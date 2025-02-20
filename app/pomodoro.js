"use client"

import { useEffect, useState } from "react";
import { FaHome, FaRegClock } from "react-icons/fa";

export default function Pomodoro() {
  // const vars
  const INIT_WORK_DURATION = 1500;
  const INIT_BREAK_DURATION = 300;
  
  // state
  const [workDuration, setWorkDuration] = useState(INIT_WORK_DURATION);
  const [breakDuration, setBreakDuration] = useState(INIT_BREAK_DURATION);
  const [timeLeft, setTimeLeft] = useState(workDuration);
  const [initTimeLeft, setInitTimeLeft] = useState(workDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [sessionCount, setSessionCount] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  
  // local storage reads (on mount)
  useEffect(() => {
    const savedWorkDuration = localStorage.getItem('workDuration');
    if (savedWorkDuration !== null) {
      setWorkDuration(JSON.parse(savedWorkDuration));
    } else {
      setWorkDuration(INIT_WORK_DURATION);
    }

    const savedBreakDuration = localStorage.getItem('breakDuration');
    if (savedBreakDuration !== null) {
      setBreakDuration(JSON.parse(savedBreakDuration));
    } else {
      setBreakDuration(INIT_BREAK_DURATION);
    }

    const savedSessionCount = localStorage.getItem('sessionCount');
    if (savedSessionCount !== null) {
      setSessionCount(JSON.parse(savedSessionCount));
    } else {
      setSessionCount(0);
    }
    
    const savedSessionDuration = localStorage.getItem('sessionDuration');
    if (savedSessionDuration !== null) {
      setSessionDuration(JSON.parse(savedSessionDuration));
    } else {
      setSessionDuration(0);
    }
  }, []);

  // local storage writes
  useEffect(() => {
    if (workDuration !== null) {
      localStorage.setItem('workDuration', JSON.stringify(workDuration));
    }
  }, [workDuration, setWorkDuration]);

  useEffect(() => {
    if (breakDuration !== null) {
      localStorage.setItem('breakDuration', JSON.stringify(breakDuration));
    }
  }, [breakDuration]);

  useEffect(() => {
    if (sessionCount !== null) {
      localStorage.setItem('sessionCount', JSON.stringify(sessionCount));
    }
  }, [sessionCount]);

  useEffect(() => {
    if (sessionDuration !== null) {
      localStorage.setItem('sessionDuration', JSON.stringify(sessionDuration));
    }
  }, [sessionDuration]);

  // clear localStorage

  // useEffect for settings changes
  // this is necessary for realtime timer update, and proper total working time calculation 
  useEffect(() => {
    if (!isRunning) {
      // update timer display when paused
      const newTimeLeft = isWorkSession ? workDuration : breakDuration;
      setTimeLeft(newTimeLeft);

      // set var for sessionDuration calcs
      if (isWorkSession) setInitTimeLeft(workDuration);
    }
  // no isRunning dependency because it will cause the timer to reset when user pauses
  // we only want the timer to update when the user changes any duration settings
  }, [workDuration, breakDuration]); 

  // misc functions
  const incrementSessionCount = () => {
    setSessionCount(prevSessionCount => prevSessionCount + 1);
  };
  const incrementSessionDuration = (initTimeLeft, timeLeft) => {
    if (initTimeLeft !== timeLeft) {
      setSessionDuration(prevSessionDuration => prevSessionDuration + (initTimeLeft - timeLeft));
    }
  };
  
  // handlers
  const handleWorkInputChange = (event) => {
    const newWorkDuration = Math.max(event.target.value * 60, 60); // Ensure at least 1 minute (60 seconds)
    setWorkDuration(newWorkDuration);
  };
  const handleBreakInputChange = (event) => {
    const newBreakDuration = Math.max(event.target.value * 60, 60); // Ensure at least 1 minute (60 seconds)
    setBreakDuration(newBreakDuration);
  };
  const startTimer = () => {
    if (workDuration === 0 || breakDuration === 0) {
      alert("Please set a work or break duration greater than 0.");
      return; // Prevent starting the timer
    }
    setIsRunning(true);
    setInitTimeLeft(workDuration);
  };
  const stopTimer = () => {
    setIsRunning(false);
  };
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isWorkSession ? workDuration : breakDuration);
  };
  const skipSession = () => {
    if (workDuration === 0 && breakDuration === 0) {
      alert("Please set a work or break duration greater than 0 to skip the session.");
      return; // Prevent switching sessions
    }
    
    setIsRunning(false);
    if (isWorkSession) {
      if (timeLeft !== workDuration) {
        incrementSessionCount();
        incrementSessionDuration(initTimeLeft, timeLeft);
      }
    }
    setIsWorkSession(prevIsWorkSession => {
      setTimeLeft(prevIsWorkSession ? breakDuration : workDuration);
      return !prevIsWorkSession;
    });
  };
  const resetAll = () => {
    localStorage.clear();
    setIsRunning(false);
    setIsWorkSession(true);
    setTimeLeft(INIT_WORK_DURATION);
    setWorkDuration(INIT_WORK_DURATION);
    setBreakDuration(INIT_BREAK_DURATION);
    setSessionCount(0);
    setSessionDuration(0);
  };

  return (
    <div className="min-w-80 container mx-auto flex h-screen text-center text-gray-800 dark:text-gray-200">
      <div className="w-full max-w-[480px] m-auto">
        <Timer
          timeLeft={timeLeft}
          isWorkSession={isWorkSession}
          isRunning={isRunning}
          setTimeLeft={setTimeLeft}
          skipSession={skipSession}
        />
        <Controls 
          startTimer={startTimer}
          stopTimer={stopTimer}
          resetTimer={resetTimer}
          skipSession={skipSession}
        />
        <SessionCounter 
          sessionCount={sessionCount}
          sessionDuration={sessionDuration}
        />
        <Settings
          workDuration={workDuration}
          breakDuration={breakDuration}
          handleWorkInputChange={handleWorkInputChange}
          handleBreakInputChange={handleBreakInputChange}
          resetAll={resetAll}
        />
        <Statistics/>
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

function Timer ({ timeLeft, isWorkSession, isRunning, setTimeLeft, skipSession }) {
  // countdown timer
  useEffect(() => {
    let countdownInterval;

    if (isRunning && timeLeft > 0) {
      countdownInterval = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(countdownInterval);
      skipSession();
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
    <div className="m-4 flex justify-evenly text-xl">
      <button onClick={startTimer} className="py-1 px-3 bg-gray-200 dark:bg-gray-800 rounded-lg drop-shadow-md outline-2 outline-gray-800 hover:outline active:bg-gray-800 active:text-white active">Start</button>
      <button onClick={stopTimer} className="py-1 px-3 bg-gray-200 dark:bg-gray-800 rounded-lg drop-shadow-md outline-2 outline-gray-800 hover:outline active:bg-gray-800 active:text-white active">Stop</button>
      <button onClick={resetTimer} className="py-1 px-3 bg-gray-200 dark:bg-gray-800 rounded-lg drop-shadow-md outline-2 outline-gray-800 hover:outline active:bg-gray-800 active:text-white active">Reset</button>
      <button onClick={skipSession} className="py-1 px-3 bg-gray-200 dark:bg-gray-800 rounded-lg drop-shadow-md outline-2 outline-gray-800 hover:outline active:bg-gray-800 active:text-white active">Skip</button>
    </div>
  );
}

function SessionCounter ({ sessionCount, sessionDuration }) {
  // track sessions & duration
  let formattedSessionDuration = formatTime(sessionDuration);
  return (
    <div className="m-4 flex justify-evenly">
      <div className="flex flex-col">
        <div className="font-bold">Session Count</div>
        <div className="text-2xl font-bold">{ sessionCount }</div>
      </div>
      <div className="flex flex-col">
        <div className="font-bold">Total Working Time</div>
        <div className="text-2xl font-bold">{ formattedSessionDuration }</div>
      </div>
    </div>
  );
}

function Settings ({ workDuration, breakDuration, handleWorkInputChange, handleBreakInputChange, resetAll }) {
  // settings to adjust timer
  let workDurationMinutes = workDuration/60;
  let breakDurationMinutes = breakDuration/60;
  
  // props: workDuration, breakDuration
  // callbacks: onWorkDurationChange, onBreakDurationChange
  return (
    <>
      <div className="m-4 flex  justify-between">
        <div className="w-1/2 flex items-center justify-evenly">
          <label className="max-w-24" htmlFor="work-duration">Work Duration:</label>
          <input 
            type="number" 
            name="work-duration" 
            id="work-duration" 
            className="w-14 p-1 text-center text-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={workDurationMinutes}
            onChange={handleWorkInputChange}
            min="1"
          />
        </div>
        <div className="w-1/2 flex items-center justify-evenly">
          <label className="max-w-24" htmlFor="work-duration">Break Duration:</label>
          <input 
            type="number" 
            name="break-duration" 
            id="break-duration" 
            className="w-14 p-1 text-center text-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={breakDurationMinutes}
            onChange={handleBreakInputChange}
            min="1"
          />
        </div>
      </div>
      <button 
          className="mx-4 py-1 px-4 bg-gray-800 rounded-lg text-white text-xs"
          onClick={resetAll}
        >Reset All</button>
      {/* <div>
        <div className="flex justify-evenly m-4">
          <div>
            <input className="mr-1" type="checkbox" id="opt-1"/>
            <label htmlFor="opt-1">Auto break</label>
          </div>
          <div>
            <input className="mr-1"type="checkbox" id="opt-2"/>
            <label htmlFor="opt-1">Auto work</label>
          </div>
          <div>
            <input className="mr-1"type="checkbox" id="opt-3"/>
            <label htmlFor="opt-1">Option 3</label>
          </div>
          <div>
            <input className="mr-1"type="checkbox" id="opt-4"/>
            <label htmlFor="opt-1">Option 4</label>
          </div>
        </div>
      </div> */}
    </>
  );
}

function Statistics () {
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}