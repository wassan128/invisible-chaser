"use strict";

const {app, BrowserWindow} = require("electron");
let win = null;

const create_win = () => {
	win = new BrowserWindow({
		"top": 0,
		"left": 0,
		"width": 800,
		"height": 600,
		"frame": false,
		"show": true,
		"transparent": true,
		"resizable": false,
		"always-on-top": true
	});
	//win.setIgnoreMouseEvents(true);
	win.maximize();
	win.loadURL(`file:///${__dirname}/index.html`);
	win.on("closed", () => {
		win = null;
	});
};

app.on("ready", create_win);
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
app.on("activate", () => {
	if (win === null) {
		create_win();
	}
});

