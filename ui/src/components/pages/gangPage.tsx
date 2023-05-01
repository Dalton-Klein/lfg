import FooterComponent from "../nav/footerComponent";
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
const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2,
};
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

export default function GangPage({ socketRef }) {
  const isMobile = isMobileDevice();

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
  const toast: any = useRef({ current: "" });
  //Voice Specific
  const [peers, setpeers] = useState<any>([]);
  const [callParticipants, setcallParticipants] = useState<any>([]);
  const userAudio = useRef<any>();
  const peersRef = useRef<any>([]);

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
    loadDevices();
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
    renderChannelDynamicContents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callParticipants]);

  //START VOICE LOGIC
  const loadDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const savedDevices = loadSavedDevices(devices, userState);
    setcurrentInputDevice(savedDevices.input_device);
    setcurrentOutputDevice(savedDevices.output_device);
  };

  //END VOICE LOGIC

  //START Loading Contents Logic
  const loadGangPage = async (id: number) => {
    const result = await getGangActivity(id, userState.id, "");
    console.log("gang?? ", result);
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
            <div className="channel-title">{tile.name}</div>
          </button>
        ))
      );
    } else {
      //If not in gang, and no request exists, show join button
      setchannelList(
        <div className="join-gang-box">
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
    const destinationChannel = gangInfo.channels.find((channel: any) => channel.index === index);
    if (!destinationChannel || destinationChannel.id === 0) {
      setcurrentChannel({ name: "" });
    } else {
      if (destinationChannel) {
        setcurrentChannel(destinationChannel);
        if (destinationChannel.is_voice) {
          setcurrentAudioChannel(destinationChannel);
        } else {
          disconnectFromVoice();
        }
      }
    }
  };

  const connectToVoice = (channel: any) => {
    // Create Peer is called within a loop, runs once per user in the channel
    function createPeer(userToSignal: any, callerID: any, stream: any) {
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: stream,
      });
      //Listen for signal event, which starts handshake request to other users
      peer.on("signal", (signal) => {
        socketRef.current.emit("sending_signal", {
          userToSignal,
          callerID,
          signal,
          user_id: userState.id,
          username: userState.username,
          user_avatar_url: userState.avatar_url,
        });
      });
      return peer;
    }
    // Add Peer is called whenever someone joins the channel after we are already in the channel
    function addPeer(incomingSignal: any, callerID: any, stream: any) {
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream,
      });
      //Listen for signal event, which completes handshake request from other user
      peer.on("signal", (signal) => {
        socketRef.current.emit("returning_signal", {
          signal,
          callerID,
          user_id: userState.id,
          username: userState.username,
          user_avatar_url: userState.avatar_url,
        });
      });
      //Accept the signal
      peer.signal(incomingSignal);
      return peer;
    }
    let constraints: any = {};
    if (isMobile || !currentInputDevice || !currentOutputDevice) {
      //Use default devices if not set
      constraints.audio = true;
    } else {
      //Use saved devices if set
      constraints.audio = currentInputDevice.deviceId;
      constraints.output = currentOutputDevice.deviceId;
    }
    navigator.mediaDevices.getUserMedia(constraints).then((currentStream) => {
      userAudio.current = {};
      userAudio.current.srcObject = currentStream;
      console.log("socket id??? ", socketRef.current.id);
      socketRef.current.emit("join_channel", {
        channelId: channel.id,
        user_id: userState.id,
        username: userState.username,
        user_avatar_url: userState.avatar_url,
      });
      socketRef.current.on("all_users", (participants: any) => {
        const tempPeers: any = [];
        // Loop through all participants in channel and create a peer
        participants.forEach((participant: any) => {
          const peer = createPeer(participant.socket_id, socketRef.current.id, currentStream);
          peersRef.current.push({
            peerID: participant.socket_id,
            peer,
          });
          tempPeers.push(peer);
        });
        //TODO, make array of user objects to display in voice chat with name and avatar
        setpeers(tempPeers);
        renderCallParticipants(false, [...participants]);
        //Only Set saved socket after JOINING a voice room
        localStorage.setItem("voiceSocketId", socketRef.current.id);
        console.log("setting socket storage: ", localStorage.getItem("voiceSocketId"));
      });
      socketRef.current.on("user_joined", (payload: any) => {
        console.log("incoming person requesting handshake: ", payload.username);
        const peer = addPeer(payload.signal, payload.callerID, currentStream);
        peersRef.current.push({
          peerID: payload.callerID,
          peer,
        });
        setpeers((users: any) => [...users, peer]);
        renderCallParticipants(true, [payload]);
      });
      socketRef.current.on("receiving_returned_signal", (payload: any) => {
        const item = peersRef.current.find((p: any) => p.peerID === payload.id);
        item.peer.signal(payload.signal);
      });
      socketRef.current.on("user_left", (payload: any) => {
        console.log("User left, remaining users: ", payload);
        const item = peersRef.current.find((p: any) => p.peerID === payload.id);
        setpeers((previousPeers) => {
          const tempPeers: any = [];
          previousPeers.forEach((loopPeer) => {
            if (loopPeer._id !== item.peer._id) {
              tempPeers.push(loopPeer);
            }
          });
          return tempPeers;
        });
        renderCallParticipants(false, payload.remaining_participants);
      });
      socketRef.current.on("user_disconnected", (payload: any) => {
        console.log("User disconnected: ", payload.id);

        const item = peersRef.current.find((p: any) => p.peerID === payload.id);
        let storedID = "";
        if (item) {
          storedID = item.peer._id;
          item.peer.destory();
        }
        const peers = peersRef.current.filter((p) => p.peerID !== payload.id);
        peersRef.current = peers;
        setpeers((previousPeers) => {
          const tempPeers: any = [];
          previousPeers.forEach((loopPeer) => {
            if (loopPeer._id !== storedID) {
              tempPeers.push(loopPeer);
            }
          });
          return tempPeers;
        });
        console.log("********* ", payload.participants);
        if (payload.participants) {
          renderCallParticipants(false, payload.participants);
        }
      });
      //Called after user disconnects, responds with active participants
    });
    renderCallParticipants(false, []);
  };

  const disconnectFromVoice = () => {
    //Disconnect from voice
    console.log("disconnecting! ", socketRef.current);
    // const locationOfLastSlash = locationPath.lastIndexOf("/");
    // const channelId = parseInt(locationPath.substring(locationOfLastSlash + 1));
    // socketRef.current.emit("pre_disconnect", {
    //   channelId,
    //   user_id: userState.id,
    //   username: userState.username,
    //   user_avatar_url: userState.avatar_url,
    // });
    peers.forEach((tempPeer) => {
      tempPeer.disconnect();
      tempPeer.destroy();
    });
    setpeers([]);
    socketRef.current.disconnect();
    setcurrentAudioChannel({});
    setcallParticipants([]);
  };

  const renderChannelTitleContents = () => {
    //If a channel is selected, load channel contents
    if (currentChannel) {
      if (currentChannel.is_voice) {
        //If loading voice channel, connect
        //***TODO, implement a proper disconnect from any previous channel
        connectToVoice(currentChannel);
        setchannelTitleContents(
          <div className="voice-channel">
            <div className="text-channel-title">
              {currentChannel.name}
              {currentAudioChannel.id === currentChannel.id ? ": connected" : ": disconnected"}
            </div>
            {/* show conditional help messages to set devices */}
            {currentChannel.is_voice && !currentInputDevice && !isMobile ? (
              <div>
                {" "}
                no input device set, set device in{" "}
                <span
                  onClick={() => {
                    navigate("/user-settings");
                  }}
                  className="link-text"
                >
                  {" "}
                  user settings
                </span>{" "}
              </div>
            ) : currentChannel.is_voice && !currentOutputDevice && !isMobile ? (
              <div className="voice-channel-helper">
                {" "}
                no output device set, set device in{" "}
                <span
                  onClick={() => {
                    navigate("/user-settings");
                  }}
                  className="link-text"
                >
                  {" "}
                  user settings
                </span>{" "}
              </div>
            ) : (
              <></>
            )}
          </div>
        );
        //Call async event for use later in fucntion
      } else {
        setchannelTitleContents(
          <div className="text-channel-container">
            <div className="text-channel-title">{currentChannel.name}</div>
          </div>
        );
      }
    }
  };

  const renderCallParticipants = (isAddingOne: boolean, participants: any) => {
    if (isAddingOne) {
      let individualAdding = participants[0];
      let formattedParticipant: any = (
        <div className="voice-participant-box" key={individualAdding.user_id}>
          {individualAdding.user_avatar_url === "" || individualAdding.user_avatar_url === "/assets/avatarIcon.png" ? (
            <div className="dynamic-avatar-border">
              <div className="dynamic-avatar-text-small">
                {individualAdding.username
                  ? individualAdding.username
                      .split(" ")
                      .map((word: string[]) => word[0])
                      .join("")
                      .slice(0, 2)
                      .toLowerCase()
                  : "gg"}
              </div>
            </div>
          ) : (
            <img className="nav-overlay-img" src={individualAdding.user_avatar_url} alt="my avatar" />
          )}
          <div className="voice-participant-name">{individualAdding.username}</div>
        </div>
      );
      setcallParticipants((previousParticipants: any) => [formattedParticipant, ...previousParticipants]);
    } else {
      let tempParticipants: any = [];
      participants.forEach((participant: any) => {
        //When user leaves, we get full copy of users, so dont add duplicate of self
        if (participant.user_id !== userState.id) {
          //Push users other than self into array
          tempParticipants.push(
            <div className="voice-participant-box" key={participant.user_id}>
              {participant.user_avatar_url === "" || participant.user_avatar_url === "/assets/avatarIcon.png" ? (
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
                <img className="nav-overlay-img" src={participant.user_avatar_url} alt="my avatar" />
              )}
              <div className="voice-participant-name">{participant.username}</div>
            </div>
          );
        }
      });
      if (currentAudioChannel.id && currentChannel.id === currentAudioChannel.id) {
        tempParticipants.push(
          <div className="voice-participant-box" key={0}>
            {userState.avatar_url === "" || userState.avatar_url === "/assets/avatarIcon.png" ? (
              <div className="dynamic-avatar-border">
                <div className="dynamic-avatar-text-small">
                  {userState.username
                    ? userState.username
                        .split(" ")
                        .map((word: string[]) => word[0])
                        .join("")
                        .slice(0, 2)
                        .toLowerCase()
                    : "gg"}
                </div>
              </div>
            ) : (
              <img className="nav-overlay-img" src={userState.avatar_url} alt="my avatar" />
            )}
            <div className="voice-participant-name">{userState.username}</div>
          </div>
        );
      }
      setcallParticipants(tempParticipants);
    }
  };

  const renderChannelDynamicContents = () => {
    if (currentChannel.is_voice) {
      setchannelDynamicContents(
        <div className="voice-channel">
          {/* List of participants in call */}
          {callParticipants}
        </div>
      );
    } else {
      setchannelDynamicContents(
        <div className="text-channel-container">
          <div>gang messging coming soon!</div>
        </div>
      );
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
              navigate(`/user-settings`);
            }}
          >
            my settings
          </div>
        ),
      },
    ] as any;
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
      <div className="master-gang-contents">
        <div className="top-bar">
          <div className="main-details">
            <div className="image-column">
              {gangInfo.basicInfo?.avatar_url === "" || gangInfo.basicInfo?.avatar_url === "/assets/avatarIcon.png" ? (
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
        {/* <div className="about-box">{gangInfo.basicInfo?.about ? gangInfo.basicInfo.about : ""}</div> */}
        {/* Gang Default Page */}
        <div className="channel-specific-contents">
          {/* Roster Row */}
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
          {/* List of channels on left, Channel contents on right */}
          {gangInfo.role?.role_id ? (
            <div className="channels-container">
              <div className="chat-list">
                {channelList}
                {peers.map((peer, index) => {
                  return <Video key={index} peer={peer} />;
                })}
              </div>
              <div className="channel-contents">
                <div className="channel-contents-title">{channelTitleContents}</div>
                <div className="channel-contents-dynamic">{channelDynamicContents}</div>
              </div>
            </div>
          ) : (
            channelList
          )}
        </div>
      </div>
      <FooterComponent></FooterComponent>
    </div>
  );
}
