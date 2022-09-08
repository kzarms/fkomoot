// Speed
export function zeroPad(i) {
  let num = i;
  if (num < 10) {
    num = `0${num}`;
  }
  return num;
}

export function formatSpeed(speed) {
  const val = ((speed * 3600) || 0) / 1000;
  return val.toFixed(2);
}

export function formatActiveTime(activeTime) {
  let seconds = (activeTime / 1000).toFixed(0);
  let minutes = Math.floor(seconds / 60);
  let hours;
  if (minutes > 59) {
    hours = Math.floor(minutes / 60);
    hours = zeroPad(hours);
    minutes -= hours * 60;
    minutes = zeroPad(minutes);
  }
  seconds = Math.floor(seconds % 60);
  seconds = zeroPad(seconds);
  if (hours) {
    return `${hours}:${minutes}:${seconds}`;
  }
  return `${minutes}:${seconds}`;
}
