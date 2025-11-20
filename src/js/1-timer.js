// 1. Імпорти бібліотек та стилів
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// 2. Отримання елементів DOM
const datetimePicker = document.querySelector("#datetime-picker");
const startBtn = document.querySelector("[data-start]");
const timerFields = {
  days: document.querySelector("[data-days]"),
  hours: document.querySelector("[data-hours]"),
  minutes: document.querySelector("[data-minutes]"),
  seconds: document.querySelector("[data-seconds]"),
};

// 3. Змінні для зберігання стану
let userSelectedDate = null;
let intervalId = null;

// Спочатку кнопка "Start" неактивна
startBtn.disabled = true;

// 4. Налаштування flatpickr
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const now = new Date();

    // Валідація дати
    if (selectedDate <= now) {
      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topRight',
        messageColor: "white",
        color: "#fd5548",
        close: null,
      });
      startBtn.disabled = true;
    } else {
      userSelectedDate = selectedDate;
      startBtn.disabled = false;
    }
  },
};

// Ініціалізація календаря
flatpickr(datetimePicker, options);

// 5. Функція форматування часу (додає 0 попереду)
function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}

// 6. Функція конвертації мілісекунд (надана в умові)
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

// 7. Функція оновлення інтерфейсу таймера
function updateTimerInterface({ days, hours, minutes, seconds }) {
  timerFields.days.textContent = addLeadingZero(days);
  timerFields.hours.textContent = addLeadingZero(hours);
  timerFields.minutes.textContent = addLeadingZero(minutes);
  timerFields.seconds.textContent = addLeadingZero(seconds);
}

// 8. Логіка запуску таймера
startBtn.addEventListener("click", () => {
  // Блокуємо інтерфейс
  startBtn.disabled = true;
  datetimePicker.disabled = true;

  // Запускаємо інтервал
  intervalId = setInterval(() => {
    const currentTime = Date.now();
    const deltaTime = userSelectedDate - currentTime;

    // Якщо час вийшов
    if (deltaTime <= 0) {
      clearInterval(intervalId); // Зупиняємо таймер
      updateTimerInterface({ days: 0, hours: 0, minutes: 0, seconds: 0 }); // Обнуляємо інтерфейс
      datetimePicker.disabled = false; // Розблокуємо інпут
      return;
    }

    // Конвертуємо час і оновлюємо інтерфейс
    const timeComponents = convertMs(deltaTime);
    updateTimerInterface(timeComponents);

  }, 1000);
});

