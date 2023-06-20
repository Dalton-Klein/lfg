const { app, session, BrowserWindow } = require("electron");
const { join } = require("path");
const isDev = require("electron-is-dev");
require("dotenv").config();
require("@electron/remote/main").initialize();

// Create a new browser window
function createWindow() {
  let mainWindow = new BrowserWindow({
    // Configure the browser window options
    width: 1500,
    height: 900,
    titleBarStyle: "hidden",
    darkTheme: true,
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
    mainWindow.webContents.openDevTools();
  }

  // Configure session to allow third-party cookies
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders["Origin"] = "https://gangs.gg"; // Replace with your web app domain
    details.requestHeaders["Content-Type"] = "application/json";
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  // Emitted when the window is closed
  mainWindow.on("closed", () => {
    // Dereference the window object
    mainWindow = null;
  });
}

// Run the createWindow function when Electron has finished initializing
app.on("ready", createWindow);
