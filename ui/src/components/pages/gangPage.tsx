import FooterComponent from "../nav/footerComponent";
import HeaderComponent from "../nav/headerComponent";
import { Accordion, AccordionTab } from "primereact/accordion";
import "./gangPage.scss";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getGangActivity, requestToJoinGang } from "../../utils/rest";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Toast } from "primereact/toast";
import styled from "styled-components";

import Peer from "simple-peer";
import * as io from "socket.io-client";
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
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return <StyledAudio playsInline autoPlay ref={ref} />;
};

export default function GangPage() {
  const isMobile = isMobileDevice();

  const navigate = useNavigate();
  const socketRef = useRef<any>();
  const gangOptionsMenu: any = useRef(null);
  const locationPath: string = useLocation().pathname;
  const userState = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  //Gang Specific
  const [gangInfo, setgangInfo] = useState<any>({});
  const [channelList, setchannelList] = useState<any>([]);
  const [channelContents, setchannelContents] = useState<any>();
  const [currentChannel, setcurrentChannel] = useState<any>({ name: "" });
  const [currentAudioChannel, setcurrentAudioChannel] = useState<any>({});
  const [first5Members, setfirst5Members] = useState<any>([]);
  const [platformImgLink, setplatformImgLink] = useState<string>("");
  const toast: any = useRef({ current: "" });
  //Voice Specific
  const [peers, setpeers] = useState<any>([]);
  const [callParticipants, setcallParticipants] = useState<any>([]);
  const [callParticipantsJSX, setcallParticipantsJSX] = useState<any>([]);
  const userAudio = useRef<any>();
  const peersRef = useRef<any>([]);

  const [currentInputDevice, setcurrentInputDevice] = useState<any>();
  const [currentOutputDevice, setcurrentOutputDevice] = useState<any>();

  const [expandedProfileVis, setExpandedProfileVis] = useState<boolean>(false);
  const toggleExpandedProfile = () => {
    setExpandedProfileVis(!expandedProfileVis);
  };

  useEffect(() => {
    dispatch(updateUserThunk(userState.id));
    socketRef.current = io.connect(
      process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://www.gangs.gg"
    );
    const locationOfLastSlash = locationPath.lastIndexOf("/");
    const extractedGangId = locationPath.substring(locationOfLastSlash + 1);
    loadGangPage(parseInt(extractedGangId));
    loadDevices();
    return () => {
      socketRef.current.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    makeChannelTabsAndContents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChannel, currentAudioChannel]);

  useEffect(() => {
    console.log("peers: ", peers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peers]);

  useEffect(() => {
    renderCallParticipantsJSX();
    setchannelContents(
      <div className="voice-channel">
        <div className="text-channel-title">{currentChannel.name}</div>
        {/* Join/Leave Call Button */}
        <button
          onClick={() => {
            joinLeaveVoiceChat(currentChannel);
          }}
        >
          {currentChannel.is_voice
            ? currentAudioChannel.id && currentChannel.id === currentAudioChannel.id
              ? `leave ${currentChannel.name}`
              : `join ${currentChannel.name}`
            : currentChannel.name}
        </button>
        {/* List of participants in call */}
        {callParticipantsJSX}
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callParticipants]);

  //START VOICE LOGIC
  const loadDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const savedDevices = loadSavedDevices(devices, userState);
    setcurrentInputDevice(savedDevices.input_device);
    setcurrentOutputDevice(savedDevices.output_device);
  };
  const connectToVoiceSocket = () => {
    console.log("making channel contents: ", currentChannel);
    //Init blank peers to load initil content
    setpeers([]);
    //Connects to voice socket to get info on participants, but doesn't actually join the voice room
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
      console.log("here4????");
      userAudio.current = {};
      userAudio.current.srcObject = currentStream;

      //Testing getting participants right away
      socketRef.current.emit("get_channel_participants", {
        channelId: currentChannel.id,
      });

      socketRef.current.on("all_users", (users: any) => {
        const tempPeers: any = [];
        const tempParticipants: any = [];
        // Loop through all users in channel and create a peer
        users.forEach((user: any) => {
          const peer = createPeer(user.socket_id, socketRef.current.id, currentStream);
          peersRef.current.push({
            peerID: user.socket_id,
            peer,
          });
          tempPeers.push(peer);
          tempParticipants.push({
            user_id: user.user_id,
            username: user.username,
            user_avatar_url: user.user_avatar_url,
          });
        });
        //TODO, make array of user objects to display in voice chat with name and avatar
        setpeers(tempPeers);
        setcallParticipants(tempParticipants);
      });

      socketRef.current.on("user_joined", (payload) => {
        console.log("incoming person requesting handshake: ", payload.callerID);
        const peer = addPeer(payload.signal, payload.callerID, currentStream);
        peersRef.current.push({
          peerID: payload.callerID,
          peer,
        });
        console.log("number of peers: ", peersRef.current.length);
        setpeers((users: any) => [...users, peer]);
        const copyOfParticipants = callParticipants;
        copyOfParticipants.push({
          user_id: payload.user_id,
          username: payload.username,
          user_avatar_url: payload.user_avatar_url,
        });
        setcallParticipants(copyOfParticipants);
      });

      socketRef.current.on("receiving_returned_signal", (payload) => {
        const item = peersRef.current.find((p: any) => p.peerID === payload.id);
        item.peer.signal(payload.signal);
      });
    });
  };
  const joinLeaveVoiceChat = (channel: any) => {
    if (currentAudioChannel && currentAudioChannel.id) {
      //Disconnect from voice

      //I don't think we need to disconnect entirely, just remove ourselves from users list
      // socketRef.current.disconnect();
      console.log("exiting voice");
      socketRef.current.emit("exit_voice", {
        channelId: currentChannel.id,
        user_id: userState.id,
      });

      setcurrentAudioChannel({});
      setpeers([]);
    } else {
      socketRef.current.emit("join_channel", {
        channelId: channel.id,
        user_id: userState.id,
        username: userState.username,
        user_avatar_url: userState.avatar_url,
      });
      setcurrentAudioChannel(channel);
    }
  };
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
      socketRef.current.emit("returning_signal", { signal, callerID });
    });
    //Accept the signal
    peer.signal(incomingSignal);
    return peer;
  }
  //END VOICE LOGIC

  //Start non-voice page Logic
  useEffect(() => {
    if (gangInfo.channels) {
      let tempIndex = 0;
      //Sets index property for use by accordion
      if (gangInfo.channels.length) {
        gangInfo.channels?.forEach((channel: any) => {
          channel.index = tempIndex;
          tempIndex++;
        });
      }
      makeChannelTabsAndContents();
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

  const loadGangPage = async (id: number) => {
    const result = await getGangActivity(id, userState.id, "");
    console.log("gang?? ", result);
    setgangInfo(result);
    setcurrentChannel(result.channels[0]);
  };

  const channelButtonPressed = (index: number) => {
    const destinationChannel = gangInfo.channels.find((channel: any) => channel.index === index);
    if (!destinationChannel || destinationChannel.id === 0) {
      setcurrentChannel({ name: "" });
    } else {
      if (destinationChannel) {
        setcurrentChannel(destinationChannel);
      }
    }
  };

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

  // Create Channel AccordianTabs
  const makeChannelTabsAndContents = () => {
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
      //If a channel is selected, load channel contents
      if (currentChannel) {
        if (currentChannel.is_voice) {
          //Call async event for use later in fucntion
          connectToVoiceSocket();
        } else {
          setchannelContents(
            <div className="text-channel-container">
              <div className="text-channel-title">{currentChannel.name}</div>
              <div>gang messging coming soon!</div>
            </div>
          );
        }
      }
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

  const renderCallParticipantsJSX = () => {
    let tempParticipants: any = [];
    if (currentAudioChannel.id && currentChannel.id === currentAudioChannel.id) {
      callParticipants.forEach((peer: any) => {
        //TODO create participant box for each peer
        console.log("participant in loop: ", peer);
        tempParticipants.push(
          <div className="voice-participant-box" key={0}>
            {peer.user_avatar_url === "" || peer.user_avatar_url === "/assets/avatarIcon.png" ? (
              <div className="dynamic-avatar-border">
                <div className="dynamic-avatar-text-small">
                  {peer.username
                    ? peer.username
                        .split(" ")
                        .map((word: string[]) => word[0])
                        .join("")
                        .slice(0, 2)
                    : "gg"}
                </div>
              </div>
            ) : (
              <img className="nav-overlay-img" src={peer.user_avatar_url} alt="my avatar" />
            )}
            <div className="voice-participant-name">{peer.username}</div>
          </div>
        );
      });
      if (currentAudioChannel && currentAudioChannel.id) {
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
    }
    setcallParticipantsJSX(tempParticipants);
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

  return (
    <div>
      <HeaderComponent></HeaderComponent>
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
                      .slice(0, 2)}
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
                <img className="member-photo" onClick={() => {}} src={member.avatar_url} alt={`member avatar`} />
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
              <div className="channel-contents">{channelContents}</div>
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
