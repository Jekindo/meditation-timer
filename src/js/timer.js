const refs = {
  startBtn: document.querySelector('button[data-action="start-timer"]'),
  timeInput: document.querySelector('.js-input-time'),
  clockFace: document.querySelector('.js-timer'),
};

const timer = {
  intervalId: null,
  isActive: false,
  start() {
    if (this.isActive) {
      this.stop();
	  this.start()
      return;
    }

    this.isActive = true;

    const targetTime = Date.now() + refs.timeInput.value * 1000 * 60;
    console.log('🚀  targetTime:', targetTime);

    this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = targetTime - currentTime;
      console.log('🚀 deltaTime:', deltaTime);
      const timeComponents = getTimeComponents(deltaTime);

      if (deltaTime < 1) {
        this.stop();
        return;
      }

      updateClockFace(timeComponents);
    }, 1000);
  },
  stop() {
    clearInterval(this.intervalId);
    this.isActive = false;
    // const timeComponents = getTimeComponents(0);
    // updateClockFace(timeComponents);
  },
};

refs.startBtn.addEventListener('click', timer.start.bind(timer));
refs.timeInput.addEventListener('focus', ontimeInputFocus);
refs.timeInput.addEventListener('blur', ontimeInputBlur);

function ontimeInputFocus(evt) {
  window.addEventListener('keydown', onEnterKeyPress);
}

function ontimeInputBlur(evt) {
  window.removeEventListener('keydown', onEnterKeyPress);
}

function onEnterKeyPress(evt) {
  if (evt.code !== 'Enter' && evt.code !== 'NumpadEnter') {
    return;
  }

  console.log(evt.code);

  timer.start();
}

function updateClockFace(timeComponents) {
  const keys = Object.keys(timeComponents);

  for (const key of keys) {
    document.querySelector(`#${key}-tens`).textContent =
      timeComponents[key].tens;
    document.querySelector(`#${key}`).textContent = timeComponents[key][key];
  }
}

function getTimeComponents(time) {
  const mins = pad(Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)));
  const secs = pad(Math.floor((time % (1000 * 60)) / 1000));

  return {
    min: {
      tens: mins[0],
      min: mins[1],
    },
    sec: {
      tens: secs[0],
      sec: secs[1],
    },
  };
}

function pad(value) {
  return String(value).padStart(2, '0');
}
