import React from "react";
import "./rankTile.scss";

export default function RankTile({ user }) {
  const renderRank = () => {
    const stars: any = [];

    switch (user.rank) {
      case 1:
        stars.push(<img src="" key={1} className="star center" />);
        break;
      case 2:
        stars.push(<img src="" key={1} className="star" />);
        stars.push(<img src="" key={2} className="star" />);
        break;
      case 3:
        stars.push(<img src="" key={1} className="star top-center" />);
        stars.push(<img src="" key={2} className="star bottom-left" />);
        stars.push(<img src="" key={3} className="star bottom-right" />);
        break;
      case 4:
        stars.push(<img src="" key={1} className="star top-left" />);
        stars.push(<img src="" key={2} className="star top-right" />);
        stars.push(<img src="" key={3} className="star bottom-left" />);
        stars.push(<img src="" key={4} className="star bottom-right" />);
        break;
      case 5:
        stars.push(<img src="" key={1} className="star center" />);
        stars.push(<img src="" key={2} className="star top" />);
        stars.push(<img src="" key={3} className="star bottom" />);
        stars.push(<img src="" key={4} className="star left" />);
        stars.push(<img src="" key={5} className="star right" />);
        break;
      default:
        break;
    }

    return stars;
  };

  return <div className="star-widget">{renderRank()}</div>;
}
