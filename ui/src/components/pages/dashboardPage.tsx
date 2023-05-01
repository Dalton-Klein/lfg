import FooterComponent from "../nav/footerComponent";
import "./gangsPage.scss";
import React, { useEffect } from "react";
import GangsList from "../gangs/gangsList";
import DaddyTile from "../tiles/daddyTile";
import DashboardWidgetsContainer from "../dashboard/dashboardWidgetsContainer";

export default function GangsPage() {
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <GangsList></GangsList>
      <div className="tile-container">
        <div className="discover-tiles">
          <DaddyTile
            has2Buttons={true}
            routerLinkLFG="/lfg-rust"
            routerLinkLFM="/lfm-rust"
            image="https://res.cloudinary.com/kultured-dev/image/upload/v1663566897/rust-tile-image_uaygce.png"
            title="rust"
            buttonTextLFG="lfg"
            buttonTextLFM="lfm"
          ></DaddyTile>
          <DaddyTile
            has2Buttons={true}
            routerLinkLFG="/lfg-rocket-league"
            routerLinkLFM="/lfm-rocket-league"
            image="https://res.cloudinary.com/kultured-dev/image/upload/v1665601538/rocket-league_fncx5c.jpg"
            title="rocket league"
            buttonTextLFG="lfg"
            buttonTextLFM="lfm"
          ></DaddyTile>
        </div>
        <DashboardWidgetsContainer></DashboardWidgetsContainer>
      </div>
      <FooterComponent></FooterComponent>
    </div>
  );
}
