import clock from "clock";
import document from "document";
import { battery } from "power";
import { peerSocket } from "messaging";
import { vibration } from "haptics";

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

const days = ['sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri'];
const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

let lastState = null;

// Returns an angle (0-360) for the current hour in the day, including minutes
function hoursToAngle(hours, minutes) {
  let hourAngle = (360 / 12) * hours;
  let minAngle = (360 / 12 / 60) * minutes;
  return hourAngle + minAngle;
}

// Returns an angle (0-360) for minutes
function minutesToAngle(minutes) {
  return (360 / 60) * minutes;
}


// Returns an angle (0-360) for seconds
function secondsToAngle(seconds) {
  return (360 / 60) * seconds;
}

setInterval(() => {
  if(lastState != peerSocket.readyState) {
    if (peerSocket.readyState === peerSocket.CLOSED) {
      vibration.start("ping");
    }
  }

  lastState = peerSocket.readyState;
}, 10000);

// Rotate the hands every tick
function updateClock(evt) {
  let today = evt.date;
  let hours = today.getHours() % 12;
  let mins = today.getMinutes();
  let secs = today.getSeconds();
  
  clockHour.text = ("0" + today.getHours()).slice(-2);
  clockMin.text = ("0" + today.getMinutes()).slice(-2);
  clockSec.text = ("0" + today.getSeconds()).slice(-2);
  
  clockYear.text = today.getFullYear();
  clockDay.text = ("0" + today.getDate()).slice(-2);
  clockWD.text = days[today.getDay()];
  clockMonth.text = months[today.getMonth()];
  
  batteryText.text = Math.floor(battery.chargeLevel);

  if (lastState == peerSocket.CLOSED) {
    disconnect.style.visibility = "visible";
  } else {
    disconnect.style.visibility = "hidden";
  }
}

// Update the clock every tick event
clock.ontick = (evt) => updateClock(evt);
