import "./playerTile.scss";
import "primeicons/primeicons.css";
import { getRocketLeaguePlaylists, howLongAgo } from "../../utils/helperFunctions";
import { useEffect, useState } from "react";
import ExpandedProfile from "../modal/expandedProfileComponent";
import { useLocation } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import RankTile from "./rankTile";

export default function PlayerTile(props: any) {
  const locationPath: string = useLocation().pathname;
  const [genderIcon, setgenderIcon] = useState("");
  const [rocketLeagueRankIcon, setrocketLeagueRankIcon] = useState("");
  const [expandedProfileVis, setExpandedProfileVis] = useState<boolean>(false);

  const rocketLeaguePlaylists: any = getRocketLeaguePlaylists();
  const lastSeen = howLongAgo(props.last_seen);

  useEffect(() => {
    if (props.gender === 1) {
      setgenderIcon("https://res.cloudinary.com/kultured-dev/image/upload/v1685814971/gender-icon-male_l71kiy.png");
    } else if (props.gender === 2) {
      setgenderIcon("https://res.cloudinary.com/kultured-dev/image/upload/v1685814973/gender-icon-female_ozujm1.png");
    } else if (props.gender === 3) {
      setgenderIcon(
        "https://res.cloudinary.com/kultured-dev/image/upload/v1685814975/gender-icon-non-binary_hepali.png"
      );
    }
  }, [props.gender]);

  useEffect(() => {
    if (props.rocket_league_rank === 1) {
      setrocketLeagueRankIcon(
        "https://res.cloudinary.com/kultured-dev/image/upload/v1666570297/rl-bronze-transp_fw3ar3.png"
      );
    } else if (props.rocket_league_rank === 2) {
      setrocketLeagueRankIcon(
        "https://res.cloudinary.com/kultured-dev/image/upload/v1666570549/rl-silver-transp_ovmdbx.png"
      );
    } else if (props.rocket_league_rank === 3) {
      setrocketLeagueRankIcon(
        "https://res.cloudinary.com/kultured-dev/image/upload/v1666570549/rl-gold-transp_vwr4dz.png"
      );
    } else if (props.rocket_league_rank === 4) {
      setrocketLeagueRankIcon(
        "https://res.cloudinary.com/kultured-dev/image/upload/v1666570549/rl-plat-transp_rgbpdw.png"
      );
    } else if (props.rocket_league_rank === 5) {
      setrocketLeagueRankIcon(
        "https://res.cloudinary.com/kultured-dev/image/upload/v1666570549/rl-diamond-transp_j0vmlx.png"
      );
    } else if (props.rocket_league_rank === 6) {
      setrocketLeagueRankIcon(
        "https://res.cloudinary.com/kultured-dev/image/upload/v1666570549/rl-champ-transp_v2xt1q.png"
      );
    } else if (props.rocket_league_rank === 7) {
      setrocketLeagueRankIcon(
        "https://res.cloudinary.com/kultured-dev/image/upload/v1666570297/rl-grand-champ-transp_jflaeq.png"
      );
    } else {
      setrocketLeagueRankIcon("");
    }
  }, [props.rocket_league_rank]);

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
                  {props.username
                    .split(" ")
                    .map((word: string[]) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toLowerCase()}
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

              {rocketLeagueRankIcon.length > 0 ? (
                <img className="details-rocket-league-rank" src={rocketLeagueRankIcon} />
              ) : (
                "not ranked"
              )}
            </div>
          ) : (
            <></>
          )}
          {locationPath === "/lfg-rust" ? (
            <div className="details-rust">
              <div className="details-rust-info-slot" data-tip data-for="playlistTip">
                {props.server_type_id === 1 ? "vanilla servers" : `${props.server_type_id}x servers`}
              </div>

              <div className="details-rust-info-slot">{props.wipe_day_preference} wipes </div>
            </div>
          ) : (
            <></>
          )}
          <div className="details-availability">
            <div className="detail-label" data-tip data-for="weekdayTip">
              mon-thu:{" "}
            </div>
            <div className="details-availabilty-text">
              {locationPath === "/lfg-rust" ? props.rust_weekdays : props.rocket_league_weekdays}
            </div>
            <div className="detail-label" data-tip data-for="weekendTip">
              fri-sun:{" "}
            </div>
            <div className="details-availabilty-text">
              {locationPath === "/lfg-rust" ? props.rust_weekends : props.rocket_league_weekends}
            </div>
          </div>
        </div>
        {/* footer details */}
        <div className="footer-details">
          <div className="footer-rank-box footer-third">
            <RankTile user={props} isSmall={true}></RankTile>
          </div>
          <div className="footer-platform-box footer-third" data-tip data-for="commPlatformTip">
            {props.preferred_platform === 1 ? (
              <img
                className="footer-platform-image"
                src="https://res.cloudinary.com/kultured-dev/image/upload/v1685814273/logoWhiteSmall_i1lvgo.png"
                alt={`${props.username} discord`}
              />
            ) : (
              <></>
            )}
            {props.preferred_platform === 2 ? (
              <img
                className="footer-platform-image"
                src="https://res.cloudinary.com/kultured-dev/image/upload/v1685814624/psn-logo-small_nbgzwa.png"
                alt={`${props.username} psn`}
              />
            ) : (
              <></>
            )}
            {props.preferred_platform === 3 ? (
              <img
                className="footer-platform-image"
                src="https://res.cloudinary.com/kultured-dev/image/upload/v1685814627/xbox-logo-small_e8sqjw.png"
                alt={`${props.username} xbox`}
              />
            ) : (
              <></>
            )}
          </div>
          <div className="footer-timestamp footer-third" data-tip data-for="seenTip">
            last active {lastSeen}
          </div>
        </div>
      </div>
      <Tooltip id="hoursTip" place="top">
        hours played
      </Tooltip>
      <Tooltip id="rankTip" place="top">
        rank
      </Tooltip>
      <Tooltip id="playlistTip" place="top">
        preferred playlist
      </Tooltip>
      <Tooltip id="weekdayTip" place="top">
        weekday availability
      </Tooltip>
      <Tooltip id="weekendTip" place="top">
        weekend availability
      </Tooltip>
      <Tooltip id="commPlatformTip" place="top">
        communication platform
      </Tooltip>
      <Tooltip id="seenTip" place="top">
        last time player was seen on gangs
      </Tooltip>
    </div>
  );
}
