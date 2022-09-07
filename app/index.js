import * as document from 'document';
import { HeartRateSensor } from 'heart-rate';
import * as messaging from 'messaging';

const hrmText = document.getElementById('hrm');
const updLable = document.getElementById('updated');
const gpsText = document.getElementById('gps');

hrmText.text = '--❤️';
updLable.text = '...';

const lastValueTimestamp = Date.now();

function convertMsAgoToString(millisecondsAgo) {
  if (millisecondsAgo < 120 * 1000) {
    return `${Math.round(millisecondsAgo / 1000)}s ago`;
  }
  if (millisecondsAgo < 60 * 60 * 1000) {
    return `${Math.round(millisecondsAgo / (60 * 1000))}min ago`;
  }

  return `${Math.round(millisecondsAgo / (60 * 60 * 1000))}h ago`;
}

function updateDisplay() {
  if (lastValueTimestamp !== undefined) {
    updLable.text = convertMsAgoToString(Date.now() - lastValueTimestamp);
  }
}

function sendData(data) {
  // If we have a MessageSocket, send the data to the device
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(JSON.parse(data));
  } else {
    console.log('No peerSocket connection');
  }
}

if (HeartRateSensor) {
  console.log('This device has a HeartRateSensor!');
  const hrm = new HeartRateSensor();
  hrm.addEventListener('reading', () => {
    // Set color based on user profile
    const hrRate = hrm.heartRate;
    // Set HR value
    if (hrRate === null) {
      hrmText.text = '--❤️';
    } else {
      hrmText.text = `${hrRate}❤️`;
      sendData(`{"hr":"${hrRate}"}`);
    }
  });
  // Start
  hrm.start();
} else {
  console.log('This device does NOT have a HeartRateSensor!');
}

messaging.peerSocket.addEventListener('message', (evt) => {
  console.log(evt.data.Latitude);
});



// Set infinity loop for update
setInterval(updateDisplay, 1000);

console.log('Exit');
