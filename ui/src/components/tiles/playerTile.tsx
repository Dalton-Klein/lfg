import "./playerTile.scss";
import "primeicons/primeicons.css";
import { howLongAgo } from "../../utils/helperFunctions";

export default function PlayerTile(props: any) {
  const genderImageLinks: any = {
    1: "male",
    2: "female",
    3: "non-binary",
  };
  const platformClassNames: any = {
    pc: "pi-desktop",
    console: "pi-server",
  };
  const lastSeen = howLongAgo(props.last_seen);
  console.log("test: ", props);
  const genderIcon = `/assets/gender-icon-${genderImageLinks[props.gender]}.png`;
  return (
    <div className="player-card">
      {/* main details */}
      <div className="main-details">
        <div className="image-column">
          <img className="card-photo" onClick={() => {}} src={props.avatar_url} alt="avatar Icon" />
        </div>
        <div className="info-column">
          <div className="info-title-row">
            <div>{props.username}</div>
            <button className="connect-button">connect</button>
          </div>
          <div className="info-stats-row">
            <i className={`platform-icon pi ${platformClassNames[props.platforms[0]]}`}></i>
            <div className="info-stats-attribute">{props.languages[0]}</div>
            <div className="info-stats-attribute">{props.age}</div>
            <img className="gender-icon" src={genderIcon} alt=""></img>
            <div className="info-stats-attribute">{props.region_abbreviation}</div>
          </div>
        </div>
      </div>
      {/* lesser details */}
      <div className="lesser-details">
        <div className="details-about">
          <div className="details-about-text">{props.about}</div>
        </div>
        <div className="details-hours-played">
          <div className="details-hours-played-text">{props.hours_played} hours</div>
        </div>
        <div className="details-availability">
          <div className="detail-label">weekdays: </div>
          <div className="details-availabilty-text">{props.weekdays}</div>
          <div className="detail-label">weekdends: </div>
          <div className="details-availabilty-text">{props.weekends}</div>
        </div>
      </div>
      {/* footer details */}
      <div className="footer-details">
        <div className="discord-box">
          <i className={`platform-icon pi pi-discord`}></i>
          <div className="footer-discord-name">{props.discord ? props.discord : "n/a"}</div>
        </div>
        <div className="footer-timestamp">{lastSeen}</div>
      </div>
    </div>
  );
}
