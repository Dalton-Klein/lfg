import "./instantMessaging.scss";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import moment from "moment";
import { howLongAgo } from "../../utils/helperFunctions";
import { getChatHistoryForGang, getChatHistoryForUser } from "../../utils/rest";
import { useLocation } from "react-router-dom";

function isMobileDevice() {
  const userAgent = window.navigator.userAgent;
  const mobileKeywords = ["Android", "iOS", "iPhone", "iPad", "iPod", "Windows Phone"];
  return mobileKeywords.some((keyword) => userAgent.includes(keyword));
}

export default function InstantMessaging({ socketRef, convo, hasPressedChannelForMobile }) {
  const isMobile = isMobileDevice();
  const userState = useSelector((state: RootState) => state.user.user);
  const locationPath: string = useLocation().pathname;

  const [currentConvo, setcurrentConvo] = useState<any>({ id: 0 });
  // const [platformUsername, setPlatformUsername] = useState<any>('');
  const [messageState, setMessageState] = useState<any>({
    roomId: 1,
    message: "",
    senderId: userState.id,
    sender: userState.username,
    timestamp: "",
  });
  const [chat, setchat] = useState<any>([]);
  const toast: any = useRef({ current: "" });
  const lastMessageRef: any = useRef(null);

  //Initial setup of chat window
  useEffect(() => {
    if (userState.id && userState.id > 0) {
      return () => {
        setMessageState({
          roomId: 1,
          message: "",
          senderId: userState.id,
          sender: userState.username,
          timestamp: "",
        });
        setchat([]);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //BEGIN Update messages list after each chat sent
  useEffect(() => {
    socketRef.current.on("message", ({ roomId, senderId, sender, message, timestamp }: any) => {
      setchat([...chat, { roomId, senderId, sender, message, timestamp }]);
    });
    // When loading gang page on mobile, prevent undesired scroll on page load until user selects channel
    if (isMobile && !hasPressedChannelForMobile) {
      //Do nothing
    } else {
      lastMessageRef.current?.scrollIntoView();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat]);
  //END Update messages list after each chat sent

  //This use effect is triggered when flipping between conversations (rooms)
  useEffect(() => {
    setchat([
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
      updateCurrentConvo();
      if (isMobile && !hasPressedChannelForMobile) {
        //Do nothing
      } else {
        lastMessageRef.current?.scrollIntoView();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convo]);

  useEffect(() => {
    setMessageState({ ...messageState, roomId: currentConvo.id });
    joinSocketRoom();
    loadChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentConvo]);

  //BEGIN SOCKET Functions
  const updateCurrentConvo = () => {
    if (convo.id === 0) {
      // @ts-ignore
      setcurrentConvo(JSON.parse(localStorage.getItem("currentConvo")));
    } else {
      setcurrentConvo(convo);
    }
  };

  const joinSocketRoom = () => {
    if (locationPath === "/messaging") {
      socketRef.current.emit("join_room", `dm_${currentConvo.id}`);
    } else {
      socketRef.current.emit("join_room", `gang_${currentConvo.id}`);
    }
  };

  const loadChat = async () => {
    if (currentConvo.id && currentConvo.id !== 0) {
      let historicalChatData;
      if (locationPath === "/messaging") {
        historicalChatData = await getChatHistoryForUser(userState.id, currentConvo.id, "");
      } else {
        //Block for loading gang group messages
        historicalChatData = await getChatHistoryForGang(userState.id, currentConvo.id, "");
      }
      if (historicalChatData && historicalChatData.length) {
        setchat([...historicalChatData]);
        joinSocketRoom();
      } else {
        setchat([]);
      }
    } else {
      setchat([]);
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
      if (locationPath === "/messaging") {
        socketRef.current.emit("message", { roomId: `dm_${roomId}`, senderId, sender, message, timestamp });
      } else {
        socketRef.current.emit("gang_message", { roomId: `gang_${roomId}`, senderId, sender, message, timestamp });
      }
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

  return (
    <div className="messages-box">
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
    </div>
  );
}
