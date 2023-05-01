import { useEffect, useState } from "react";
import ConversationTile from "../tiles/conversationTile";
import "./verticalNav.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { getConnectionsForUser, getMyGangTiles } from "../../utils/rest";
import { useNavigate } from "react-router-dom";
import { setPreferences } from "../../store/userPreferencesSlice";

const rustChatObject = {
  id: 1,
  username: "rust general",
  avatar_url: "https://res.cloudinary.com/kultured-dev/image/upload/v1663786762/rust-logo-small_uarsze.png",
  isPublicChat: "true",
};
const minecraftChatObject = {
  id: 2,
  username: "minecraft general",
  avatar_url: "https://res.cloudinary.com/kultured-dev/image/upload/v1665619101/Minecraft_ttasx5.png",
  isPublicChat: "true",
};
const rocketLeagueChatObject = {
  id: 3,
  username: "rocket league general",
  avatar_url: "https://res.cloudinary.com/kultured-dev/image/upload/v1665620519/RocketLeagueResized_loqz1h.png",
  isPublicChat: "true",
};
export default function VerticalNav() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [currentConvo, setcurrentConvo] = useState<any>({ id: 0 });
  const [messagingResult, setmessagingResult] = useState<any>([<div key={0}></div>]);
  const [gangResult, setgangResult] = useState<any>([<div key={0}></div>]);
  const [currentNavSelection, setcurrentNavSelection] = useState<number>(0);

  const userState = useSelector((state: RootState) => state.user.user);
  const preferencesState = useSelector((state: RootState) => state.preferences);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userState.id && userState.id > 0) {
      loadAppropriateContent();
    } else {
      setcurrentNavSelection(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNavSelection]);

  useEffect(() => {
    loadAppropriateContent();
    dispatch(
      setPreferences({
        ...preferencesState,
        currentConvo: currentConvo,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentConvo]);

  const loadAppropriateContent = () => {
    if (currentNavSelection === 0) {
      fetchMyGangs();
    } else {
      fetchMyConnections();
    }
  };

  const fetchMyConnections = async () => {
    const httpResult = await getConnectionsForUser(userState.id, "blank");
    let tiles: any;
    if (httpResult.length) {
      tiles = httpResult.map((tile: any) => (
        <li className="conversation-list-item" style={{ listStyleType: "none" }} key={tile.id}>
          <ConversationTile
            key={tile.id}
            {...tile}
            currentlyOpenConvo={currentConvo}
            isPublicChat="false"
            callOpenConversation={(connectionId: number) => {
              openConversation(connectionId);
            }}
          ></ConversationTile>
        </li>
      ));
    }
    setmessagingResult(tiles);
  };

  const fetchMyGangs = async () => {
    const httpResult = await getMyGangTiles(userState.id && userState.id > 0 ? userState.id : 0, "nothing");
    let tiles: any;
    httpResult.forEach((tile: any) => {
      tile.username = tile.name;
    });
    if (httpResult.length) {
      tiles = httpResult.map((tile: any) => (
        <li className="conversation-list-item" style={{ listStyleType: "none" }} key={tile.id}>
          <ConversationTile
            key={tile.id}
            {...tile}
            currentlyOpenConvo={currentConvo}
            isPublicChat="false"
            callOpenConversation={(connectionId: number) => {
              openConversation(connectionId);
            }}
          ></ConversationTile>
        </li>
      ));
    }
    setgangResult(tiles);
  };

  const openConversation = async (tile: any) => {
    const convoItem: any = {
      id: tile.id,
      user_id: tile.user_id,
      username: tile.username,
      avatar_url: tile.avatar_url,
      isPublicChat: tile.isPublicChat,
      preferred_platform: tile.preferred_platform,
      currentlyOpenConvo: tile.id,
      discord: tile.discord,
      psn: tile.psn,
      xbox: tile.xbox,
    };
    setcurrentConvo(convoItem);
    localStorage.setItem("currentConvo", JSON.stringify(convoItem));
    let newUrl = "/";
    //Decide between sub-sections of a url
    if (currentNavSelection === 0) {
      newUrl = `/gang/${tile.id}`;
    } else {
      newUrl = `/messaging`;
    }
    // Navigates to dynamic url (new page)
    navigate(`${newUrl}`);
  };

  const toggleNavMenu = (navSelection: number) => {
    setcurrentNavSelection(navSelection);
  };

  return (
    <div className="nav-container">
      <div className="switch-box">
        {userState.id && userState.id > 0 ? (
          <button
            className={`text-only-button vert-nav-button ${currentNavSelection === 0 ? "selected-nav" : ""}`}
            onClick={(event) => toggleNavMenu(0)}
            data-tip
            data-for="dashboardTip"
          >
            <i className="pi pi-users" />
          </button>
        ) : (
          <></>
        )}

        <button
          className={`text-only-button vert-nav-button ${currentNavSelection === 1 ? "selected-nav" : ""}`}
          onClick={(event) => toggleNavMenu(1)}
          data-tip
          data-for="messagingTip"
        >
          <i className="pi pi-envelope" />
        </button>
      </div>
      <div className="chat-container">
        {currentNavSelection === 0 ? (
          <div className="conversations-box">
            {/* List of GANGS */}
            {gangResult}
          </div>
        ) : (
          <div className="conversations-box">
            {/* List of DIRECT MESSAGING */}
            {messagingResult}
            <ConversationTile
              key={0.1}
              {...rustChatObject}
              currentlyOpenConvo={currentConvo}
              callOpenConversation={(connectionId: number) => {
                openConversation(connectionId);
              }}
            ></ConversationTile>
            <ConversationTile
              key={0.2}
              {...minecraftChatObject}
              currentlyOpenConvo={currentConvo}
              callOpenConversation={(connectionId: number) => {
                openConversation(connectionId);
              }}
            ></ConversationTile>
            <ConversationTile
              key={0.3}
              {...rocketLeagueChatObject}
              currentlyOpenConvo={currentConvo}
              callOpenConversation={(connectionId: number) => {
                openConversation(connectionId);
              }}
            ></ConversationTile>
          </div>
        )}
      </div>
    </div>
  );
}
