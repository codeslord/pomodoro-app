"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTasks } from '../context/Taskscontext';
import { Play, Pause, RefreshCw, Clock, ChevronUp, ChevronDown, ChevronDown as DropdownIcon } from 'lucide-react';

export default function Timer() {
  const [time, setTime] = useState(1500); // Default: 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [customTime, setCustomTime] = useState(25); // Custom time in minutes
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const { tasks, completeTask } = useTasks();
  
  // Custom dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Ref for the audio element
  const audioRef = useRef<HTMLAudioElement>(null);

  // Filter out completed tasks
  const incompleteTasks = tasks.filter(task => !task.completed);

  // Selected task label
  const selectedTaskLabel = selectedTask !== null
    ? incompleteTasks.find(task => task.id === selectedTask)?.task || "Select a task"
    : "Select a task to focus on";

  // Memoize completeTask to ensure it doesn't change on every render
  const memoizedCompleteTask = useCallback(
    (taskId: number) => {
      completeTask(taskId);
    },
    [completeTask]
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Effect to handle the timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, time]);

  // Effect to handle timer completion
  useEffect(() => {
    if (time === 0 && isActive) {
      setIsActive(false);
      if (selectedTask !== null) {
        memoizedCompleteTask(selectedTask);
      }
      // Play the ding sound
      if (audioRef.current) {
        audioRef.current.play();
      }
    }
  }, [time, isActive, selectedTask, memoizedCompleteTask]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const handleStart = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setTime(1500); // Reset to default time (25 minutes)
  };

  const handleCustomTime = () => {
    if (customTime > 0) {
      setIsActive(false);
      setTime(customTime * 60); // Convert minutes to seconds
    }
  };

  const incrementTime = () => {
    setCustomTime(prev => prev + 1);
  };

  const decrementTime = () => {
    setCustomTime(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleTaskSelect = (taskId: number) => {
    setSelectedTask(taskId);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="max-w-md mx-auto flex flex-col items-center">
      {/* Timer Display */}
      <div className="text-6xl font-bold mb-8 glass-dark py-4 px-10 rounded-2xl">
        <span>{`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</span>
      </div>

      {/* Timer Controls */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={handleStart}
          className={`${isActive ? 'bg-yellow-500/20' : 'bg-green-500/20'} 
            glass-button text-text px-6 py-2 rounded-lg font-semibold transition flex items-center`}
        >
          {isActive ? 
            <Pause className="mr-2" size={18} /> : 
            <Play className="mr-2" size={18} />
          }
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={handleReset}
          className="glass-button bg-gray-500/20 text-text px-6 py-2 rounded-lg font-semibold transition flex items-center"
        >
          <RefreshCw className="mr-2" size={18} />
          Reset
        </button>
      </div>

      {/* Custom Time Input - Fixed version with integrated controls */}
      <div className="w-full flex items-center space-x-2 mb-6 relative">
        <div className="flex-1 relative glass rounded-lg overflow-hidden">
          <input
            type="number"
            min="1"
            max="120"
            placeholder="Set custom time (minutes)"
            value={customTime}
            onChange={(e) => setCustomTime(Number(e.target.value))}
            className="w-full p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
            style={{ appearance: 'textfield' }}
          />
          <div className="absolute right-0 inset-y-0 flex flex-col border-l border-border">
            <button 
              onClick={incrementTime} 
              className="flex-1 px-3 hover:bg-primary/10 transition-colors border-b border-border"
              aria-label="Increase time"
            >
              <ChevronUp size={16} />
            </button>
            <button 
              onClick={decrementTime} 
              className="flex-1 px-3 hover:bg-primary/10 transition-colors"
              aria-label="Decrease time"
            >
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
        <button
          onClick={handleCustomTime}
          className="glass-button bg-primary/20 text-text px-4 py-3 rounded-lg font-semibold transition"
        >
          Set Time
        </button>
      </div>

      {/* Custom Task Dropdown */}
      <div className="w-full mb-4 relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="glass w-full flex justify-between items-center p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-left"
          aria-haspopup="listbox"
          aria-expanded={isDropdownOpen}
        >
          <span className={selectedTask === null ? "text-text-secondary" : ""}>
            {selectedTaskLabel}
          </span>
          <DropdownIcon size={18} className={`transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
        </button>
        
        {isDropdownOpen && (
          <div className="absolute w-full mt-1 glass-dark rounded-lg shadow-lg z-10 overflow-hidden">
            <ul className="max-h-60 overflow-auto" role="listbox">
              {/* Add an option to clear selection */}
              {selectedTask !== null && (
                <li
                  className="p-3 cursor-pointer hover:bg-primary/20 transition border-b border-border text-text-secondary"
                  onClick={() => {
                    setSelectedTask(null);
                    setIsDropdownOpen(false);
                  }}
                  role="option"
                  aria-selected={false}
                >
                  Clear selection
                </li>
              )}
              
              {incompleteTasks.length === 0 ? (
                <li className="p-3 text-center text-text-secondary">No tasks available</li>
              ) : (
                incompleteTasks.map((task) => (
                  <li
                    key={task.id}
                    className={`p-3 cursor-pointer hover:bg-primary/20 transition ${selectedTask === task.id ? 'bg-primary/30' : ''}`}
                    onClick={() => handleTaskSelect(task.id)}
                    role="option"
                    aria-selected={selectedTask === task.id}
                  >
                    {task.task}
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>

      {selectedTask && (
        <div className="text-center text-text-secondary glass px-4 py-2 rounded-lg mt-2">
          Task will be marked as complete when timer ends
        </div>
      )}

      {/* Audio element for the ding sound */}
      <audio ref={audioRef} src="/ding.mp3" preload="auto" />
    </div>
  );
}
