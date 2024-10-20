"use client"

import { useEffect, useState } from "react";
import { FaHome, FaRegClock } from "react-icons/fa";

export default function Pomodoro() {
  // state
  const [workDuration, setWorkDuration] = useState(1500);
  const [breakDuration, setBreakDuration] = useState(300);
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
      setWorkDuration(1500);
    }

    const savedBreakDuration = localStorage.getItem('breakDuration');
    if (savedBreakDuration !== null) {
      setBreakDuration(JSON.parse(savedBreakDuration));
    } else {
      setBreakDuration(300);
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
  }, [workDuration]);

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
  }, [workDuration, breakDuration, isWorkSession]);

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
    const newWorkDuration = event.target.value * 60;
    setWorkDuration(newWorkDuration);
    };
  const handleBreakInputChange = (event) => {
    const newBreakDuration = event.target.value * 60;
    setBreakDuration(newBreakDuration);
  };
  const startTimer = () => {
    setIsRunning(true);
    setInitTimeLeft(workDuration)
  };
  const stopTimer = () => {
    setIsRunning(false);
  };
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isWorkSession ? workDuration : breakDuration);
  };
  const skipSession = () => {
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
    setWorkDuration(1500);
    setBreakDuration(300);
    setSessionCount(0);
    setSessionDuration(0);
  };

  return (
    <div className="container mx-auto flex h-screen text-center text-black">
      <div className="max-w-1/2 m-auto pb-16">
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
    <div className="m-4 flex justify-between text-xl">
      <button onClick={startTimer} className="mx-4 py-1 px-4 bg-gray-200 rounded-xl">Start</button>
      <button onClick={stopTimer} className="mx-4 p-1 px-4 bg-gray-200 rounded-xl">Stop</button>
      <button onClick={resetTimer} className="mx-4 p-1 px-4 bg-gray-200 rounded-xl">Reset</button>
      <button onClick={skipSession} className="mx-4 p-1 px-4 bg-gray-200 rounded-xl">Skip</button>
    </div>
  );
}

function SessionCounter ({ sessionCount, sessionDuration }) {
  // track sessions & duration
  let formattedSessionDuration = formatTime(sessionDuration);
  return (
    <div className="min-w-max flex justify-evenly m-4">
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
  
  // props: workDuration, breakDuration
  // callbacks: onWorkDurationChange, onBreakDurationChange
  return (
    <>
      <div className="flex items-center justify-between">
        <label htmlFor="work-duration">Work Duration:</label>
        <input 
          type="number" 
          name="work-duration" 
          id="work-duration" 
          className="w-16 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"  
          defaultValue={workDuration/60}
          onChange={handleWorkInputChange}
        />
        <label htmlFor="work-duration">Break Duration:</label>
        <input 
          type="number" 
          name="break-duration" 
          id="break-duration" 
          className="w-16 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"    
          defaultValue={breakDuration/60}
          onChange={handleBreakInputChange}
        />
      </div>
      <div>
        <div className="flex justify-evenly m-4">
          <div>
            <input className="mr-1" type="checkbox" id="opt-1"/>
            <label htmlFor="opt-1">Auto break</label>
          </div>
          <div>
            <input className="mr-1"type="checkbox" id="opt-2"/>
            <label htmlFor="opt-1">Auto work</label>
          </div>
          {/* <div>
            <input className="mr-1"type="checkbox" id="opt-3"/>
            <label htmlFor="opt-1">Option 3</label>
          </div>
          <div>
            <input className="mr-1"type="checkbox" id="opt-4"/>
            <label htmlFor="opt-1">Option 4</label>
          </div> */}
        </div>
        <button 
          className="mx-4 py-1 px-4 bg-gray-800 rounded-lg text-white text-xs"
          onClick={resetAll}
        >Reset All</button>
      </div>
    </>
  );
}

function Statistics () {
  // average time per work session
  // total break time
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}