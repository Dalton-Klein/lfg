import "./conversationTile.scss";
import ReactTooltip from "react-tooltip";

export default function ConversationTile(props: any) {
  const createTooltipId = (tooltipName: string) => {
    return `${tooltipName}_${props.id}`;
  };

  return (
    <div className={`conversation-tile ${props.currentlyOpenConvo.id === props.id ? "selected-convo" : ""}`}>
      {props.id === -99 ? (
        <i
          className="pi pi-plus dynamic-conversation-border"
          data-tip
          data-for={createTooltipId("convoNameTip")}
          onClick={() => {
            props.callOpenConversation(props);
          }}
        />
      ) : props.avatar_url === "" || props.avatar_url === "/assets/avatarIcon.png" ? (
        <div
          className="dynamic-conversation-border"
          onClick={() => {
            props.callOpenConversation(props);
          }}
          data-tip
          data-for={createTooltipId("convoNameTip")}
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
          data-tip
          data-for={createTooltipId("convoNameTip")}
        />
      )}
      <ReactTooltip id={createTooltipId("convoNameTip")} place="right" effect="solid">
        {props.name}
      </ReactTooltip>
    </div>
  );
}
