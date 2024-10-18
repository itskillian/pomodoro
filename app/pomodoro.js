"use client"

import { useEffect, useState } from "react";
import { FaHome, FaRegClock } from "react-icons/fa";

export default function Pomodoro() {
  // main component to handle state

  // temp vars
  let workDuration = 10;

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
    setIsWorkSession(prevIsWorkSession => {
      setTimeLeft(prevIsWorkSession ? 300 : 1500);
      return !prevIsWorkSession;
    });
  }

  return (
    <div className="container mx-auto flex h-screen text-center text-black">
      <div className="max-w-1/2 m-auto pb-16">
        <Timer
          timeLeft={timeLeft}
          isWorkSession={isWorkSession}
          isRunning={isRunning}
          setTimeLeft={setTimeLeft}
          setIsWorkSession={setIsWorkSession}
          setIsRunning={setIsRunning}
        />
        <Controls 
          startTimer={startTimer}
          stopTimer={stopTimer}
          resetTimer={resetTimer}
          skipSession={skipSession}
        />
        {/* <SessionCounter />
        <Settings /> */}
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

function Timer ({ timeLeft, isWorkSession, isRunning, setTimeLeft, setIsWorkSession, setIsRunning }) {
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
      setIsWorkSession(prevIsWorkSession => {
        setTimeLeft(prevIsWorkSession ? 300 : 1500);
        return !prevIsWorkSession;
      });
    }
    return () => clearInterval(countdownInterval);
  }, [isRunning, timeLeft, isWorkSession]);

  let formattedTimeLeft = formatTime(timeLeft);

  return (
    <>
      <div className="m-4 text-lg">
        {isWorkSession ? ("Work Session") : ("On Break")}
      </div>
      <div className="m-4 text-8xl">
          { formattedTimeLeft }
        </div>
    </>
  );
}

function Controls ({ startTimer, stopTimer, resetTimer, skipSession }) {
  // timer controls
  // props: isRunning, isWorkSession
  // callbacks: onStart, onStop, onReset, onSkip
  return (
    <div className="m-4 flex justify-between text-xl">
      <button onClick={startTimer} className="mx-4 py-2 px-3 bg-gray-200 rounded-xl">Start</button>
      <button onClick={stopTimer} className="mx-4 p-2 px-3 bg-gray-200 rounded-xl">Stop</button>
      <button onClick={resetTimer} className="mx-4 p-2 px-3 bg-gray-200 rounded-xl">Reset</button>
      <button onClick={skipSession} className="mx-4 p-2 px-3 bg-gray-200 rounded-xl">Skip</button>
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