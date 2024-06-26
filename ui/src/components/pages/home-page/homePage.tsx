import AboutComponent from "../../pages/home-page/aboutComponent";
import FooterComponent from "../../nav/footerComponent";
import "./homePage.scss";
import MediumTile from "../../tiles/mediumTile";
import DaddyTile from "../../tiles/daddyTile";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useLocation } from "react-router-dom";
import { updateUserThunk } from "../../../store/userSlice";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import React, { Suspense } from "react";
import ThreeDLogo from "../lobby/objects/threeDLogo";
import SmallTile from "../../tiles/smallTile";
// import { logoutUser } from "../../../store/userSlice";

export default function HomePage({ socketRef }) {
  // Coffee, use to wipe state if something goes wacky
  const dispatch = useDispatch();
  const locationPath: string = useLocation().pathname;
  const userState = useSelector((state: RootState) => state.user.user);

  const [conditionalAuthTile, setconditionalAuthTile] = useState<any>(true);

  useEffect(() => {
    setconditionalAuthTile(
      userState.email === "" ? (
        <MediumTile routerLink="/login" imageLink="pi pi-sign-in" title="sign up | sign in"></MediumTile>
      ) : (
        <MediumTile routerLink="/general-profile" imageLink="pi pi-user" title="my profile"></MediumTile>
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(updateUserThunk(userState.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationPath]);

  return (
    <div className="home-page-master">
      <div className="title-box">
        <Suspense
          fallback={
            <img
              className="logo-img"
              src={
                "https://res.cloudinary.com/kultured-dev/image/upload/v1663653269/logo-v2-gangs.gg-transparent-white_mqcq3z.png"
              }
              alt="gangs logo"
            />
          }
        >
          <Canvas
            frameloop="always"
            gl={{ preserveDrawingBuffer: true }}
            style={{
              width: "10vw",
              height: "10vw",
            }}
          >
            <OrbitControls enableZoom={false} />
            <ambientLight intensity={0.9} />
            <directionalLight position={[10, 10, 10]} intensity={1.75} />
            <ThreeDLogo></ThreeDLogo>
          </Canvas>
        </Suspense>
        <h1 className="main-title">form your gang</h1>
        <h2 className="subtitle">
          Say goodbye to solo queuing, find ideal team members to play with, make new friends
        </h2>
      </div>
      <div className="tile-container">
        <div className="discover-tiles">
          <DaddyTile
            has2Buttons={true}
            routerLinkLFG="/lfg-rust"
            routerLinkLFM="/lfm-rust"
            image="https://res.cloudinary.com/kultured-dev/image/upload/v1694466692/BannerRust1300Samples_ny1dhs.png"
            title="rust"
            buttonTextLFG="lfg"
            buttonTextLFM="lfm"
          ></DaddyTile>
          <DaddyTile
            has2Buttons={true}
            routerLinkLFG="/lfg-battle-bit"
            routerLinkLFM="/lfm-battle-bit"
            image="https://res.cloudinary.com/kultured-dev/image/upload/v1688412634/MXCsRopuFE4LJdKeTEE3uY_dhzham.jpg"
            title="battlebit remastered"
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
          {/* NEW GAME EDIT */}
        </div>
        <div className="nav-tiles">
          {conditionalAuthTile}
          <MediumTile
            routerLink="https://discord.gg/2JUsEphFwG"
            imageLink="pi pi-discord"
            title="join our discord"
          ></MediumTile>
          <MediumTile routerLink="/blog" imageLink="pi pi-bookmark" title="blog"></MediumTile>
        </div>
      </div>
      <AboutComponent socketRef={socketRef}></AboutComponent>
      <div className="title-box">
        <h2 className="main-title">promos</h2>
      </div>
      <div className="extra-tiles">
        <DaddyTile
          has2Buttons={false}
          routerLinkLFG="/blog/rankup-promo"
          routerLinkLFM=""
          image="https://res.cloudinary.com/kultured-dev/image/upload/v1687803327/BattleBit_jcjxkp.webp"
          title="rank up promo | win $20 bundles"
          buttonTextLFG="see details"
          buttonTextLFM=""
        ></DaddyTile>
        <DaddyTile
          has2Buttons={false}
          routerLinkLFG="/blog/signup-promo"
          routerLinkLFM=""
          image="https://res.cloudinary.com/kultured-dev/image/upload/v1686770431/g6ouckgsguxpxha8icjo.jpg"
          title="sign up promo | win rust skins"
          buttonTextLFG="see details"
          buttonTextLFM=""
        ></DaddyTile>
      </div>
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
        <SmallTile routerLink="/support" imageLink="pi pi-question" title="support & feedback"></SmallTile>
        <SmallTile routerLink="/help" imageLink="pi pi-info-circle" title="tutorials & faq"></SmallTile>
        <SmallTile routerLink="/privacy-policy" imageLink="pi pi-shield" title="privacy policy"></SmallTile>
        <SmallTile routerLink="/terms-of-service" imageLink="pi pi-book" title="terms of service"></SmallTile>
      </div>
      <FooterComponent></FooterComponent>
    </div>
  );
}
