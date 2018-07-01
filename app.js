"use strict";

require("dotenv").config();
const electron = require("electron");
const {app, BrowserWindow, ipcMain} = electron;
const twitter = require("twitter");
const util = require("util");

let win = null;

const create_win = () => {
	const screen = electron.screen;
	const size = screen.getPrimaryDisplay().size;
	win = new BrowserWindow({
		"top": 0,
		"left": 0,
		"width": size.width,
		"height": size.height,
		"frame": false,
		"transparent": true,
		"alwaysOnTop": true,
	});
	win.maximize();
	win.setIgnoreMouseEvents(true);
	win.loadURL(`file:///${__dirname}/index.html`);
	win.on("closed", () => {
		win = null;
	});

	const tw = new twitter({
		consumer_key: process.env.CONSUMER_KEY,
		consumer_secret: process.env.CONSUMER_SECRET,
		access_token_key: process.env.ACCESS_TOKEN,
		access_token_secret: process.env.ACCESS_TOKEN_SECRET
	});
	tw.stream("user", (stream) => {
		stream.on("data", (data) => {
			const name = data.user.screen_name;
			const text = data.text.replace("\n", " ");
			win.webContents.send("new_tweet", {"name": name, "text": text});
		});
		stream.on("error", (error) => {
			console.log(`error: ${util.inspect(error)}`);
		});
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

