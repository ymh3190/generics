require("dotenv").config();
const { app, BrowserWindow } = require("electron");

app
  .on("ready", () => {
    const win = new BrowserWindow({
      width: 1024,
      height: 738,
      // fullscreen: true,
      // kiosk: true,
      // resizable: false,
      webPreferences: {
        nodeIntegration: true,
      },
    });

    const port = process.env.PORT || 3000;
    win.setMenu(null);
    win.loadURL(`http://localhost:${port}`);
  })
  .on("window-all-closed", () => {
    app.quit();
  });
