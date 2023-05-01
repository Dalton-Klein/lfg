import "./playerTile.scss";
import "primeicons/primeicons.css";
import { getRocketLeaguePlaylists, howLongAgo } from "../../utils/helperFunctions";
import { useState } from "react";
import ExpandedProfile from "../modal/expandedProfileComponent";
import { useLocation } from "react-router-dom";
import ReactTooltip from "react-tooltip";

export default function PlayerTile(props: any) {
  const locationPath: string = useLocation().pathname;

  const genderImageLinks: any = {
    1: "male",
    2: "female",
    3: "non-binary",
  };

  const rocketLeaguePlaylists: any = getRocketLeaguePlaylists();
  const rocketLeagueRanks: any = {
    1: (
      <img
        src="https://res.cloudinary.com/kultured-dev/image/upload/v1666570297/rl-bronze-transp_fw3ar3.png"
        alt="rocket league bronze rank"
        style={{ maxHeight: "7vh", maxWidth: "7vh", minHeight: "7vh", minWidth: "7vh" }}
      ></img>
    ),
    2: (
      <img
        src="https://res.cloudinary.com/kultured-dev/image/upload/v1666570549/rl-silver-transp_ovmdbx.png"
        alt="rocket league silver rank"
        style={{ maxHeight: "7vh", maxWidth: "7vh", minHeight: "7vh", minWidth: "7vh" }}
      ></img>
    ),
    3: (
      <img
        src="https://res.cloudinary.com/kultured-dev/image/upload/v1666570549/rl-gold-transp_vwr4dz.png"
        alt="rocket league gold rank"
        style={{ maxHeight: "7vh", maxWidth: "7vh", minHeight: "7vh", minWidth: "7vh" }}
      ></img>
    ),
    4: (
      <img
        src="https://res.cloudinary.com/kultured-dev/image/upload/v1666570549/rl-plat-transp_rgbpdw.png"
        alt="rocket league platinum rank"
        style={{ maxHeight: "7vh", maxWidth: "7vh", minHeight: "7vh", minWidth: "7vh" }}
      ></img>
    ),
    5: (
      <img
        src="https://res.cloudinary.com/kultured-dev/image/upload/v1666570549/rl-diamond-transp_j0vmlx.png"
        alt="rocket league diamond rank"
        style={{ maxHeight: "7vh", maxWidth: "7vh", minHeight: "7vh", minWidth: "7vh" }}
      ></img>
    ),
    6: (
      <img
        src="https://res.cloudinary.com/kultured-dev/image/upload/v1666570549/rl-champ-transp_v2xt1q.png"
        alt="rocket league champ rank"
        style={{ maxHeight: "7vh", maxWidth: "7vh", minHeight: "7vh", minWidth: "7vh" }}
      ></img>
    ),
    7: (
      <img
        src="https://res.cloudinary.com/kultured-dev/image/upload/v1666570297/rl-grand-champ-transp_jflaeq.png"
        alt="rocket league grand champ rank"
        style={{ maxHeight: "7vh", maxWidth: "7vh", minHeight: "7vh", minWidth: "7vh" }}
      ></img>
    ),
  };
  const lastSeen = howLongAgo(props.last_seen);
  const genderIcon = `/assets/gender-icon-${genderImageLinks[props.gender]}.png`;

  const [expandedProfileVis, setExpandedProfileVis] = useState<boolean>(false);

  const toggleExpandedProfile = () => {
    setExpandedProfileVis(!expandedProfileVis);
  };

  return (
    <div>
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
      <div>
        {/* main details */}
        <div className="main-details">
          <div className="image-column">
            {props.avatar_url === "" || props.avatar_url === "/assets/avatarIcon.png" ? (
              <div
                className="dynamic-avatar-border"
                onClick={() => {
                  toggleExpandedProfile();
                }}
              >
                <div className="dynamic-avatar-text-med">
                  {props.username
                    .split(" ")
                    .map((word: string[]) => word[0])
                    .join("")
                    .slice(0, 2)}
                </div>
              </div>
            ) : (
              <img
                className="card-photo"
                onClick={() => {}}
                src={props.avatar_url}
                alt={`${props.username}'s avatar`}
              />
            )}
          </div>
          <div className="info-column">
            <div className="info-title-row">
              <div>{props.username}</div>
              <button
                className="connect-button"
                onClick={() => {
                  toggleExpandedProfile();
                }}
              >
                <i className="pi pi-plus" />
                &nbsp; view
              </button>
            </div>
            <div className="info-stats-row">
              <div className="info-stats-attribute">{props.languages}</div>
              <div className="info-stats-attribute">{props.age}</div>
              <img className="gender-icon" src={genderIcon} alt="gender icon"></img>
              <div className="info-stats-attribute">{props.region_abbreviation}</div>
            </div>
          </div>
        </div>
        {/* lesser details */}
        <div className="lesser-details">
          <div className="details-about">
            <div className="details-about-text">{props.about}</div>
          </div>
          <div className="details-hours-played">
            <div className="hours-belt-outer">
              <div className="hours-belt-inner">
                <div className="details-hours-played-text" data-tip data-for="hoursTip">
                  {props.hours} hours
                </div>
              </div>
            </div>
          </div>
          {locationPath === "/lfg-rocket-league" ? (
            <div className="details-rocket-league">
              <div className="details-rocket-league-playlist" data-tip data-for="playlistTip">
                {rocketLeaguePlaylists[props.rocket_league_playlist]}
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className="details-availability">
            <div className="detail-label" data-tip data-for="weekdayTip">
              weekdays:{" "}
            </div>
            <div className="details-availabilty-text">
              {locationPath === "/lfg-rust" ? props.rust_weekdays : props.rocket_league_weekdays}
            </div>
            <div className="detail-label" data-tip data-for="weekendTip">
              weekends:{" "}
            </div>
            <div className="details-availabilty-text">
              {locationPath === "/lfg-rust" ? props.rust_weekends : props.rocket_league_weekends}
            </div>
          </div>
        </div>
        {/* footer details */}
        <div className="footer-details">
          <div className="footer-platform-box" data-tip data-for="commPlatformTip">
            {props.preferred_platform === 1 ? (
              <img
                className="footer-platform-image"
                src="/assets/logoWhiteSmall.png"
                alt={`${props.username} discord`}
              />
            ) : (
              <></>
            )}
            {props.preferred_platform === 2 ? (
              <img className="footer-platform-image" src="/assets/psn-logo-small.png" alt={`${props.username} psn`} />
            ) : (
              <></>
            )}
            {props.preferred_platform === 3 ? (
              <img className="footer-platform-image" src="/assets/xbox-logo-small.png" alt={`${props.username} xbox`} />
            ) : (
              <></>
            )}
          </div>
          <div className="footer-timestamp" data-tip data-for="seenTip">
            {lastSeen}
          </div>
        </div>
      </div>
      <ReactTooltip id="hoursTip" place="top" effect="solid">
        hours played
      </ReactTooltip>
      <ReactTooltip id="rankTip" place="top" effect="solid">
        rank
      </ReactTooltip>
      <ReactTooltip id="playlistTip" place="top" effect="solid">
        preferred playlist
      </ReactTooltip>
      <ReactTooltip id="weekdayTip" place="top" effect="solid">
        weekday availability
      </ReactTooltip>
      <ReactTooltip id="weekendTip" place="top" effect="solid">
        weekend availability
      </ReactTooltip>
      <ReactTooltip id="commPlatformTip" place="top" effect="solid">
        communication platform
      </ReactTooltip>
      <ReactTooltip id="seenTip" place="top" effect="solid">
        last time player was seen on gangs
      </ReactTooltip>
    </div>
  );
}
