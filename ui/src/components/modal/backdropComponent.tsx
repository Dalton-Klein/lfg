import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import "./backdropComponent.scss";
import DrawerComponent from "./drawerComponent";

type Props = {
  toggleDrawer: any;
};

const Backdrop = (props: Props) => {
  useEffect(() => {
    document.querySelector(".backdrop-event-listener")!.addEventListener("click", () => {
      props.toggleDrawer();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createPortal(
    <div className="backdrop-container">
      <div className="backdrop-event-listener"></div>
      <DrawerComponent toggleDrawer={props.toggleDrawer} />
    </div>,
    document.getElementById("drawer-hook")!
  );
};

export default Backdrop;
