import AboutComponent from "../../pages/home-page/aboutComponent";
import FooterComponent from "../../nav/footerComponent";
import "./homePage.scss";
import MediumTile from "../../tiles/mediumTile";
import DaddyTile from "../../tiles/daddyTile";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
// import { logoutUser } from "../../../store/userSlice";

export default function HomePage() {
  // Coffee, use to wipe state if something goes wacky
  // dispatch(logoutUser(1))
  const userState = useSelector((state: RootState) => state.user.user);

  const [conditionalAuthTile, setconditionalAuthTile] = useState<any>(true);
  const [conditionalDashTile, setconditionalDashTile] = useState<any>(true);

  useEffect(() => {
    setconditionalAuthTile(
      userState.email === "" ? (
        <MediumTile routerLink="/login" imageLink="pi pi-sign-in" title="sign up | sign in"></MediumTile>
      ) : (
        <MediumTile routerLink="/general-profile" imageLink="pi pi-user" title="my profile"></MediumTile>
      )
    );
    setconditionalDashTile(
      userState.email === "" ? (
        <></>
      ) : (
        <MediumTile routerLink="/dashboard" imageLink="pi pi-users" title="my dashboard"></MediumTile>
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="title-box">
        {/* <div className="title">gangs</div> */}
        <img className="logo-img" src={"/assets/logo-v2-gangs.gg-transparent-white.png"} alt="gangs logo" />
        <h1 className="main-title">form your gang</h1>
        <h2 className="subtitle">
          Say goodbye to solo queuing, find competent team members to play with, make new friends
        </h2>
      </div>
      <div className="tile-container">
        <div className="discover-tiles">
          <DaddyTile
            has2Buttons={true}
            routerLinkLFG="/lfg-rust"
            routerLinkLFM="/lfm-rust"
            image="https://res.cloudinary.com/kultured-dev/image/upload/v1663566897/rust-tile-image_uaygce.png"
            title="rust"
            buttonTextLFG="lfg"
            buttonTextLFM="lfm"
          ></DaddyTile>
          <DaddyTile
            has2Buttons={true}
            routerLinkLFG="/lfg-rocket-league"
            routerLinkLFM="/lfm-rocket-league"
            image="https://res.cloudinary.com/kultured-dev/image/upload/v1665601538/rocket-league_fncx5c.jpg"
            title="rocket league"
            buttonTextLFG="lfg"
            buttonTextLFM="lfm"
          ></DaddyTile>
        </div>

        <div className="nav-tiles">
          {conditionalAuthTile}
          {conditionalDashTile}
          <MediumTile
            routerLink="https://discord.gg/MMaYZ8bUQc"
            imageLink="pi pi-discord"
            title="join our discord"
          ></MediumTile>
          <MediumTile routerLink="/blog" imageLink="pi pi-bookmark" title="blog"></MediumTile>
        </div>
      </div>
      <AboutComponent></AboutComponent>
      <div className="title-box">
        <h2 className="main-title">games coming soon</h2>
      </div>
      <div className="extra-tiles">
        <DaddyTile
          has2Buttons={false}
          routerLinkLFG="/blog/rocket-league-minecraft-support"
          buttonTextLFG="info"
          image="https://res.cloudinary.com/kultured-dev/image/upload/v1665601538/minecraft_bscq2s.png"
          title="minecraft"
        ></DaddyTile>
      </div>
      <div className="extra-tiles">
        <MediumTile routerLink="/help" imageLink="pi pi-info-circle" title="help | faq"></MediumTile>
        <MediumTile routerLink="/privacy-policy" imageLink="pi pi-shield" title="privacy policy"></MediumTile>
        <MediumTile routerLink="/terms-of-service" imageLink="pi pi-book" title="terms of service"></MediumTile>
      </div>
      <FooterComponent></FooterComponent>
    </div>
  );
}
