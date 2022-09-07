import * as document from 'document';
import { HeartRateSensor } from 'heart-rate';

const hrmText = document.getElementById('hrm');
const updLable = document.getElementById('updated');

hrmText.text = '--❤️';
updLable.text = '...';

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

setInterval(updateDisplay, 1000);
