import FooterComponent from "../nav/footerComponent";
import HeaderComponent from "../nav/headerComponent";
import "./gangsPage.scss";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import GangsList from "../gangs/gangsList";
import DaddyTile from "../tiles/daddyTile";
import DashboardWidgetsContainer from "../dashboard/dashboardWidgetsContainer";

export default function GangsPage() {
  const locationPath: string = useLocation().pathname;

  const [gangId, setgangId] = useState<number>(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <HeaderComponent></HeaderComponent>
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
