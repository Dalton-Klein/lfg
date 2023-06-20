import React from "react";
import "./rankTile.scss";

export default function RankTile({ user }) {
  const renderRankImage = () => {
    return (
      <div className={"dynamic-avatar-border circle-audio-ring"}>
        <div className="dynamic-avatar-text-small">
          {user.username
            ? user.username
                .split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)
                .toLowerCase()
            : "gg"}
        </div>
      </div>
    );
  };

  return (
    <div className="rank-box" key={user.user_id}>
      {renderRankImage()}
    </div>
  );
}
