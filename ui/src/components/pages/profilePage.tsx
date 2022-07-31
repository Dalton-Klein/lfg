import React from "react";
import HeaderComponent from "../nav/headerComponent";
import "./profilePage.scss";
import ProfileGeneral from "../tiles/myProfileTiles/profileGeneral";

export default function ProfilePage() {
  return (
    <div>
      <HeaderComponent></HeaderComponent>
      <div className="my-profile-container">
        <ProfileGeneral></ProfileGeneral>
      </div>
    </div>
  );
}
