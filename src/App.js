import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [workDuration, setWorkDuration] = useState(1500); // Default 25 minutes in seconds
  const [breakDuration, setBreakDuration] = useState(300); // Default 5 minutes in seconds
  const [time, setTime] = useState(workDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  // Load saved preferences from localStorage on app load
  useEffect(() => {
    const savedWorkDuration = localStorage.getItem('workDuration');
    const savedBreakDuration = localStorage.getItem('breakDuration');
    const savedSessionCount = localStorage.getItem('sessionCount');

    if (savedWorkDuration) setWorkDuration(Number(savedWorkDuration));
    if (savedBreakDuration) setBreakDuration(Number(savedBreakDuration));
    if (savedSessionCount) setSessionCount(Number(savedSessionCount));
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('workDuration', workDuration);
    localStorage.setItem('breakDuration', breakDuration);
    localStorage.setItem('sessionCount', sessionCount);
  }, [workDuration, breakDuration, sessionCount]);

  // Timer logic
  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    }

    if (time === 0 && isRunning) {
      alert(isBreak ? 'Break time is over! Time to work!' : 'Work session is over! Take a break!');
      setIsRunning(false);
      setIsBreak(!isBreak);
      setTime(isBreak ? workDuration : breakDuration);

      if (!isBreak) {
        setSessionCount((prevCount) => prevCount + 1); // Increment session count after work session
      }
    }

    return () => clearInterval(timer);
  }, [time, isRunning, isBreak, workDuration, breakDuration]);

  // Handle timer controls
  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTime(isBreak ? breakDuration : workDuration);
  };

  // Format time to MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress bar width
  const progress = isBreak
    ? ((breakDuration - time) / breakDuration) * 100
    : ((workDuration - time) / workDuration) * 100;

  return (
    <div className="app">
      <h1>Pomodoro Timer</h1>
      <div className="settings">
        <label>
          Work Duration (minutes):
          <input
            type="number"
            value={workDuration / 60}
            onChange={(e) => setWorkDuration(e.target.value * 60)}
          />
        </label>
        <label>
          Break Duration (minutes):
          <input
            type="number"
            value={breakDuration / 60}
            onChange={(e) => setBreakDuration(e.target.value * 60)}
          />
        </label>
      </div>
      <div className="timer">{formatTime(time)}</div>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="controls">
        <button onClick={toggleTimer}>{isRunning ? 'Pause' : 'Start'}</button>
        <button onClick={resetTimer}>Reset</button>
      </div>
      <div className="session-counter">
        <h3>Completed Sessions: {sessionCount}</h3>
      </div>
    </div>
  );
}

export default App;
