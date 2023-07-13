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
  requestSoftDeleteMessage,
  uploadAvatarCloud,
} from "../../utils/rest";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ExpandedProfile from "../modal/expandedProfileComponent";
import { avatarFormIn, avatarFormOut } from "../../utils/animations";
import RankTile from "../tiles/rankTile";
import { Menu } from "primereact/menu";
import AddReactionOutlinedIcon from "@mui/icons-material/AddReactionOutlined";

function isMobileDevice() {
  const userAgent = window.navigator.userAgent;
  const mobileKeywords = ["Android", "iOS", "iPhone", "iPad", "iPod", "Windows Phone"];
  return mobileKeywords.some((keyword) => userAgent.includes(keyword));
}
const messageReactionsKey = {
  1: "count_love",
  2: "count_thumbs_down",
  3: "count_thumbs_up",
  4: "count_one_hunderd",
  5: "count_fire",
  6: "count_skull",
};
export default function InstantMessaging({ socketRef, convo, hasPressedChannelForMobile }) {
  const navigate = useNavigate();

  const reactionOptionsMenu: any = useRef(null);
  const messageOptionsMenu: any = useRef(null);
  const hiddenFileInput: any = React.useRef(null);
  const [photoFile, setPhotoFile] = useState<File>({ name: "" } as File);
  const isMobile = isMobileDevice();
  const userState = useSelector((state: RootState) => state.user.user);
  const locationPath: string = useLocation().pathname;

  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null);
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
  const reactionListener = ({ roomId, ownerId, reactionTypeId, messageId, reactionScopeId, isAdding }) => {
    setchat((prevChat) => {
      let copyOfChat = [...prevChat];
      //Find message we need to edit reactions for
      copyOfChat.forEach((message) => {
        if (message.id === messageId) {
          //Found message needing to edit reaction for, adjusting count
          const prevValue = parseInt(message[messageReactionsKey[reactionTypeId]])
            ? parseInt(message[messageReactionsKey[reactionTypeId]])
            : 0;
          message[messageReactionsKey[reactionTypeId]] = isAdding ? prevValue + 1 : prevValue - 1;
        }
      });
      return copyOfChat;
    });
  };
  const messageListener = ({
    id,
    roomId,
    senderId,
    avatar_url,
    rank,
    sender,
    message,
    isImage,
    timestamp,
    count_love,
    count_thumbs_down,
    count_thumbs_up,
    count_one_hunderd,
    count_fire,
    count_skull,
  }: any) => {
    setchat((prevChat) => [
      ...prevChat,
      {
        id,
        roomId,
        senderId,
        sender,
        message,
        is_image: isImage,
        rank,
        avatar_url,
        timestamp,
        count_love,
        count_thumbs_down,
        count_thumbs_up,
        count_one_hunderd,
        count_fire,
        count_skull,
      },
    ]);
  };
  useEffect(() => {
    socketRef.current.on("message", messageListener);
    socketRef.current.on("reaction_event", reactionListener);
    // When loading gang page on mobile, prevent undesired scroll on page load until user selects channel
    if (isMobile && !hasPressedChannelForMobile) {
      //Do nothing
    } else {
      lastMessageRef.current?.scrollIntoView();
    }
    //Cleanup listeners to ensure only 1 is active for each event at a time
    return () => {
      socketRef.current.off("reaction_event", reactionListener);
      socketRef.current.off("message", messageListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //BEGIN Update messages list after each chat sent

  useEffect(() => {
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
        socketRef.current.emit("join_room", `reactions_dm_${currentConvo.id}`);
        socketRef.current.emit("join_room", `dm_${currentConvo.id}`);
      } else {
        socketRef.current.emit("join_room", `reactions_gang_${currentConvo.id}`);
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

  const removeMessage = async (id: any) => {
    const isGangMessaging = locationPath === "/messaging" ? false : true;
    const result = await requestSoftDeleteMessage(id, isGangMessaging, "");
    if (result) {
      setchat((prevChat: any[]) => prevChat.filter((message) => message.id !== id));
      setSelectedMessageId(null); // Reset the selected message ID
    }
    messageOptionsMenu.current = null;
    const clickEvent = new MouseEvent("click");
    document.dispatchEvent(clickEvent);
  };

  const openOptionsMenu = (event: React.MouseEvent<HTMLButtonElement>, messageId: number) => {
    setSelectedMessageId(messageId);
    if (messageOptionsMenu.current) {
      messageOptionsMenu.current.toggle(event);
    }
  };

  const openReactionsMenu = (event: React.MouseEvent<HTMLButtonElement>, messageId: number) => {
    setSelectedMessageId(messageId);
    if (reactionOptionsMenu.current) {
      reactionOptionsMenu.current.toggle(event);
    }
  };

  const addMessageReaction = async (reactionId: number, messageId: any) => {
    // Right now there is direct and group messaging, if third scope is added change this
    const { roomId } = messageState;
    if (locationPath === "/messaging") {
      socketRef.current.emit("reaction_event", {
        roomId: `reactions_dm_${roomId}`,
        ownerId: userState.id,
        reactionTypeId: reactionId,
        messageId,
        reactionScopeId: 1,
      });
    } else {
      socketRef.current.emit("reaction_event", {
        roomId: `reactions_gang_${roomId}`,
        ownerId: userState.id,
        reactionTypeId: reactionId,
        messageId,
        reactionScopeId: 2,
      });
    }
    messageOptionsMenu.current = null;
    const clickEvent = new MouseEvent("click");
    document.dispatchEvent(clickEvent);
  };

  const renderChat = () => {
    if (chat.length) {
      return chat.map(
        (
          {
            id,
            senderId,
            sender,
            message,
            is_image,
            rank,
            avatar_url,
            created_at,
            count_love,
            count_thumbs_down,
            count_thumbs_up,
            count_one_hunderd,
            count_fire,
            count_skull,
          }: any,
          index: number
        ) => {
          const formattedTimestamp = howLongAgo(created_at);
          return (
            <div
              className={
                sender === userState.username
                  ? "message-bubble message-border-owner"
                  : "message-bubble message-border-non-owner"
              }
              key={id}
            >
              <div className="message-sender-box">
                <div className="sender-specific">
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
                </div>
                <div className="message-details">
                  <div className="message-timestamp">{formattedTimestamp}</div>
                  <button
                    className="reaction-button"
                    onClick={(event) => {
                      openReactionsMenu(event, id);
                    }}
                  >
                    <AddReactionOutlinedIcon />
                  </button>
                  <button
                    style={{ display: sender === userState.username ? "inline-block" : "none" }}
                    className="options-button"
                    onClick={(event) => {
                      openOptionsMenu(event, id);
                    }}
                  >
                    <i className="pi pi-ellipsis-h"></i>
                  </button>
                </div>
              </div>
              <div className="message-content">
                {is_image ? (
                  <img src={message} className="user-uploaded-img" alt="user-uploaded-content"></img>
                ) : (
                  message
                )}
              </div>
              <div className="reaction-box">
                {renderReactionsForMessage(
                  id,
                  count_love,
                  count_thumbs_down,
                  count_thumbs_up,
                  count_one_hunderd,
                  count_fire,
                  count_skull
                )}
              </div>
            </div>
          );
        }
      );
    } else {
      return (
        <div className="message-bubble message-border-non-owner">
          <div className="message-sender-box">
            <div className="sender-specific">
              <img
                className="mssg-avatar"
                onClick={() => {}}
                src={
                  "https://res.cloudinary.com/kultured-dev/image/upload/v1663653269/logo-v2-gangs.gg-transparent-white_mqcq3z.png"
                }
              />
              <RankTile user={{ rank: 174 }} isSmall={true}></RankTile>
              <div className="message-sender-name">gangs team</div>
            </div>
            <div className="message-details">
              <div className="message-timestamp"></div>
            </div>
          </div>
          <div className="message-content">no messages yet, go ahead and say hi!</div>
        </div>
      );
    }
  };
  const renderReactionsForMessage = (
    messageId,
    count_love,
    count_thumbs_down,
    count_thumbs_up,
    count_one_hunderd,
    count_fire,
    count_skull
  ) => {
    let reactionsResult: any[] = [];
    if (count_love > 0) {
      reactionsResult.push(
        <div
          key={1}
          className="mssg-reaction"
          onClick={() => {
            addMessageReaction(1, messageId);
          }}
        >
          <div>❤️</div>
          <div className="reaction-count">{count_love}</div>
        </div>
      );
    }
    if (count_thumbs_up > 0) {
      reactionsResult.push(
        <div
          key={3}
          className="mssg-reaction"
          onClick={() => {
            addMessageReaction(3, messageId);
          }}
        >
          <div>👍</div>
          <div className="reaction-count">{count_thumbs_up}</div>
        </div>
      );
    }
    if (count_thumbs_down > 0) {
      reactionsResult.push(
        <div
          key={2}
          className="mssg-reaction"
          onClick={() => {
            addMessageReaction(2, messageId);
          }}
        >
          <div>👎</div>
          <div className="reaction-count">{count_thumbs_down}</div>
        </div>
      );
    }
    if (count_one_hunderd > 0) {
      reactionsResult.push(
        <div
          key={4}
          className="mssg-reaction"
          onClick={() => {
            addMessageReaction(4, messageId);
          }}
        >
          <div>💯</div>
          <div className="reaction-count">{count_one_hunderd}</div>
        </div>
      );
    }
    if (count_fire > 0) {
      reactionsResult.push(
        <div
          key={5}
          className="mssg-reaction"
          onClick={() => {
            addMessageReaction(5, messageId);
          }}
        >
          <div>🔥</div>
          <div className="reaction-count">{count_fire}</div>
        </div>
      );
    }
    if (count_skull > 0) {
      reactionsResult.push(
        <div
          key={6}
          className="mssg-reaction"
          onClick={() => {
            addMessageReaction(6, messageId);
          }}
        >
          <div>💀</div>
          <div className="reaction-count">{count_skull}</div>
        </div>
      );
    }
    return reactionsResult;
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
        <Menu
          model={[
            {
              template: (
                <div className="reactions-options" style={{ display: "flex" }}>
                  <div
                    style={{ marginRight: ".5vw", cursor: "pointer" }}
                    onClick={() => addMessageReaction(1, selectedMessageId)}
                  >
                    ❤️
                  </div>
                  <div
                    style={{ marginRight: ".5vw", cursor: "pointer" }}
                    onClick={() => addMessageReaction(3, selectedMessageId)}
                  >
                    👍
                  </div>
                  <div
                    style={{ marginRight: ".5vw", cursor: "pointer" }}
                    onClick={() => addMessageReaction(2, selectedMessageId)}
                  >
                    👎
                  </div>
                  <div
                    style={{ marginRight: ".5vw", cursor: "pointer" }}
                    onClick={() => addMessageReaction(4, selectedMessageId)}
                  >
                    💯
                  </div>
                  <div
                    style={{ marginRight: ".5vw", cursor: "pointer" }}
                    onClick={() => addMessageReaction(5, selectedMessageId)}
                  >
                    🔥
                  </div>
                  <div
                    style={{ marginRight: ".5vw", cursor: "pointer" }}
                    onClick={() => addMessageReaction(6, selectedMessageId)}
                  >
                    💀
                  </div>
                </div>
              ),
            },
          ]}
          popup
          ref={reactionOptionsMenu}
        />
        <Menu
          model={[
            {
              template: <div onClick={() => removeMessage(selectedMessageId)}>delete message</div>,
            },
          ]}
          popup
          ref={messageOptionsMenu}
        />
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
