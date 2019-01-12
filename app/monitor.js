import * as messaging from "messaging";

let connected = false;

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
