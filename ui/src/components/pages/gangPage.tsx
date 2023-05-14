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
    if (currentAudioChannel.id) {
      connectToVoice();
    }
    renderChannelTitleContents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAudioChannel]);

  useEffect(() => {
    renderChannelDynamicContents();
    socketRef.current.on("join_voice", (participants: any) => {
      console.log("user joined? ", participants);
      renderCallParticipants(participants);
    });
    socketRef.current.on("leave_voice", (participants: any) => {
      console.log("user left? ", participants);
      renderCallParticipants(participants);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callParticipants]);

  useEffect(() => {
    renderChannelTitleContents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showChannelNav]);

  //START VOICE LOGIC
  const loadDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const savedDevices = loadSavedDevices(devices, userState);
    setcurrentInputDevice(savedDevices.input_device);
    setcurrentOutputDevice(savedDevices.output_device);
  };
  const connectToVoice = () => {
    console.log("connecting to voice: ", currentAudioChannel);
    socketRef.current.emit("join_voice", {
      roomId: `voice_${currentAudioChannel.id}`,
      user_id: userState.id,
      username: userState.username,
      avatar_url: userState.avatar_url,
    });
  };

  const disconnectFromVoice = () => {
    console.log("disconnecting from voice: ");
    socketRef.current.emit("leave_voice", {
      roomId: `voice_${currentAudioChannel.id}`,
      user_id: userState.id,
    });
    setcurrentAudioChannel({});
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
              navigate(`/user-settings`);
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
    console.log("rendering contents? ", callParticipants);
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
                  {peers.map((peer, index) => {
                    return <Video key={index} peer={peer} />;
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
