import React, { useState } from "react";
import "./joinGangPage.scss";
import { useNavigate } from "react-router-dom";
import BannerTitle from "../nav/banner-title";

export default function JoinGangPage() {
  const navigate = useNavigate();

  const [joinCodeText, setjoinCodeText] = useState<string>("");
  const [hasCompletedForm, sethasCompletedForm] = useState<boolean>(false);

  const navigateToLink = (link) => {
    navigate(link);
  };

  const checkIfFormComplete = () => {
    if (joinCodeText && joinCodeText.length >= 3) {
      sethasCompletedForm(true);
      console.log("eyyyo", hasCompletedForm);
    } else {
      sethasCompletedForm(false);
    }
    return;
  };

  const tryGangInviteCode = () => {};

  return (
    <div>
      <BannerTitle
        title={"join a gang in two ways"}
        imageLink={"https://res.cloudinary.com/kultured-dev/image/upload/v1663566897/rust-tile-image_uaygce.png"}
      ></BannerTitle>
      <div className="master-alignment-container">
        <div className="join-gang-container">
          <input
            onChange={(event) => {
              setjoinCodeText(event.target.value);
              checkIfFormComplete();
            }}
            value={joinCodeText ? joinCodeText : ""}
            type="text"
            className="input-box"
            placeholder={"...invite code"}
          ></input>
          <button disabled={true} className="join-gang-return-button" onClick={tryGangInviteCode}>
            invite feature coming soon
          </button>
          <div className="info-text">or</div>
          <button
            className="join-gang-return-button"
            onClick={() => {
              navigateToLink("/lfm-rust");
            }}
          >
            browse rust lfm
          </button>
          <button
            className="join-gang-return-button"
            onClick={() => {
              navigateToLink("/lfm-rocket-league");
            }}
          >
            browse rocket league lfm
          </button>
          <button
            className="join-gang-return-button"
            onClick={() => {
              navigateToLink("/dashboard");
            }}
          >
            back
          </button>
        </div>
      </div>
    </div>
  );
}
