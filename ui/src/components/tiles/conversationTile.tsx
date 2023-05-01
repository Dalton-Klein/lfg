import { useEffect } from "react";
import "./conversationTile.scss";

export default function ConversationTile(props: any) {
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  return (
    <div className={`conversation-tile ${props.currentlyOpenConvo.id === props.id ? "selected-convo" : ""}`}>
      {props.avatar_url === "" || props.avatar_url === "/assets/avatarIcon.png" ? (
        <div
          className="dynamic-conversation-border"
          onClick={() => {
            props.callOpenConversation(props);
          }}
        >
          <div className="dynamic-conversation-text-small">
            {props.username
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
            props.callOpenConversation(props);
          }}
          className="conversation-profile-image"
          src={props.avatar_url}
          alt={`${props.username}'s avatar`}
        />
      )}
    </div>
  );
}
