import { me as companion } from 'companion';
import { geolocation } from 'geolocation';
import * as messaging from 'messaging';

const MILLISECONDS_PER_MINUTE = 1000 * 60;

companion.wakeInterval = 0.5 * MILLISECONDS_PER_MINUTE;
// Functions
function doThis(position) {
  console.log('Wake interval happened!');
  console.log(`Significant location change! ${JSON.stringify(position)}`);
}

function sendSettingData(data) {
// If we have a MessageSocket, send the data to the device
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  } else {
    console.log('No peerSocket connection');
  }
}

// Listen for the event
companion.addEventListener('wakeinterval', doThis);

// Event happens if the companion is launched and has been asleep
if (companion.launchReasons.wokenUp) {
  doThis();
}

// GPS

function locationSuccess(position) {
  console.log(
    `Latitude: ${position.coords.latitude}`,
    `Longitude: ${position.coords.longitude}`,
  );
}

function locationError(error) {
  console.log(
    `Error: ${error.code}`,
    `Message: ${error.message}`,
  );
}
// Run GPS monitoring
geolocation.watchPosition(locationSuccess, locationError, { timeout: 60 * 1000 });
