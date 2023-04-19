import { avatarFormIn, avatarFormOut } from "../../utils/animations";
import "./gangsMgmt.scss";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createNewGang,
  getGangActivity,
  updateGangField,
  getGangRequests,
  acceptGangConnectionRequest,
} from "../../utils/rest";
import { Toast } from "primereact/toast";
import ReactTooltip from "react-tooltip";
import BannerAlt from "../nav/banner-alt";
import SelectComponent from "../myProfile/selectComponent";
import { roleOptions } from "../../utils/selectOptions";
import ConnectionTile from "../tiles/connectionTile";
import Confetti from "react-confetti";

type Props = {
  gangId: number;
};

export default function GangsMgmt(props: Props) {
  const locationPath: string = useLocation().pathname;
  const hiddenFileInput: any = React.useRef(null);
  const userState = useSelector((state: RootState) => state.user.user);
  const toast: any = useRef({ current: "" });
  const navigate = useNavigate();

  const [isConfetti, setIsConfetti] = useState<any>(false);
  // Requests Mgmt
  const [requests, setrequests] = useState<any>([]);
  const [requestTiles, setrequestTiles] = useState<any>();
  // Basic Editing
  const [loadedGangInfo, setloadedGangInfo] = useState<any>({});
  const [hasCompletedForm, sethasCompletedForm] = useState<boolean>(false);
  const [hasUnsavedChanges, sethasUnsavedChanges] = useState<boolean>(false);
  const [isUploadFormShown, setisUploadFormShown] = useState<boolean>(false);
  const [photoFile, setPhotoFile] = useState<File>({ name: "" } as File);
  const [gangAvatarUrl, setgangAvatarUrl] = useState<string>("");
  const [nameText, setnameText] = useState<string>("");
  const [aboutText, setaboutText] = useState<string>("");
  const [chatPlatform, setchatPlatform] = useState<number>(0);
  const [game, setgame] = useState<number>(0);
  const [isPublic, setisPublic] = useState<boolean>(true);
  //Channel Editing
  const [channelTiles, setchannelTiles] = useState<any>();
  const [temporaryChannelNames, settemporaryChannelNames] = useState<any>({});
  //Member Editing
  const [memberTiles, setmemberTiles] = useState<any>();
  const [temporaryRoles, settemporaryRoles] = useState<any>({});
  const rolesRef: any = useRef([{ current: "" }]);

  useEffect(() => {
    if (locationPath[13] && parseInt(locationPath[13]) > 0) {
      //Get gang info to manage the gang
      loadGangInfos(parseInt(locationPath.slice(13, 55)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    checkIfFormComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game, chatPlatform]);

  //Used to render initial tiles, unfiltered
  useEffect(() => {
    createChannelTiles();
    createMemberTiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedGangInfo]);

  useEffect(() => {
    createRequestTiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requests]);

  // START Loading UI
  const loadGangInfos = async (id: number) => {
    const gangResult = await getGangActivity(id, userState.id, "");

    const formattedMembers: any = [];
    gangResult.basicInfo.members.forEach((member) => {
      formattedMembers.push({ label: "test", value: member.id });
    });
    settemporaryRoles(formattedMembers);
    console.log("gang info: ", gangResult);
    if (gangResult.role.role_id === 1) {
      setloadedGangInfo(gangResult);
      setnameText(gangResult.basicInfo.name);
      setaboutText(gangResult.basicInfo.about);
      setgangAvatarUrl(gangResult.basicInfo.avatar_url);
      setchatPlatform(gangResult.basicInfo.chat_platform_id);
      setgame(gangResult.basicInfo.game_platform_id);
      setisPublic(gangResult.basicInfo.is_public);
    } else {
      //TODO prevent non-owner from managing gang
    }
    loadGangRequests(id);
  };

  const loadGangRequests = async (id: number) => {
    const requestsResult = await getGangRequests(id, false, "");
    setrequests(requestsResult);
  };
  const createChannelTiles = () => {
    setchannelTiles(
      loadedGangInfo.channels?.map((tile: any) => (
        <div key={tile.id} className="channels-mgmt-tile">
          <input
            onChange={(event) => {
              updateChannelNameText(tile, event.target.value);
            }}
            value={temporaryChannelNames[tile.id]}
            type="text"
            className="channels-mgmt-input-box"
            placeholder={tile.name}
          ></input>
          <div className="channels-mgmt-naming">
            <button
              onClick={() => {
                saveNewChannelName(tile.id, "");
              }}
            >
              save
            </button>
            <button
              onClick={() => {
                removeChannel(tile);
              }}
            >
              <i className="pi pi-trash" />
            </button>
          </div>
        </div>
      ))
    );
  };
  const createMemberTiles = () => {
    setmemberTiles(
      loadedGangInfo.basicInfo?.members?.map((tile: any) => (
        <div key={tile.id} className="channels-mgmt-tile">
          <div className="channels-mgmt-naming">
            {tile.username}
            <SelectComponent
              publicMethods={rolesRef}
              title="role"
              options={roleOptions}
              multi={false}
              setSelection={changeRole}
              selection={temporaryRoles.find(({ value }) => value === tile.role_id)}
            ></SelectComponent>
            <button
              onClick={() => {
                removeChannel(tile);
              }}
            >
              kick
            </button>
          </div>
        </div>
      ))
    );
  };
  const createRequestTiles = () => {
    console.log("reqests? ", requests);
    //Make property for game image
    let copyOfRequests = requests;
    copyOfRequests.forEach((request) => {
      request.platform = loadedGangInfo.basicInfo.game_platform_id;
    });
    console.log("copy of reqs", copyOfRequests);
    setrequestTiles(
      copyOfRequests.map((tile: any) => (
        <ConnectionTile
          key={tile.id}
          {...tile}
          type={3}
          callAcceptRequest={(requestId: number) => {
            acceptRequest(tile.id);
          }}
        ></ConnectionTile>
      ))
    );
  };
  //END Loading UI

  //START Gang Gen Editing
  const checkIfFormComplete = () => {
    if (nameText && nameText.length >= 3 && aboutText && aboutText.length >= 3 && chatPlatform > 0 && game > 0) {
      sethasCompletedForm(true);
    } else {
      sethasCompletedForm(false);
    }
    console.log("changing platform: ", chatPlatform, "  ", game, nameText, aboutText);
    return;
  };
  const changeSelectedPlatform = (selection: number) => {
    if (chatPlatform !== selection) sethasUnsavedChanges(true);
    setchatPlatform(selection);
    return;
  };
  const changeSelectedGame = (selection: number) => {
    if (game !== selection) sethasUnsavedChanges(true);
    setgame(selection);
    return;
  };
  //END Gang Gen Editing

  //START AVATAR EDIT LOGIC
  const chooseFileHandler = (event: any) => {
    if (hiddenFileInput.current !== null) {
      hiddenFileInput.current!.click();
    }
    return;
  };
  const handleFileUpload = (event: any) => {
    setPhotoFile(event.target.files[0]);
    return;
  };
  const closeAvatar = () => {
    avatarFormOut();
    setisUploadFormShown(false);
    return;
  };
  const startEditingAvatar = async (field: string) => {
    if (userState.id === 0) alert("You must be logged in to edit this field");
    setisUploadFormShown(true);
    avatarFormIn();
    return;
  };
  //END AVATAR EDIT LOGIC

  //START NON-MODAL SAVE LOGIC
  const saveChanges = async () => {
    if (loadedGangInfo.basicInfo.name !== nameText) {
      await updateGangField(loadedGangInfo.basicInfo.id, "name", nameText);
    }
    if (loadedGangInfo.basicInfo.about !== aboutText) {
      await updateGangField(loadedGangInfo.basicInfo.id, "about", aboutText);
    }
    if (loadedGangInfo.basicInfo.chat_platform_id !== chatPlatform) {
      await updateGangField(loadedGangInfo.basicInfo.id, "chat_platform_id", chatPlatform);
    }
    if (loadedGangInfo.basicInfo.game_platform_id !== game) {
      await updateGangField(loadedGangInfo.basicInfo.id, "game_platform_id", game);
    }
    if (loadedGangInfo.basicInfo.is_public !== isPublic) {
      await updateGangField(loadedGangInfo.basicInfo.id, "is_public", isPublic);
    }
    loadGangInfos(loadedGangInfo.basicInfo.id);
    sethasUnsavedChanges(false);
    toast.current.clear();
    toast.current.show({
      severity: "success",
      summary: "changes saved!",
      detail: ``,
      sticky: false,
    });
  };
  const tryCreateGang = async () => {
    const createResult = await createNewGang(userState.id, {
      name: nameText,
      avatar_url: gangAvatarUrl,
      about: aboutText,
      chat_platform_id: chatPlatform,
      game_platform_id: game,
      is_public: isPublic,
    });
    if (createResult) {
      navigate(`/dashboard`);
    }
  };
  //END NON-MODAL SAVE LOGIC

  //Start Channel Edit LOGIC
  const removeChannel = (tile) => {
    toast.current.clear();
    toast.current.show({
      severity: "info",
      summary: "feature coming soon!",
      detail: ``,
      sticky: false,
    });
  };
  const updateChannelNameText = (tile, text) => {
    let copyOfNames = temporaryChannelNames;
    copyOfNames[tile.id] = text;
    settemporaryChannelNames(copyOfNames);
  };

  const saveNewChannelName = (id, name) => {
    toast.current.clear();
    toast.current.show({
      severity: "info",
      summary: "feature coming soon!",
      detail: ``,
      sticky: false,
    });
  };
  //END Channel Edit LOGIC

  //START Member Edit Logic
  const changeRole = (selection: any) => {
    // if (!language || region !== selection.value) setHasUnsavedChanges(true);
    console.log("selection: ", selection);
    const copyOfTemp = temporaryRoles;
    copyOfTemp[selection.id] = selection;
    settemporaryRoles(copyOfTemp);
    return;
  };
  const acceptRequest = async (requestId: number) => {
    const acceptResult = await acceptGangConnectionRequest(loadedGangInfo.basicInfo.id, requestId, "");
    console.log("accept result? ", acceptResult);
    const blastConfetti = async () => {
      setTimeout(function () {
        setIsConfetti(false);
      }, 4000);
    };
    if (acceptResult && acceptResult.length) {
      setIsConfetti(true);
      await blastConfetti();
      loadGangRequests(parseInt(locationPath.slice(13, 55)));
    }
  };
  //END Member Edit Logic

  return (
    <div>
      <Toast ref={toast} />
      {/* <BannerTitle
        title={locationPath === "/create-gang" ? "create gang" : "gang management"}
        imageLink={""}
      ></BannerTitle> */}
      {/* Show stuff only if creating gang, or after existing gang info is loaded */}
      {locationPath === "/create-gang" || loadedGangInfo.basicInfo?.id ? (
        <BannerAlt
          title={locationPath === "/create-gang" ? "create gang" : "gang management"}
          buttonText={locationPath === "/create-gang" ? "cancel" : "dashboard"}
          buttonLink={locationPath === "/create-gang" ? "/dashboard" : `/gang/${loadedGangInfo.basicInfo?.id}`}
        ></BannerAlt>
      ) : (
        <></>
      )}
      {locationPath !== "/create-gang" ? (
        <div className="gang-mgmt-master">
          <div className="gang-mgmt-container">
            <div className="gang-mgmt-title">
              based on your role of
              <span className="link-text"> {loadedGangInfo.role?.role_name}</span> you can...
            </div>
            <div className="gang-mgmt-perms-box">
              <div className="gang-mgmt-perms-col">
                <div>
                  {loadedGangInfo.role?.role_id === 1 ? (
                    <i className="pi pi-check"></i>
                  ) : (
                    <i className="pi pi-times"></i>
                  )}
                  manage basics
                </div>
                <div>
                  {loadedGangInfo.role?.role_id === 1 ? (
                    <i className="pi pi-check"></i>
                  ) : (
                    <i className="pi pi-times"></i>
                  )}
                  manage members
                </div>
                <div>
                  {[1, 2].includes(loadedGangInfo.role?.role_id) ? (
                    <i className="pi pi-check"></i>
                  ) : (
                    <i className="pi pi-times"></i>
                  )}
                  manage channels
                </div>
              </div>
              <div className="gang-mgmt-perms-col">
                <div>
                  {loadedGangInfo.role?.role_id === 1 ? (
                    <i className="pi pi-check"></i>
                  ) : (
                    <i className="pi pi-times"></i>
                  )}
                  manage roles
                </div>
                <div>
                  {[1, 2, 3].includes(loadedGangInfo.role?.role_id) ? (
                    <i className="pi pi-check"></i>
                  ) : (
                    <i className="pi pi-times"></i>
                  )}
                  manage requests
                </div>
                <div>
                  {[1, 2, 3, 4].includes(loadedGangInfo.role?.role_id) ? (
                    <i className="pi pi-check"></i>
                  ) : (
                    <i className="pi pi-times"></i>
                  )}
                  manage messaegs
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      {locationPath !== "/create-gang" ? (
        <div className="gang-mgmt-master">
          <div className="gang-mgmt-container">
            <div className="gang-mgmt-title">manage requests to join</div>
            {requestTiles}
          </div>
        </div>
      ) : (
        <></>
      )}
      {/* Show stuff only if creating gang, or after existing gang info is loaded */}
      {locationPath === "/create-gang" || loadedGangInfo.basicInfo?.id ? (
        <div className="gang-mgmt-master">
          <div className="gang-mgmt-container">
            <div className="gang-mgmt-title">manage basics</div>
            <div className="gradient-bar"></div>
            {/* AVATAR PHTO */}
            <div className="gang-container-top">
              {!nameText || nameText === "/assets/avatarIcon.png" ? (
                <div
                  className="dynamic-avatar-bg"
                  onClick={() => startEditingAvatar("avatar_url")}
                  data-tip
                  data-for="avatarTip"
                >
                  <div className="dynamic-avatar-text">{"gg"}</div>
                </div>
              ) : (
                <img
                  className="gang-avatar"
                  src={gangAvatarUrl}
                  alt="my-avatar"
                  onClick={() => startEditingAvatar("avatar_url")}
                  data-tip
                  data-for="avatarTip"
                ></img>
              )}
            </div>
            <div className="gradient-bar"></div>
            {/* DISPLAY NAME */}
            <div className="gang-container">
              <div className="gang-about-text" data-tip data-for="gang-name-tooltip">
                gang name
              </div>
              <input
                onChange={(event) => {
                  setnameText(event.target.value);
                  sethasUnsavedChanges(true);
                  checkIfFormComplete();
                }}
                value={nameText ? nameText : ""}
                type="text"
                className="input-box"
                placeholder={locationPath == "/create-gang" ? "name..." : "name..."}
              ></input>
            </div>
            <div className="gradient-bar"></div>
            {/* ABOUT */}
            <div className="gang-container">
              <div className="gang-about-text" data-tip data-for="gang-name-tooltip">
                about
              </div>
              <input
                onChange={(event) => {
                  setaboutText(event.target.value);
                  sethasUnsavedChanges(true);
                  checkIfFormComplete();
                }}
                value={aboutText ? aboutText : ""}
                type="text"
                className="input-box"
                placeholder={locationPath == "create-gang" ? "about..." : "about..."}
              ></input>
            </div>
            <div className="gradient-bar"></div>
            {/* END ABOUT */}
            {/* CHAT PLATFROM */}
            <div className="gang-container">
              <div className="gang-about-text" data-tip data-for="must-select-tooltip">
                chat platform
              </div>
              <div className="gender-container">
                <div
                  className={`gender-box ${chatPlatform === 1 ? "box-selected" : ""}`}
                  onClick={() => {
                    changeSelectedPlatform(1);
                  }}
                >
                  <img className="gender-icon" src={"/assets/logoWhiteSmall.png"} alt="gangs selector"></img>
                </div>
                <div
                  className={`gender-box ${chatPlatform === 2 ? "box-selected" : ""}`}
                  onClick={() => {
                    changeSelectedPlatform(2);
                  }}
                >
                  <img className="gender-icon" src={"/assets/psn-logo-small.png"} alt="psn selector"></img>
                </div>
                <div
                  className={`gender-box ${chatPlatform === 3 ? "box-selected" : ""}`}
                  onClick={() => {
                    changeSelectedPlatform(3);
                  }}
                >
                  <img className="gender-icon" src={"/assets/xbox-logo-small.png"} alt="xbox selector"></img>
                </div>
              </div>
            </div>
            <div className="gradient-bar"></div>
            {/* END CHAT PLATFROM */}
            {/* GAME PLATFROM */}
            <div className="gang-container">
              <div className="gang-about-text" data-tip data-for="must-select-tooltip">
                primary game
              </div>
              <div className="gender-container">
                <div
                  className={`gender-box ${game === 1 ? "box-selected" : ""}`}
                  onClick={() => {
                    changeSelectedGame(1);
                  }}
                >
                  <img
                    className="gender-icon"
                    src={"https://res.cloudinary.com/kultured-dev/image/upload/v1663786762/rust-logo-small_uarsze.png"}
                    alt="rust selector"
                  ></img>
                </div>
                <div
                  className={`gender-box ${game === 2 ? "box-selected" : ""}`}
                  onClick={() => {
                    changeSelectedGame(2);
                  }}
                >
                  <img
                    className="gender-icon"
                    src={
                      "https://res.cloudinary.com/kultured-dev/image/upload/v1665620519/RocketLeagueResized_loqz1h.png"
                    }
                    alt="rocket league selector"
                  ></img>
                </div>
              </div>
            </div>
            <div className="gradient-bar"></div>
            {/* END GAME PLATFROM */}
            {/* IS PUBLIC */}
            <div className="gang-container">
              <div className="gang-about-text">is public</div>
              <input
                checked={isPublic}
                onChange={() => {
                  setisPublic(!isPublic);
                  sethasUnsavedChanges(true);
                }}
                className="react-switch-checkbox"
                id={`react-switch-emails-marketing`}
                type="checkbox"
              />
              <label className="react-switch-label" htmlFor={`react-switch-emails-marketing`}>
                <span className={`react-switch-button`} />
              </label>
            </div>
            <div className="gradient-bar"></div>
            {/* END IS PUBLIC */}
            {/* START SAVE BOX */}
            <div className="save-box">
              <button
                className="save-button"
                disabled={locationPath === "/create-gang" ? !hasCompletedForm : !hasUnsavedChanges}
                onClick={() => {
                  if (locationPath === "/create-gang") {
                    tryCreateGang();
                  } else {
                    saveChanges();
                  }
                }}
              >
                {locationPath === "/create-gang" ? "create" : "save"}
              </button>
            </div>
            {/* END SAVE BOX */}
          </div>
        </div>
      ) : (
        <></>
      )}

      {/* Show stuff only if creating gang, or after existing gang info is loaded */}
      {locationPath !== "/create-gang" && loadedGangInfo.basicInfo?.id && loadedGangInfo.role?.role_id === 1 ? (
        <div className="gang-mgmt-master">
          <div className="channels-mgmt-container">
            <div className="channels-mgmt-title">manage channels</div>
            <div className="gradient-bar"></div>
            {channelTiles}
          </div>
        </div>
      ) : (
        <></>
      )}

      {/* Show stuff only if creating gang, or after existing gang info is loaded */}
      {locationPath !== "/create-gang" && loadedGangInfo.basicInfo?.id && loadedGangInfo.role?.role_id === 1 ? (
        <div className="gang-mgmt-master">
          <div className="member-mgmt-container">
            <div className="member-mgmt-title">manage members</div>
            <div className="gradient-bar"></div>
            {memberTiles}
          </div>
        </div>
      ) : (
        <></>
      )}
      <ReactTooltip id="gang-name-tooltip" place="right" effect="solid">
        must be 3 or more characters
      </ReactTooltip>
      <ReactTooltip id="must-select-tooltip" place="right" effect="solid">
        must make a selection
      </ReactTooltip>
    </div>
  );
}
