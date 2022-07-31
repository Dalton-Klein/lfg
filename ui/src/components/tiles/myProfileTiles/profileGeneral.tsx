import React from "react";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/store";
import { updateUserAvatarUrl, updateUserName } from "../../../store/userSlice";
import "./profileGeneral.scss";
import { avatarFormIn, avatarFormOut } from "../../../utils/animations";
import { uploadAvatarCloud, uploadAvatarServer, changeUserName } from "../../../utils/rest";

export default function ProfileGeneral() {
  const hiddenFileInput: any = React.useRef(null);
  const nameInputRef: any = useRef();
  const idInputRef: any = useRef();
  const userData = useSelector((state: RootState) => state.user.user);
  userData.about = "Avid rust player and creator of lfg.";
  userData.age = 28;
  userData.gender = 1;
  userData.location = "united states";
  const [isUploadFormShown, setIsUploadFormShown] = useState<boolean>(false);
  const [changeFormTitle, setChangeFormTitle] = useState<string>("");
  const [photoFile, setPhotoFile] = useState<any>();
  const [photoFileName, setPhotoFileName] = useState<string>("file");
  const [changeFormRender, setChangeFormRender] = useState<any>();
  const [changeFormText, setChangeFormText] = useState<string>();
  const dispatch = useDispatch();

  useEffect(() => {
    if (photoFile && photoFile!.name) {
      setPhotoFileName(`${photoFile.name}`);
    }
  }, [photoFile]);

  useEffect(() => {}, [userData]);

  const changeAvatar = async () => {
    if (userData.id === 0) {
      alert("You must be logged in to use avatar upload feature");
    } else {
      await setChangeFormTitle("Upload Avatar");
      await setChangeFormRender(
        <div>
          <input type="file" className="avatar-input" ref={hiddenFileInput} style={{ display: "none" }} onChange={handleFileUpload}></input>
          <button onClick={chooseFileHandler}>Choose Photo</button>
          <div>{photoFileName}</div>
        </div>
      );
      setIsUploadFormShown(true);
      avatarFormIn();
    }
  };

  const chooseFileHandler = (event: any) => {
    if (hiddenFileInput.current !== null) {
      hiddenFileInput.current!.click();
    }
  };

  const handleFileUpload = (event: any) => {
    setPhotoFile(event.target.files[0]);
  };

  const changeSubmitHandler = async (e: any) => {
    avatarFormOut();
    setIsUploadFormShown(false);
    switch (changeFormTitle) {
      case "Upload Avatar":
        const avatar = document.querySelector(".avatar-input");
        const url: string | undefined = await uploadAvatarCloud(userData.id, avatar);
        dispatch(updateUserAvatarUrl(url));
        uploadAvatarServer(userData.id, url!);
        setPhotoFileName("");
        break;
      case "Update Name":
        dispatch(updateUserName(changeFormText));
        changeUserName(userData.id, changeFormText!);
        await setChangeFormText("");
        nameInputRef.current.value = "";
        break;
    }
  };

  const closeAvatar = () => {
    avatarFormOut();
    setIsUploadFormShown(false);
  };

  const changeUserInfoFunction = async (field: string) => {
    let idTNameF = false;
    if (field === "about") idTNameF = true;
    else idTNameF = false;
    if (userData.id === 0) {
      alert("You must be logged in to edit this field");
    } else {
      await setChangeFormTitle(`update ${field}`);
      await setChangeFormRender(
        <input
          onChange={(event) => {
            setChangeFormText(event.target.value);
          }}
          value={changeFormText}
          type="text"
          className="avatar-input"
          placeholder="type here..."
          ref={idTNameF ? nameInputRef : idInputRef}
        ></input>
      );
      setIsUploadFormShown(true);
      avatarFormIn();
    }
  };

  const conditionalClass = isUploadFormShown ? "conditionalZ2" : "conditionalZ1";
  return (
    <div className="my-profile-containers">
      <div className={`edit-profile-form ${conditionalClass}`}>
        <p>{changeFormTitle}</p>
        {changeFormRender}
        <div className="upload-form-btns">
          <button onClick={changeSubmitHandler}>save</button>
          <button onClick={closeAvatar}>close</button>
        </div>
      </div>
      <div className="banner-container-top">
        <div className="profile-avatar-box">
          <img
            className="prof-banner-avatar"
            src={
              userData.avatarUrl !== "https://res.cloudinary.com/dasb94yfb/image/upload/v1612801631/a6auhq4b9eblw0ketmlv.png"
                ? userData.avatarUrl
                : "/assets/avatarIcon.png"
            }
            alt=""
          ></img>
          <button className="alt-button" onClick={changeAvatar}>
            <img className="edit-icon" src="/assets/editiconw.png" alt=""></img>
          </button>
        </div>
        <div className="my-profile-text">{userData.username ? userData.username : "No user name..."}</div>
      </div>
      {/* ABOUT */}
      <div className="banner-container">
        <div className="prof-banner-detail-text">about</div>
        <div className="banner-change-box">
          <button className="text-only-button" onClick={() => changeUserInfoFunction("about")}>
            <img className="edit-icon" src="/assets/editiconw.png" alt=""></img>
          </button>
        </div>
      </div>
      <div className="prof-banner-tiny-text">{userData.about ? userData.about : "blank"}</div>
      {/* END ABOUT */}
      {/* AGE */}
      <div className="banner-container">
        <div className="prof-banner-detail-text">age</div>
        <div className="banner-change-box">
          <button className="text-only-button" onClick={() => changeUserInfoFunction("age")}>
            <img className="edit-icon" src="/assets/editiconw.png" alt=""></img>
          </button>
        </div>
      </div>
      <div className="prof-banner-tiny-text">{userData.age ? userData.age : "blank"}</div>
      {/* END AGE */}
      {/* GENDER */}
      <div className="banner-container">
        <div className="prof-banner-detail-text">gender</div>
        <div className="banner-change-box"></div>
      </div>
      <div className="gender-container">
        <div className={`gender-box ${userData.gender === 1 ? "box-selected" : ""}`}>
          <img className="gender-icon" src={"/assets/gender-icon-male.png"} alt=""></img>
          <div className="box-text">male</div>
        </div>
        <div className="gender-box">
          <img className="gender-icon" src={"/assets/gender-icon-female.png"} alt=""></img>
          <div className="box-text">female</div>
        </div>
        <div className="gender-box">
          <img className="gender-icon" src={"/assets/gender-icon-non-binary.png"} alt=""></img>
          <div className="box-text">non-binary</div>
        </div>
      </div>
      {/* END GENDER */}
      {/* LOCATION */}
      <div className="banner-container">
        <div className="prof-banner-detail-text">location</div>
        <div className="banner-change-box">
          <button className="text-only-button" onClick={() => changeUserInfoFunction("location")}>
            <img className="edit-icon" src="/assets/editiconw.png" alt=""></img>
          </button>
        </div>
      </div>
      <div className="prof-banner-tiny-text">{userData.location ? userData.location : "blank"}</div>
      {/* END LOCATION */}
      {/* PASSWORD */}
      <div className="banner-container">
        <div className="prof-banner-detail-text">password</div>
        <div className="banner-change-box">
          <button className="text-only-button" onClick={() => changeUserInfoFunction("password")}>
            <img className="edit-icon" src="/assets/editiconw.png" alt=""></img>
          </button>
        </div>
      </div>
      {/* END PASSWORD */}
    </div>
  );
}
