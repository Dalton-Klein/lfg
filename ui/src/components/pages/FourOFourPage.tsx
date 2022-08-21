import React from "react";
import "./fourOFour.scss";
import { useNavigate } from "react-router-dom";

export default function FourOFourPage() {
  const navigate = useNavigate();

  const returnHome = () => {
    navigate("/");
  };

  return (
    <div className="fourOFour-container">
      <div className="fourOFour-text">404</div>
      <div className="info-text">oops, you aren't supposed to see this.</div>
      <div className="info-text">the page you are trying to access does not exist.</div>
      <button className="return-button" onClick={returnHome}>
        return home
      </button>
    </div>
  );
}
