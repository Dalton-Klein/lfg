import { useEffect, useState } from "react";
import "./profileInlayComponent.scss";
import { useNavigate } from "react-router-dom";
import Backdrop from "../modal/backdropComponent";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";

export default function ProfileInlayComponet() {
  const navigate = useNavigate();
  const userState = useSelector((state: RootState) => state.user.user);
  const [hamburgVis, setHamburgVis] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<string>("/assets/avatarIcon.png");

  useEffect(() => {
    if (typeof userState.avatar_url === "string" && userState.avatar_url.length > 1) {
      setProfileImage(userState.avatar_url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setProfileImage(userState.avatar_url);
  }, [userState.avatar_url]);

  const toggleHamburger = () => {
    setHamburgVis(!hamburgVis);
  };

  return (
    <div className="my-profile-overlay">
      {/* Conditionally render hamburger modal */}
      {hamburgVis ? <Backdrop toggleHamburger={toggleHamburger} /> : <></>}
      {/* Conditionally render log in options or show profile info */}
      {userState.email === "" ? (
        <div className="my-profile-overlay-link prof-overlay-text" onClick={() => navigate("/login")}>
          Log In | Sign Up
        </div>
      ) : (
        <div className="my-profile-overlay-wrapper">
          {/* <i onClick={() => navigate("/messages")} className="pi pi-comments " /> */}
          <div className="my-profile-overlay-link">
            <div className="prof-overlay-text" onClick={toggleHamburger}>
              {userState.username}
            </div>

            <img className="nav-overlay-img" onClick={toggleHamburger} src={profileImage} alt="avatar Icon" />
          </div>
        </div>
      )}
    </div>
  );
}
