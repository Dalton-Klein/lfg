import "./electron-title-bar.scss";
import React from "react";
import { ipcRenderer } from "electron";
import isElectron from "electron-is";
const { platform } = process;

function ElectronTitleBar() {
  // Define the button labels/icons based on the platform
  const buttonLabels = {
    win32: {
      minimize: "_",
      maximize: "\u25A1",
      close: "\u2715",
    },
    // Add labels/icons for other platforms if needed
  };
  const labels = buttonLabels[platform];
  if (!isElectron()) {
    return null; // Render nothing in web builds
  }

  function handleMinimize() {
    ipcRenderer.send("minimize-window");
  }

  function handleMaximize() {
    ipcRenderer.send("maximize-window");
  }

  function handleClose() {
    ipcRenderer.send("close-window");
  }

  // Custom title bar JSX code
  return (
    <div className="electron-title-bar">
      {/* Your title bar content */}
      <div className="electron-title-text">gangs</div>
      <div>
        <button onClick={handleMinimize}>{labels.minimize}</button>
        <button onClick={handleMaximize}>{labels.maximize}</button>
        <button onClick={handleClose}>{labels.close}</button>
      </div>
    </div>
  );
}

export default ElectronTitleBar;
