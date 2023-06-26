import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import "./drawerComponent.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { logoutUser } from "../../store/userSlice";

type Props = {
  toggleDrawer: any;
  handleMouseEnter?: any;
  handleMouseLeave?: any;
};

const DrawerComponent = (props: Props) => {
  const navigate = useNavigate();
  const userState = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const [exitIcon, setExitIcon] = useState<string>(
    "https://res.cloudinary.com/kultured-dev/image/upload/v1685814832/exit-icon_la47ch.png"
  );

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
    return () => {
      setExitIcon("https://res.cloudinary.com/kultured-dev/image/upload/v1685814832/exit-icon_la47ch.png");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseEnter = () => {
    setExitIcon("https://res.cloudinary.com/kultured-dev/image/upload/v1685814833/exit-icon-hover2_fdognt.png");
  };

  const handleMouseLeave = () => {
    setExitIcon("https://res.cloudinary.com/kultured-dev/image/upload/v1685814832/exit-icon_la47ch.png");
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
    //***Fix this so that the destination is just the url
    if (destination === "genProfile") {
      link = "general-profile";
    } else if (destination === "incoming") {
      link = "incoming-requests";
    } else if (destination === "outgoing") {
      link = "outgoing-requests";
    } else if (destination === "accountSettings") {
      link = "account-settings";
    } else if (destination === "help") {
      link = "help";
    }
    // Navigates to dynamic url (new page)
    navigate(`/${link}`);
  };

  return (
    <div className="hamburger-red-panel">
      <div className="hamburger-green-panel">
        <div className="hamburger-nav">
          <i className="pi pi-angle-left hamburger-exit" onClick={props.toggleDrawer}></i>
          <div
            onClick={() => {
              navigationButtonPressed("genProfile");
            }}
            className="hamburger-links"
          >
            <button className="hamburger-button">general profile</button>
          </div>
          <div
            onClick={() => {
              navigationButtonPressed("accountSettings");
            }}
            className="hamburger-links"
          >
            <button className="hamburger-button">account settings</button>
          </div>
          <div
            onClick={() => {
              navigationButtonPressed("incoming");
            }}
            className="hamburger-links"
          >
            <button className="hamburger-button">incoming requests</button>
          </div>
          <div
            onClick={() => {
              navigationButtonPressed("outgoing");
            }}
            className="hamburger-links"
          >
            <button className="hamburger-button">outgoing requests</button>
          </div>
          <div
            onClick={() => {
              navigationButtonPressed("blog");
            }}
            className="hamburger-links"
          >
            <button className="hamburger-button">blog</button>
          </div>
          <div
            onClick={() => {
              navigationButtonPressed("help");
            }}
            className="hamburger-links"
          >
            <button className="hamburger-button">help | faq</button>
          </div>
          <div className="hamburger-links">
            <button
              className="google-button"
              onClick={() => {
                logoutFunction();
              }}
            >
              logout
            </button>
          </div>
          <div
            onClick={() => {
              navigationButtonPressed("privacy-policy");
            }}
            className="hamburger-links"
          >
            <button className="text-only-button boring-button">privacy policy</button>
          </div>
          <div
            onClick={() => {
              navigationButtonPressed("terms-of-service");
            }}
            className="hamburger-links"
          >
            <button className="text-only-button boring-button">terms of service</button>
          </div>
          <img
            className="small-logo"
            src="https://res.cloudinary.com/kultured-dev/image/upload/v1663653269/logo-v2-gangs.gg-transparent-white_mqcq3z.png"
            alt="gangs-logo-small"
          />
          <h5>gangs</h5>
        </div>
      </div>
    </div>
  );
};

export default DrawerComponent;
