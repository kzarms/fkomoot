import { me as companion } from 'companion';
import { geolocation } from 'geolocation';
import * as messaging from 'messaging';

// Functions
function sendData(data) {
  // If we have a MessageSocket, send the data to the device
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(JSON.parse(data));
  } else {
    console.log('No peerSocket connection');
  }
}

// GPS functions
function locationSuccess(position) {
  console.log(
    `Latitude: ${position.coords.latitude}`,
    `Longitude: ${position.coords.longitude}`,
  );
  const positionJSON = `{"Latitude":"${position.coords.latitude}","Longitude":"${position.coords.longitude}"}`;
  sendData(positionJSON);
}

function locationError(error) {
  console.log(
    `Error: ${error.code}`,
    `Message: ${error.message}`,
  );
}

function main() {
  // Run GPS monitoring
  if (!companion.permissions.granted('access_location')) {
    console.log("We're not allowed to access the GPD, exit :(");
    return;
  }
  // Start listening data from the watch
  messaging.peerSocket.addEventListener('message', (evt) => {
    console.log(evt.data.hr);
  });
  // Start monitoring GPS location
  geolocation.watchPosition(locationSuccess, locationError, { timeout: 60 * 1000 });
}

// execution
main();
