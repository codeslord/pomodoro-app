// app/components/Tasks.tsx
"use client";

import { useState } from 'react';
import { useTasks } from '../context/Taskscontext';

export default function Tasks() {
  const { tasks, addTask, deleteTask, completeTask } = useTasks(); // Use tasks and functions from context
  const [newTask, setNewTask] = useState('');

  const handleAddTask = () => {
    addTask(newTask);
    setNewTask('');
  };

  return (
    <div className="p-8 bg-background">
      <h1 className="text-2xl font-bold mb-4">Tasks</h1>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Add a new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
          className="flex-1 p-2 border rounded-lg mr-2"
        />
        <button
          onClick={handleAddTask}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
        >
          Add
        </button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="flex justify-between items-center bg-white p-3 rounded-lg shadow mb-2">
            <span className={task.completed ? 'line-through' : ''}>{task.task}</span>
            <div>
              {!task.completed && (
                <button
                  onClick={() => completeTask(task.id)}
                  className="text-green-500 hover:text-green-700 transition mr-2"
                >
                  Complete
                </button>
              )}
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-700 transition"
                >
                  Delete
                </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}