import { Accordion, AccordionTab } from "primereact/accordion";
import React from "react";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { updateUserAvatarUrl, updateUserName } from "../../store/userSlice";
import "./profileGeneral.scss";
import { avatarFormIn, avatarFormOut } from "../../utils/animations";
import { uploadAvatarCloud, uploadAvatarServer, changeUserName } from "../../utils/rest";
import SelectComponent from "./selectComponent";
import { languageOptions, regionOptions } from "../../utils/selectOptions";

export default function ProfileGeneral() {
  const hiddenFileInput: any = React.useRef(null);
  const userData = useSelector((state: RootState) => state.user.user);
  const [isUploadFormShown, setIsUploadFormShown] = useState<boolean>(false);
  //Profile Fields Form Tracking
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [photoFile, setPhotoFile] = useState<any>();
  const [aboutText, setAboutText] = useState<string>("");
  const [ageText, setAgeText] = useState<string>("");
  const [gender, setGender] = useState<number>(0);
  const [platform, setPlatform] = useState<number>(0);
  const [gamertagText, setGamertagText] = useState<string>("");
  const [rustWeekday, setRustWeekday] = useState<number>(0);
  const [rustWeekend, setRustWeekend] = useState<number>(0);
  //End Profile Fields Form Tracking

  const dispatch = useDispatch();
  const avatarPlaceholder = "/assets/avatarIcon.png";
  console.log("user data: ", userData);
  useEffect(() => {}, [userData]);

  // BEGIN AVATAR LOGIC
  const chooseFileHandler = (event: any) => {
    if (hiddenFileInput.current !== null) {
      hiddenFileInput.current!.click();
    }
  };

  const handleFileUpload = (event: any) => {
    setPhotoFile(event.target.files[0]);
  };

  const closeAvatar = () => {
    avatarFormOut();
    setIsUploadFormShown(false);
  };

  const startEditingAvatar = async (field: string) => {
    if (userData.id === 0) alert("You must be logged in to edit this field");
    setIsUploadFormShown(true);
    avatarFormIn();
  };
  // END AVATAR LOGIC

  const changeSelectedGender = (selection: number) => {
    if (gender !== selection) setHasUnsavedChanges(true);
    setGender(selection);
  };

  const changeSelectedPlatform = (selection: number) => {
    if (platform !== selection) setHasUnsavedChanges(true);
    setPlatform(selection);
  };

  const changeRustWeekday = (selection: number) => {
    if (rustWeekday !== selection) setHasUnsavedChanges(true);
    setRustWeekday(selection);
  };

  const changeRustWeekend = (selection: number) => {
    if (rustWeekday !== selection) setHasUnsavedChanges(true);
    setRustWeekday(selection);
  };

  //MODAL SAVE LOGIC
  const changeSubmitHandler = async (e: any) => {
    avatarFormOut();
    setIsUploadFormShown(false);
    // switch (changeFormTitle) {
    //   case "Upload Avatar":
    //     const avatar = document.querySelector(".avatar-input");
    //     console.log("what is avatar? ", avatar);
    //     const url: string | undefined = await uploadAvatarCloud(avatar);
    //     dispatch(updateUserAvatarUrl(url));
    //     uploadAvatarServer(userData.id, url!);
    //     setPhotoFile(undefined);
    //     break;
    // case "Update Name":
    //   dispatch(updateUserName(changeFormText));
    //   changeUserName(userData.id, changeFormText!);
    //   await setChangeFormText("");
    //   nameInputRef.current.value = "";
    //   break;
    // }
  };

  //NON-MODAL SAVE LOGIC
  const saveChanges = () => {
    if (userData.about !== aboutText) {
      console.log("need to save about text to: ", aboutText);
    }
    if (userData.age !== ageText) {
      console.log("need to save age text to: ", ageText);
    }
  };

  const conditionalClass = isUploadFormShown ? "conditionalZ2" : "conditionalZ1";
  return (
    <div className="my-profile-containers">
      <Accordion activeIndex={0} className="accordion">
        <AccordionTab header="general profile">
          {/* EDIT PHTO MODAL */}
          <div className={`edit-profile-form ${conditionalClass}`}>
            <p>{"upload avatar"}</p>
            {
              <div className="avatar-upload-form">
                <input className="avatar-input" type="file" ref={hiddenFileInput} style={{ display: "none" }} onChange={handleFileUpload}></input>
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
          {/* AVATAR PHTO */}
          <div className="banner-container-top">
            <div className="profile-avatar-box">
              <img
                className="prof-banner-avatar"
                src={!userData.avatar_url || userData.avatar_url === "/assets/avatarIcon.png" ? avatarPlaceholder : userData.avatar_url}
                alt=""
                onClick={() => startEditingAvatar("avatar_url")}
              ></img>
            </div>
            <div className="my-profile-text">{userData.username ? userData.username : "No user name..."}</div>
          </div>
          <div className="gradient-bar"></div>
          {/* ABOUT */}
          <div className="banner-container">
            <div className="prof-banner-detail-text">about</div>
            <input
              onChange={(event) => {
                setAboutText(event.target.value);
                setHasUnsavedChanges(true);
              }}
              value={aboutText}
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
                setAgeText(event.target.value);
                setHasUnsavedChanges(true);
              }}
              value={ageText}
              type="text"
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
                <img className="gender-icon" src={"/assets/gender-icon-male.png"} alt=""></img>
                <div className="box-text">m</div>
              </div>
              <div
                className={`gender-box ${gender === 2 ? "box-selected" : ""}`}
                onClick={() => {
                  changeSelectedGender(2);
                }}
              >
                <img className="gender-icon" src={"/assets/gender-icon-female.png"} alt=""></img>
                <div className="box-text">f</div>
              </div>
              <div
                className={`gender-box ${gender === 3 ? "box-selected" : ""}`}
                onClick={() => {
                  changeSelectedGender(3);
                }}
              >
                <img className="gender-icon" src={"/assets/gender-icon-non-binary.png"} alt=""></img>
                <div className="box-text">nb</div>
              </div>
            </div>
          </div>
          <div className="gradient-bar"></div>
          {/* END GENDER */}
          {/* REGION */}
          <div className="banner-container">
            <div className="prof-banner-detail-text">location</div>
            <div className="select-container">
              <SelectComponent title="region" options={regionOptions} multi={false}></SelectComponent>
            </div>
          </div>
          <div className="gradient-bar"></div>
          {/* END REGION */}
          {/* LANGUAGES */}
          <div className="banner-container">
            <div className="prof-banner-detail-text">languages</div>
            <div className="select-container">
              <SelectComponent title="languages" options={languageOptions} multi={true}></SelectComponent>
            </div>
          </div>
          <div className="gradient-bar"></div>
          {/* END LANGUAGES */}
          {/* PLATFORM */}
          <div className="banner-container">
            <div className="prof-banner-detail-text">platform</div>
            <div className="gender-container">
              <div
                className={`gender-box ${platform === 1 ? "box-selected" : ""}`}
                onClick={() => {
                  changeSelectedPlatform(1);
                }}
              >
                <img className="gender-icon" src={"/assets/discord-logo-small.png"} alt=""></img>
              </div>
              <div
                className={`gender-box ${platform === 2 ? "box-selected" : ""}`}
                onClick={() => {
                  changeSelectedPlatform(2);
                }}
              >
                <img className="gender-icon" src={"/assets/psn-logo-small.png"} alt=""></img>
              </div>
              <div
                className={`gender-box ${platform === 3 ? "box-selected" : ""}`}
                onClick={() => {
                  changeSelectedPlatform(3);
                }}
              >
                <img className="gender-icon" src={"/assets/xbox-logo-small.png"} alt=""></img>
              </div>
            </div>
          </div>
          <div className="gradient-bar"></div>
          {/* END PLATFORM */}
          {/* PLATFORM GAMERTAG */}
          <div className="banner-container">
            <div className="prof-banner-detail-text">
              {userData[userData.preferred_platform] ? userData[userData.preferred_platform] : "gamertag"}
            </div>
            <input
              onChange={(event) => {
                setGamertagText(event.target.value);
                setHasUnsavedChanges(true);
              }}
              value={gamertagText}
              type="text"
              className="input-box"
              placeholder={
                userData[userData.preferred_platform] &&
                userData[userData.preferred_platform] !== null &&
                userData[userData.preferred_platform] !== ""
                  ? userData[userData.preferred_platform]
                  : "blank"
              }
            ></input>
          </div>
          <div className="gradient-bar"></div>
          {/* END PLATFORM GAMERTAG */}
          {/* PASSWORD */}
          <div className="banner-container">
            <div className="prof-banner-detail-text">password</div>
            <div className="banner-change-box">
              <button className="text-only-button" onClick={() => startEditingAvatar("password")}>
                <img className="edit-icon" src="/assets/editiconw.png" alt=""></img>
              </button>
            </div>
          </div>
          <div className="gradient-bar"></div>
          {/* END PASSWORD */}
          <div className=" ">
            <button className="save-button" disabled={!hasUnsavedChanges} onClick={() => saveChanges()}>
              save
            </button>
          </div>
        </AccordionTab>
        <AccordionTab header="rust">
          {/* Availability- Weekdays */}
          <div className="banner-container">
            <div className="prof-banner-detail-text">weekdays</div>
            <div className="gender-container">
              <div
                className={`gender-box ${platform === 1 ? "box-selected" : ""}`}
                onClick={() => {
                  changeRustWeekday(1);
                }}
              >
                none
              </div>
              <div
                className={`gender-box ${platform === 2 ? "box-selected" : ""}`}
                onClick={() => {
                  changeRustWeekday(2);
                }}
              >
                some
              </div>
              <div
                className={`gender-box ${platform === 3 ? "box-selected" : ""}`}
                onClick={() => {
                  changeRustWeekday(3);
                }}
              >
                a lot
              </div>
              <div
                className={`gender-box ${platform === 4 ? "box-selected" : ""}`}
                onClick={() => {
                  changeRustWeekday(4);
                }}
              >
                all day
              </div>
            </div>
          </div>
          <div className="gradient-bar"></div>
          {/* END Availability- Weekdays */}
          {/* Availability- Weekends */}
          <div className="banner-container">
            <div className="prof-banner-detail-text">weekdays</div>
            <div className="gender-container">
              <div
                className={`gender-box ${platform === 1 ? "box-selected" : ""}`}
                onClick={() => {
                  changeRustWeekend(1);
                }}
              >
                none
              </div>
              <div
                className={`gender-box ${platform === 2 ? "box-selected" : ""}`}
                onClick={() => {
                  changeRustWeekend(2);
                }}
              >
                some
              </div>
              <div
                className={`gender-box ${platform === 3 ? "box-selected" : ""}`}
                onClick={() => {
                  changeRustWeekend(3);
                }}
              >
                a lot
              </div>
              <div
                className={`gender-box ${platform === 4 ? "box-selected" : ""}`}
                onClick={() => {
                  changeRustWeekend(4);
                }}
              >
                all day
              </div>
            </div>
          </div>
          <div className="gradient-bar"></div>
          {/* END Availability- Weekends */}
        </AccordionTab>
      </Accordion>
    </div>
  );
}
