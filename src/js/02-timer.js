import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const startBtn = document.querySelector('[data-start]');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');
let timerId = null;

startBtn.setAttribute('disabled', true);

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

const padEl = value => String(value).padStart(2, 0);

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] < new Date()) {
      alert('Please choose a date in the future');
      return;
    }
    startBtn.removeAttribute('disabled');

    const showTimer = () => {
      const now = new Date();
      localStorage.setItem('selectedData', selectedDates[0]);
      const selectData = new Date(localStorage.getItem('selectedData'));

      if (!selectData) return;

      const diff = selectData - now;
      const { days, hours, minutes, seconds } = convertMs(diff);
      daysEl.textContent = days;
      hoursEl.textContent = padEl(hours);
      minutesEl.textContent = padEl(minutes);
      secondsEl.textContent = padEl(seconds);

      if (
        daysEl.textContent === '0' &&
        hoursEl.textContent === '00' &&
        minutesEl.textContent === '00' &&
        secondsEl.textContent === '00'
      ) {
        clearInterval(timerId);
      }
    };

    const onClick = () => {
      if (timerId) {
        clearInterval(timerId);
      }
      showTimer();
      timerId = setInterval(showTimer, 1000);
    };

    startBtn.addEventListener('click', onClick);
  },
};

flatpickr('#datetime-picker', { ...options });