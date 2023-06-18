import { useEffect, useRef, useState } from "react";
import "./profileInlayComponent.scss";
import { useLocation, useNavigate } from "react-router-dom";
import Backdrop from "../modal/backdropComponent";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Menu } from "primereact/menu";
import { howLongAgo } from "../../utils/helperFunctions";
import { getNotificationsUser } from "../../utils/rest";
import ReactTooltip from "react-tooltip";
import addNotification from "react-push-notification";

const actionPhrases: any = {
  1: " sent you a connection request",
  2: " accepted your connection request",
  3: " sent you a message",
  4: " congrats on signing up!",
};

export default function ProfileInlayComponet({ socketRef }) {
  const locationPath: string = useLocation().pathname;
  const lfgORlfm = locationPath.slice(0, 4);
  const navigate = useNavigate();
  const userState = useSelector((state: RootState) => state.user.user);
  const [drawerVis, setDrawerVis] = useState<boolean>(false);
  const [profileImage, setprofileImage] = useState<string>("");
  const [notifications, setnotifications] = useState<any>([]);
  const [notificationMenuItems, setnotificationMenuItems] = useState<any[]>([
    {
      label: (
        <div key={-1} className="notification-container" onClick={() => {}}>
          no notifications yet!
        </div>
      ),
    },
  ]);
  const [hasUnreadNotifications, sethasUnreadNotifications] = useState(false);
  const [hasPublishedAProfile, sethasPublishedAProfile] = useState<boolean>(true);
  //GameNav
  const [gameImgUrl, setgameImgUrl] = useState<string>("");
  //Menu Refs
  const notifsMenu: any = useRef(null);
  const discoverMenu: any = useRef(null);
  const gameProfilesMenu: any = useRef(null);

  useEffect(() => {
    if (userState.id && userState.id > 0) {
      loadNotificationHistory();
    }
    determineGameNavContents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationPath]);

  useEffect(() => {
    if (userState.id > 0 && (userState.rust_is_published || userState.rocket_league_is_published)) {
      sethasPublishedAProfile(true);
    } else {
      sethasPublishedAProfile(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userState.rust_is_published, userState.rocket_league_is_published]);

  //BEGIN Update notifications list after each notification sent
  const handleNotification = (data: any) => {
    const { id, owner_id, type_id, other_user_id, other_user_avatar_url, other_username } = data;
    setnotifications([
      { id: id, owner_id, type_id, other_user_id, other_user_avatar_url, other_username },
      ...notifications,
    ]);
    if (isBrowser()) {
      addNotification({
        title: "gangs notification",
        subtitle: "",
        message: `${other_username} ${actionPhrases[type_id]}`,
        theme: "darkblue",
        native: true, // when using native, your OS will handle theming.
      });
    } else {
      new Audio("https://res.cloudinary.com/kultured-dev/video/upload/v1687113879/notif2_iw4407.wav").play();
    }
    sethasUnreadNotifications(true);
  };
  useEffect(() => {
    renderNotifications();
    socketRef.current.on("notification", handleNotification);
    return () => {
      socketRef.current.off("notification", handleNotification);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications]);
  //END Update notifications list after each notification sent

  useEffect(() => {
    if (typeof userState.avatar_url === "string" && userState.avatar_url.length > 1) {
      setprofileImage(userState.avatar_url);
    }
  }, [userState.avatar_url]);

  const isBrowser = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.indexOf("electron") === -1; // Assuming Electron is used for the desktop app version
  };

  //BEGIN SOCKET Functions
  const loadNotificationHistory = async () => {
    const historicalNotifications = await getNotificationsUser(userState.id, "");
    setnotifications([...historicalNotifications]);
    if (userState.id && userState.id > 0) {
      socketRef.current.emit("join_room", `notifications-${userState.id}`);
    }
  };
  const renderNotifications = () => {
    if (notifications.length) {
      let items: any = [];
      notifications.forEach((notif: any, index: number) => {
        items.push({
          label: (
            <div
              className="notification-container"
              onClick={() => {
                notificationPressed(notif.type_id);
              }}
              key={`${notif.id}-${index}`}
            >
              {notif.other_user_avatar_url === "" ||
              notif.other_user_avatar_url ===
                "https://res.cloudinary.com/kultured-dev/image/upload/v1625617920/defaultAvatar_aeibqq.png" ||
              notif.other_user_avatar_url === null ? (
                <div className="dynamic-avatar-border">
                  <div className="dynamic-avatar-text-small">
                    {notif.other_username === null
                      ? "gg"
                      : notif.other_username
                          .split(" ")
                          .map((word: string[]) => word[0])
                          .join("")
                          .slice(0, 2)
                          .toLowerCase()}
                  </div>
                </div>
              ) : (
                <img
                  className="notification-profile-image"
                  src={notif.other_user_avatar_url}
                  alt={`${notif.other_username}'s avatar`}
                />
              )}
              <div className="notification-username"> {notif.other_username}</div>
              {actionPhrases[notif.type_id]}
              <div className="notification-timestamp">{howLongAgo(notif.created_at)}</div>
            </div>
          ),
        });
      });
      sethasUnreadNotifications(true);
      setnotificationMenuItems(items);
      return;
    }
  };
  const handleNotificationButtonClicked = (event: any) => {
    notifsMenu.current.toggle(event);
    sethasUnreadNotifications(false);
  };
  //END SOCKET Functions
  const determineGameNavContents = () => {
    let determinedUrl = "";
    const gameNameString = locationPath.slice(5, 100);
    switch (gameNameString) {
      case "rust":
        determinedUrl = "https://res.cloudinary.com/kultured-dev/image/upload/v1663786762/rust-logo-small_uarsze.png";
        break;
      case "rocket-league":
        determinedUrl =
          "https://res.cloudinary.com/kultured-dev/image/upload/v1665620519/RocketLeagueResized_loqz1h.png";
        break;
      default:
        break;
    }
    setgameImgUrl(determinedUrl);
  };
  const renderDiscoverOptions = () => {
    return [
      {
        label: (
          <img
            onClick={() => {
              navigate(lfgORlfm === "/lfg" ? "/lfg-rust" : "/lfm-rust");
            }}
            className="discover-navigator-option-image"
            src={"https://res.cloudinary.com/kultured-dev/image/upload/v1663786762/rust-logo-small_uarsze.png"}
            alt={`link to rust discovery`}
          />
        ),
      },
      {
        label: (
          <img
            onClick={() => {
              navigate(lfgORlfm === "/lfg" ? "/lfg-rocket-league" : "/lfm-rocket-league");
            }}
            className="discover-navigator-option-image"
            src={"https://res.cloudinary.com/kultured-dev/image/upload/v1665620519/RocketLeagueResized_loqz1h.png"}
            alt={`link to rocket league discovery`}
          />
        ),
      },
    ] as any;
  };
  const notificationPressed = (notificationType: number) => {
    let newUrl = "/general-profile";
    //Decide between sub-sections of a url
    if (notificationType === 1) {
      newUrl = "/incoming-requests";
    } else if (notificationType === 2 || notificationType === 3) {
      newUrl = "/messaging";
    } else if (notificationType === 4) {
      newUrl = `/general-profile`;
    }

    // Navigates to dynamic url (new page)
    navigate(`${newUrl}`);
  };

  const renderGameProfileOptions = () => {
    return [
      {
        label: (
          <img
            onClick={() => {
              navigate("/rust-profile");
            }}
            className="discover-navigator-option-image"
            src={"https://res.cloudinary.com/kultured-dev/image/upload/v1663786762/rust-logo-small_uarsze.png"}
            alt={`link to rust profile`}
          />
        ),
      },
      {
        label: (
          <img
            onClick={() => {
              navigate("/rocket-league-profile");
            }}
            className="discover-navigator-option-image"
            src={"https://res.cloudinary.com/kultured-dev/image/upload/v1665620519/RocketLeagueResized_loqz1h.png"}
            alt={`link to rocket league profile`}
          />
        ),
      },
    ] as any;
  };

  const toggleDrawer = () => {
    setDrawerVis(!drawerVis);
  };

  return (
    <div className="my-profile-overlay">
      {/* Conditionally render hamburger modal */}
      {drawerVis ? <Backdrop toggleDrawer={toggleDrawer} /> : <></>}
      {/* Conditionally render log in options or show profile info */}
      {userState.email === "" ? (
        <div className="my-profile-overlay-link prof-overlay-text" onClick={() => navigate("/login")}>
          login | signup
        </div>
      ) : (
        <div className="my-profile-overlay-wrapper">
          <Menu model={notificationMenuItems} popup ref={notifsMenu} id="popup_menu" />
          <Menu model={renderDiscoverOptions()} popup ref={discoverMenu} id="popup_menu" />
          <Menu model={renderGameProfileOptions()} popup ref={gameProfilesMenu} id="popup_menu" />
          {/* if no profiles published, add notifier */}
          {!hasPublishedAProfile ? (
            <button
              className="text-only-button notifications-button"
              onClick={(event) => gameProfilesMenu.current.toggle(event)}
              data-tip
              data-for="profileHiddenTip"
            >
              no profiles published &#160;
              <i className="pi pi-eye-slash eye-slash-icon" />
            </button>
          ) : (
            <></>
          )}
          {/* if in lfg or lfm, load game toggle */}
          {lfgORlfm === "/lfg" || lfgORlfm === "/lfm" ? (
            <img
              onClick={(event) => discoverMenu.current.toggle(event)}
              className="discover-navigator-image"
              src={gameImgUrl}
              alt={`lfg page navigator`}
              data-tip
              data-for="platformTip"
            />
          ) : (
            <></>
          )}
          <button
            className="text-only-button notifications-button"
            onClick={(event) => handleNotificationButtonClicked(event)}
          >
            <i className={hasUnreadNotifications ? "pi pi-bell has-unread" : "pi pi-bell"} />
          </button>
          <div className="my-profile-overlay-link">
            {profileImage === "" ||
            profileImage ===
              "https://res.cloudinary.com/kultured-dev/image/upload/v1625617920/defaultAvatar_aeibqq.png" ? (
              <div className="dynamic-avatar-border" onClick={toggleDrawer}>
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
              <img className="nav-overlay-img" onClick={toggleDrawer} src={profileImage} alt="my avatar" />
            )}
          </div>
        </div>
      )}
      <ReactTooltip id="profileHiddenTip" place="left" effect="solid">
        you don't have any published game profiles
      </ReactTooltip>
      <ReactTooltip id="platformTip" place="left" effect="solid">
        select game for player discovery
      </ReactTooltip>
      <ReactTooltip id="dashboardTip" place="bottom" effect="solid">
        my gangs
      </ReactTooltip>
      <ReactTooltip id="messagingTip" place="bottom" effect="solid">
        direct messaging
      </ReactTooltip>
    </div>
  );
}
