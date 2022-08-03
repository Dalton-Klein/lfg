import React from "react";
import AboutComponent from "../../pages/home-page/aboutComponent";
import FooterComponent from "../../nav/footerComponent";
import HeaderComponent from "../../nav/headerComponent";
import "./homePage.scss";
import MediumTile from "../../tiles/mediumTile";
import DaddyTile from "../../tiles/daddyTile";

export default function HomePage() {
  return (
    <div>
      <HeaderComponent></HeaderComponent>
      <div className="title-box">
        <div className="title">lfg</div>
        <div className="subtitle">find your group</div>
      </div>
      <div className="tile-container">
        <div className="left">
          <div className="sub-left">
            <MediumTile routerLink="/discover" imageLink="pi pi-users" title="discover"></MediumTile>
            <MediumTile routerLink="/share" imageLink="pi pi-share-alt" title="share profile"></MediumTile>
          </div>
          <div className="sub-right">
            <MediumTile routerLink="" imageLink="pi pi-discord" title="join our discord"></MediumTile>
            <MediumTile routerLink="/about" imageLink="pi pi-info-circle" title="about us"></MediumTile>
          </div>
        </div>
        <div className="right">
          <DaddyTile routerLink="/discover"></DaddyTile>
        </div>
      </div>
      <AboutComponent></AboutComponent>
      <FooterComponent></FooterComponent>
    </div>
  );
}
