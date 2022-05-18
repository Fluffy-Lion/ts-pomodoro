let timer: {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
  longBreakInterval: number;
  sessions: number;
  // question marks to say its optional, can be added later
  mode?: string;
  remainingTime?: any;
};
// starting values for timer
timer = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
  sessions: 0,
};

let interval: number = <any>setInterval(() => {});

let getRemainingTime: (a: number) => object;
getRemainingTime = (endTime) => {
  // taking the endtime and subtracting the current to leave
  // with the time remaining for the countdown
  let newDate = new Date();
  let currentTime = newDate.getTime();
  const difference = endTime - currentTime;
  // parseInt takes a string argument
  // last argument is radix of 10, converts from a decimal number
  const total = Number.parseInt(String(difference / 1000), 10);
  const minutes = Number.parseInt(String((total / 60) % 60), 10);
  const seconds = Number.parseInt(String(total % 60), 10);

  return {
    total,
    minutes,
    seconds,
  };
};

let startTimer = () => {
  let { total } = timer.remainingTime;
  let newDate = new Date();
  let date = newDate.getTime();
  let old = date;
  // if session started is pomodoro then increase session by 1
  // when its gets to 4 will trigger long break
  if (timer.mode === "pomodoro") timer.sessions++;
  let endTime = date + total * 1000;
  console.log(date - old);
  // changing the button action to stop, changing text content
  // and adding active class
  mainButton.dataset.action = "stop";
  mainButton.textContent = "stop";
  mainButton.classList.add("active");

  interval = setInterval(() => {
    console.log("tick");
    // return value from getRemainingTime
    timer.remainingTime = getRemainingTime(endTime);
    // updateClock called and updates the countdown to latest value
    updateClock();
    // if the updated value for total is 0
    // the interval is canceled and cleared
    total = timer.remainingTime.total;
    if (total <= 0) {
      clearInterval(interval);

      switch (timer.mode) {
        case "pomodoro":
            // is timer sessions is divisible by 4 with a remainder of 0
            // then switchmode has argument 'longbreak'
            // other wise short break is triggered
          if (timer.sessions % timer.longBreakInterval === 0) {
            switchMode("longBreak");
          } else {
            switchMode("shortBreak");
          }
          break;
        default:
          switchMode("pomodoro");
      }
      let sound = document.getElementById("sound") as HTMLAudioElement
      sound.play()
      startTimer()
    }
  }, 1000);
};

const mainButton = document.getElementById("btn") as HTMLButtonElement;
// once main button clicked, the data-action attribute is stored in
// the action variable to check it is equal to start
mainButton.addEventListener("click", () => {
  const { action } = mainButton.dataset;
  if (action === "start") {
    startTimer();
  } else {
    stopTimer();
  }
});
const stopTimer = () => {
  clearInterval(interval);
  mainButton.dataset.action = "start";
  mainButton.textContent = "start";
  mainButton.classList.remove("active");
};

const modeButtons = document.querySelector(
  "#mode-buttons"
) as HTMLButtonElement;

const updateClock = () => {
  const { remainingTime } = timer;
  // had to change version on JS to ES2017 to use padStart
  // pad start passes current string with another
  // multiple if needed
  const minutes = `${remainingTime.minutes}`.padStart(2, "0");
  const seconds = `${remainingTime.seconds}`.padStart(2, "0");

  const min = document.getElementById("minutes") as HTMLSpanElement;
  const sec = document.getElementById("seconds") as HTMLSpanElement;
  min.textContent = minutes;
  sec.textContent = seconds;
  console.log("minutes: ", remainingTime.minutes)
  console.log("seconds: ", remainingTime.seconds)
  const text = timer.mode === 'pomodoro' ? 'get back to work' : 'time to take a break'
  document.title = `${minutes}:${seconds} - ${text}`
  let progress = document.getElementById("progress") as HTMLProgressElement

  // typeof give the type { timer object }
  // keyof literal type union 
  progress.value = timer[timer.mode as keyof typeof timer] * 60 - timer.remainingTime.total
};
const switchMode = (mode: string) => {
  // updating the mode and remaining time property
  timer.mode = mode;
  timer.remainingTime = {
    // total number of seconds remaining
    // total is between pomodoro, short break or long break
    // that remaining time is multiplied by 60
    total: timer[mode as keyof object] * 60,
    minutes: timer[mode as keyof object],
    seconds: 0,
  };
  console.log(timer);
  document
    .querySelectorAll("button[data-mode]")
    .forEach((e) => e.classList.remove("active"));
  // css attribute selector (square brackets)
  document.querySelector(`[data-mode="${mode}"]`)?.classList.add("active");
  // css custom properties
  document.body.style.backgroundColor = `var(--${timer.mode})`;
  let progress = document.getElementById("progress") as HTMLProgressElement
  progress.setAttribute('max', timer.remainingTime.total)

  updateClock();
};

const handleMode = (e: Event) => {
  // have to specify that its an element
  // detecting a click on any of the buttons
  const target = e.target as HTMLButtonElement;
  const { mode } = target.dataset;
  console.log(mode);
  if (!mode) return;

  //data mode is send to switch mode function
  switchMode(mode);
  stopTimer();
};
modeButtons.addEventListener("click", handleMode);
const timerDisplay = document.querySelector(
  "#timerDisplay"
) as HTMLParagraphElement;
// const startTimer = document.querySelector("#startTimer") as HTMLButtonElement;

// console.log(timer);
//added at the start so it has pomodoro as first value
document.addEventListener("DOMContentLoaded", () => {
  console.log("loaded");
  switchMode("pomodoro");
});
