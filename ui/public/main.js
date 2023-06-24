const { app, ipcMain, session, BrowserWindow, screen } = require("electron");
const { join } = require("path");
const isDev = require("electron-is-dev");
const log = require("electron-log");
require("dotenv").config();
require("@electron/remote/main").initialize();
const { autoUpdater } = require("electron-updater");

// Handle IPC message to retrieve Electron version
ipcMain.handle("getElectronVersion", () => {
  return app.getVersion();
});

function sendStatusToWindow(win, text) {
  log.info(text);
  console.log("whats happening?? ", text);
  win.webContents.send("message", text);
}

// Create a new browser window
function createWindow() {
  let mainWindow = new BrowserWindow({
    // Configure the browser window options
    width: 1600,
    height: 900,
    titleBarStyle: "hidden",
    darkTheme: true,
    frame: false,
    backgroundColor: "#1c1c1e",
    titleBarOverlay: {
      color: "#1c1c1e",
      symbolColor: "#9b9b9b",
      height: 40,
    },
    webPreferences: {
      enableRemoteModule: true,
      webSecurity: false,
      nodeIntegration: true,
      contextIsolation: false,
      nativeWindowOpen: true,
    },
    icon: __dirname + "/build/favicon.ico",
    title: "gangs",
    autoHideMenuBar: true,
  });
  // Load your existing app's HTML file
  if (isDev) {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
  } else {
    console.log("dirname?", __dirname);
    mainWindow.loadURL(`file://${join(__dirname, "../build/index.html")}`);
    // mainWindow.webContents.openDevTools();
  }

  // Configure session to allow third-party cookies
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders["Origin"] = "https://www.gangs.gg"; // Replace with your web app domain
    details.requestHeaders["Content-Type"] = "application/json";
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  autoUpdater.on("checking-for-update", () => {
    sendStatusToWindow(mainWindow, "Checking for update...");
  });
  autoUpdater.on("update-available", (info) => {
    sendStatusToWindow(mainWindow, "Update available.");
  });
  autoUpdater.on("update-not-available", (info) => {
    sendStatusToWindow(mainWindow, "Update not available.");
  });
  autoUpdater.on("error", (err) => {
    sendStatusToWindow(mainWindow, "Error in auto-updater. " + err);
  });
  autoUpdater.on("download-progress", (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + " - Downloaded " + progressObj.percent + "%";
    log_message = log_message + " (" + progressObj.transferred + "/" + progressObj.total + ")";
    sendStatusToWindow(mainWindow, log_message);
  });
  autoUpdater.on("update-downloaded", (info) => {
    sendStatusToWindow(mainWindow, "Update downloaded");
    autoUpdater.quitAndInstall(); // Added this line to restart the app and install the update
  });

  // Emitted when the window is closed
  mainWindow.on("closed", () => {
    // Dereference the window object
    mainWindow = null;
  });
}

// Run the createWindow function when Electron has finished initializing
app.whenReady().then(() => {
  createWindow();
  console.log("check for updates? ");
  autoUpdater.checkForUpdatesAndNotify();
});
