import "./instantMessaging.scss";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import moment from "moment";
import { howLongAgo } from "../../utils/helperFunctions";
import {
  fetchUserDataAndConnectedStatus,
  getChatHistoryForGang,
  getChatHistoryForUser,
  uploadAvatarCloud,
} from "../../utils/rest";
import { Link, useLocation } from "react-router-dom";
import ExpandedProfile from "../modal/expandedProfileComponent";
import { avatarFormIn, avatarFormOut } from "../../utils/animations";
import RankTile from "../tiles/rankTile";

function isMobileDevice() {
  const userAgent = window.navigator.userAgent;
  const mobileKeywords = ["Android", "iOS", "iPhone", "iPad", "iPod", "Windows Phone"];
  return mobileKeywords.some((keyword) => userAgent.includes(keyword));
}

export default function InstantMessaging({ socketRef, convo, hasPressedChannelForMobile }) {
  const hiddenFileInput: any = React.useRef(null);
  const [photoFile, setPhotoFile] = useState<File>({ name: "" } as File);
  const isMobile = isMobileDevice();
  const userState = useSelector((state: RootState) => state.user.user);
  const locationPath: string = useLocation().pathname;
  const [expandedProfileVis, setExpandedProfileVis] = useState<boolean>(false);
  const [currentUserHighlighted, setcurrentUserHighlighted] = useState<any>({ id: 0 });
  const [currentConvo, setcurrentConvo] = useState<any>({ id: 0 });
  const [isUploadFormShown, setisUploadFormShown] = useState<boolean>(false);
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
    socketRef.current.on(
      "message",
      ({ roomId, senderId, sender, message, isImage, rank, avatar_url, timestamp }: any) => {
        setchat([...chat, { roomId, senderId, sender, message, is_image: isImage, rank, avatar_url, timestamp }]);
      }
    );
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
        created_at: `${moment().format("MM-DD-YYYY h:mmA")}`,
        id: 0,
        message: "loading...",
        is_image: false,
        sender: "gangs team",
        updated_at: `${moment().format("MM-DD-YYYY h:mmA")}`,
        username: "gangs team",
        rank: 1,
        avatar_url:
          "https://res.cloudinary.com/kultured-dev/image/upload/v1663653269/logo-v2-gangs.gg-transparent-white_mqcq3z.png",
      },
    ]);
    updateCurrentConvo();
    if (isMobile && !hasPressedChannelForMobile) {
      //Do nothing
    } else {
      lastMessageRef.current?.scrollIntoView();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convo]);

  useEffect(() => {
    setMessageState({ ...messageState, roomId: currentConvo.id });
    joinSocketRoom();
    loadChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentConvo]);

  useEffect(() => {
    if (currentUserHighlighted.id) {
      setExpandedProfileVis(!expandedProfileVis);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserHighlighted]);

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
    if (currentConvo.id && currentConvo.id > 0) {
      if (locationPath === "/messaging") {
        socketRef.current.emit("join_room", `dm_${currentConvo.id}`);
      } else {
        socketRef.current.emit("join_room", `gang_${currentConvo.id}`);
      }
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
    const timestamp = moment().format("MM-DD-YYYY h:mmA");
    if (message.length > 750) {
      toast.current?.clear();
      toast.current.show({
        severity: "warn",
        summary: "message length exceeded",
        detail: `message length ${message.length} is longer than the cap of 750 characters`,
        sticky: true,
      });
    } else if (message.length < 1) {
      toast.current?.clear();
      toast.current.show({
        severity: "warn",
        summary: "no message conent",
        detail: `message must have at least 1 character`,
        sticky: true,
      });
    } else {
      if (locationPath === "/messaging") {
        socketRef.current.emit("message", {
          roomId: `dm_${roomId}`,
          senderId,
          sender,
          avatar_url: userState.avatar_url,
          rank: userState.rank,
          message,
          isImage: false,
          timestamp,
        });
      } else {
        socketRef.current.emit("gang_message", {
          roomId: `gang_${roomId}`,
          senderId,
          sender,
          avatar_url: userState.avatar_url,
          rank: userState.rank,
          message,
          isImage: false,
          timestamp,
        });
      }
      e.preventDefault();
      setMessageState({ roomId, senderId, sender, message: "", timestamp });
    }
  };

  const renderChat = () => {
    if (chat.length) {
      return chat.map(({ senderId, sender, message, is_image, rank, avatar_url, created_at }: any, index: number) => {
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
              {avatar_url === "" ||
              avatar_url ===
                "https://res.cloudinary.com/kultured-dev/image/upload/v1625617920/defaultAvatar_aeibqq.png" ? (
                <div className="dynamic-avatar-border">
                  <div className="dynamic-avatar-text-med">
                    {sender
                      .split(" ")
                      .map((word: string[]) => word[0])
                      .join("")
                      .slice(0, 2)
                      .toLowerCase()}
                  </div>
                </div>
              ) : (
                <img className="mssg-avatar" onClick={() => {}} src={avatar_url} alt={`${sender}avatar`} />
              )}
              <RankTile user={{ rank: rank ? rank : 1 }} isSmall={true}></RankTile>
              <div
                className="message-sender-name"
                onClick={() => {
                  toggleExpandedProfile(senderId);
                }}
              >
                {sender}
              </div>
              <div className="message-timestamp">{formattedTimestamp}</div>
            </div>
            <div className="message-content">
              {is_image ? <img src={message} className="user-uploaded-img" alt="user-uploaded-content"></img> : message}
            </div>
          </div>
        );
      });
    } else {
      return (
        <div className="message-bubble message-border-non-owner">
          <div className="message-sender-box">
            <img
              className="mssg-avatar"
              onClick={() => {}}
              src={
                "https://res.cloudinary.com/kultured-dev/image/upload/v1663653269/logo-v2-gangs.gg-transparent-white_mqcq3z.png"
              }
            />
            <RankTile user={{ rank: 174 }} isSmall={true}></RankTile>
            <div className="message-sender-name">gangs team</div>
            <div className="message-timestamp"></div>
          </div>
          <div className="message-content">no messages yet, go ahead and say hi!</div>
        </div>
      );
    }
  };
  //END SOCKET Functions

  const toggleExpandedProfile = async (senderId: number) => {
    if (!expandedProfileVis) {
      //Get user data for that person
      const result = await fetchUserDataAndConnectedStatus(userState.id, senderId);
      if (result?.data) {
        setcurrentUserHighlighted(result.data);
      }
    } else {
      setExpandedProfileVis(!expandedProfileVis);
    }
  };

  //START IMAGE ATTACHMENT LOGIC
  const openImageAttachmentModal = async () => {
    if (!userState.id || userState.id === 0) alert("You must be logged in to attach an image");
    setisUploadFormShown(true);
    avatarFormIn();
    return;
  };
  const handleFileUpload = (event: any) => {
    setPhotoFile(event.target.files[0]);
    return;
  };
  const chooseFileHandler = (event: any) => {
    if (hiddenFileInput.current !== null) {
      hiddenFileInput.current!.click();
    }
    return;
  };
  const handlePhotoUploaded = async (e: any) => {
    avatarFormOut();
    setisUploadFormShown(false);
    const avatar = document.querySelector(".avatar-input");
    const url: string | undefined = await uploadAvatarCloud(avatar);
    //Send Message With Image
    onImageSubmit(url);
    setPhotoFile({ name: "" } as File);
  };
  const onImageSubmit = (url: string | undefined) => {
    const { roomId, senderId, sender } = messageState;
    const timestamp = moment().format("MM-DD-YYYY h:mmA");
    if (!url) {
      toast.current?.clear();
      toast.current.show({
        severity: "warn",
        summary: "image failed to upload",
        detail: `we encountered a problem, sorry!`,
        sticky: true,
      });
    } else {
      if (locationPath === "/messaging") {
        socketRef.current.emit("message", {
          roomId: `dm_${roomId}`,
          senderId,
          sender,
          message: url,
          isImage: true,
          timestamp,
        });
      } else {
        socketRef.current.emit("gang_message", {
          roomId: `gang_${roomId}`,
          senderId,
          sender,
          message: url,
          isImage: true,
          timestamp,
        });
      }
      setMessageState({ roomId, senderId, sender, message: "", timestamp });
    }
  };
  const closeImageAttachmentModal = () => {
    avatarFormOut();
    setisUploadFormShown(false);
    return;
  };
  //END IMAGE ATTACHMENT LOGIC

  const conditionalClass = isUploadFormShown ? "conditionalZ2" : "conditionalZ1";
  return (
    <div className="messages-box">
      {/* EDIT PHTO MODAL */}
      <div className={`edit-profile-form ${conditionalClass}`}>
        <p>{"attach image"}</p>
        {
          <div className="msg-img-upload-form">
            <input
              className="avatar-input"
              type="file"
              ref={hiddenFileInput}
              style={{ display: "none" }}
              onChange={handleFileUpload}
            ></input>
            <button onClick={chooseFileHandler} className="upload-form-btns">
              choose photo
            </button>
            <div className="photo-label">{photoFile ? photoFile.name : ""}</div>
          </div>
        }
        <div className="upload-form-btns">
          <button onClick={handlePhotoUploaded}>send</button>
          <button onClick={closeImageAttachmentModal}>close</button>
        </div>
      </div>
      {/* Conditionally render hamburger modal */}
      {expandedProfileVis ? (
        <ExpandedProfile
          toggleExpandedProfile={toggleExpandedProfile}
          userInfo={currentUserHighlighted}
          refreshTiles={() => {}}
          showConnectForm={currentUserHighlighted.showConnectForm}
          isProfileComplete={true}
          isConnected={currentUserHighlighted.isConnected}
          game={"all"}
        />
      ) : (
        <></>
      )}
      {/* Messages Scroll Box */}
      <div className={locationPath === "/messaging" ? `render-chat render-chat-dms` : `render-chat render-chat-gangs`}>
        {renderChat()}
        <div ref={lastMessageRef} />
      </div>
      {/* Message Input Form */}
      {userState.id && userState.id > 0 ? (
        <form className="message-form" onSubmit={onMessageSubmit}>
          <input
            onChange={(e) => {
              onTextChange(e);
            }}
            value={messageState.message ? messageState.message : ""}
            className="input-box messaging-input"
            placeholder={"type here..."}
          ></input>
          <button
            type="button"
            onClick={() => {
              openImageAttachmentModal();
            }}
          >
            <i className="pi pi-image"></i>
          </button>
          <button type="submit" disabled={messageState?.message?.length < 1}>
            send
          </button>
        </form>
      ) : (
        <div className="message-form-no-user">
          {" "}
          to send messages,{" "}
          <Link to="/login" className="link-text">
            login
          </Link>{" "}
          or{" "}
          <Link to="/login" className="link-text">
            signup
          </Link>
        </div>
      )}
    </div>
  );
}
