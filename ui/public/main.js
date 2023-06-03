const { app, BrowserWindow } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const url = require("url");
require("dotenv").config();

require("@electron/remote/main").initialize();

// Create a new browser window
function createWindow() {
  let mainWindow = new BrowserWindow({
    // Configure the browser window options
    width: 800,
    height: 600,
    webPreferences: {
      enableRemoteModule: true,
      webSecurity: false,
    },
    icon: __dirname + "/build/favicon.ico",
    title: "gangs",
    autoHideMenuBar: true,
  });

  // Load your existing app's HTML file
  if (isDev) {
    mainWindow.loadURL("http://localhost:3000");
  } else {
    console.log("dirname?", __dirname);
    mainWindow.loadURL(`file://${path.join(__dirname, "../build/index.html")}`);
    mainWindow.webContents.openDevTools();
  }

  // Other code...

  // Emitted when the window is closed
  mainWindow.on("closed", () => {
    // Dereference the window object
    mainWindow = null;
  });
}

// Run the createWindow function when Electron has finished initializing
app.on("ready", createWindow);
