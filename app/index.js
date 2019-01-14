import clock from "clock";
import document from "document";
import { battery } from "power";

import * as settingsHandler from "./settings";
import * as monitor from "./monitor";
import * as digital from "./digital";

// Update the clock every second
clock.granularity = "seconds";

let batteryText = document.getElementById('battery');
let disconnect = document.getElementById('disconnect');

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

//update clock on every tick
function updateClock(evt) {
  digital.update(evt.date);

  batteryText.text = Math.floor(battery.chargeLevel);

  if (monitor.isConnected() || !settings.disconnectWarning) {
    disconnect.style.visibility = "hidden";
  } else {
    disconnect.style.visibility = "visible";
  }
}

// Update the clock every tick event
clock.ontick = (evt) => updateClock(evt);
