import React from "react";
import "./voiceParticipant.scss";
import RankTile from "./rankTile";

export default function VoiceParticipant({ participant, isTalking }) {
  const renderAvatar = () => {
    if (
      participant.avatar_url === "" ||
      participant.avatar_url ===
        "https://res.cloudinary.com/kultured-dev/image/upload/v1625617920/defaultAvatar_aeibqq.png"
    ) {
      return (
        <div className={isTalking ? "dynamic-avatar-border circle-audio-ring" : "dynamic-avatar-border"}>
          <div className="dynamic-avatar-text-small">
            {participant.username
              ? participant.username
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2)
                  .toLowerCase()
              : "gg"}
          </div>
        </div>
      );
    } else {
      return (
        <img
          className={isTalking ? "nav-overlay-img circle-audio-ring" : "nav-overlay-img"}
          src={participant.avatar_url}
          alt="my avatar"
        />
      );
    }
  };

  return (
    <div className="voice-participant-box" key={participant.user_id}>
      {renderAvatar()}
      <RankTile user={participant} isSmall={true}></RankTile>
      <div className="voice-participant-name">{participant.username}</div>
    </div>
  );
}
