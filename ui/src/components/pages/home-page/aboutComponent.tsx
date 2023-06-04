import "./aboutComponent.scss";
import { howLongAgo } from "../../../utils/helperFunctions";
import { getNotificationsGeneral } from "../../../utils/rest";
import * as io from "socket.io-client";
import { useEffect, useState } from "react";
const socketRef = io.connect(process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://www.gangs.gg");

export default function HomePage() {
  const [notifications, setnotifications] = useState<any>([]);

  useEffect(() => {
    loadNotificationHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //BEGIN Update notifications list after each notification sent
  useEffect(() => {
    socketRef.on(
      "notification",
      ({
        owner_id,
        owner_username,
        owner_avatar_url,
        type_id,
        other_user_id,
        other_user_avatar_url,
        other_username,
      }: any) => {
        setnotifications([
          { owner_id, owner_username, owner_avatar_url, type_id, other_user_id, other_user_avatar_url, other_username },
          ...notifications,
        ]);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications]);
  //END Update notifications list after each notification sent

  //BEGIN SOCKET Functions
  const loadNotificationHistory = async () => {
    const historicalNotifications = await getNotificationsGeneral();
    setnotifications([...historicalNotifications]);
    socketRef.emit("join_room", `notifications-general`);
  };
  const renderNotifications = () => {
    if (notifications.length) {
      let items: any = [];
      let ownerName;
      let otherName;
      notifications.forEach((notif: any) => {
        ownerName = notif.owner_username;
        otherName = notif.other_username;
        const user1Key: any = {
          1: otherName,
          2: otherName,
          3: otherName,
          4: ownerName,
          5: otherName,
        };
        const actionPhraseKey: any = {
          1: ` requested `,
          2: ` accepted `,
          3: ` messaged `,
          4: ` signed up! `,
          5: ` endorsed `,
        };
        const user2Key: any = {
          1: ` ${ownerName}`,
          2: ` ${ownerName}`,
          3: ` ${ownerName}`,
          4: "",
          5: ` ${ownerName}`,
        };
        const user1 = user1Key[notif.type_id];
        const actionPhrase = actionPhraseKey[notif.type_id];
        const user2 = user2Key[notif.type_id];
        items.push(
          <div className="notification-container" key={notif.id}>
            <div className="info-stackable-container">
              <div className="user-1-container">
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
                <div className="notification-username"> {user1}</div>
                {actionPhrase}
              </div>
              {notif.type_id !== 4 ? (
                notif.owner_avatar_url === "" ||
                notif.owner_avatar_url ===
                  "https://res.cloudinary.com/kultured-dev/image/upload/v1625617920/defaultAvatar_aeibqq.png" ||
                notif.owner_avatar_url === null ? (
                  <div className="user-2-container">
                    <div className="dynamic-avatar-border">
                      <div className="dynamic-avatar-text-small">
                        {notif.owner_username === null
                          ? "gg"
                          : notif.owner_username
                              .split(" ")
                              .map((word: string[]) => word[0])
                              .join("")
                              .slice(0, 2)
                              .toLowerCase()}
                      </div>
                    </div>
                    <div className="notification-username2"> {user2}</div>
                  </div>
                ) : (
                  <div className="user-2-container">
                    <img
                      className="notification-profile-image"
                      src={notif.owner_avatar_url}
                      alt={`${notif.owner_username}'s avatar`}
                    />
                    <div className="notification-username2"> {user2}</div>
                  </div>
                )
              ) : (
                <></>
              )}
            </div>
            <div className="notification-timestamp">{howLongAgo(notif.created_at)}</div>
          </div>
        );
      });
      return items;
    }
  };
  //END SOCKET Functions

  return (
    <div className="about-container">
      <div className="column-1">
        <div className="about-text">
          Finding suitable teammates is tough. Finding them here isn't. <br /> <br />
          Find, chat, and play with teammates based on criteria that matters to you. <br /> <br />
        </div>
      </div>
      <div className="column-2">{renderNotifications()}</div>
    </div>
  );
}
