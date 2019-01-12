import clock from "clock";
import document from "document";
import { battery } from "power";
import { peerSocket } from "messaging";
import { vibration } from "haptics";
import * as messaging from "messaging";
import * as settingsHandler from "./settings";
import { preferences } from "user-settings";

console.log(preferences.clockDisplay);

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

const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

let interval = null;
let connected = false;
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

  if(settings.disconnectWarning) {
    if(interval == null) {
      interval = setInterval(() => {
        let currentState = peerSocket.readyState == peerSocket.CLOSED ? false : true;
        // console.log("Connected: " + currentState);
        if(currentState != connected) {
          if (currentState == false) {
            vibration.start("ping");
          }
        }

        connected = currentState;
     }, 5000);
    }
  } else if (interval != null) {
    clearInterval(interval);
    interval = null;
  }
}

// Rotate the hands every tick
function updateClock(evt) {  
  let today = evt.date;
  let hours = ("0" + today.getHours()).slice(-2);

  if(preferences.clockDisplay == '12h') {
    hours = today.getHours() > 12 ?
    today.getHours() % 12 :
    today.getHours();
  }

  clockHour.text = hours;
  clockMin.text = ("0" + today.getMinutes()).slice(-2);
  clockSec.text = ("0" + today.getSeconds()).slice(-2);
  
  clockYear.text = today.getFullYear();
  clockDay.text = ("0" + today.getDate()).slice(-2);
  clockWD.text = days[today.getDay()];
  clockMonth.text = months[today.getMonth()];
  
  batteryText.text = Math.floor(battery.chargeLevel);

  if (connected || !settings.disconnectWarning) {
    disconnect.style.visibility = "hidden";
  } else {
    disconnect.style.visibility = "visible";
  }
}

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  // Ready to send messages
  connected = true;
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  connected = false;
}

// Update the clock every tick event
clock.ontick = (evt) => updateClock(evt);
