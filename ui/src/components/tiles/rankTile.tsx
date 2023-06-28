import React, { useEffect, useState } from "react";
import "./rankTile.scss";

export default function RankTile({ user }) {
  const [starImage, setstarImage] = useState<string>("");
  const [arrangedStars, setarrangedStars] = useState<any>();
  const [prestigeRemainder, setprestigeRemainder] = useState<number>(0);
  useEffect(() => {
    const rankValue = parseInt(user.rank);
    const prestige = Math.floor(rankValue / 25);
    const prestigeRemainderValue = rankValue < 25 ? rankValue : rankValue % 25;
    setprestigeRemainder(prestigeRemainderValue);
    if (prestige === 0) {
      setstarImage("https://res.cloudinary.com/kultured-dev/image/upload/v1687969980/star-grey_vjgjgd.png");
    } else if (prestige === 1) {
      setstarImage("https://res.cloudinary.com/kultured-dev/image/upload/v1687969980/star-blue_mtppfj.png");
    } else if (prestige === 2) {
      setstarImage("https://res.cloudinary.com/kultured-dev/image/upload/v1687969980/star-red_j1x40f.png");
    } else if (prestige === 3) {
      setstarImage("https://res.cloudinary.com/kultured-dev/image/upload/v1687969980/star-gold_l9tsoi.png");
    } else if (prestige === 4) {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.rank]);

  useEffect(() => {
    renderRank();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [starImage, prestigeRemainder]);

  const renderRank = () => {
    switch (Math.floor(prestigeRemainder / 5)) {
      case 0:
        setarrangedStars(<img src={starImage} className="rank single" />);
        break;
      case 1:
        setarrangedStars(
          <div className="double">
            <img src={starImage} className="rank" />
            <img src={starImage} className="rank" />
          </div>
        );
        break;
      case 2:
        setarrangedStars(
          <div className="triple">
            <img src={starImage} className="rank" />
            <div className="rank-horizontal">
              <img src={starImage} className="rank" />
              <img src={starImage} className="rank" />
            </div>
          </div>
        );
        break;
      case 3:
        setarrangedStars(
          <div className="quad">
            <div className="rank-horizontal">
              <img src={starImage} className="rank" />
              <img src={starImage} className="rank" />
            </div>
            <div className="rank-horizontal">
              <img src={starImage} className="rank" />
              <img src={starImage} className="rank" />
            </div>
          </div>
        );
        break;
      case 4:
        setarrangedStars(
          <div className="pentagon">
            <div className="pentagon-first">
              <img src={starImage} className="rank" />
            </div>
            <div className="pentagon-second">
              <img src={starImage} className="rank" />
              <img src={starImage} className="rank" />
            </div>
            <div className="pentagon-third">
              <img src={starImage} className="rank" />
              <img src={starImage} className="rank" />
            </div>
          </div>
        );
        break;
      default:
        break;
    }
    return;
  };

  return <div className="rank-widget">{arrangedStars}</div>;
}
