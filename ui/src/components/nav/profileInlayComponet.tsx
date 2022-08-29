import { useEffect, useState } from "react";
import "./profileInlayComponent.scss";
import { useNavigate } from "react-router-dom";
import Backdrop from "../modal/backdropComponent";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

export default function ProfileInlayComponet() {
  const navigate = useNavigate();
  const userState = useSelector((state: RootState) => state.user.user);
  const [drawerVis, setDrawerVis] = useState<boolean>(false);
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

  const toggleDrawer = () => {
    setDrawerVis(!drawerVis);
  };

  return (
    <div className="my-profile-overlay">
      {/* Conditionally render hamburger modal */}
      {drawerVis ? <Backdrop toggleDrawer={toggleDrawer} /> : <></>}
      {/* Conditionally render log in options or show profile info */}
      {userState.email === "" ? (
        <div className="my-profile-overlay-link prof-overlay-text" onClick={() => navigate("/login")}>
          Log In | Sign Up
        </div>
      ) : (
        <div className="my-profile-overlay-wrapper">
          {/* <i onClick={() => navigate("/messages")} className="pi pi-comments " /> */}
          <div className="my-profile-overlay-link">
            <div className="prof-overlay-text" onClick={toggleDrawer}>
              {userState.username}
            </div>

            <img className="nav-overlay-img" onClick={toggleDrawer} src={profileImage} alt="avatar Icon" />
          </div>
        </div>
      )}
    </div>
  );
}
