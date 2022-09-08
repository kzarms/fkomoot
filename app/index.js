import * as document from 'document';
import { me as appbit } from 'appbit';
import exercise from 'exercise';
import clock from 'clock';
import * as utils from './utils';
import { HeartRateSensor } from 'heart-rate';
// import * as messaging from 'messaging';

// Define global var
let EXCERSIZE_INDEX = 0;
const EXCERSIZE_TYPE = ['', 'run', 'cycling'];

// Define screens
const screenSelect = document.getElementById('screenSelect');
const screenAction = document.getElementById('screenAction');
const screenResults = document.getElementById('screenResults');
// Get item lists
const list = document.getElementById('exerciseList');
const items = list.getElementsByClassName('list-item');
// Action screen text
const hrmText = document.getElementById('hrmText');
const timeText = document.getElementById('timeText');
const speedText = document.getElementById('speedText');
const stepsText = document.getElementById('stepsText');

// const gpsText = document.getElementById('gps');
const buttonStart = document.getElementById('buttonStart');
const buttonPause = document.getElementById('buttonPause');
const buttonFinish = document.getElementById('buttonFinish');
const buttonExit = document.getElementById('buttonExit');

// const lastValueTimestamp = Date.now();

// Functions
function showScreenResults() {
  console.log('Show screen action');
  screenSelect.style.display = 'none';
  screenAction.style.display = 'none';
  screenResults.style.display = 'inline';
  // Handle buttons
  buttonExit.addEventListener('click', () => {
    console.log('Exit clicked');
    appbit.exit();
  });
}
function buttonsUpdate() {
  // Start HR
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
      }
    });
    // Start
    hrm.start();
  } else {
    console.log('This device does NOT have a HeartRateSensor!');
  }
  //
  buttonStart.addEventListener('click', () => {
    buttonStart.style.display = 'none';
    buttonPause.style.display = 'inline';
    buttonFinish.style.display = 'inline';
    // If ex on pause => resume, or start if not
    if (exercise.state === 'paused') {
      console.log(`Resume ${EXCERSIZE_TYPE[EXCERSIZE_INDEX]}`);
      exercise.resume();
    } else {
      console.log(`Start ${EXCERSIZE_TYPE[EXCERSIZE_INDEX]}`);
      exercise.start(EXCERSIZE_TYPE[EXCERSIZE_INDEX], { gps: false });
    }
  });
  buttonPause.addEventListener('click', () => {
    buttonStart.style.display = 'inline';
    buttonPause.style.display = 'none';
    buttonFinish.style.display = 'none';
    // Start exersize
    console.log(`Pause ${EXCERSIZE_TYPE[EXCERSIZE_INDEX]}`);
    exercise.pause();
  });
  buttonFinish.addEventListener('click', () => {
    console.log(`Finish ${EXCERSIZE_TYPE[EXCERSIZE_INDEX]}`);
    exercise.stop();
    showScreenResults();
  });
  // Update screen every second
  clock.granularity = 'seconds';
  clock.ontick = (evt) => {
    const today_time = evt.date;
    // Set time
    let hours = today_time.getHours();
    hours = utils.zeroPad(hours);
    const mins = utils.zeroPad(today_time.getMinutes());
    //app_time.text = `${hours}:${mins}`;
    if (exercise && exercise.stats && exercise.state === 'started') {
      //
      timeText.text = utils.formatActiveTime(exercise.stats.activeTime);
      speedText.text = `${utils.formatSpeed(exercise.stats.speed.current)}km/h`;
      stepsText.text = `${exercise.stats.steps}`;
    }
  };
}
function showScreenAction() {
  console.log('Show screen action');
  screenSelect.style.display = 'none';
  screenAction.style.display = 'inline';
  screenResults.style.display = 'none';
  // Handle buttons
  buttonsUpdate();
}
function showScreenSelect() {
  console.log('Show screen select');
  screenSelect.style.display = 'inline';
  screenAction.style.display = 'none';
  screenResults.style.display = 'none';
  // Set listeners for items
  items.forEach((element, index) => {
    const touch = element.getElementById('touch');
    if (touch !== null) {
      touch.onclick = function () {
        // console.log(`touched: ${index}`);
        if (index === 3) {
          // Exit
          appbit.exit();
        } else {
          // Set global var and switch to the second screen
          EXCERSIZE_INDEX = parseInt(index);
          showScreenAction();
        }
      };
    }
  });
}

// function convertMsAgoToString(millisecondsAgo) {
//   if (millisecondsAgo < 120 * 1000) {
//     return `${Math.round(millisecondsAgo / 1000)}s ago`;
//   }
//   if (millisecondsAgo < 60 * 60 * 1000) {
//     return `${Math.round(millisecondsAgo / (60 * 1000))}min ago`;
//   }

//   return `${Math.round(millisecondsAgo / (60 * 60 * 1000))}h ago`;
// }

// function updateDisplay() {
//   if (lastValueTimestamp !== undefined) {
//     // updLable.text = convertMsAgoToString(Date.now() - lastValueTimestamp);
//   }
// }

// function sendData(data) {
//   // If we have a MessageSocket, send the data to the device
//   if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
//     messaging.peerSocket.send(JSON.parse(data));
//   } else {
//     console.log('No peerSocket connection');
//   }
// }

function main() {
  // Show the main screen
  // showScreenAction();
  showScreenSelect();

  // // Track
  // items.forEach((element, index) => {
  //   let touch = element.getElementById("touch");
  //   touch.onclick = function(evt) {
  //     console.log(`touched: ${index}`);
  //   };
  // });
}



// messaging.peerSocket.addEventListener('message', (evt) => {
//   console.log(evt.data.Latitude);
//   gpsText.text = evt.data.Latitude;
// });

// showScreenSelect();
// startBtn.onclick = function (){
//   showScreenAction();
// }
// // Set infinity loop for update
// setInterval(updateDisplay, 1000);

main();
