import FooterComponent from "../../nav/footerComponent";
import "./blogArticle.scss";
import { useLocation, useNavigate } from "react-router-dom";
import BannerTitle from "../../nav/banner-title";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import React, { useEffect, useRef, useState } from "react";
import MediumTile from "../../tiles/mediumTile";

export default function BlogArticle4() {
  const navigate = useNavigate();
  const locationPath: string = useLocation().pathname;
  const userState = useSelector((state: RootState) => state.user.user);
  const topOfPageRef: any = useRef(null);
  const scrollToSection = (ref: any) => {
    ref.current?.scrollIntoView();
  };

  const [conditionalAuthTile, setconditionalAuthTile] = useState<any>(true);

  useEffect(() => {
    setconditionalAuthTile(
      userState.email === "" ? (
        <MediumTile routerLink="/login" imageLink="pi pi-sign-in" title="try gangs"></MediumTile>
      ) : (
        <></>
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollToSection(topOfPageRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationPath]);

  return (
    <div ref={topOfPageRef}>
      <div className="article-master-container">
        <BannerTitle
          title={"battle bit is here!"}
          imageLink={"https://res.cloudinary.com/kultured-dev/image/upload/v1665601538/rocket-league_fncx5c.jpg"}
        ></BannerTitle>
        <div className="article-header-info">
          <h4 className="article-header-date">updated 07/03/2023</h4>
          <button
            onClick={() => {
              navigate(`/blog`);
            }}
          >
            blog home
          </button>
          <h4 className="article-read-time">2 min read</h4>
        </div>
        {/* Welcome */}
        <div className="article-content-container">
          <h3 className="article-sub-title">Gangs Now Supports Battle Bit Remastered</h3>
          <div className="article-paragraph">
            The new game has taken steam by storm. It was number 2 on the steam store as of this writing. This is an
            online multiplayer shooter, where teamwork is paramount. This makes the game a perfect candidate for the
            gangs platform.
          </div>
        </div>
        <div className="article-content-container">
          <h3 className="article-sub-title">How does it work?</h3>
          <div className="article-paragraph">
            There are new options in the home page and lfg page. You can view players and gangs looking to play Battle
            Bit Remastered. There is now an additional{" "}
            <a href="https://www.gangs.gg/#/battle-bit-profile" className="link-text">
              {" "}
              profile
            </a>{" "}
            to manage, with fields specific for to Battle Bit like class, playlist, and rank. Once you complete your new
            Battle Bit profile, you can publish it which will make you discoverable to others.
          </div>
        </div>
        <div className="article-content-container">
          <h3 className="article-sub-title">Support In Groups</h3>
          <div className="article-paragraph">
            When creating groups, you can select Battle Bit as the primary game for your group. This will ensure players
            looking for groups can find your Battle Bit team!
          </div>
          <div className="article-paragraph">
            {" "}
            Rolling out new games to the platform is exciting news! If you want to keep up to date on the status of new
            releases, or to request a game to support, join our{" "}
            <a href="https://discord.gg/MMaYZ8bUQc" className="link-text">
              {" "}
              discord
            </a>{" "}
            and let us know!
          </div>
          <div className="article-paragraph" style={{ display: userState.email === "" ? "inline-block" : "none" }}>
            Are you new here? Create an account and get started!
          </div>
          {conditionalAuthTile}
          <div className="article-closing">Happy Gaming,</div>
          <div className="article-closing">gangs team</div>
        </div>
      </div>
      <FooterComponent></FooterComponent>
    </div>
  );
}
