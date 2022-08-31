import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import "./drawerComponent.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { logoutUser } from "../../store/userSlice";
import { setPreferences } from "../../store/userPreferencesSlice";

type Props = {
  toggleDrawer: any;
  handleMouseEnter?: any;
  handleMouseLeave?: any;
};

const DrawerComponent = (props: Props) => {
  const navigate = useNavigate();
  const preferencesState = useSelector((state: RootState) => state.preferences);
  const userState = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const [exitIcon, setExitIcon] = useState<string>("/assets/exit-icon.png");

  useEffect(() => {
    gsap.from(".hamburger-red-panel", 0.25, {
      x: 400,
    });
    gsap.to(".hamburger-red-panel", 0.25, {
      opacity: 1,
    });
    gsap.from(".hamburger-green-panel", 0.25, {
      x: 400,
      delay: 0.15,
    });
    gsap.to(".hamburger-green-panel", 0.25, {
      opacity: 1,
      delay: 0.15,
    });
    gsap.from(".hamburger-nav", 0.25, {
      x: 400,
      delay: 0.25,
    });
    gsap.to(".hamburger-nav", 0.25, {
      opacity: 1,
      delay: 0.25,
    });
    handleMouseLeave();
  }, []);

  const handleMouseEnter = () => {
    setExitIcon("/assets/exit-icon-hover2.png");
  };

  const handleMouseLeave = () => {
    setExitIcon("/assets/exit-icon.png");
  };

  const logoutFunction = () => {
    dispatch(logoutUser(userState.id));
    navigate("/login");
  };

  const navigationButtonPressed = (destination: string) => {
    // Closes the side menu
    props.toggleDrawer();
    //Decide between sub-sections of a url
    let link = destination;
    if (destination === "connections") {
      link = "profile";
      dispatch(
        setPreferences({
          ...preferencesState,
          lastProfileMenu: 2,
        })
      );
    } else if (destination === "myProfile") {
      link = "profile";
      dispatch(
        setPreferences({
          ...preferencesState,
          lastProfileMenu: 1,
        })
      );
    }
    // Navigates to dynamic url (new page)
    navigate(`/${link}`);
  };

  return (
    <div className="hamburger-red-panel">
      <div className="hamburger-green-panel">
        <div className="hamburger-nav">
          <img
            onClick={props.toggleDrawer}
            className="hamburger-exit"
            src={exitIcon}
            onMouseOver={handleMouseEnter}
            onMouseOut={handleMouseLeave}
            alt="exit Icon"
          />
          <div
            onClick={() => {
              navigationButtonPressed("discover");
            }}
            className="hamburger-links"
          >
            <button className="hamburger-button">discover</button>
          </div>
          <div
            onClick={() => {
              navigationButtonPressed("connections");
            }}
            className="hamburger-links"
          >
            <button className="hamburger-button">connections</button>
          </div>
          <div
            onClick={() => {
              navigationButtonPressed("myProfile");
            }}
            className="hamburger-links"
          >
            <button className="hamburger-button">profile</button>
          </div>
          <div
            onClick={() => {
              navigationButtonPressed("about");
            }}
            className="hamburger-links"
          >
            <button className="hamburger-button">about</button>
          </div>
          <div onClick={() => logoutFunction()} className="hamburger-links">
            <button className="hamburger-logout-button">logout</button>
          </div>
          <h5>lfg</h5>
        </div>
      </div>
    </div>
  );
};

export default DrawerComponent;
