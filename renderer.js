"use strict";

const {ipcRenderer} = require("electron");

const N_LANE = 16;
let LANES = (new Array(N_LANE)).fill(true);

const prepare_lane_anim = (n_lane, x_max) => {
	for (let no = 0; no < n_lane; no++) {
		const anim = `
			@keyframes lane${no} {
				0% {transform: translate(${x_max}px, ${no * 1.5}em);}
				100% {transform: translate(-100%, ${no * 1.5}em);}
			}
		`;
		document.styleSheets[0].insertRule(anim, 0);
	}
};

const lets_swim = (text, lane_no) => {
	const box = document.querySelector("#box");
	const tweet = document.createElement("p");
	tweet.setAttribute("class", `tweets l_${lane_no}`);
	tweet.innerText = text.replace(/\r?\n/g, " ");
	tweet.style.animationName = `lane${lane_no}`;
	box.appendChild(tweet);
};

const apply_lane_status = () => {
	for (const t of document.querySelectorAll(".tweets")) {
		if (t.getBoundingClientRect().right <= 0) {
			const idx = parseInt(t.getAttribute("class").split(" ")[1].substr(2));
			t.remove();
			LANES[idx] = true;
		}
	}
};

document.addEventListener("DOMContentLoaded", () => {
	setInterval(apply_lane_status, 5000);
	prepare_lane_anim(N_LANE, 1280);
	ipcRenderer.on("new_tweet", (e, data) => {
		const lane_no = LANES.indexOf(true);
		LANES[lane_no] = false;
		lets_swim(`${data.text} (@${data.name})`, lane_no);
	});
});

