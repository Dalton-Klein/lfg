import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import "./expandedProfileComponent.scss";
import { howLongAgo } from "../../utils/helperFunctions";

type Props = {
  toggleExpandedProfile: any;
  userInfo: any;
};

const ExpandedProfile = (props: Props) => {
  const [exitIcon, setExitIcon] = useState<string>("/assets/exit-icon.png");
  const [connectionText, setConnectionText] = useState<string>("");
  const lastSeen = howLongAgo(props.userInfo.last_seen);

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

  const sendConnectionRequest = () => {
    console.log("sending connection request", connectionText);
  };
  console.log("props: ", props);
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
            <div className="expanded-banner">
              <img className="expanded-photo" onClick={() => {}} src={props.userInfo.avatar_url} alt="avatar" />
              <div className="expanded-basic-info">
                <div className="expanded-username">{props.userInfo.username}</div>
                <div className="expanded-basic-text">{lastSeen}</div>
                <div className="expanded-basic-text">{props.userInfo.about}</div>
              </div>
            </div>
            <div className="expanded-core-info">
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
                <div>{props.userInfo.gender}</div>
              </div>
              <div className="expanded-core-info-field">
                <label>region</label>
                <div>{props.userInfo.region_abbreviation}</div>
              </div>
            </div>
            <div className="expanded-connect-box">
              <input
                onChange={(event) => {
                  setConnectionText(event.target.value);
                }}
                value={connectionText ? connectionText : ""}
                className="input-box"
                placeholder={"attach a message with your request"}
              ></input>
              <button
                className="connect-button"
                onClick={() => {
                  sendConnectionRequest();
                }}
              >
                <i className="pi pi-users" />
                &nbsp; send request
              </button>
            </div>
            <h5>lfg</h5>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("drawer-hook")!
  );
};

export default ExpandedProfile;
