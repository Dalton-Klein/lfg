import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import "./expandedProfileComponent.scss";
import {
  getProfileSocialData,
  createConnectionRequest,
  getEndorsementOptions,
  getAllPublishStatus,
} from "../../utils/rest";
import { getBattleBitPlaylists, getRocketLeaguePlaylists, howLongAgo } from "../../utils/helperFunctions";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import EndorsementTile from "../tiles/endorsementTile";
import { useLocation, useNavigate } from "react-router-dom";
import RankTile from "../tiles/rankTile";

type Props = {
  toggleExpandedProfile: any;
  userInfo: any;
  refreshTiles: any;
  showConnectForm: boolean;
  isProfileComplete: boolean;
  isConnected: boolean;
  game: string;
};

const ExpandedProfile = (props: Props) => {
  const locationPath: string = useLocation().pathname;
  const navigate = useNavigate();
  let platformId = 0;
  // ***NEW GAME MODIFY
  switch (locationPath) {
    case "/lfg-rust":
      platformId = 1;
      break;
    case "/lfg-rocket-league":
      platformId = 2;
      break;
    case "/lfg-battle-bit":
      platformId = 4;
      break;
    default:
      break;
  }
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
  const [connectionText, setConnectionText] = useState<string>("");
  const [requestSent, setRequestSent] = useState<boolean>(false);
  // ***NEW GAME EDIT
  const [publishData, setpublishData] = useState<any>({
    rust_status: false,
    rocket_league_status: false,
    battle_bit_status: false,
  });
  const [socialData, setsocialData] = useState<any>({ connections: 0, mutual: 0 });
  const [endorsementFeed, setendorsementFeed] = useState(<li></li>);
  const [endorsementInput, setendorsementInput] = useState(<li></li>);
  const lastSeen = howLongAgo(props.userInfo.last_seen);

  const userState = useSelector((state: RootState) => state.user.user);

  let hasSendError = false;

  useEffect(() => {
    fetchSocialData();
    getPublishInfo();
    document.querySelector(".backdrop-event-listener")!.addEventListener("click", () => {
      props.toggleExpandedProfile();
    });
    // SETUP ANIMS
    gsap.to(".hamburger-primary-panel", {
      duration: 0.01,
      xPercent: 100,
    });
    gsap.to(".hamburger-secondary-panel", {
      opacity: 0,
      duration: 0.01,
      xPercent: 100,
    });
    gsap.to(".profile-container", {
      duration: 0.01,
      opacity: 0,
    });
    // Slide & Opacity ANIMS
    gsap.to(".hamburger-primary-panel", {
      duration: 0.25,
      xPercent: 0,
      opacity: 1,
      delay: 0.02,
    });
    gsap.to(".hamburger-secondary-panel", {
      delay: 0.13,
      opacity: 1,
      duration: 0.25,
      xPercent: 0,
    });
    gsap.to(".profile-container", {
      delay: 0.25,
      duration: 0.25,
      opacity: 1,
      xPercent: 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPublishInfo = async () => {
    const publishData = await getAllPublishStatus(props.userInfo.id, "");
    setpublishData(publishData.data);
  };

  const fetchSocialData = async () => {
    const socialData = await getProfileSocialData(userState.id, props.userInfo.id, "nothing");
    setsocialData(socialData);
    setendorsementFeed(
      socialData.endorsements && socialData.endorsements.length ? (
        socialData.endorsements.map((endorsement: any) => (
          <div key={endorsement.id}>
            <EndorsementTile
              id={endorsement.id}
              forUser={props.userInfo.id}
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
    if (props.isConnected) {
      const allEndorsementResult = await getEndorsementOptions(
        userState.id,
        props.userInfo.id,
        props.userInfo.rust_is_published
      );
      setendorsementInput(
        allEndorsementResult.data && allEndorsementResult.data.length ? (
          allEndorsementResult.data.map((endorsement: any) => (
            <div key={endorsement.id}>
              <EndorsementTile
                id={endorsement.id}
                forUser={props.userInfo.id}
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
      props.userInfo.id,
      platformId,
      connectionText,
      "nothing"
    );
    if (requestResult.status === "success") {
      setRequestSent(true);
      props.refreshTiles();
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

  return createPortal(
    <div className="backdrop-container">
      <div className="backdrop-event-listener"></div>
      <div className="hamburger-primary-panel">
        <div className="hamburger-secondary-panel">
          <div className="profile-container">
            <i className="pi pi-angle-left hamburger-exit" onClick={props.toggleExpandedProfile}></i>
            <div className="expanded-banner">
              {props.userInfo.avatar_url === "" ||
              props.userInfo.avatar_url ===
                "https://res.cloudinary.com/kultured-dev/image/upload/v1625617920/defaultAvatar_aeibqq.png" ? (
                <div className="dynamic-avatar-border">
                  <div className="dynamic-avatar-text-med">
                    {props.userInfo.username
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
                  src={props.userInfo.avatar_url}
                  alt={`${props.userInfo.username}avatar`}
                />
              )}
              <RankTile user={props.userInfo} isSmall={false}></RankTile>
              <div className="expanded-basic-info">
                <div className="expanded-username">{props.userInfo.username}</div>
                <div className="expanded-basic-text">{props.userInfo.about}</div>
              </div>
            </div>
            <div className="expanded-gradient-bar"></div>
            {/* Connect Section */}
            {props.showConnectForm ? (
              <div className="expanded-connect-box">
                <div className="expanded-core-info-title">connect</div>
                {props.isProfileComplete ? (
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
                    **complete{" "}
                    <span
                      onClick={() => {
                        goToGameProfile();
                      }}
                      className="link-text"
                    >
                      {" "}
                      profile
                    </span>{" "}
                    before sending requests**
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
            {props.showConnectForm ? <div className="expanded-gradient-bar"></div> : <></>}
            {/* Core Info Section */}
            <div className="expanded-core-info">
              <div className="expanded-core-info-title">general info</div>
              <div className="expanded-core-info-field">
                <label>last seen</label>
                <div>{lastSeen}</div>
              </div>
              <div className="expanded-core-info-field">
                <label>language</label>
                <div>{props.userInfo.languages}</div>
              </div>
              <div className="expanded-core-info-field">
                <label>age</label>
                <div>{props.userInfo.age}</div>
              </div>
              <div className="expanded-core-info-field">
                <label>gender</label>
                <div>
                  {props.userInfo.gender === 1 ? "male" : props.userInfo.gender === 2 ? "female" : "non-binary"}
                </div>
              </div>
              <div className="expanded-core-info-field">
                <label>region</label>
                <div>
                  {props.userInfo.region_abbreviation ? props.userInfo.region_abbreviation : props.userInfo.region}
                </div>
              </div>
            </div>
            <div className="expanded-gradient-bar"></div>
            {/* Rust Info Section */}
            {(props.game === "all" || props.game === "rust") && publishData.rust_status ? (
              <div className="expanded-core-info">
                <div className="expanded-core-info-title">rust info</div>
                <div className="expanded-core-info-field">
                  <label>hours</label>
                  <div>{props.userInfo.rust_hours}</div>
                </div>
                <div className="expanded-core-info-field">
                  <label>server type</label>
                  <div>{props.userInfo.server_type_id === 1 ? "vanilla" : `${props.userInfo.server_type_id}x`}</div>
                </div>
                <div className="expanded-core-info-field">
                  <label>wipe day pref</label>
                  <div>{props.userInfo.wipe_day_preference}</div>
                </div>
                <div className="expanded-core-info-field">
                  <label>weekdays</label>
                  <div>{props.userInfo.rust_weekdays}</div>
                </div>
                <div className="expanded-core-info-field">
                  <label>weekends</label>
                  <div>{props.userInfo.rust_weekends}</div>
                </div>
              </div>
            ) : (
              <></>
            )}
            {(props.game === "all" || props.game === "rust") && publishData.rust_status ? (
              <div className="expanded-gradient-bar"></div>
            ) : (
              <></>
            )}
            {/* Rocket League Info Section */}
            {(props.game === "all" || props.game === "rocket-league") && publishData.rocket_league_status ? (
              <div className="expanded-core-info">
                <div className="expanded-core-info-title">rocket league info</div>
                <div className="expanded-core-info-field">
                  <label>playlist</label>
                  <div className="details-rocket-league-playlist">
                    {rocketLeaguePlaylists[props.userInfo.rocket_league_playlist]}
                  </div>
                </div>
                <div className="expanded-core-info-field">
                  <label>rank</label>
                  <div>{rocketLeagueRanks[props.userInfo.rocket_league_rank]}</div>
                </div>
                <div className="expanded-core-info-field">
                  <label>hours</label>
                  <div>{props.userInfo.rocket_league_hours}</div>
                </div>
                <div className="expanded-core-info-field">
                  <label>weekdays</label>
                  <div>{props.userInfo.rocket_league_weekdays}</div>
                </div>
                <div className="expanded-core-info-field">
                  <label>weekends</label>
                  <div>{props.userInfo.rocket_league_weekends}</div>
                </div>
              </div>
            ) : (
              <></>
            )}
            {(props.game === "all" || props.game === "rocket-league") && publishData.rocket_league_status ? (
              <div className="expanded-gradient-bar"></div>
            ) : (
              <></>
            )}
            {/* Battle Bit Info Section */}
            {(props.game === "all" || props.game === "battle-bit") && publishData.battle_bit_status ? (
              <div className="expanded-core-info">
                <div className="expanded-core-info-title">battlebit info</div>
                <div className="expanded-core-info-field">
                  <label>class</label>
                  <div className="details-rocket-league-playlist">
                    {battleBitClasses[props.userInfo.battle_bit_class]}
                  </div>
                </div>
                <div className="expanded-core-info-field">
                  <label>playlist</label>
                  <div className="details-rocket-league-playlist">
                    {battleBitPlaylists[props.userInfo.battle_bit_playlist]}
                  </div>
                </div>
                <div className="expanded-core-info-field">
                  <label>rank</label>
                  <div>{props.userInfo.battle_bit_rank}</div>
                </div>
                <div className="expanded-core-info-field">
                  <label>hours</label>
                  <div>{props.userInfo.battle_bit_hours}</div>
                </div>
                <div className="expanded-core-info-field">
                  <label>weekdays</label>
                  <div>{props.userInfo.battle_bit_weekdays}</div>
                </div>
                <div className="expanded-core-info-field">
                  <label>weekends</label>
                  <div>{props.userInfo.battle_bit_weekends}</div>
                </div>
              </div>
            ) : (
              <></>
            )}
            {(props.game === "all" || props.game === "battle-bit") && publishData.rocket_league_status ? (
              <div className="expanded-gradient-bar"></div>
            ) : (
              <></>
            )}
            {/* ***NEW GAME EDIT */}
            {/* Social Section */}
            <div className="expanded-core-info">
              <div className="expanded-core-info-title">social</div>
              <div className="expanded-social-container">
                <div className="platform-image-container">
                  {props.userInfo.preferred_platform === 1 ? (
                    <img
                      className="expanded-platform-image"
                      src="https://res.cloudinary.com/kultured-dev/image/upload/v1685814273/logoWhiteSmall_i1lvgo.png"
                      alt={`${props.userInfo.username} gangs`}
                    />
                  ) : (
                    <></>
                  )}
                  {props.userInfo.preferred_platform === 2 ? (
                    <img
                      className="expanded-platform-image"
                      src="https://res.cloudinary.com/kultured-dev/image/upload/v1685814624/psn-logo-small_nbgzwa.png"
                      alt={`${props.userInfo.username} psn`}
                    />
                  ) : (
                    <></>
                  )}
                  {props.userInfo.preferred_platform === 3 ? (
                    <img
                      className="expanded-platform-image"
                      src="https://res.cloudinary.com/kultured-dev/image/upload/v1685814627/xbox-logo-small_e8sqjw.png"
                      alt={`${props.userInfo.username} xbox`}
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
            {props.isConnected ? (
              <div className="expanded-core-info">
                <div className="expanded-core-info-title">endorse</div>
                <div className="expanded-endorsement-container">{endorsementInput}</div>
              </div>
            ) : (
              <></>
            )}

            {/* Add margin to bottom of profile for mobile scrolling */}
            <div className="bottom-of-profile"></div>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("drawer-hook")!
  );
};

export default ExpandedProfile;
