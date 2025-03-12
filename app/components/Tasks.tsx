// app/components/Tasks.tsx
"use client";

import { useState } from 'react';
import { useTasks } from '../context/Taskscontext';
import { Plus, Download, Check, Trash } from 'lucide-react';

export default function Tasks() {
  const { tasks, addTask, deleteTask, completeTask } = useTasks();
  const [newTask, setNewTask] = useState('');

  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      addTask(newTask);
      setNewTask('');
    }
  };

  const handleExportCSV = () => {
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 19).replace(/[:T]/g, '-');
    const headers = ['ID,Task,Status\n'];
    const csvContent = tasks.map(task => 
      `${task.id},"${task.task}",${task.completed ? 'Completed' : 'Pending'}\n`
    ).join('');
    
    const blob = new Blob([headers + csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tasks_export_${formattedDate}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <button
          onClick={handleExportCSV}
          className="glass-button hover:bg-green-700/20 text-white px-4 py-2 rounded-lg transition flex items-center"
          disabled={tasks.length === 0}
        >
          <Download 
            className="mr-2" 
            size={18} 
            style={{ 
              color: '#a855f7', 
              filter: 'drop-shadow(0 0 2px rgba(168, 85, 247, 0.5))' 
            }} 
          />
          Export to CSV
        </button>
      </div>
      
      <div className="flex mb-6">
        <input
          type="text"
          placeholder="Add a new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
          className="flex-1 p-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={handleAddTask}
          className="bg-primary/20 glass-button text-text px-5 py-3 rounded-r-lg hover:opacity-90 transition flex items-center"
        >
          <Plus 
            className="mr-2" 
            size={18} 
            style={{ 
              color: '#0ea5e9', 
              filter: 'drop-shadow(0 0 2px rgba(14, 165, 233, 0.6))' 
            }} 
          />
          Add
        </button>
      </div>
      
      {tasks.length === 0 ? (
        <div className="text-center py-10 text-text-secondary">
          No tasks yet. Add some tasks to get started!
        </div>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li key={task.id} className="glass flex justify-between items-center p-4 rounded-lg">
              <span className={`${task.completed ? 'line-through text-text-secondary' : ''} flex-grow`}>
                {task.task}
              </span>
              <div className="flex items-center">
                {!task.completed && (
                  <button
                    onClick={() => completeTask(task.id)}
                    className="text-green-500 hover:text-green-700 mr-4 flex items-center"
                    aria-label="Complete task"
                  >
                    <Check 
                      className="mr-1" 
                      size={18} 
                      style={{ 
                        color: '#10b981', 
                        filter: 'drop-shadow(0 0 2px rgba(16, 185, 129, 0.6))' 
                      }} 
                    />
                    Complete
                  </button>
                )}
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-700 flex items-center"
                  aria-label="Delete task"
                >
                  <Trash 
                    className="mr-1" 
                    size={18} 
                    style={{ 
                      color: '#ef4444', 
                      filter: 'drop-shadow(0 0 2px rgba(239, 68, 68, 0.6))' 
                    }} 
                  />
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}