import React, { useEffect, useState } from "react";
import { ipcRenderer } from "electron";
import packageJson from "../../../package.json";
import "./electronTitleBar.scss";

const ElectronTitlebar = () => {
  const [electronVersion, setElectronVersion] = useState("");

  useEffect(() => {
    // Retrieve the Electron app version from the package.json file
    const appVersion = ipcRenderer.sendSync("get-app-version");
    setElectronVersion(appVersion);
  }, []);

  const handleMouseDown = () => {
    ipcRenderer.invoke("mouse-event", "mousedown");
  };

  const handleMouseUp = () => {
    ipcRenderer.invoke("mouse-event", "mouseup");
  };

  return (
    <div className="electron-titlebar" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
      {/* Titlebar content */}
      <div className="version-text">gangs v{electronVersion}</div>
      {/* minimize/maximize buttons here */}
    </div>
  );
};

export default ElectronTitlebar;
