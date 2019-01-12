import * as messaging from "messaging";
import { peerSocket } from "messaging";
import { vibration } from "haptics";

let connected = false;
let interval = null;

export function setup(enabled = false) {
    if(enabled) {
        if(interval == null) {
          interval = setInterval(alert, 5000);
        }
      } else if (interval != null) {
        clearInterval(interval);
        interval = null;
      }
}

export function isConnected() {
    return connected;
}

function alert() {
    let currentState = peerSocket.readyState == peerSocket.CLOSED ? false : true;
    // console.log("Connected: " + currentState);
    if(currentState != connected) {
        if (currentState == false) {
            vibration.start("ping");
        }
    }

    connected = currentState;
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
