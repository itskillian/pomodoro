"use client"

import { useEffect, useState } from "react";
import { FaHome, FaRegClock } from "react-icons/fa";

export default function Pomodoro() {
  // main component to handle state

  // temp vars
  let workDuration = 1500;

  // state
  const [timeLeft, setTimeLeft] = useState(workDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  //const [workDuration, setWorkDuration] = useState(1500);
  //const [breakDuration, setBreakDuration] = useState(300);

  // handlers
  const startTimer = () => {
    setIsRunning(true);
  }
  const stopTimer = () => {
    setIsRunning(false);
  }
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isWorkSession ? 1500 : 300);
  }
  const skipSession = () => {
    setIsRunning(false);
    setIsWorkSession(!isWorkSession);
    setTimeLeft(!isWorkSession ? 1500 : 300);
  }

  return (
    <div className="container mx-auto flex flex-col text-center text-black">
      <div className="w-1/2 mx-auto my-4">
        <Timer
          timeLeft={timeLeft}
          isWorkSession={isWorkSession}
          isRunning={isRunning}
          setTimeLeft={setTimeLeft}
          setIsRunning={setIsRunning}
        />
        <Controls 
          startTimer={startTimer}
          stopTimer={stopTimer}
          resetTimer={resetTimer}
          skipSession={skipSession}
        />
        <SessionCounter />
        <Settings />
      </div>
    </div>
  );
}

function SideBar () {
  const SideBarIcon = ({ icon, text = 'tooltip' }) => (
    <div className="sidebar-icon group">
      {icon}

      <span class="sidebar-tooltip group-hover:scale-100">
        {text}
      </span>
    </div>
  );
  return (
    <div className="
      fixed top-0 left-0 h-screen w-16 m-0 p-0
      flex flex-col
      bg-gray-800 text-white shadow-lg">
        <SideBarIcon icon={<FaHome size="28" />} />
        <SideBarIcon icon={<FaRegClock size="28" />} />
    </div>
  );
}

function Timer ({ timeLeft, isWorkSession, isRunning, setTimeLeft, setIsRunning }) {
  // countdown timer
  useEffect(() => {
    let countdownInterval;

    if (isRunning && timeLeft > 0) {
      countdownInterval = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(countdownInterval);
      setIsRunning(false);
    }
    return () => clearInterval(countdownInterval);
  }, [isRunning, timeLeft]);

  let formattedTimeLeft = formatTime(timeLeft);

  return (
    <div className="m-4">
      <div className="m-4 text-xl">
        {isWorkSession ? ("Work Session") : ("On Break")}
      </div>
      <div className="text-8xl">
          { formattedTimeLeft }
        </div>
    </div>
  );
}

function Controls ({ startTimer, stopTimer, resetTimer, skipSession }) {
  // timer controls
  // props: isRunning, isWorkSession
  // callbacks: onStart, onStop, onReset, onSkip
  return (
    <div className="flex justify-evenly text-xl">
      <button onClick={startTimer} className="py-2 px-3 bg-gray-200 rounded-xl">Start</button>
      <button onClick={stopTimer} className="p-2 px-3 bg-gray-200 rounded-xl">Stop</button>
      <button onClick={resetTimer} className="p-2 px-3 bg-gray-200 rounded-xl">Reset</button>
      <button onClick={skipSession} className="p-2 px-3 bg-gray-200 rounded-xl">Skip</button>
    </div>
  );
}

function SessionCounter () {
  // tracks statistics
  // props: totalWorkTime, sessionCount
  // optional prop: totalBreakTime
  // state:
  return (
    <>
      <p>Session Count: #</p>
      <p>Total working time: 00:00</p>
    </>
  );
}

function Settings () {
  // settings to adjust timer
  // props: workDuration, breakDuration
  // callbacks: onWorkDurationChange, onBreakDurationChange
  return (
    <>
      <button>Settings</button>
      <div>
        <form>
          <label htmlFor="">Work Duration</label>
          <input type="number" />
        </form>
        <form>
          <label htmlFor="">Break Duration</label>
          <input type="number" />
        </form>
      </div>
    </>
  );
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}