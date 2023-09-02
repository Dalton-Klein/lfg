import FooterComponent from "../../nav/footerComponent";
import "./blogArticle.scss";
import { useLocation, useNavigate } from "react-router-dom";
import BannerTitle from "../../nav/banner-title";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import React, { useEffect, useRef, useState } from "react";
import MediumTile from "../../tiles/mediumTile";
import { getRankLeaderboard, getUserCount } from "../../../utils/rest";

export default function BlogArticle5() {
  const navigate = useNavigate();
  const locationPath: string = useLocation().pathname;
  const userState = useSelector((state: RootState) => state.user.user);
  const topOfPageRef: any = useRef(null);
  const scrollToSection = (ref: any) => {
    ref.current?.scrollIntoView();
  };
  const [conditionalAuthTile, setconditionalAuthTile] = useState<any>(true);
  const [rankLeaderboardData, setrankLeaderboardData] = useState<any>([<div>loading...</div>]);
  const [usersAcheived, setusersAcheived] = useState<string>("loading...");

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
    loadRankLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationPath]);

  const loadRankLeaderboard = async () => {
    const leaderboardResult = await getRankLeaderboard(userState.id, "");
    console.log("rez ", leaderboardResult);
    let tempUsersAcheived = 0;
    let tempLeaderboardArray: any = [];
    leaderboardResult.forEach((rec: any) => {
      if (rec.total_points >= 50) {
        tempUsersAcheived++;
      }
      tempLeaderboardArray.push(
        <div className="rank-leaderboard-container rank-challenge">
          <div className="rank-leaderboard-subtitle">
            {rec.avatar_url === "" ||
            rec.avatar_url ===
              "https://res.cloudinary.com/kultured-dev/image/upload/v1625617920/defaultAvatar_aeibqq.png" ? (
              <div
                className="dynamic-avatar-border"
                onClick={() => {
                  //toggleExpandedProfile();
                }}
              >
                <div className="dynamic-avatar-text-med">
                  {rec.username
                    .split(" ")
                    .map((word: string[]) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toLowerCase()}
                </div>
              </div>
            ) : (
              <img className="card-photo" onClick={() => {}} src={rec.avatar_url} alt={`${rec.username}'s avatar`} />
            )}
            {rec.username}
          </div>
          <div className="rank-leaderboard-tally">{rec.total_points} points</div>
        </div>
      );
    });
    setusersAcheived(tempUsersAcheived.toString());
    setrankLeaderboardData(tempLeaderboardArray);
  };

  return (
    <div ref={topOfPageRef}>
      <div className="article-master-container">
        <BannerTitle
          title={"gangs rank up promo"}
          imageLink={"https://res.cloudinary.com/kultured-dev/image/upload/v1663566897/rust-tile-image_uaygce.png"}
        ></BannerTitle>
        <div className="article-header-info">
          <h4 className="article-header-date">updated 07/04/2023</h4>
          <button
            onClick={() => {
              navigate(`/blog`);
            }}
          >
            blog home
          </button>
          <h4 className="article-read-time">2 min read</h4>
        </div>
        {/* Promo Info */}
        <div className="article-content-container">
          <h3 className="article-sub-title">What is the promo?</h3>
          <div className="article-paragraph">
            We are giving out $20 bundles of in game items of your choosing.
            <li>
              You can win your bundle by being one of the first 10 to achieve prestige 2 in your rank progression (50
              points)
            </li>{" "}
            <li>
              To view your progress, go to your general profile, then click on
              <a href="https://www.gangs.gg/#/my-rank" className="link-text">
                {" "}
                my rank
              </a>{" "}
            </li>
            <li>The bundle can include the battlebit supporter DLC, rust skins, or rocket league in game items.</li>
          </div>
        </div>
        {/* Promo Progress */}
        <div className="article-content-container">
          <h3 className="article-sub-title">Promo Progress</h3>
          <div className="article-highlighted-detail">{usersAcheived}/10 Have Reached The Goal!</div>
          <div className="rank-leaderboard-container">
            <div className="rank-leaderboard-grid-header">gamer</div>
            <div className="rank-leaderboard-grid-header">points</div>
          </div>
          {rankLeaderboardData}
        </div>
        <div className="article-content-container">
          <h3 className="article-sub-title">Will I be eligible?</h3>
          <div className="article-paragraph">
            To be eligible, you must:
            <li>
              Be one of the first 10 people to acquire 50 rank progression points. This will make you prestige 2, rank
              1.{" "}
            </li>
          </div>
          {conditionalAuthTile}
        </div>
        <div className="article-content-container">
          <h3 className="article-sub-title">How will I know if I won?</h3>
          <div className="article-paragraph">
            This very page will be updated once the user count is hit. All the users who won will be listed. If there is
            no response within a week we will choose someone else. The gangs team will be reaching out to you on this
            platform, to your email, and to your discord if you are on our discord page.
          </div>
          <div className="article-closing">Happy Gaming,</div>
          <div className="article-closing">gangs team</div>
        </div>
      </div>
      <FooterComponent></FooterComponent>
    </div>
  );
}
