import "./gangPage.scss";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getGangActivity, requestToJoinGang } from "../../utils/rest";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Toast } from "primereact/toast";
import styled from "styled-components";
import { useBeforeunload } from "react-beforeunload";

import Peer from "simple-peer";
import { Menu } from "primereact/menu";
import { loadSavedDevices } from "../../utils/helperFunctions";
import { updateUserThunk } from "../../store/userSlice";
import InstantMessaging from "../messaging/instantMessaging";
import ReactTooltip from "react-tooltip";

function isMobileDevice() {
  const userAgent = window.navigator.userAgent;
  const mobileKeywords = ["Android", "iOS", "iPhone", "iPad", "iPod", "Windows Phone"];

  return mobileKeywords.some((keyword) => userAgent.includes(keyword));
}
// Some stuff for video can be used for screen sharing perhaps
const StyledAudio = styled.audio`
  height: 0%;
  width: 0%;
`;
// const videoConstraints = {
//   height: window.innerHeight / 2,
//   width: window.innerWidth / 2,
// };
const Video = (props: any) => {
  const ref = useRef<any>();

  useEffect(() => {
    if (ref.current && props.peer) {
      props.peer.on("stream", (stream: any) => {
        ref.current.srcObject = stream;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <StyledAudio playsInline autoPlay ref={ref} />;
};
let constraints: any = {};
export default function GangPage({ socketRef }) {
  const isMobile = isMobileDevice();
  const [hasPressedChannelForMobile, sethasPressedChannelForMobile] = useState<boolean>(false);

  const navigate = useNavigate();
  const gangOptionsMenu: any = useRef(null);
  const locationPath: string = useLocation().pathname;
  const userState = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  //Gang Specific
  const [gangInfo, setgangInfo] = useState<any>({});
  const [channelList, setchannelList] = useState<any>([]);
  const [channelTitleContents, setchannelTitleContents] = useState<any>();
  const [channelDynamicContents, setchannelDynamicContents] = useState<any>();
  const [currentChannel, setcurrentChannel] = useState<any>({ name: "" });
  const [currentAudioChannel, setcurrentAudioChannel] = useState<any>({});
  const [first5Members, setfirst5Members] = useState<any>([]);
  const [platformImgLink, setplatformImgLink] = useState<string>("");
  const [showChannelNav, setshowChannelNav] = useState<boolean>(true);
  const toast: any = useRef({ current: "" });
  //Voice Specific
  const [callParticipants, setcallParticipants] = useState<any>([]);
  // const userAudio = useRef<any>();
  const peersRef = useRef<any>([]);
  const [myDevicesStream, setmyDevicesStream] = useState<MediaStream>();

  const [hasMicAccess, sethasMicAccess] = useState<boolean>(true);
  const [currentInputDevice, setcurrentInputDevice] = useState<any>();
  const [currentOutputDevice, setcurrentOutputDevice] = useState<any>();

  const [expandedProfileVis, setExpandedProfileVis] = useState<boolean>(false);
  const toggleExpandedProfile = () => {
    setExpandedProfileVis(!expandedProfileVis);
  };

  //Catch if user tries to leave page while connected to voice
  useBeforeunload((event) => {
    if (currentAudioChannel.id) {
      disconnectFromVoice();
    }
  });

  useEffect(() => {
    dispatch(updateUserThunk(userState.id));
    const locationOfLastSlash = locationPath.lastIndexOf("/");
    const extractedGangId = locationPath.substring(locationOfLastSlash + 1);
    loadGangPage(parseInt(extractedGangId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(updateUserThunk(userState.id));
    const locationOfLastSlash = locationPath.lastIndexOf("/");
    const extractedGangId = locationPath.substring(locationOfLastSlash + 1);
    loadGangPage(parseInt(extractedGangId));
    loadDevices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationPath]);

  useEffect(() => {
    if (gangInfo.channels) {
      let tempIndex = 0;
      //Sets index property for use by accordion
      if (gangInfo.channels.length) {
        gangInfo.channels?.forEach((channel: any) => {
          channel.index = tempIndex;
          tempIndex++;
        });
        makeChannelTabs();
      }
      if (gangInfo.basicInfo?.members) {
        setfirst5Members(gangInfo.basicInfo.members.slice(0, 5));
      }
      switch (gangInfo.basicInfo?.game_platform_id) {
        case 1:
          setplatformImgLink(
            "https://res.cloudinary.com/kultured-dev/image/upload/v1663786762/rust-logo-small_uarsze.png"
          );
          break;
        case 2:
          setplatformImgLink(
            "https://res.cloudinary.com/kultured-dev/image/upload/v1665620519/RocketLeagueResized_loqz1h.png"
          );
          break;
        default:
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gangInfo]);

  useEffect(() => {
    //Run this to change which channel is selected
    makeChannelTabs();
    //Run this to load contents of selected channel
    renderChannelTitleContents();
    renderChannelDynamicContents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChannel]);

  useEffect(() => {
    if (currentAudioChannel.id) {
      connectToVoice();
    }
    renderChannelTitleContents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAudioChannel]);

  useEffect(() => {
    if (myDevicesStream) {
      // Send my data so others can see my participant info
      socketRef.current.emit("join_voice", {
        roomId: `voice_${currentAudioChannel.id}`,
        user_id: userState.id,
        username: userState.username,
        avatar_url: userState.avatar_url,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myDevicesStream]);

  useEffect(() => {
    renderChannelDynamicContents();
    if (isMobile || !currentInputDevice || !currentOutputDevice) {
      //Use default devices if not set
      constraints.audio = {
        // Add iPhone-specific constraints here
        deviceId: "default", // Use the default audio input device
        sampleRate: 48000, // Set the desired sample rate
        channelCount: 2, // Set the desired number of audio channels (stereo)
      };
    } else {
      //Use saved devices if set
      constraints.audio = currentInputDevice.deviceId;
      constraints.output = currentOutputDevice.deviceId;
    }
    //Listens for people joining voice, and will render participants as they join
    socketRef.current.on("join_voice", handleAddParticipant);
    return () => {
      socketRef.current.off("join_voice", handleAddParticipant);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callParticipants]);

  useEffect(() => {
    renderChannelTitleContents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showChannelNav]);

  //Special useEffect for socket listeners with all dependencies
  const handleAddParticipant = (payload: any) => {
    renderCallParticipants(payload.participants);
  };
  const handleUserJoinsVoice = (payload) => {
    if (myDevicesStream && currentAudioChannel && currentAudioChannel.id && payload.user_joined !== userState.id) {
      createPeers(payload.participants, myDevicesStream);
    }
  };
  const handleSignal = (payload) => {
    if (payload.targetUser === userState.id && myDevicesStream && currentAudioChannel && currentAudioChannel.id) {
      const peer = addPeer(payload.user_id, payload.signal, payload.callerID, myDevicesStream);
      peersRef.current.push({
        peerID: payload.callerID,
        peer,
        peer_user_id: payload.user_id,
      });
    }
  };
  const handleReturnSignal = (payload) => {
    if (payload.targetUser === userState.id) {
      const item = peersRef.current.find((p: any) => p.peerID === payload.id);
      if (item && item.peer && !item.peer.destroyed) {
        item.peer.signal(payload.signal);
      }
    }
  };
  const handleLeaveVoice = (payload) => {
    // Find the index of the peer in the array to destroy and remove
    const index = peersRef.current.findIndex((peer) => peer.peer_user_id === payload.userLeaving);
    // Check if the peer exists in the array
    if (index !== -1) {
      const peer = peersRef.current[index];
      peer.peer.destroy();
      // Remove the peer from the array
      peersRef.current.splice(index, 1);
    }
    renderCallParticipants(payload.participants);
  };

  useEffect(() => {
    //Listens for people joining voice, will create peers if our stream is live
    socketRef.current.on("join_voice", handleUserJoinsVoice);
    //Receive First Part of handshake
    socketRef.current.on("receive_sent_signal", handleSignal);
    //Receive Last Part of handshake
    socketRef.current.on("receiving_returned_signal", handleReturnSignal);
    //Always listen for leaving user?
    socketRef.current.on("leave_voice", handleLeaveVoice);
    return () => {
      socketRef.current.off("join_voice", handleUserJoinsVoice);
      socketRef.current.off("receive_sent_signal", handleSignal);
      socketRef.current.off("receiving_returned_signal", handleReturnSignal);
      socketRef.current.off("leave_voice", handleLeaveVoice);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myDevicesStream, currentAudioChannel, userState.id, userState.username, userState.avatar_url]);

  //START VOICE LOGIC
  const loadDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const savedDevices = loadSavedDevices(devices, userState);
    setcurrentInputDevice(savedDevices.input_device);
    setcurrentOutputDevice(savedDevices.output_device);
    //Always listen for people joining voice
  };

  const connectToVoice = () => {
    checkMicPermissions();
    closePeerConnections();
    navigator.mediaDevices.getUserMedia(constraints).then((currentStream) => {
      setmyDevicesStream(currentStream);
    });
  };

  const checkMicPermissions = async () => {
    if (navigator.permissions && navigator.permissions.query) {
      try {
        const permissionStatus = await navigator.permissions.query({ name: "microphone" as PermissionName });
        if (permissionStatus.state === "denied") {
          // Show a message to the user about enabling microphone access
          console.log("Microphone access is denied. Please enable microphone access in your browser settings.");
          sethasMicAccess(false);
        }
      } catch (error) {
        console.error("Error checking microphone permission:", error);
      }
    } else {
      // Browser doesn't support navigator.permissions API
      console.log(
        "Cannot check microphone permission. Please ensure microphone access is enabled in your browser settings."
      );
    }
  };

  const createPeers = (participants: any, currentStream: any) => {
    function createPeer(userIdToSignal: number, userToSignal: any, callerID: any, stream: any) {
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: stream,
      });
      //Listen for signal event, which starts handshake request to other users
      peer.on("signal", (signal) => {
        socketRef.current.emit("sending_signal", {
          userIdToSignal,
          userToSignal,
          callerID,
          signal,
          roomId: currentAudioChannel.id,
          user_id: userState.id,
          username: userState.username,
          user_avatar_url: userState.avatar_url,
        });
      });
      return peer;
    }
    // Loop through all participants in channel and create a peer
    participants.forEach((participant: any) => {
      if (participant.user_id !== userState.id) {
        //Creat only for non-self participants
        const matchingPeer = peersRef.current.find((peerObj: any) => peerObj.peer_user_id === participant.user_id);
        if (!matchingPeer) {
          //Create only new peer
          const peer = createPeer(participant.user_id, participant.socket_id, socketRef.current.id, currentStream);
          peersRef.current.push({
            peerID: participant.socket_id,
            peer,
            peer_user_id: participant.user_id,
          });
        } else if (matchingPeer && matchingPeer.peer.destroyed) {
          // if we have a peer for the user, but its been destroyed, handle then recreate
          const index = peersRef.current.findIndex((peerObj: any) => peerObj.peer_user_id === participant.user_id);
          // Check if the peer exists in the array
          if (index !== -1) {
            const peer = peersRef.current[index];
            peer.peer.destroy();
            // Remove the peer from the array
            peersRef.current.splice(index, 1);
          }
          const peer = createPeer(participant.user_id, participant.socket_id, socketRef.current.id, currentStream);
          peersRef.current.push({
            peerID: participant.socket_id,
            peer,
            peer_user_id: participant.user_id,
          });
        }
      }
    });
  };

  const addPeer = (targetUser: number, incomingSignal: any, callerID: any, stream: any) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });
    //Listen for signal event, which completes handshake request from other user
    peer.on("signal", (signal) => {
      //Start last part of handshake
      socketRef.current.emit("returning_signal", {
        signal,
        callerID,
        targetUser,
        user_id: userState.id,
        username: userState.username,
        user_avatar_url: userState.avatar_url,
      });
    });
    //Accept the signal
    peer.signal(incomingSignal);
    return peer;
  };

  const disconnectFromVoice = () => {
    closePeerConnections();
    socketRef.current.emit("leave_voice", {
      roomId: `voice_${currentAudioChannel.id}`,
      user_id: userState.id,
    });
    setcurrentAudioChannel({});
  };

  const closePeerConnections = () => {
    // Destroy all my peers cause I'm leaving
    peersRef.current.forEach((peer: any) => {
      peer.peer.destroy();
    });
    //Re-init to blank array after peers destroyed
    peersRef.current = [];
  };

  //END VOICE LOGIC

  //START Loading Contents Logic
  const loadGangPage = async (id: number) => {
    const result = await getGangActivity(id, userState.id, "");
    setgangInfo(result);
    setcurrentChannel(result.channels[0]);
  };

  const makeChannelTabs = () => {
    //This will run on page load
    if (gangInfo.role?.role_id) {
      //If in gang, show list of channels
      setchannelList(
        gangInfo.channels.map((tile: any) => (
          <button
            className={`alt-button ${tile.id === currentChannel.id ? "selected-channel" : ""}`}
            key={tile.id}
            onClick={() => {
              channelButtonPressed(tile.index);
            }}
          >
            <i className={`${tile.is_voice ? "pi pi-volume-up" : "pi pi-book"}`} />
            <div className="channel-title">{tile.name}</div>
          </button>
        ))
      );
    } else {
      //If not in gang, and no request exists, show join button
      setchannelList(
        <div className="join-gang-box" key={0}>
          <div>you do not have access to this gang's channels because you are not a member of this gang</div>
          <button
            className="alt-button"
            disabled={gangInfo.requestStatus?.length}
            onClick={() => {
              requestJoinGang();
            }}
          >
            {gangInfo.requestStatus?.length
              ? "request pending"
              : `request to join ${gangInfo.basicInfo?.name ? gangInfo.basicInfo?.name : ""}`}
          </button>
        </div>
      );
    }
  };

  const channelButtonPressed = (index: number) => {
    sethasPressedChannelForMobile(true);
    const destinationChannel = gangInfo.channels.find((channel: any) => channel.index === index);
    if (!destinationChannel || destinationChannel.id === 0) {
      setcurrentChannel({ name: "" });
    } else {
      if (destinationChannel) {
        setcurrentChannel(destinationChannel);
        if (isMobile) {
          toggleNavBarVisibility();
        }
        if (destinationChannel.is_voice) {
          socketRef.current.emit("join_room", `voice_${destinationChannel.id}`);
        }
      }
    }
  };

  const toggleNavBarVisibility = () => {
    setshowChannelNav((prevState) => !prevState);
  };

  const renderChannelTitleContents = () => {
    //If a channel is selected, load channel contents
    if (currentChannel) {
      if (currentChannel.is_voice) {
        //If loading voice channel, connect
        //***TODO, implement a proper disconnect from any previous channel

        setchannelTitleContents(
          <div className="voice-channel">
            <button
              className="expand-channels-button"
              onClick={() => {
                toggleNavBarVisibility();
              }}
            >
              <i className={`pi ${showChannelNav ? "pi-angle-left" : "pi-angle-right"}`} />
            </button>
            <div className="text-channel-title">
              {currentChannel.name}
              {currentAudioChannel.id === currentChannel.id ? (
                <button
                  className="disconnnect-button"
                  onClick={() => {
                    disconnectFromVoice();
                  }}
                  data-tip
                  data-for="voice-connect-tooltip"
                >
                  <i className="pi pi-phone " />
                </button>
              ) : (
                <button
                  className="connect-button"
                  onClick={() => {
                    setcurrentAudioChannel(currentChannel);
                  }}
                  data-tip
                  data-for="voice-connect-tooltip"
                >
                  <i className="pi pi-phone" />
                </button>
              )}
            </div>
            {/* show conditional help messages to set devices */}
            {currentChannel.is_voice && !currentInputDevice && !isMobile ? (
              <div>
                {" "}
                no input device set, set device in{" "}
                <span
                  onClick={() => {
                    navigate("/account-settings");
                  }}
                  className="link-text"
                >
                  {" "}
                  account settings
                </span>{" "}
              </div>
            ) : currentChannel.is_voice && !currentOutputDevice && !isMobile ? (
              <div className="voice-channel-helper">
                {" "}
                no output device set, set device in{" "}
                <span
                  onClick={() => {
                    navigate("/account-settings");
                  }}
                  className="link-text"
                >
                  {" "}
                  account settings
                </span>{" "}
              </div>
            ) : (
              <></>
            )}{" "}
            {hasMicAccess ? (
              <></>
            ) : (
              <div className="voice-channel-helper">
                {" "}
                mic access denied, please enable mic access in your browser settings.{" "}
              </div>
            )}
            <ReactTooltip id="voice-connect-tooltip" place="right" effect="float">
              <span>{currentAudioChannel.id ? "disconnect from voice" : "connect to voice"}</span>
            </ReactTooltip>
          </div>
        );
        //Call async event for use later in fucntion
      } else {
        setchannelTitleContents(
          <div className="text-channel-container">
            <button
              className="expand-channels-button"
              onClick={() => {
                toggleNavBarVisibility();
              }}
            >
              <i className={`pi ${showChannelNav ? "pi-angle-left" : "pi-angle-right"}`} />
            </button>
            <div className="text-channel-title">{currentChannel.name}</div>
          </div>
        );
      }
    }
  };

  const renderGangOptions = () => {
    return [
      {
        label: (
          <div
            onClick={() => {
              navigate(`/manage-gang/${gangInfo.basicInfo.id}`);
            }}
          >
            manage gang
          </div>
        ),
      },
      {
        label: (
          <div
            onClick={() => {
              navigate(`/account-settings`);
            }}
          >
            my settings
          </div>
        ),
      },
    ] as any;
  };
  //    VOICE RELATED LOADING EVENTS
  const renderCallParticipants = (participants: any) => {
    let tempParticipants: any = [];
    participants.forEach((participant: any) => {
      //When user leaves, we get full copy of users, so dont add duplicate of self
      //Push users other than self into array
      tempParticipants.push(
        <div className="voice-participant-box" key={participant.user_id}>
          {participant.avatar_url === "" || participant.avatar_url === "/assets/avatarIcon.png" ? (
            <div className="dynamic-avatar-border">
              <div className="dynamic-avatar-text-small">
                {participant.username
                  ? participant.username
                      .split(" ")
                      .map((word: string[]) => word[0])
                      .join("")
                      .slice(0, 2)
                      .toLowerCase()
                  : "gg"}
              </div>
            </div>
          ) : (
            <img className="nav-overlay-img" src={participant.avatar_url} alt="my avatar" />
          )}
          <div className="voice-participant-name">{participant.username}</div>
        </div>
      );
    });
    setcallParticipants(tempParticipants);
  };

  const renderChannelDynamicContents = () => {
    if (currentChannel.is_voice) {
      //Render voice chnnel content
      setchannelDynamicContents(
        <div className="voice-channel">
          {/* List of participants in call */}
          {callParticipants}
        </div>
      );
    } else {
      //Render group messaging content
      setchannelDynamicContents(
        <div className="text-channel-container">
          <InstantMessaging
            socketRef={socketRef}
            convo={currentChannel}
            hasPressedChannelForMobile={hasPressedChannelForMobile}
          />
        </div>
      );
    }
  };

  //END Loading Contents Logic

  //START MISC LOGIC
  const requestJoinGang = async () => {
    const result = await requestToJoinGang(gangInfo.basicInfo.id, userState.id, true, "");
    let copyOfGangInfo = Object.assign({}, gangInfo);
    copyOfGangInfo.requestStatus = [result[0]];
    setgangInfo(copyOfGangInfo);
    toast.current.clear();
    toast.current.show({
      severity: "success",
      summary: "request sent!",
      detail: ``,
      sticky: false,
    });
  };
  //END MISC LOGIC

  return (
    <div>
      <Toast ref={toast} />
      {/* Gang Top Details Bar */}
      <div className="master-gang-contents">
        {showChannelNav ? (
          <div className="top-bar">
            <div className="main-details">
              <div className="image-column">
                {gangInfo.basicInfo?.avatar_url === "" ||
                gangInfo.basicInfo?.avatar_url === "/assets/avatarIcon.png" ? (
                  <div
                    className="dynamic-avatar-border"
                    onClick={() => {
                      toggleExpandedProfile();
                    }}
                  >
                    <div className="dynamic-avatar-text-med">
                      {gangInfo.basicInfo?.name
                        .split(" ")
                        .map((word: string[]) => word[0])
                        .join("")
                        .slice(0, 2)
                        .toLowerCase()}
                    </div>
                  </div>
                ) : (
                  <img
                    className="card-photo"
                    onClick={() => {}}
                    src={gangInfo.basicInfo?.avatar_url}
                    alt={`${gangInfo.basicInfo?.name}'s avatar`}
                  />
                )}
              </div>
              <div className="gang-info">
                <div className="gang-name">{gangInfo.basicInfo?.name ? gangInfo.basicInfo.name : ""}</div>
                <div className="gang-role-text">{gangInfo.role?.role_name ? gangInfo.role?.role_name : ""}</div>
              </div>
            </div>
            <img className="gang-game-image" src={platformImgLink} alt={`game this team supports`} />
            <Menu model={renderGangOptions()} popup ref={gangOptionsMenu} id="popup_menu" />
            <button
              style={{ display: gangInfo!.role && gangInfo!.role!.role_id === 1 ? "inline-block" : "none" }}
              className="options-button"
              onClick={(event) => gangOptionsMenu.current.toggle(event)}
            >
              <i className="pi pi-ellipsis-h"></i>
            </button>
          </div>
        ) : (
          <></>
        )}

        {/* <div className="about-box">{gangInfo.basicInfo?.about ? gangInfo.basicInfo.about : ""}</div> */}
        {/* Gang Default Channel */}
        <div className="channel-specific-contents">
          {/* Roster Row */}
          {showChannelNav ? (
            <div className="gang-roster-container">
              {first5Members.map((member: any) => (
                <div className="list-member-photo" key={member.id}>
                  {!member.avatar_url || member.avatar_url === "/assets/avatarIcon.png" ? (
                    <div
                      className="dynamic-avatar-bg"
                      onClick={() => {
                        /* ***TODO*** load detail profile of person here */
                      }}
                      data-tip
                      data-for="avatarTip"
                    >
                      <div className="dynamic-avatar-text">
                        {member.username
                          ? member.username
                              .split(" ")
                              .map((word: string[]) => word[0])
                              .join("")
                              .slice(0, 2)
                              .toLowerCase()
                          : "gg"}
                      </div>
                    </div>
                  ) : (
                    <img
                      className="member-photo"
                      onClick={() => {
                        /* ***TODO*** load detail profile of person here */
                      }}
                      src={member.avatar_url}
                      alt={`member avatar`}
                    />
                  )}
                </div>
              ))}
              <div className="number-of-members">
                {gangInfo.basicInfo?.members?.length ? gangInfo.basicInfo?.members?.length : ""} members
              </div>
            </div>
          ) : (
            <></>
          )}

          {/* List of channels on left, Channel contents on right */}
          {gangInfo.role?.role_id ? (
            <div className="channels-container">
              {showChannelNav ? (
                <div className="chat-list">
                  {channelList}
                  {peersRef.current.map((peerObj, index) => {
                    return <Video key={index} peer={peerObj.peer} />;
                  })}
                </div>
              ) : (
                <></>
              )}
              <div className="channel-contents">
                <div className="channel-contents-title">{channelTitleContents}</div>
                <div className="channel-contents-dynamic">{channelDynamicContents}</div>
              </div>
            </div>
          ) : showChannelNav ? (
            [channelList]
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
