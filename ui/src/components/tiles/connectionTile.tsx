import React, { useEffect, useState } from "react";
import "./connectionTile.scss";
import { useNavigate } from "react-router-dom";

export default function ConnectionTile(props: any) {
  const [platformUsername, setPlatformUsername] = useState<any>("");

  useEffect(() => {
    if (props.preferred_platform === 1) setPlatformUsername(props.discord);
    else if (props.preferred_platform === 2) setPlatformUsername(props.psn);
    else if (props.preferred_platform === 3) setPlatformUsername(props.xbox);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = useNavigate();

  const returnHome = () => {
    navigate("/");
  };

  return (
    <div className="connection-container">
      {/* User Connection Info Section */}
      <div className="connection-user-box">
        <img
          onClick={() => {
            console.log("Link to profile view here later!");
          }}
          className="connection-profile-image"
          src={props.avatarUrl}
          alt={`${props.username} profile image`}
        />
        <div className="connection-name">{props.username}</div>
        <img className="connection-game-image" src="/assets/rust-logo-small.png" alt={`${props.username} profile image`} />
      </div>
      {/* Chat Platform Section */}
      <div className="connection-chat-platform-container">
        <div className={`connection-chat-platform-box ${props.preferred_platform === 1 ? "box-selected" : ""}`}>
          <img className="connection-platform-image" src="/assets/discord-logo-small.png" alt={`${props.username} profile image`} />
        </div>
        <div className={`connection-chat-platform-box ${props.preferred_platform === 2 ? "box-selected" : ""}`}>
          <img className="connection-platform-image" src="/assets/psn-logo-small.png" alt={`${props.username} profile image`} />
        </div>
        <div className={`connection-chat-platform-box ${props.preferred_platform === 3 ? "box-selected" : ""}`}>
          <img
            className="connection-platform-image"
            src={props.platform === 1 ? "/assets/xbox-logo-small.png" : ""}
            alt={`${props.username} profile image`}
          />
        </div>
        <div className="connection-chat-platform-text">{platformUsername}</div>
      </div>
      {/* Manage Connection Section */}
      <button className="text-only-button" onClick={returnHome}>
        <i className="pi pi-ellipsis-h"></i>
      </button>
    </div>
  );
}
