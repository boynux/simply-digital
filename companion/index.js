import * as messaging from "messaging";
import { settingsStorage } from "settings";

let settings = loadSettings();

function loadSettings() {
  let disconnectWarning = settingsStorage.getItem("disconnect-warning");
  
   return {
    disconnectWarning: disconnectWarning == "true" ? true : false,
  };
}

settingsStorage.onchange = function(evt) {
  settings = loadSettings();

  sendSettings();
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Nothing to do
}

messaging.peerSocket.onopen = () => {
  sendSettings();
}

messaging.peerSocket.onmessage = (evt) => {
  // Nothing to do
}

// Send a message to the peer
function sendSettings() {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send the data to peer as a message
    messaging.peerSocket.send(settings);
  }
}

/*
setInterval(() => {
  sendSettings();
}, 5000);
*/