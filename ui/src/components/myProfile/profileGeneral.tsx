/* eslint-disable */
import "./profileGeneral.scss";
import React from "react";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { updateUserAvatarUrl, updateUserThunk } from "../../store/userSlice";
import { avatarFormIn, avatarFormOut } from "../../utils/animations";
import { uploadAvatarCloud, updateUserField, updateGeneralInfoField } from "../../utils/rest";
import SelectComponent from "./selectComponent";
import { languageOptions, regionOptions } from "../../utils/selectOptions";
import ExpandedProfile from "../modal/expandedProfileComponent";
import { Toast } from "primereact/toast";
import ReactTooltip from "react-tooltip";
import GameTile from "../tiles/gameTile";

type Props = {
  changeBanner: any;
};

export default function ProfileGeneral(props: Props) {
  const dispatch = useDispatch();
  const hiddenFileInput: any = React.useRef(null);
  const userData = useSelector((state: RootState) => state.user.user);

  const [isUploadFormShown, setisUploadFormShown] = useState<boolean>(false);
  //View Profile
  const [expandedProfileVis, setExpandedProfileVis] = useState<boolean>(false);
  //Profile Fields Form Tracking
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  //END WidgetData
  const [photoFile, setPhotoFile] = useState<File>({ name: "" } as File);
  const [aboutText, setAboutText] = useState<string>("");
  const [ageText, setAgeText] = useState<number>(0);
  const [gender, setGender] = useState<number>(0);
  const [region, setRegion] = useState<any>({ label: "region" });
  const [language, setlanguage] = useState<any>({ label: "language" });
  const [platform, setPlatform] = useState<number>(0);
  const [discord, setDiscord] = useState<string>("");
  const [psn, setPSN] = useState<string>("");
  const [xbox, setXbox] = useState<string>("");
  //End Profile Fields Form Tracking

  const toast: any = useRef({ current: "" });
  const regionRef: any = useRef({ current: "" });
  const languageRef: any = useRef({ current: "" });

  useEffect(() => {
    loadSavedInfo();
    props.changeBanner("https://res.cloudinary.com/kultured-dev/image/upload/v1663566897/rust-tile-image_uaygce.png");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Setup hook for when url changes to track what banner image should be
  const pathname = window.location.pathname;
  useEffect(() => {
    //Gen profile needs this block to manually set image for the gen profile page
    //Game profiles house seperate logic to change banner
    props.changeBanner("https://res.cloudinary.com/kultured-dev/image/upload/v1663566897/rust-tile-image_uaygce.png");
  }, [pathname]);

  useEffect(() => {
    languageRef.current.detectChangeFromParent(language);
  }, [language]);

  useEffect(() => {
    regionRef.current.detectChangeFromParent(region);
  }, [region]);

  useEffect(() => {
    //Having this logic in the user state use effect means it will await the dispatch to get the latest info. It is otherwise hard to await the dispatch
    if (userData.email && userData.email !== "") {
      setAboutText(userData.about);
      setAgeText(userData.age);
      setGender(userData.gender);
      setlanguage(
        userData.languages === ""
          ? { label: "language" }
          : languageOptions.find(({ label }) => label === userData.languages)
      );
      setRegion(
        userData.region_name === ""
          ? { label: "region" }
          : regionOptions.find(({ label }) => label === userData.region_name)
      );
      setPlatform(userData.preferred_platform);
      setDiscord(!userData.discord ? "" : userData.discord);
      setPSN(!userData.psn ? " " : userData.psn);
      setXbox(!userData.xbox ? "" : userData.xbox);
    }
  }, [userData]);

  // BEGIN Logic to load saved values to ui
  const loadSavedInfo = () => {
    dispatch(updateUserThunk(userData.id));
  };
  // End Logic to load saved values to ui

  // BEGIN Toggle Profile Modal
  const toggleExpandedProfile = () => {
    setExpandedProfileVis(!expandedProfileVis);
  };
  // END Toggle Profile Modal

  // BEGIN AVATAR LOGIC
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
  const startEditingAvatar = async () => {
    if (!userData.id || userData.id === 0) alert("You must be logged in to edit this field");
    setisUploadFormShown(true);
    avatarFormIn();
    return;
  };
  // END AVATAR LOGIC

  const changeSelectedGender = (selection: number) => {
    if (gender !== selection) setHasUnsavedChanges(true);
    setGender(selection);
    return;
  };

  const changeRegion = (selection: any) => {
    if (!language || region !== selection.value) setHasUnsavedChanges(true);
    setRegion(selection);
    return;
  };

  const changeLanguage = (selection: any) => {
    if (!language || language.value !== selection.value) setHasUnsavedChanges(true);
    setlanguage(selection);
    return;
  };

  const changeSelectedPlatform = (selection: number) => {
    if (platform !== selection) setHasUnsavedChanges(true);
    setPlatform(selection);
    return;
  };

  //MODAL SAVE LOGIC
  const changeSubmitHandler = async (e: any) => {
    avatarFormOut();
    setisUploadFormShown(false);
    const avatar = document.querySelector(".avatar-input");
    const url: string | undefined = await uploadAvatarCloud(avatar);
    dispatch(updateUserAvatarUrl(url));
    updateUserField(userData.id, "avatar_url", url!);
    setPhotoFile({ name: "" } as File);
  };

  //NON-MODAL SAVE LOGIC
  const saveChanges = async () => {
    if (userData.about !== aboutText) await updateGeneralInfoField(userData.id, "about", aboutText);
    if (parseInt(userData.age) !== ageText) await updateGeneralInfoField(userData.id, "age", ageText);
    if (userData.gender !== gender) await updateGeneralInfoField(userData.id, "gender", gender);
    if (region && userData.region !== region.value) await updateGeneralInfoField(userData.id, "region", region.value);
    if (language && userData.language !== language.value) {
      await updateGeneralInfoField(userData.id, "languages", language.value);
    }
    if (userData.preferred_platform !== platform)
      await updateGeneralInfoField(userData.id, "preferred_platform", platform);
    if (userData.discord !== discord) await updateGeneralInfoField(userData.id, "discord", discord);
    if (userData.psn !== psn) await updateGeneralInfoField(userData.id, "psn", psn);
    if (userData.xbox !== xbox) await updateGeneralInfoField(userData.id, "xbox", xbox);
    // After all data is comitted to db, get fresh copy of user object to update state
    dispatch(updateUserThunk(userData.id));
    setHasUnsavedChanges(false);
    toast.current.clear();
    toast.current.show({
      severity: "success",
      summary: "changes saved!",
      detail: ``,
      sticky: false,
    });
  };

  const conditionalClass = isUploadFormShown ? "conditionalZ2" : "conditionalZ1";
  return (
    <div className="profile-master">
      <Toast ref={toast} />
      {/* Conditionally render hamburger modal */}
      {expandedProfileVis ? (
        <ExpandedProfile
          toggleExpandedProfile={toggleExpandedProfile}
          userInfo={userData}
          refreshTiles={() => {}}
          showConnectForm={false}
          isProfileComplete={true}
          isConnected={false}
          game={"all"}
        />
      ) : (
        <></>
      )}

      {/* EDIT PHTO MODAL */}
      <div className={`edit-profile-form ${conditionalClass}`}>
        <p>{"upload avatar"}</p>
        {
          <div className="avatar-upload-form">
            <input
              className="avatar-input"
              type="file"
              ref={hiddenFileInput}
              style={{ display: "none" }}
              onChange={handleFileUpload}
            ></input>
            <button onClick={chooseFileHandler} className="upload-form-btns">
              choose photo
            </button>
            <div className="photo-label">{photoFile ? photoFile.name : ""}</div>
          </div>
        }
        <div className="upload-form-btns">
          <button onClick={changeSubmitHandler}>save</button>
          <button onClick={closeAvatar}>close</button>
        </div>
      </div>
      {/* GAME PROFILE LINKS */}
      <div className="game-profile-container">
        <GameTile
          imageLink={"https://res.cloudinary.com/kultured-dev/image/upload/v1663566897/rust-tile-image_uaygce.png"}
          routerLink={"/rust-profile"}
          title={"rust profile"}
          changeBanner={props.changeBanner}
        ></GameTile>
        <GameTile
          imageLink={"https://res.cloudinary.com/kultured-dev/image/upload/v1665601538/rocket-league_fncx5c.jpg"}
          routerLink={"/rocket-league-profile"}
          title={"rocket league profile"}
          changeBanner={props.changeBanner}
        ></GameTile>
      </div>
      <div className="gradient-bar"></div>
      {/* AVATAR PHTO */}
      <div className="banner-container-top">
        {!userData.avatar_url ||
        userData.avatar_url ===
          "https://res.cloudinary.com/kultured-dev/image/upload/v1625617920/defaultAvatar_aeibqq.png" ? (
          <div className="dynamic-avatar-bg" onClick={() => startEditingAvatar()} data-tip data-for="avatarTip">
            <div className="dynamic-avatar-text">
              {userData.username
                ? userData.username
                    .split(" ")
                    .map((word: string[]) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toLowerCase()
                : "gg"}
            </div>
          </div>
        ) : (
          <img
            className="prof-banner-avatar"
            src={userData.avatar_url}
            alt="my-avatar"
            onClick={() => startEditingAvatar()}
            data-tip
            data-for="avatarTip"
          ></img>
        )}
        <button
          className="expand-button"
          onClick={() => {
            toggleExpandedProfile();
          }}
        >
          <i className="pi pi-plus" />
          &nbsp; view my profile
        </button>
      </div>
      <div className="gradient-bar"></div>
      {/* DISPLAY NAME */}
      <div className="banner-container-username">
        <div className="my-profile-text">{userData.username ? userData.username : "No user name..."}</div>
      </div>
      <div className="gradient-bar"></div>
      {/* ABOUT */}
      <div className="banner-container">
        <div className="prof-banner-detail-text" data-tip data-for="aboutMeTip">
          about
        </div>
        <input
          onChange={(event) => {
            setAboutText(event.target.value);
            setHasUnsavedChanges(true);
          }}
          value={aboutText ? aboutText : ""}
          type="text"
          className="input-box"
          placeholder={userData.about && userData.about !== null && userData.about !== "" ? userData.about : "blank"}
        ></input>
      </div>
      <div className="gradient-bar"></div>
      {/* END ABOUT */}
      {/* AGE */}
      <div className="banner-container">
        <div className="prof-banner-detail-text">age</div>
        <input
          onChange={(event) => {
            setAgeText(parseInt(event.target.value));
            setHasUnsavedChanges(true);
          }}
          value={ageText ? ageText : ""}
          type="number"
          className="input-box"
          placeholder={userData.age && userData.age !== null && userData.age !== "" ? userData.age : "blank"}
        ></input>
      </div>
      <div className="gradient-bar"></div>
      {/* END AGE */}
      {/* GENDER */}
      <div className="banner-container">
        <div className="prof-banner-detail-text">gender</div>
        <div className="banner-change-box"></div>
        <div className="gender-container">
          <div
            className={`gender-box ${gender === 1 ? "box-selected" : ""}`}
            onClick={() => {
              changeSelectedGender(1);
            }}
          >
            <img
              className="gender-icon"
              src={"https://res.cloudinary.com/kultured-dev/image/upload/v1685814971/gender-icon-male_l71kiy.png"}
              alt="male gender"
            ></img>
            <div className="box-text">m</div>
          </div>
          <div
            className={`gender-box ${gender === 2 ? "box-selected" : ""}`}
            onClick={() => {
              changeSelectedGender(2);
            }}
          >
            <img
              className="gender-icon"
              src={"https://res.cloudinary.com/kultured-dev/image/upload/v1685814973/gender-icon-female_ozujm1.png"}
              alt="female gender"
            ></img>
            <div className="box-text">f</div>
          </div>
          <div
            className={`gender-box ${gender === 3 ? "box-selected" : ""}`}
            onClick={() => {
              changeSelectedGender(3);
            }}
          >
            <img
              className="gender-icon"
              src={"https://res.cloudinary.com/kultured-dev/image/upload/v1685814975/gender-icon-non-binary_hepali.png"}
              alt="non-binary gender"
            ></img>
            <div className="box-text">nb</div>
          </div>
        </div>
      </div>
      <div className="gradient-bar"></div>
      {/* END GENDER */}
      {/* REGION */}
      <div className="banner-container">
        <div className="prof-banner-detail-text">region</div>
        <div className="select-container">
          <SelectComponent
            publicMethods={regionRef}
            title="region"
            options={regionOptions}
            multi={false}
            setSelection={changeRegion}
            selection={region}
          ></SelectComponent>
        </div>
      </div>
      <div className="gradient-bar"></div>
      {/* END REGION */}
      {/* LANGUAGE */}
      <div className="banner-container">
        <div className="prof-banner-detail-text" data-tip data-for="languageTip">
          language
        </div>
        <div className="select-container">
          <SelectComponent
            publicMethods={languageRef}
            title="language"
            options={languageOptions}
            multi={false}
            setSelection={changeLanguage}
            selection={language}
          ></SelectComponent>
        </div>
      </div>
      <div className="gradient-bar"></div>
      {/* END LANGUAGE */}
      {/* PLATFORM */}
      <div className="banner-container">
        <div className="prof-banner-detail-text" data-tip data-for="platformTip">
          platform
        </div>
        <div className="gender-container">
          <div
            className={`gender-box ${platform === 1 ? "box-selected" : ""}`}
            onClick={() => {
              changeSelectedPlatform(1);
            }}
          >
            <img
              className="gender-icon"
              src={"https://res.cloudinary.com/kultured-dev/image/upload/v1685814273/logoWhiteSmall_i1lvgo.png"}
              alt="discord selector"
            ></img>
          </div>
          <div
            className={`gender-box ${platform === 2 ? "box-selected" : ""}`}
            onClick={() => {
              changeSelectedPlatform(2);
            }}
          >
            <img
              className="gender-icon"
              src={"https://res.cloudinary.com/kultured-dev/image/upload/v1685814624/psn-logo-small_nbgzwa.png"}
              alt="psn selector"
            ></img>
          </div>
          <div
            className={`gender-box ${platform === 3 ? "box-selected" : ""}`}
            onClick={() => {
              changeSelectedPlatform(3);
            }}
          >
            <img
              className="gender-icon"
              src={"https://res.cloudinary.com/kultured-dev/image/upload/v1685814627/xbox-logo-small_e8sqjw.png"}
              alt="xbox selector"
            ></img>
          </div>
        </div>
      </div>
      <div className="gradient-bar"></div>
      {/* END PLATFORM */}
      {/* DISCORD */}
      {platform === 1 ? <></> : <></>}
      {/* END DISCORD */}
      {/* PLAYSTATION */}
      {platform === 2 ? (
        <div className="banner-container">
          <div className="prof-banner-detail-text">psn name</div>
          <input
            onChange={(event) => {
              setPSN(event.target.value);
              setHasUnsavedChanges(true);
            }}
            value={psn ? psn : ""}
            type="text"
            className="input-box"
            placeholder={userData.psn ? userData.psn : "blank"}
          ></input>
        </div>
      ) : (
        <></>
      )}
      {/* END PLAYSTATION */}
      {/* XBOX */}
      {platform === 3 ? (
        <div className="banner-container">
          <div className="prof-banner-detail-text">xbox name</div>
          <input
            onChange={(event) => {
              setXbox(event.target.value);
              setHasUnsavedChanges(true);
            }}
            value={xbox ? xbox : ""}
            type="text"
            className="input-box"
            placeholder={userData.xbox ? userData.xbox : "blank"}
          ></input>
        </div>
      ) : (
        <></>
      )}
      {/* END XBOX */}
      {/* START SAVE BOX */}
      <div className="save-box">
        <button className="save-button" disabled={!hasUnsavedChanges} onClick={() => saveChanges()}>
          save
        </button>
      </div>
      {/* END SAVE BOX */}

      <ReactTooltip id="aboutMeTip" place="top" effect="solid">
        Say something about your gaming strengths and playstyle.
      </ReactTooltip>
      <ReactTooltip id="publishTip" place="right" effect="solid">
        Controls whether your profile is discoverable. You must have both general and game profiles complete to publish.
      </ReactTooltip>
      <ReactTooltip id="avatarTip" place="right" effect="solid">
        Click here to upload profile image
      </ReactTooltip>
      <ReactTooltip id="languageTip" place="right" effect="solid">
        Language you will use in text and voice communications.
      </ReactTooltip>
      <ReactTooltip id="platformTip" place="right" effect="solid">
        Select your primary gaming communication platform (voice). Then enter your username for the platform below.
      </ReactTooltip>
    </div>
  );
}
