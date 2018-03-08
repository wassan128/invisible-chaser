"use strict";

const electron = require("electron");
const express = require("express");
const app = express();
app.use(express.static("public"));
app.listen(3000, "localhost");

electron.app.on("ready", () => {
	const main = new electron.BrowserWindow({width: 800, height: 600});
	main.on("closed", electron.app.quit);
	main.webContents.openDevTools();
	main.loadURL("http://localhost:3000");
});

