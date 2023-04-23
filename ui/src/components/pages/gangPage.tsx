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

//
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
  const navigate = useNavigate();
  const socketRef = useRef<any>();
  const gangOptionsMenu: any = useRef(null);
  const locationPath: string = useLocation().pathname;
  const userState = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  //Gang Specific
  const [gangInfo, setgangInfo] = useState<any>({});
  const [channelList, setchannelList] = useState<any>([]);
  const [currentChannel, setcurrentChannel] = useState<any>({ name: "" });
  const [currentAudioChannel, setcurrentAudioChannel] = useState<any>({});
  const [first5Members, setfirst5Members] = useState<any>([]);
  const [platformImgLink, setplatformImgLink] = useState<string>("");
  const toast: any = useRef({ current: "" });
  //Voice Specific
  const [peers, setpeers] = useState<any>([]);
  const userAudio = useRef<any>();
  const peersRef = useRef<any>([]);
  const channelId = 2;

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
    makeChannelTabs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChannel, currentAudioChannel]);

  useEffect(() => {
    console.log("peers: ", peers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peers]);

  //START VOICE LOGIC
  const loadDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const savedDevices = loadSavedDevices(devices, userState);
    console.log("saved ", savedDevices);
    setcurrentInputDevice(savedDevices.input_device);
    setcurrentOutputDevice(savedDevices.output_device);
  };
  const connectToVoice = (channel: any) => {
    if (channel.id === currentAudioChannel.id) {
      //Disconnect from voice
      socketRef.current.disconnect();
      setcurrentAudioChannel({});
      setpeers([]);
    } else {
      //Connect to voice
      setcurrentAudioChannel(channel);
      console.log("saved devices: ", userState.input_device_id);
      let constraints: any = {};
      if (!currentInputDevice || !currentOutputDevice) {
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
        socketRef.current.emit("join_channel", { channelId: channelId, userId: userState.id });
        socketRef.current.on("all users", (users) => {
          const tempPeers: any = [];
          // Loop through all users in channel and create a peer
          users.forEach((userID: number) => {
            const peer = createPeer(userID, socketRef.current.id, currentStream);
            peersRef.current.push({
              peerID: userID,
              peer,
            });
            tempPeers.push(peer);
          });
          //TODO, make array of user objects to display in voice chat with name and avatar
          setpeers(tempPeers);
        });

        socketRef.current.on("user joined", (payload) => {
          console.log("incoming person requesting handshake: ", payload.callerID);
          const peer = addPeer(payload.signal, payload.callerID, currentStream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });
          console.log("peers: ", peersRef.current.length);
          setpeers((users: any) => [...users, peer]);
        });

        socketRef.current.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p: any) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });
      });
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
      socketRef.current.emit("sending signal", { userToSignal, callerID, signal });
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
      socketRef.current.emit("returning signal", { signal, callerID });
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
      makeChannelTabs();
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
    setgangInfo(result);
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
  const makeChannelTabs = () => {
    if (gangInfo.role?.role_id) {
      //If in gang, show list of channels
      setchannelList(
        gangInfo.channels.map((tile: any) => (
          <AccordionTab header={`‎ ‎ ${tile.name}`} key={tile.id} className="alt-button">
            {tile.is_voice ? (
              <div className="voice-channel">
                <button
                  onClick={() => {
                    connectToVoice(tile);
                  }}
                >
                  {tile.is_voice
                    ? currentAudioChannel.id && tile.id === currentAudioChannel.id
                      ? `leave ${tile.name} (${peers.length + 1})`
                      : `join ${tile.name} (${peers.length})`
                    : tile.name}
                </button>
                {/* show conditional help messages to set devices */}
                {tile.is_voice && !currentInputDevice ? (
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
                ) : tile.is_voice && !currentOutputDevice ? (
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
            ) : (
              `text chats will go here`
            )}
          </AccordionTab>
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
          {/* List of channels */}
          {gangInfo.role?.role_id ? (
            <div className="chat-list">
              <Accordion activeIndex={currentChannel.index} onTabChange={(e) => channelButtonPressed(e.index)}>
                {channelList}
              </Accordion>
              {peers.map((peer, index) => {
                return <Video key={index} peer={peer} />;
              })}
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
