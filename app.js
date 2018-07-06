"use strict";

require("dotenv").config();
const electron = require("electron");
const {app, BrowserWindow, ipcMain, Tray, Menu} = electron;
const twitter = require("twitter");
const util = require("util");

let win = null;
let tray = null;

const create_tray = () => {
	tray = new Tray(`${__dirname}/icon.png`);
	const context_menu = Menu.buildFromTemplate([
		{label: "終了", click: () => win.close()}
	]);
	tray.setContextMenu(context_menu);
};

const create_win = () => {
	win = new BrowserWindow({
		top: 0,
		left: 0,
		width: 0,
		height: 0,
		frame: false,
		transparent: true,
		alwaysOnTop: true
	});
	win.maximize();
	win.setIgnoreMouseEvents(true);
	win.loadURL(`file:///${__dirname}/index.html`);
	win.on("closed", () => {
		win = null;
	});

	create_tray();
	
	const tw = new twitter({
		consumer_key: process.env.CONSUMER_KEY,
		consumer_secret: process.env.CONSUMER_SECRET,
		access_token_key: process.env.ACCESS_TOKEN,
		access_token_secret: process.env.ACCESS_TOKEN_SECRET
	});
	tw.stream("user", (stream) => {
		stream.on("data", (data) => {
			const id = data.user.screen_name;
			const name = data.user.name;
			const text = data.text.replace("\n", " ");
			win.webContents.send("new_tweet", {"id": id, "name": name, "text": text});
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

