import * as document from 'document';
import { HeartRateSensor } from 'heart-rate';
import * as messaging from 'messaging';

let screenSelect = document.getElementById("screenSelect");
let screenAction = document.getElementById("screenAction");
//let screenResult = document.getElementById("result");

const hrmText = document.getElementById('hrm');
const updLable = document.getElementById('updated');
const gpsText = document.getElementById('gps');
const startBtn = document.getElementById('startBtn');

hrmText.text = '--❤️';
updLable.text = '...';

const lastValueTimestamp = Date.now();

function showScreenSelect() {
  console.log("Show screen select");
  screenSelect.style.display = "inline";
  screenAction.style.display = "none";
}

function showScreenAction() {
  console.log("Show screen action");
  screenSelect.style.display = "none";
  screenAction.style.display = "inline";
}

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
  gpsText.text = evt.data.Latitude;
});

showScreenSelect();
startBtn.onclick = function (){
  showScreenAction();
}
// Set infinity loop for update
setInterval(updateDisplay, 1000);

console.log('Exit');
