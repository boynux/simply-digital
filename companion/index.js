import * as messaging from "messaging";
import { settingsStorage } from "settings";

let disconnectWarning = settingsStorage.getItem("disconnect-warning");

settingsStorage.onchange = function(evt) {
  disconnectWarning = settingsStorage.getItem("disconnect-warning");

  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    sendSettings();
  }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Nothing to do
}

messaging.peerSocket.onopen = () => {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    sendSettings();
  }
}

messaging.peerSocket.onmessage = (evt) => {
  // Nothing to do
}

// Send a message to the peer
function sendSettings() {
  // Settings data
  var settings = {
    disconnectWarning: disconnectWarning == "true" ? true : false,
  }

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