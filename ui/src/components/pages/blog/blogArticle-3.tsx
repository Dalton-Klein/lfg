import FooterComponent from "../../nav/footerComponent";
import "./blogArticle.scss";
import { useLocation, useNavigate } from "react-router-dom";
import BannerTitle from "../../nav/banner-title";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import React, { useEffect, useRef, useState } from "react";
import MediumTile from "../../tiles/mediumTile";
import { getUserCount } from "../../../utils/rest";

export default function BlogArticle3() {
  const navigate = useNavigate();
  const locationPath: string = useLocation().pathname;
  const userState = useSelector((state: RootState) => state.user.user);
  const topOfPageRef: any = useRef(null);
  const scrollToSection = (ref: any) => {
    ref.current?.scrollIntoView();
  };
  const [conditionalAuthTile, setconditionalAuthTile] = useState<any>(true);
  const [userCount, setuserCount] = useState<string>("loading...");

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
    loadUserCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationPath]);

  const loadUserCount = async () => {
    const userCountResult = await getUserCount(userState.id, "");
    console.log("what is rezz? ", userCountResult);
    setuserCount(userCountResult);
  };

  return (
    <div ref={topOfPageRef}>
      <div className="article-master-container">
        <BannerTitle
          title={"gangs sign up promo"}
          imageLink={"https://res.cloudinary.com/kultured-dev/image/upload/v1663566897/rust-tile-image_uaygce.png"}
        ></BannerTitle>
        <div className="article-header-info">
          <h4 className="article-header-date">updated 06/08/2023</h4>
          <button
            onClick={() => {
              navigate(`/blog`);
            }}
          >
            blog home
          </button>
          <h4 className="article-read-time">2 min read</h4>
        </div>
        {/* Promo Progress */}
        <div className="article-content-container">
          <h3 className="article-sub-title">How close are we?</h3>
          <div className="article-highlighted-detail">{userCount}/150 Members Signed Up</div>
        </div>
        {/* Promo Info */}
        <div className="article-content-container">
          <h3 className="article-sub-title">What is the promo?</h3>
          <div className="article-paragraph">
            We are giving out $250 in free rust skins once the gangs reaches 150 members. When we cross the mark, 30 of
            the first 150 members will be randomly selected to receive a rust skin. Some examples of skins that are in
            the pot are listed below!
          </div>
        </div>
        <div className="article-content-container">
          <h3 className="article-sub-title">Will I be eligible?</h3>
          <div className="article-paragraph">
            To be eligible, you must:
            <li>Be one of the first 150 people to make a gangs account. </li>
            <li>Have published your Rust profile. </li>
          </div>
          {conditionalAuthTile}
        </div>
        <div className="article-content-container">
          <h3 className="article-sub-title">What skins will be given out?</h3>
          <div className="article-paragraph">
            <li>Black Gold skinset </li>
            <img
              className="blog-image"
              src="https://res.cloudinary.com/kultured-dev/image/upload/v1686255480/blackgold_xqpg8m.png"
              alt="black-gold-skin"
            ></img>
            <li>Whiteout skinset </li>
            <img
              className="blog-image"
              src="https://res.cloudinary.com/kultured-dev/image/upload/v1686255480/whiteout_hcsxpb.png"
              alt="whiteout-skin"
            ></img>
            <li>Various weapon, door, and armor skins </li>
            <img
              className="blog-image"
              src="https://res.cloudinary.com/kultured-dev/image/upload/v1686255480/variousothers_wzfaad.png"
              alt="example-weapon-skin"
            ></img>
          </div>
        </div>
        <div className="article-content-container">
          <h3 className="article-sub-title">How will I know if I won?</h3>
          <div className="article-paragraph">
            This very page will be updated once the user count is hit. All the users who won a skin will be listed. If
            there is no response within a week we will choose someone else. The gangs team will be reaching out to you
            on this platform, to your email, and to your discord if you are on our discord page.
          </div>
          <div className="article-closing">Happy Gaming,</div>
          <div className="article-closing">gangs team</div>
        </div>
      </div>
      <FooterComponent></FooterComponent>
    </div>
  );
}
