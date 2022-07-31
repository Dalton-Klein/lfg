import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import "./backdropComponent.scss";
import DrawerComponent from "./hamburgerComponent";

type Props = {
  toggleHamburger: any;
};

const Backdrop = (props: Props) => {
  useEffect(() => {
    document.querySelector(".backdrop-event-listener")!.addEventListener("click", () => {
      props.toggleHamburger();
    });
  }, []);

  return createPortal(
    <div className="backdrop-container">
      <div className="backdrop-event-listener"></div>
      <DrawerComponent toggleHamburger={props.toggleHamburger} />
    </div>,
    document.getElementById("drawer-hook")!
  );
};

export default Backdrop;
