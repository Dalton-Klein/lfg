import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import "./expandedProfileComponent.scss";

type Props = {
  toggleExpandedProfile: any;
  userInfo: any;
};

const ExpandedProfile = (props: Props) => {
  const [exitIcon, setExitIcon] = useState<string>("/assets/exit-icon.png");

  useEffect(() => {
    document.querySelector(".backdrop-event-listener")!.addEventListener("click", () => {
      props.toggleExpandedProfile();
    });
    gsap.from(".hamburger-primary-panel", 0.25, {
      x: 400,
    });
    gsap.to(".hamburger-primary-panel", 0.25, {
      opacity: 1,
    });
    gsap.from(".hamburger-secondary-panel", 0.25, {
      x: 400,
      delay: 0.15,
    });
    gsap.to(".hamburger-secondary-panel", 0.25, {
      opacity: 1,
      delay: 0.15,
    });
    gsap.from(".profile-container", 0.25, {
      x: 400,
      delay: 0.25,
    });
    gsap.to(".profile-container", 0.25, {
      opacity: 1,
      delay: 0.25,
    });
    handleMouseLeave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseEnter = () => {
    setExitIcon("/assets/exit-icon-hover2.png");
  };

  const handleMouseLeave = () => {
    setExitIcon("/assets/exit-icon.png");
  };

  return createPortal(
    <div className="backdrop-container">
      <div className="backdrop-event-listener"></div>
      <div className="hamburger-primary-panel">
        <div className="hamburger-secondary-panel">
          <div className="profile-container">
            <img
              onClick={props.toggleExpandedProfile}
              className="hamburger-exit"
              src={exitIcon}
              onMouseOver={handleMouseEnter}
              onMouseOut={handleMouseLeave}
              alt="exit Icon"
            />
            <div className="expanded-username">{props.userInfo.username}</div>
            <img className="expanded-photo" onClick={() => {}} src={props.userInfo.avatar_url} alt="avatar" />
            <h5>lfg</h5>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("drawer-hook")!
  );
};

export default ExpandedProfile;
