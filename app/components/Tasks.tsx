// app/components/Tasks.tsx
"use client";

import { useState, useRef } from 'react';
import { useTasks } from '../context/Taskscontext';
import { Plus, Download, Check, Trash, GripVertical } from 'lucide-react';

// Add this to your globals.css
// .dragging { opacity: 0.5; }

export default function Tasks() {
  const { tasks, addTask, deleteTask, completeTask, reorderTasks } = useTasks();
  const [newTask, setNewTask] = useState('');
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);
  const dragOverTaskId = useRef<number | null>(null);
  const [dropPosition, setDropPosition] = useState<'above' | 'below' | null>(null);

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

  // Improved drag event handlers
  const handleDragStart = (e: React.DragEvent, taskId: number) => {
    // Prevent drag event from triggering buttons
    e.stopPropagation();
    
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.completed) {
      e.preventDefault();
      return;
    }
    
    setDraggedTaskId(taskId);
    
    // Set data transfer for better cross-browser compatibility
    e.dataTransfer.setData('text/plain', taskId.toString());
    e.dataTransfer.effectAllowed = "move";
    
    const element = document.getElementById(`task-${taskId}`);
    if (element) {
      // Add dragging class after a small delay so the drag image looks right
      setTimeout(() => element.classList.add('dragging'), 0);
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    // Prevent default actions and stop propagation
    e.preventDefault();
    e.stopPropagation();
    
    // Remove dragging visual styles
    const element = document.getElementById(`task-${draggedTaskId}`);
    if (element) {
      element.classList.remove('dragging');
    }
    
    // Clear all drop indicators
    document.querySelectorAll('.drop-above, .drop-below').forEach(el => {
      el.classList.remove('drop-above', 'drop-below');
    });
    
    // Perform reordering if conditions are met
    if (draggedTaskId !== null && 
        dragOverTaskId.current !== null && 
        draggedTaskId !== dragOverTaskId.current && 
        dropPosition) {
      
      reorderTasks(draggedTaskId, dragOverTaskId.current, dropPosition);
    }
    
    // Reset state
    setDraggedTaskId(null);
    dragOverTaskId.current = null;
    setDropPosition(null);
  };

  const handleDragOver = (e: React.DragEvent, taskId: number) => {
    // Always prevent default to allow drop
    e.preventDefault();
    
    // Set data transfer properties
    e.dataTransfer.dropEffect = "move";
    
    // Don't allow dropping on completed tasks or the same task
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask || targetTask.completed || taskId === draggedTaskId) {
      return;
    }
    
    // Update the current drag target
    dragOverTaskId.current = taskId;
    
    // Determine drop position
    const element = document.getElementById(`task-${taskId}`);
    if (!element) return;
    
    // Clear previous indicators
    document.querySelectorAll('.drop-above, .drop-below').forEach(el => {
      el.classList.remove('drop-above', 'drop-below');
    });
    
    const rect = element.getBoundingClientRect();
    const middle = rect.top + rect.height / 2;
    const position = e.clientY < middle ? 'above' : 'below';
    
    setDropPosition(position);
    element.classList.add(`drop-${position}`);
  };
  
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Filter tasks: incomplete first, then completed
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    return 0;
  });

  const incompleteTasks = sortedTasks.filter(task => !task.completed);
  const completedTasks = sortedTasks.filter(task => task.completed);
  const displayTasks = [...incompleteTasks, ...completedTasks];

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
        <ul className="space-y-3 tasks-list">
          {displayTasks.map((task) => (
            <li 
              key={task.id}
              id={`task-${task.id}`}
              className={`glass-dark flex justify-between items-center p-4 rounded-lg task-item 
                ${task.completed ? 'opacity-60' : ''}
                transition-opacity duration-200`}
              draggable={!task.completed}
              onDragStart={(e) => handleDragStart(e, task.id)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, task.id)}
              onDragEnter={handleDragEnter}
            >
              {/* Drag Handle - Only clickable for non-completed tasks */}
              <div 
                className={`mr-3 ${task.completed ? 'cursor-not-allowed opacity-40' : 'cursor-grab active:cursor-grabbing'}`}
              >
                <GripVertical 
                  size={18} 
                  style={{ 
                    color: '#60dfcd', 
                    filter: 'drop-shadow(0 0 2px rgba(96, 223, 205, 0.5))' 
                  }} 
                />
              </div>
              
              <span className={`${task.completed ? 'line-through text-text-secondary' : ''} flex-grow`}>
                {task.task}
              </span>
              
              {/* Task actions - separated from drag handling */}
              <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
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