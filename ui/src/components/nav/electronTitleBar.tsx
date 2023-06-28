// ***ELECTRON DISABLE ENTIRE COMPONENT
import React, { useEffect, useState } from "react";
import * as FS from "fs";
// import { IpcRenderer } from "electron";
import "./electronTitleBar.scss";
// const fs: typeof FS = window.require("fs");
// const ipcRenderer: IpcRenderer = window.require("electron").ipcRenderer;

const ElectronTitlebar = () => {
  const [electronVersion, setElectronVersion] = useState("");

  useEffect(() => {
    // ipcRenderer.invoke("getElectronVersion").then((version) => {
    //   setElectronVersion(version);
    // });
  }, []);
  //restart the application :: again
  return (
    <div className="electron-titlebar">
      {/* Titlebar content */}
      <span>gangs v{electronVersion}</span>
    </div>
  );
};

export default ElectronTitlebar;
