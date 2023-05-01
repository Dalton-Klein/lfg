import FooterComponent from "../nav/footerComponent";
import "./gangsPage.scss";
import React, { useEffect } from "react";
import GangsMgmt from "../gangs/gangsMgmt";

export default function GangsPage() {
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <GangsMgmt></GangsMgmt>
      <FooterComponent></FooterComponent>
    </div>
  );
}
