import clock from "clock";
import document from "document";
import { battery } from "power";
import { peerSocket } from "messaging";
import { vibration } from "haptics";
import * as messaging from "messaging";

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
let connected = true;
let settings = {
  disconnectWarning: false,
}

function updateSettings(settings) {
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

// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {
  // Output the message to the console
  console.log(JSON.stringify(evt.data));

  settings = evt.data;
  updateSettings(settings);
}

// Update the clock every tick event
clock.ontick = (evt) => updateClock(evt);
