import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BannerTitle from "../nav/banner-title";
import FooterComponent from "../nav/footerComponent";
import "./viewProfile.scss";
import {
  attemptPublishRustProfile,
  createConnectionRequest,
  fetchUserData,
  fetchUserDataAndConnectedStatus,
  getAllPublishStatus,
  getEndorsementOptions,
  getProfileSocialData,
} from "../../utils/rest";
import RankTile from "../tiles/rankTile";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { getBattleBitPlaylists, getRocketLeaguePlaylists, howLongAgo } from "../../utils/helperFunctions";
import EndorsementTile from "../tiles/endorsementTile";

export default function ViewProfilePage({ socketRef }) {
  const locationPath: string = useLocation().pathname;
  const userState = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();
  const [loadedUserInfo, setloadedUserInfo] = useState<any>({});
  const [showConnectForm, setshowConnectForm] = useState<boolean>(true);
  const [connectionText, setConnectionText] = useState<string>("");
  const [requestSent, setRequestSent] = useState<boolean>(false);
  const [isProfileComplete, setisProfileComplete] = useState<boolean>(false);
  const [lastSeen, setlastSeen] = useState<any>("");
  const [publishData, setpublishData] = useState<any>({
    rust_status: false,
    rocket_league_status: false,
    battle_bit_status: false,
  });
  const [socialData, setsocialData] = useState<any>({ connections: 0, mutual: 0 });
  const [endorsementFeed, setendorsementFeed] = useState(<li></li>);
  const [endorsementInput, setendorsementInput] = useState(<li></li>);
  let hasSendError = false;
  const rocketLeaguePlaylists: any = getRocketLeaguePlaylists();
  const battleBitPlaylists: any = getBattleBitPlaylists();
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
  const battleBitClasses: any = {
    1: (
      <img
        src="https://res.cloudinary.com/kultured-dev/image/upload/v1688413506/battle-bit-classes-squad-leader_oeskw6.png"
        alt="squad leader class"
        style={{ maxHeight: "5vh", maxWidth: "5vh", minHeight: "5vh", minWidth: "5vh" }}
      ></img>
    ),
    2: (
      <img
        src="https://res.cloudinary.com/kultured-dev/image/upload/v1688413554/battle-bit-classes-assault_k8mydg.png"
        alt="assault class"
        style={{ maxHeight: "5vh", maxWidth: "5vh", minHeight: "5vh", minWidth: "5vh" }}
      ></img>
    ),
    3: (
      <img
        src="https://res.cloudinary.com/kultured-dev/image/upload/v1688413506/battle-bit-classes-medic_muxa1d.png"
        alt="medic class"
        style={{ maxHeight: "5vh", maxWidth: "5vh", minHeight: "5vh", minWidth: "5vh" }}
      ></img>
    ),
    4: (
      <img
        src="https://res.cloudinary.com/kultured-dev/image/upload/v1688413506/battle-bit-classes-engineer_qcxbvi.png"
        alt="engineer class"
        style={{ maxHeight: "5vh", maxWidth: "5vh", minHeight: "5vh", minWidth: "5vh" }}
      ></img>
    ),
    5: (
      <img
        src="https://res.cloudinary.com/kultured-dev/image/upload/v1688413506/battle-bit-classes-support_nqoqth.png"
        alt="support class"
        style={{ maxHeight: "5vh", maxWidth: "5vh", minHeight: "5vh", minWidth: "5vh" }}
      ></img>
    ),
    6: (
      <img
        src="https://res.cloudinary.com/kultured-dev/image/upload/v1688413506/battle-bit-classes-recon_hjvxjs.png"
        alt="recon class"
        style={{ maxHeight: "5vh", maxWidth: "5vh", minHeight: "5vh", minWidth: "5vh" }}
      ></img>
    ),
  };

  useEffect(() => {
    if (locationPath[9] && parseInt(locationPath[9]) > 0) {
      //Get gang info to manage the gang
      getUserInfo(parseInt(locationPath.slice(9, 55)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationPath]);

  useEffect(() => {
    fetchSocialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedUserInfo]);

  const getUserInfo = async (userId: number) => {
    const connectionData = await fetchUserDataAndConnectedStatus(userState.id, userId);

    let isCompleteResult = { status: "" };
    if (userState.id && userState.id > 0) {
      isCompleteResult = await attemptPublishRustProfile(userState.id, "nothing");
    } else {
      isCompleteResult.status = "error";
    }
    const publishData = await getAllPublishStatus(userId, "");
    setloadedUserInfo(connectionData.data);
    console.log("test? ", isCompleteResult);
    setshowConnectForm(!connectionData.data.isConnected);
    setisProfileComplete(isCompleteResult.status === "success" ? true : false);
    setlastSeen(howLongAgo(connectionData.data.last_seen));
    setpublishData(publishData.data);
  };
  const fetchSocialData = async () => {
    const userId = parseInt(locationPath.slice(9, 55));
    const socialData = await getProfileSocialData(userState.id, userId, "nothing");
    setsocialData(socialData);
    setendorsementFeed(
      socialData.endorsements && socialData.endorsements.length ? (
        socialData.endorsements.map((endorsement: any) => (
          <div key={endorsement.id}>
            <EndorsementTile
              id={endorsement.id}
              forUser={parseInt(locationPath.slice(9, 55))}
              title={endorsement.description}
              value={endorsement.value}
              isInput={false}
              alreadyEndorsed={0}
              refreshSocial={fetchSocialData}
            ></EndorsementTile>
          </div>
        ))
      ) : (
        <div>no endorsements yet</div>
      )
    );
    //If viewing friend, populate endorsement input options
    if (loadedUserInfo && loadedUserInfo.isConnected) {
      const allEndorsementResult = await getEndorsementOptions(userState.id, userId, loadedUserInfo.rust_is_published);
      setendorsementInput(
        allEndorsementResult.data && allEndorsementResult.data.length ? (
          allEndorsementResult.data.map((endorsement: any) => (
            <div key={endorsement.id}>
              <EndorsementTile
                id={endorsement.id}
                forUser={userId}
                title={endorsement.description}
                value={0}
                isInput={true}
                alreadyEndorsed={endorsement.already_endorsed}
                refreshSocial={fetchSocialData}
              ></EndorsementTile>
            </div>
          ))
        ) : (
          <div>no endorsements yet</div>
        )
      );
    }
  };

  const sendConnectionRequest = async () => {
    const requestResult = await createConnectionRequest(
      userState.id,
      parseInt(locationPath.slice(9, 55)),
      0,
      connectionText,
      "nothing"
    );
    if (requestResult.status === "success") {
      setRequestSent(true);
    } else {
      hasSendError = true;
    }
  };

  const goToGameProfile = () => {
    let route = "";
    switch (locationPath) {
      // ***NEW GAME MODIFY
      case "/lfg-rust":
        route = "rust-profile";
        break;
      case "/lfg-rocket-league":
        route = "rocket-league-profile";
        break;
      default:
        break;
    }
    navigate(`/${route}`);
  };

  const goToSignInPage = () => {
    navigate(`/login`);
  };

  return (
    <div className="tos-master">
      <BannerTitle
        title={"gamer profile"}
        imageLink={"https://res.cloudinary.com/kultured-dev/image/upload/v1663566897/rust-tile-image_uaygce.png"}
      ></BannerTitle>
      <div className="profile-container">
        <div className="expanded-banner">
          {loadedUserInfo.avatar_url === "" ||
          loadedUserInfo.avatar_url ===
            "https://res.cloudinary.com/kultured-dev/image/upload/v1625617920/defaultAvatar_aeibqq.png" ? (
            <div className="dynamic-avatar-border">
              <div className="dynamic-avatar-text-med">
                {loadedUserInfo.username
                  .split(" ")
                  .map((word: string[]) => word[0])
                  .join("")
                  .slice(0, 2)
                  .toLowerCase()}
              </div>
            </div>
          ) : (
            <img
              className="expanded-photo"
              onClick={() => {}}
              src={loadedUserInfo.avatar_url}
              alt={`${loadedUserInfo.username}avatar`}
            />
          )}
          <RankTile user={loadedUserInfo} isSmall={false}></RankTile>
          <div className="expanded-basic-info">
            <div className="expanded-username">{loadedUserInfo.username}</div>
            <div className="expanded-basic-text">{loadedUserInfo.about}</div>
          </div>
        </div>
        <div className="expanded-gradient-bar"></div>
        {/* Connect Section */}
        {showConnectForm && userState.id !== loadedUserInfo.id ? (
          <div className="expanded-connect-box">
            <div className="expanded-core-info-title">connect</div>
            {isProfileComplete ? (
              <input
                onChange={(event) => {
                  setConnectionText(event.target.value);
                }}
                value={connectionText ? connectionText : ""}
                className="input-box"
                placeholder={"write a short message..."}
              ></input>
            ) : (
              <div className="profile-incomplete-text">
                {userState.id && userState.id > 0 ? (
                  <>
                    complete{" "}
                    <span
                      onClick={() => {
                        goToGameProfile();
                      }}
                      className="link-text"
                    >
                      {" "}
                      profile
                    </span>{" "}
                    before sending requests
                  </>
                ) : (
                  <div>
                    must be{" "}
                    <span
                      onClick={() => {
                        goToSignInPage();
                      }}
                      className="link-text"
                    >
                      {" "}
                      signed in
                    </span>{" "}
                    to send connection request
                  </div>
                )}
              </div>
            )}
            <button
              className="connect-button"
              onClick={() => {
                sendConnectionRequest();
              }}
              disabled={connectionText === "" || requestSent || hasSendError}
            >
              <i className="pi pi-user-plus" />
              &nbsp; {requestSent ? "pending" : "send request"}
            </button>
            {hasSendError ? (
              <small id="username-help" className="p-error">
                problem sending request
              </small>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <></>
        )}
        {showConnectForm && userState.id !== loadedUserInfo.id ? <div className="expanded-gradient-bar"></div> : <></>}
        {/* Core Info Section */}
        <div className="expanded-core-info">
          <div className="expanded-core-info-title">general info</div>
          <div className="expanded-core-info-field">
            <label>last seen</label>
            <div>{lastSeen}</div>
          </div>
          <div className="expanded-core-info-field">
            <label>language</label>
            <div>{loadedUserInfo.languages}</div>
          </div>
          <div className="expanded-core-info-field">
            <label>age</label>
            <div>{loadedUserInfo.age}</div>
          </div>
          <div className="expanded-core-info-field">
            <label>gender</label>
            <div>{loadedUserInfo.gender === 1 ? "male" : loadedUserInfo.gender === 2 ? "female" : "non-binary"}</div>
          </div>
          <div className="expanded-core-info-field">
            <label>region</label>
            <div>{loadedUserInfo.region_abbreviation ? loadedUserInfo.region_abbreviation : loadedUserInfo.region}</div>
          </div>
        </div>
        <div className="expanded-gradient-bar"></div>
        {/* Rust Info Section */}
        {publishData.rust_status ? (
          <div className="expanded-core-info">
            <div className="expanded-core-info-title">rust info</div>
            <div className="expanded-core-info-field">
              <label>hours</label>
              <div>{loadedUserInfo.rust_hours}</div>
            </div>
            <div className="expanded-core-info-field">
              <label>server type</label>
              <div>
                {loadedUserInfo.rust_server_type_id === 1 ? "vanilla" : `${loadedUserInfo.rust_server_type_id}x`}
              </div>
            </div>
            <div className="expanded-core-info-field">
              <label>wipe day pref</label>
              <div>{loadedUserInfo.wipe_day_preference}</div>
            </div>
            <div className="expanded-core-info-field">
              <label>weekdays</label>
              <div>{loadedUserInfo.rust_weekdays}</div>
            </div>
            <div className="expanded-core-info-field">
              <label>weekends</label>
              <div>{loadedUserInfo.rust_weekends}</div>
            </div>
          </div>
        ) : (
          <></>
        )}
        {publishData.rust_status ? <div className="expanded-gradient-bar"></div> : <></>}
        {/* Rocket League Info Section */}
        {publishData.rocket_league_status ? (
          <div className="expanded-core-info">
            <div className="expanded-core-info-title">rocket league info</div>
            <div className="expanded-core-info-field">
              <label>playlist</label>
              <div className="details-rocket-league-playlist">
                {rocketLeaguePlaylists[loadedUserInfo.rocket_league_playlist]}
              </div>
            </div>
            <div className="expanded-core-info-field">
              <label>rank</label>
              <div>{rocketLeagueRanks[loadedUserInfo.rocket_league_rank]}</div>
            </div>
            <div className="expanded-core-info-field">
              <label>hours</label>
              <div>{loadedUserInfo.rocket_league_hours}</div>
            </div>
            <div className="expanded-core-info-field">
              <label>weekdays</label>
              <div>{loadedUserInfo.rocket_league_weekdays}</div>
            </div>
            <div className="expanded-core-info-field">
              <label>weekends</label>
              <div>{loadedUserInfo.rocket_league_weekends}</div>
            </div>
          </div>
        ) : (
          <></>
        )}
        {publishData.rocket_league_status ? <div className="expanded-gradient-bar"></div> : <></>}
        {/* Battle Bit Info Section */}
        {publishData.battle_bit_status ? (
          <div className="expanded-core-info">
            <div className="expanded-core-info-title">battlebit info</div>
            <div className="expanded-core-info-field">
              <label>class</label>
              <div className="details-rocket-league-playlist">{battleBitClasses[loadedUserInfo.battle_bit_class]}</div>
            </div>
            <div className="expanded-core-info-field">
              <label>playlist</label>
              <div className="details-rocket-league-playlist">
                {battleBitPlaylists[loadedUserInfo.battle_bit_playlist]}
              </div>
            </div>
            <div className="expanded-core-info-field">
              <label>rank</label>
              <div>{loadedUserInfo.battle_bit_rank}</div>
            </div>
            <div className="expanded-core-info-field">
              <label>hours</label>
              <div>{loadedUserInfo.battle_bit_hours}</div>
            </div>
            <div className="expanded-core-info-field">
              <label>weekdays</label>
              <div>{loadedUserInfo.battle_bit_weekdays}</div>
            </div>
            <div className="expanded-core-info-field">
              <label>weekends</label>
              <div>{loadedUserInfo.battle_bit_weekends}</div>
            </div>
          </div>
        ) : (
          <></>
        )}
        {publishData.battle_bit_status ? <div className="expanded-gradient-bar"></div> : <></>}
        {/* ***NEW GAME EDIT */}
        {/* Social Section */}
        <div className="expanded-core-info">
          <div className="expanded-core-info-title">social</div>
          <div className="expanded-social-container">
            <div className="platform-image-container">
              {loadedUserInfo.preferred_platform === 1 ? (
                <img
                  className="expanded-platform-image"
                  src="https://res.cloudinary.com/kultured-dev/image/upload/v1685814273/logoWhiteSmall_i1lvgo.png"
                  alt={`${loadedUserInfo.username} gangs`}
                />
              ) : (
                <></>
              )}
              {loadedUserInfo.preferred_platform === 2 ? (
                <img
                  className="expanded-platform-image"
                  src="https://res.cloudinary.com/kultured-dev/image/upload/v1685814624/psn-logo-small_nbgzwa.png"
                  alt={`${loadedUserInfo.username} psn`}
                />
              ) : (
                <></>
              )}
              {loadedUserInfo.preferred_platform === 3 ? (
                <img
                  className="expanded-platform-image"
                  src="https://res.cloudinary.com/kultured-dev/image/upload/v1685814627/xbox-logo-small_e8sqjw.png"
                  alt={`${loadedUserInfo.username} xbox`}
                />
              ) : (
                <></>
              )}
            </div>
            <div className="expanded-social-box">
              <div>connections</div>
              <div>{socialData.connections}</div>
            </div>
            <div className="expanded-social-box">
              <div>mutual</div>
              <div>{socialData.mutual}</div>
            </div>
          </div>
        </div>
        <div className="expanded-gradient-bar"></div>
        {/* View Endorsements */}
        <div className="expanded-core-info">
          <div className="expanded-core-info-title">endorsements</div>
          <div className="expanded-endorsement-container">{endorsementFeed}</div>
        </div>
        <div className="expanded-gradient-bar"></div>
        {/* Send Endorsements */}
        {loadedUserInfo.isConnected ? (
          <div className="expanded-core-info">
            <div className="expanded-core-info-title">endorse</div>
            <div className="expanded-endorsement-container">{endorsementInput}</div>
          </div>
        ) : (
          <></>
        )}
        {/* Add margin to bottom of profile for mobile scrolling*/}
        <div className="bottom-of-profile"></div>
      </div>
    </div>
  );
}
