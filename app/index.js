import clock from "clock";
import document from "document";
import { battery } from "power";
import { peerSocket } from "messaging";
import { vibration } from "haptics";
import { preferences } from "user-settings";

import * as settingsHandler from "./settings";
import * as monitor from "./monitor";
import * as utils from "./utils";

// Update the clock every second
clock.granularity = "seconds";

let clockHour = document.getElementById('clock-hour');
let clockMin = document.getElementById('clock-min');
let clockSec = document.getElementById('clock-sec');

let clockWD = document.getElementById('clock-wd');
let clockMonth = document.getElementById('clock-month');
let clockYear = document.getElementById('clock-year');
let clockDay = document.getElementById('clock-day');

let batteryText = document.getElementById('battery');
let disconnect = document.getElementById('disconnect');

let interval = null;

const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

let settings = {
  disconnectWarning: false,
};

settingsHandler.initialize((data) => {
  if(data) {
    updateSettings(data);
  }
});

function updateSettings(newSettings) {
  Object.keys(newSettings).forEach(key => {
    settings[key] = newSettings[key];
  });

  monitor.setup(settings.disconnectWarning);
}

// Rotate the hands every tick
function updateClock(evt) {  
  let today = evt.date;
  let hours = utils.zeroPad(today.getHours());

  if(preferences.clockDisplay == '12h') {
    hours = today.getHours() > 12 ?
    today.getHours() % 12 :
    today.getHours();
  }

  clockHour.text = hours;
  clockMin.text = utils.zeroPad(today.getMinutes());
  clockSec.text = utils.zeroPad(today.getSeconds());
  
  clockYear.text = today.getFullYear();
  clockDay.text = utils.zeroPad(today.getDate());
  clockWD.text = days[today.getDay()];
  clockMonth.text = months[today.getMonth()];
  
  batteryText.text = Math.floor(battery.chargeLevel);

  if (connected || !settings.disconnectWarning) {
    disconnect.style.visibility = "hidden";
  } else {
    disconnect.style.visibility = "visible";
  }
}


// Update the clock every tick event
clock.ontick = (evt) => updateClock(evt);
