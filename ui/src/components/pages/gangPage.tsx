import FooterComponent from "../nav/footerComponent";
import HeaderComponent from "../nav/headerComponent";
import "./gangPage.scss";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { getGangActivity } from "../../utils/rest";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import styled from "styled-components";

import Peer from "simple-peer";
import * as io from "socket.io-client";

const StyledVideo = styled.video`
  height: 60%;
  width: 70%;
`;

const Video = (props: any) => {
  const ref = useRef<any>();

  useEffect(() => {
    props.peer.on("stream", (stream: any) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return <StyledVideo playsInline autoPlay ref={ref} />;
};

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2,
};

export default function GangPage() {
  const socketRef = useRef<any>();
  const locationPath: string = useLocation().pathname;
  const userState = useSelector((state: RootState) => state.user.user);
  //Gang Specific
  const [gangInfo, setgangInfo] = useState<any>({});
  const [channelList, setchannelList] = useState<any>([]);
  const [currentChannel, setcurrentChannel] = useState<any>({ name: "" });
  const [first5Members, setfirst5Members] = useState<any>([]);
  const [platformImgLink, setplatformImgLink] = useState<string>("");
  //Voice Specific
  const [peers, setPeers] = useState<any>([]);
  const userAudio = useRef<any>();
  const peersRef = useRef<any>([]);
  const channelId = 2;

  const [expandedProfileVis, setExpandedProfileVis] = useState<boolean>(false);
  const toggleExpandedProfile = () => {
    setExpandedProfileVis(!expandedProfileVis);
  };

  useEffect(() => {
    socketRef.current = io.connect(
      process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://www.gangs.gg"
    );
    const locationOfLastSlash = locationPath.lastIndexOf("/");
    const extractedGangId = locationPath.substring(locationOfLastSlash + 1);
    loadGangPage(parseInt(extractedGangId));

    //VOICE SETUP
    // Get audio media
    // navigator.mediaDevices.getUserMedia({ audio: true }).then((currentStream: any) => {
    //   setlocalStream(currentStream);
    //   myAudio.current = {};
    //   myAudio.current.srcObject = currentStream;
    // });

    return () => {
      socketRef.current.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    turnChatsIntoTiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChannel]);

  //START VOICE LOGIC
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
    console.log("gang: ", gangInfo);
    if (gangInfo.channels) {
      turnChatsIntoTiles();
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

  const channelButtonPressed = (tile: any) => {
    const foundChannel = gangInfo.channels.find((channel: any) => channel.id === tile.id);
    if (tile.is_voice) {
      //Here we can connect or disconnect from the voice socket chat
      if (tile.id === currentChannel.id) {
        //Disconnect from voice
        setcurrentChannel({ name: "" });
        socketRef.current.disconnect();
      } else {
        //Connect To Voice
        setcurrentChannel(foundChannel);
        navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then((currentStream) => {
          userAudio.current = {};
          userAudio.current.srcObject = currentStream;
          socketRef.current.emit("join_channel", { channelId: channelId, userId: userState.id });
          socketRef.current.on("all users", (users) => {
            const peers: any = [];
            // Loop through all users in channel and create a peer
            users.forEach((userID: number) => {
              console.log("all users? ", userID);
              const peer = createPeer(userID, socketRef.current.id, currentStream);
              peersRef.current.push({
                peerID: userID,
                peer,
              });
              peers.push(peer);
            });
            setPeers(peers);
          });

          socketRef.current.on("user joined", (payload) => {
            console.log("incoming person requesting handshake: ", payload.callerID);
            const peer = addPeer(payload.signal, payload.callerID, currentStream);
            peersRef.current.push({
              peerID: payload.callerID,
              peer,
            });
            console.log("peers: ", peersRef.current.length);
            setPeers((users: any) => [...users, peer]);
          });

          socketRef.current.on("receiving returned signal", (payload) => {
            const item = peersRef.current.find((p: any) => p.peerID === payload.id);
            item.peer.signal(payload.signal);
          });
        });
      }
    } else {
      if (tile.id == 0) {
        setcurrentChannel({ name: "" });
      } else {
        if (foundChannel) {
          setcurrentChannel(foundChannel);
        }
      }
    }
  };

  const turnChatsIntoTiles = () => {
    if (gangInfo.role?.role_id) {
      //If in gang, show list of channels
      setchannelList(
        gangInfo.channels.map((tile: any) => (
          <button
            key={tile.id}
            className="alt-button"
            onClick={() => {
              channelButtonPressed(tile);
            }}
          >
            {tile.is_voice
              ? tile.id === currentChannel.id
                ? `leave ${tile.name} (${peers.length})`
                : `join ${tile.name} (${peers.length})`
              : tile.name}
          </button>
        ))
      );
    } else {
      //If not in gang, show join button
      setchannelList(
        <button className="alt-button">join {gangInfo.basicInfo?.name ? gangInfo.basicInfo?.name : ""}</button>
      );
    }
  };

  return (
    <div>
      <HeaderComponent></HeaderComponent>
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
        </div>
        {/* <div className="about-box">{gangInfo.basicInfo?.about ? gangInfo.basicInfo.about : ""}</div> */}
        {/* Gang Default Page */}
        <div
          className="channel-specific-contents"
          style={{
            display: currentChannel.is_voice === true || currentChannel.is_voice == undefined ? "flex" : "none",
          }}
        >
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
          <div className="chat-list">{channelList}</div>
        </div>
        {/* This area shows contents of a specific channel */}
        <div
          className="channel-specific-contents"
          style={{ display: currentChannel.is_voice === false ? "flex" : "none" }}
        >
          {/* Return to list of channels */}
          <div className="channel-title-bar">
            <button
              className="channel-return-button"
              onClick={() => {
                channelButtonPressed(0);
              }}
            >
              <i className="pi pi-angle-left"></i>
            </button>
            <div className="gang-channel-title">{currentChannel.name}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
