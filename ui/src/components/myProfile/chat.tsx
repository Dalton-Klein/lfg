import "./chat.scss";
import { Menu } from "primereact/menu";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import moment from "moment";
import { howLongAgo } from "../../utils/helperFunctions";
import { fetchUserData, getChatHistoryForUser } from "../../utils/rest";
import { Toast } from "primereact/toast";
import ReactTooltip from "react-tooltip";
import ExpandedProfile from "../modal/expandedProfileComponent";

export default function Chat({ socketRef, convo }) {
  const userState = useSelector((state: RootState) => state.user.user);

  const [currentConvo, setcurrentConvo] = useState<any>({ id: 0 });
  const [isPublic, setisPublic] = useState<boolean>(true);
  const [platformImage, setplatformImage] = useState<any>([]);
  const [platformUsername, setplatformUsername] = useState<any>("");
  // const [platformUsername, setPlatformUsername] = useState<any>('');
  const [messageState, setMessageState] = useState<any>({
    roomId: 1,
    message: "",
    senderId: userState.id,
    sender: userState.username,
    timestamp: "",
  });
  const [chat, setChat] = useState<any>([]);
  const toast: any = useRef({ current: "" });
  const dropdownMenu: any = useRef(null);
  const lastMessageRef: any = useRef(null);
  const [expandedProfileVis, setexpandedProfileVis] = useState<boolean>(false);
  const [chatUserData, setchatUserData] = useState<any>({});

  //Initial setup of chat window
  useEffect(() => {
    determinePlatformImageAndUsername();
    if (userState.id && userState.id > 0) {
      return () => {
        setisPublic(true);
        setplatformImage([]);
        setplatformUsername("");
        setMessageState({
          roomId: 1,
          message: "",
          senderId: userState.id,
          sender: userState.username,
          timestamp: "",
        });
        setChat([]);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //BEGIN Update messages list after each chat sent
  useEffect(() => {
    socketRef.current.on("message", ({ roomId, senderId, sender, message, timestamp }: any) => {
      setChat([...chat, { roomId, senderId, sender, message, timestamp }]);
    });
    lastMessageRef.current?.scrollIntoView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat]);
  //END Update messages list after each chat sent

  //This use effect is triggered when flipping between conversations (rooms)
  useEffect(() => {
    setChat([
      {
        connection_id: 1,
        created_at: `${moment().format()}`,
        id: 0,
        message: "loading...",
        sender: "gangs team",
        updated_at: `${moment().format()}`,
        username: "gangs team",
      },
    ]);
    if (userState.id && userState.id > 0) {
      setMessageState({ ...messageState, roomId: currentConvo.id });
      determinePlatformImageAndUsername();
      updateCurrentConvo();
      socketRef.current.emit("join_room", currentConvo.id);
      lastMessageRef.current?.scrollIntoView();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convo]);

  useEffect(() => {
    loadChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentConvo]);

  const determinePlatformImageAndUsername = () => {
    const assetLinks: any = {
      1: "https://res.cloudinary.com/kultured-dev/image/upload/v1685814273/logoWhiteSmall_i1lvgo.png",
      2: "https://res.cloudinary.com/kultured-dev/image/upload/v1685814624/psn-logo-small_nbgzwa.png",
      3: "https://res.cloudinary.com/kultured-dev/image/upload/v1685814627/xbox-logo-small_e8sqjw.png",
    };
    let assetLink = assetLinks[currentConvo.preferred_platform];
    setisPublic(currentConvo.isPublicChat === "true" ? true : false);
    if (currentConvo.preferred_platform) {
      if (currentConvo.preferred_platform === 1) setplatformUsername(currentConvo.username);
      if (currentConvo.preferred_platform === 2) setplatformUsername(currentConvo.psn);
      if (currentConvo.preferred_platform === 3) setplatformUsername(currentConvo.xbox);
      setplatformImage(<img className="connection-platform-image" src={assetLink} alt={`platform type`} />);
    } else {
      setplatformImage(<></>);
      setplatformUsername("");
    }
  };

  //BEGIN SOCKET Functions
  const updateCurrentConvo = () => {
    if (convo.id === 0) {
      // @ts-ignore
      setcurrentConvo(JSON.parse(localStorage.getItem("currentConvo")));
    } else {
      setcurrentConvo(convo);
    }
  };

  const loadChat = async () => {
    if (currentConvo.id !== 0) {
      const historicalChatData = await getChatHistoryForUser(userState.id, currentConvo.id, "");
      if (historicalChatData && historicalChatData.length) {
        setChat([...historicalChatData]);
        socketRef.current.emit("join_room", currentConvo.id);
      } else {
        setChat([]);
      }
    } else {
      setChat([]);
    }
  };

  const onTextChange = (e: any) => {
    setMessageState({ ...messageState, message: e.target.value });
  };

  const onMessageSubmit = (e: any) => {
    const { roomId, senderId, sender, message } = messageState;
    const timestamp = moment().format();
    if (message.length > 750) {
      toast.current.clear();
      toast.current.show({
        severity: "warn",
        summary: "message length exceeded",
        detail: `message length 5 is longer than the cap of 750 characters`,
        sticky: true,
      });
    } else {
      socketRef.current.emit("message", { roomId, senderId, sender, message, timestamp });
      e.preventDefault();
      setMessageState({ roomId, senderId, sender, message: "", timestamp });
    }
  };
  const renderChat = () => {
    if (chat.length) {
      return chat.map(({ sender, message, created_at }: any, index: number) => {
        const formattedTimestamp = howLongAgo(created_at);
        return (
          <div
            className={
              sender === userState.username
                ? "message-bubble message-border-owner"
                : "message-bubble message-border-non-owner"
            }
            key={index}
          >
            <div className="message-sender-box">
              <div className="message-sender-name">{sender}</div>
              <div className="message-timestamp">{formattedTimestamp}</div>
            </div>
            <div className="message-content">{message}</div>
          </div>
        );
      });
    } else {
      return (
        <div className="message-bubble message-border-non-owner">
          <div className="message-sender-box">
            <div className="message-sender-name">gangs team</div>
            <div className="message-timestamp"></div>
          </div>
          <div className="message-content">no messages yet, go ahead and say hi!</div>
        </div>
      );
    }
  };
  //END SOCKET Functions

  const items = [
    {
      items: [
        {
          label: "remove connection",
          icon: "pi pi-user-minus",
          command: () => {
            toast.current.clear();
            toast.current.show({
              severity: "info",
              summary: "feature coming soon!",
              detail: ``,
              sticky: true,
            });
          },
        },
        {
          label: "block",
          icon: "pi pi-times",
          command: () => {
            toast.current.clear();
            toast.current.show({
              severity: "info",
              summary: "feature coming soon!",
              detail: ``,
              sticky: true,
            });
          },
        },
      ],
    },
  ];

  //START Expanded Profile Logic
  const toggleExpandedProfile = async () => {
    const userData: any = await fetchUserData(currentConvo.user_id);
    setchatUserData(userData.data);
    setexpandedProfileVis(!expandedProfileVis);
  };
  //END Expanded Profile Logic

  return (
    <div className="messages-box">
      <Toast ref={toast} />
      {/* Conditionally render hamburger modal */}
      {expandedProfileVis ? (
        <ExpandedProfile
          toggleExpandedProfile={toggleExpandedProfile}
          userInfo={chatUserData}
          refreshTiles={() => {}}
          showConnectForm={false}
          isProfileComplete={currentConvo.isProfileComplete}
          isConnected={true}
          game={"all"}
        />
      ) : (
        <></>
      )}
      {/* Message Title Bar */}
      <div className="messages-title-container">
        {currentConvo.avatar_url === "" ||
        currentConvo.avatar_url ===
          "https://res.cloudinary.com/kultured-dev/image/upload/v1625617920/defaultAvatar_aeibqq.png" ? (
          <div
            className="dynamic-conversation-border"
            onClick={() => {
              toggleExpandedProfile();
            }}
          >
            <div className="dynamic-conversation-text-small">
              {currentConvo.username
                .split(" ")
                .map((word: string[]) => word[0])
                .join("")
                .slice(0, 2)
                .toLowerCase()}
            </div>
          </div>
        ) : (
          <img
            onClick={() => {
              toggleExpandedProfile();
            }}
            className="conversation-profile-image"
            src={currentConvo.avatar_url}
            alt={`${currentConvo.username}'s avatar`}
          />
        )}
        <div className="messages-title-text">{currentConvo.username}</div>
        <div className="stackable-container-right">
          <div
            className="messaging-platform-box"
            style={{ display: !isPublic ? "inline-block" : "none" }}
            data-tip
            data-for="platformTip"
          >
            {platformImage}
          </div>
        </div>
        <Menu model={items} popup ref={dropdownMenu} id="popup_menu" />
        <button className="options-button" onClick={(event) => dropdownMenu.current.toggle(event)}>
          <i className="pi pi-ellipsis-h"></i>
        </button>
      </div>
      {/* Messages Scroll Box */}
      <div className="render-chat">
        {renderChat()}
        <div ref={lastMessageRef} />
      </div>

      {/* Message Input Form */}
      <form className="message-form" onSubmit={onMessageSubmit}>
        <input
          onChange={(e) => {
            onTextChange(e);
          }}
          value={messageState.message ? messageState.message : ""}
          className="input-box messaging-input"
          placeholder={"type here..."}
        ></input>

        <button type="submit">send</button>
      </form>

      <ReactTooltip id="platformTip" place="bottom" effect="solid">
        {platformUsername}
      </ReactTooltip>
    </div>
  );
}
