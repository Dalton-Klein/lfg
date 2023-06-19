const { app, session, BrowserWindow } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const url = require("url");
require("dotenv").config();
require("@electron/remote/main").initialize();
const { setupTitlebar, attachTitlebarToWindow } = require("custom-electron-titlebar/main");

// setupTitlebar();

// Create a new browser window
function createWindow() {
  let mainWindow = new BrowserWindow({
    // Configure the browser window options
    width: 1500,
    height: 900,
    titleBarStyle: "hidden",
    webPreferences: {
      enableRemoteModule: true,
      webSecurity: false,
      nodeIntegration: true,
      contextIsolation: false,
      // preload: path.join(__dirname, "preload.js"),
    },
    icon: __dirname + "/build/favicon.ico",
    title: "gangs",
    autoHideMenuBar: true,
  });

  // attachTitlebarToWindow(mainWindow);

  // Load your existing app's HTML file
  if (isDev) {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
  } else {
    console.log("dirname?", __dirname);
    mainWindow.loadURL(`file://${path.join(__dirname, "../build/index.html")}`);
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
