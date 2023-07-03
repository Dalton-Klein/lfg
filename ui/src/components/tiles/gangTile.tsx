import "./gangTile.scss";
import "primeicons/primeicons.css";
import { useEffect, useState } from "react";
import ExpandedProfile from "../modal/expandedProfileComponent";
import { useLocation, useNavigate } from "react-router-dom";

export default function GangTile(props: any) {
  const navigate = useNavigate();
  const locationPath: string = useLocation().pathname;
  const [expandedProfileVis, setExpandedProfileVis] = useState<boolean>(false);
  const [platformImgLink, setplatformImgLink] = useState<string>("");
  const first5Members = props.members?.slice(0, 5);
  const toggleExpandedProfile = () => {
    setExpandedProfileVis(!expandedProfileVis);
  };

  useEffect(() => {
    // ***NEW GAME MODIFY
    switch (props.game_platform_id) {
      case 1:
        setplatformImgLink(
          "https://res.cloudinary.com/kultured-dev/image/upload/v1663786762/rust-logo-small_uarsze.png"
        );
        break;
      case 2:
        setplatformImgLink(
          "https://res.cloudinary.com/kultured-dev/image/upload/v1665620519/RocketLeagueResized_loqz1h.png"
        );
        break;
      case 3:
        setplatformImgLink(
          "https://res.cloudinary.com/kultured-dev/image/upload/v1688419805/minecraft_logo_icon_168974_ue0qxn.png"
        );
        break;
      case 4:
        setplatformImgLink(
          "https://res.cloudinary.com/kultured-dev/image/upload/v1688414978/battle-bit-logo_ctgigq.jpg"
        );
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      onClick={() => {
        navigate(`/gang/${props.id}`);
      }}
      className="gang-card-master"
    >
      {/* Conditionally render hamburger modal */}
      {expandedProfileVis ? (
        <ExpandedProfile
          toggleExpandedProfile={toggleExpandedProfile}
          userInfo={props}
          refreshTiles={props.refreshTiles}
          showConnectForm={true}
          isProfileComplete={props.isProfileComplete}
          isConnected={false}
          game={locationPath === "/lfg-rust" ? "rust" : "rocket-league"}
        />
      ) : (
        <></>
      )}
      <div className="gang-card">
        {/* main details */}
        <div className="top-bar">
          <div className="main-details">
            <div className="image-column">
              {props.avatar_url === "" ||
              props.avatar_url ===
                "https://res.cloudinary.com/kultured-dev/image/upload/v1625617920/defaultAvatar_aeibqq.png" ? (
                <div
                  className="dynamic-avatar-border"
                  onClick={() => {
                    toggleExpandedProfile();
                  }}
                >
                  <div className="dynamic-avatar-text-med">
                    {props.name
                      .split(" ")
                      .map((word: string[]) => word[0])
                      .join("")
                      .slice(0, 2)
                      .toLowerCase()}
                  </div>
                </div>
              ) : (
                <img className="card-photo" onClick={() => {}} src={props.avatar_url} alt={`${props.name}'s avatar`} />
              )}
            </div>
            <div className="gang-info">
              <div className="gang-name">{props.name}</div>
              <div className="gang-role-text">{props.role_name}</div>
            </div>
          </div>
          <img className="gang-game-image" src={platformImgLink} alt={`game this team supports`} />
        </div>
        <div className="gang-about-container">
          <div>{props.about}</div>
        </div>
        <div className="gang-roster-container">
          {first5Members?.map((member: any) => (
            <div className="list-member-photo" key={member.id}>
              {/* <img className="member-photo" onClick={() => {}} src={member.avatar_url} alt={`member avatar`} /> */}

              {member.avatar_url === "" ||
              member.avatar_url ===
                "https://res.cloudinary.com/kultured-dev/image/upload/v1625617920/defaultAvatar_aeibqq.png" ? (
                <div className="dynamic-avatar-border">
                  <div className="dynamic-avatar-text-small">
                    {member.username
                      ? member.username
                          .split(" ")
                          .map((word: string[]) => word[0])
                          .join("")
                          .slice(0, 2)
                          .toLowerCase()
                      : "gg"}
                  </div>
                </div>
              ) : (
                <img className="member-photo" src={member.avatar_url} alt="my avatar" />
              )}
            </div>
          ))}
          <div className="number-of-members">{props.members?.length} members</div>
        </div>
        <div className="gang-footer">
          <div className="footer-platform-box" data-tip data-tooltip-id="commPlatformTip">
            {props.chat_platform_id === 1 ? (
              <img
                className="footer-platform-image"
                src="https://res.cloudinary.com/kultured-dev/image/upload/v1685814273/logoWhiteSmall_i1lvgo.png"
                alt={`${props.username} discord`}
              />
            ) : (
              <></>
            )}
            {props.chat_platform_id === 2 ? (
              <img
                className="footer-platform-image"
                src="https://res.cloudinary.com/kultured-dev/image/upload/v1685814624/psn-logo-small_nbgzwa.png"
                alt={`${props.username} psn`}
              />
            ) : (
              <></>
            )}
            {props.chat_platform_id === 3 ? (
              <img
                className="footer-platform-image"
                src="https://res.cloudinary.com/kultured-dev/image/upload/v1685814627/xbox-logo-small_e8sqjw.png"
                alt={`${props.username} xbox`}
              />
            ) : (
              <></>
            )}
          </div>
          <div>
            <div className="privacy-text">{props.is_public ? "public gang" : "private gang"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
