import React from "react";
import "./connectionTile.scss";
import { useNavigate } from "react-router-dom";

export default function ConnectionTile(props: any) {
  const navigate = useNavigate();
  console.log("connection: ", props);
  const returnHome = () => {
    navigate("/");
  };

  return (
    <div className="connection-container">
      <div className="connection-user-box">
        <img
          onClick={() => {
            console.log("Link to profile view here later!");
          }}
          className="connection-profile-image"
          src={props.avatar_url}
          alt={`${props.username} profile image`}
        />
        <div className="connection-name">{props.username}</div>
      </div>
      <img
        className="connection-platform-image"
        src={props.platform === 1 ? "/assets/rust-logo-small.png" : ""}
        alt={`${props.username} profile image`}
      />
      <img
        className="connection-platform-image"
        src={props.platform === 1 ? "/assets/rust-logo-small.png" : ""}
        alt={`${props.username} profile image`}
      />
      <button className="text-only-button" onClick={returnHome}>
        ...
      </button>
    </div>
  );
}
