// app/components/Timer.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useTasks } from '../context/Taskscontext';

export default function Timer() {
  const [time, setTime] = useState(1500); // Default: 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [customTime, setCustomTime] = useState(25); // Custom time in minutes
  const [selectedTask, setSelectedTask] = useState<number | null>(null); // Selected task ID
  const { tasks, completeTask } = useTasks(); // Use tasks and completeTask from context

  // Filter out completed tasks
  const incompleteTasks = tasks.filter(task => !task.completed);

  // Memoize completeTask to ensure it doesn't change on every render
  const memoizedCompleteTask = useCallback(
    (taskId: number) => {
      completeTask(taskId);
    },
    [completeTask]
  );

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
        memoizedCompleteTask(selectedTask); // Mark task as completed when timer finishes
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
    setIsActive(false);
    setTime(customTime * 60); // Convert minutes to seconds
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Clickable Pomofocus Text */}
      <Link href="/">
        <h1 className="text-4xl font-bold mb-8 cursor-pointer hover:underline">Pomodoro</h1>
      </Link>

      {/* Timer Display */}
      <div className="text-6xl font-bold text-third mb-4">
        {`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
      </div>

      {/* Timer Controls */}
      <div className="flex space-x-4">
        <button
          onClick={handleStart}
          className="bg-secondary text-white px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition"
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition"
        >
          Reset
        </button>
      </div>

      {/* Custom Time Input */}
      <div className="mt-6">
        <input
          type="number"
          placeholder="Set custom time (minutes)"
          value={customTime}
          onChange={(e) => setCustomTime(Number(e.target.value))}
          className="p-2 border rounded-lg mr-2 text-third"
        />
        <button
          onClick={handleCustomTime}
          className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition"
        >
          Set Time
        </button>
      </div>

      {/* Task Selection */}
      <div className="mt-6">
        <select
          onChange={(e) => setSelectedTask(Number(e.target.value))}
          className="p-2 border rounded-lg text-third"
        >
          <option value="">Select a task</option>
          {incompleteTasks.map((task) => (
            <option
              key={task.id}
              value={task.id}
            >
              {task.task}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}