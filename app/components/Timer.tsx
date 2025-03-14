"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTasks } from '../context/Taskscontext';
import { Play, Pause, RefreshCw, ChevronUp, ChevronDown } from 'lucide-react';

export default function Timer() {
  const [time, setTime] = useState(1500); // Default: 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [customTime, setCustomTime] = useState(25); // Custom time in minutes
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const { tasks, completeTask } = useTasks();
  
  // Store target end time to handle background tab throttling
  const endTimeRef = useRef<number | null>(null);
  
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

  // Handle visibility change to fix timer in background tabs
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden || !isActive) return;
      
      // If we have an end time reference and page becomes visible again
      if (endTimeRef.current !== null) {
        // Calculate time that should've elapsed
        const now = Date.now();
        const remainingTime = Math.max(0, Math.floor((endTimeRef.current - now) / 1000));
        
        // Update timer with the correct time
        setTime(remainingTime);
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isActive]);

  // Effect to handle the timer countdown with improved background tab handling
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && time > 0) {
      // Set the expected end time when starting/resuming the timer
      if (endTimeRef.current === null) {
        endTimeRef.current = Date.now() + time * 1000;
      }
      
      interval = setInterval(() => {
        // Calculate remaining time based on the end time
        const now = Date.now();
        if (endTimeRef.current !== null) {
          const remaining = Math.max(0, Math.floor((endTimeRef.current - now) / 1000));
          setTime(remaining);
        } else {
          // Fallback to normal countdown if no end time is set
          setTime(prevTime => prevTime - 1);
        }
      }, 1000);
    } else if (!isActive) {
      // Reset end time reference when paused
      endTimeRef.current = null;
    }

    return () => clearInterval(interval);
  }, [isActive, time]);

  // Effect to handle timer completion
  useEffect(() => {
    if (time === 0 && isActive) {
      setIsActive(false);
      endTimeRef.current = null; // Reset end time reference
      
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
    // Reset the end time reference when toggling
    endTimeRef.current = isActive ? null : Date.now() + time * 1000;
  };

  const handleReset = () => {
    setIsActive(false);
    endTimeRef.current = null; // Reset end time reference
    setTime(1500); // Reset to default time (25 minutes)
  };

  const handleCustomTime = () => {
    if (customTime > 0) {
      setIsActive(false);
      endTimeRef.current = null; // Reset end time reference
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
      {/* Timer Display - Removed the clock icon as requested */}
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
            <Pause 
              className="mr-2" 
              size={18} 
              style={{ 
                color: '#ffcc00', 
                filter: 'drop-shadow(0 0 2px rgba(255, 204, 0, 0.6))' 
              }} 
            /> : 
            <Play 
              className="mr-2" 
              size={18} 
              style={{ 
                color: '#4ade80', 
                filter: 'drop-shadow(0 0 2px rgba(74, 222, 128, 0.6))' 
              }} 
            />
          }
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={handleReset}
          className="glass-button bg-gray-500/20 text-text px-6 py-2 rounded-lg font-semibold transition flex items-center"
        >
          <RefreshCw 
            className="mr-2" 
            size={18} 
            style={{ 
              color: '#f87171', 
              filter: 'drop-shadow(0 0 2px rgba(248, 113, 113, 0.6))' 
            }} 
          />
          Reset
        </button>
      </div>

      {/* Custom Time Input */}
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
              <ChevronUp 
                size={16} 
                style={{ color: '#60dfcd' }}
              />
            </button>
            <button 
              onClick={decrementTime} 
              className="flex-1 px-3 hover:bg-primary/10 transition-colors"
              aria-label="Decrease time"
            >
              <ChevronDown 
                size={16} 
                style={{ color: '#60dfcd' }}
              />
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

      {/* Custom Task Dropdown - Fixed z-index issue */}
      <div className="w-full mb-4 relative dropdown-wrapper" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="glass w-full flex justify-between items-center p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-left"
          aria-haspopup="listbox"
          aria-expanded={isDropdownOpen}
        >
          <span className={selectedTask === null ? "text-text-secondary" : ""}>
            {selectedTaskLabel}
          </span>
          <ChevronDown 
            size={18} 
            className={`transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`}
            style={{ 
              color: '#1e9afe',
            }}
          />
        </button>
        
        {isDropdownOpen && (
          <div className="absolute w-full mt-1 glass-dark rounded-lg shadow-lg dropdown-layer overflow-hidden task-select-dropdown">
            {/* Fixed: Changed li to div for Clear selection option */}
            {selectedTask !== null && (
              <div
                className="p-3 cursor-pointer hover:bg-primary/20 transition border-b border-border text-text-secondary"
                onClick={() => {
                  setSelectedTask(null);
                  setIsDropdownOpen(false);
                }}
                role="option"
                aria-selected={false}
              >
                Clear selection
              </div>
            )}
            
            {incompleteTasks.length === 0 ? (
              <div className="p-3 text-center text-text-secondary">No tasks available</div>
            ) : (
              <ul className="max-h-60 overflow-auto" role="listbox">
                {incompleteTasks.map((task) => (
                  <li
                    key={task.id}
                    className={`p-3 cursor-pointer hover:bg-primary/20 transition ${selectedTask === task.id ? 'bg-primary/30' : ''}`}
                    onClick={() => handleTaskSelect(task.id)}
                    role="option"
                    aria-selected={selectedTask === task.id}
                  >
                    {task.task}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {selectedTask && (
        <div className="text-center text-text-secondary glass px-4 py-2 rounded-lg mt-2 task-completion-message">
          Task will be marked as complete when timer ends
        </div>
      )}

      {/* Audio element for the ding sound */}
      <audio ref={audioRef} src="/ding.mp3" preload="auto" />
    </div>
  );
}
