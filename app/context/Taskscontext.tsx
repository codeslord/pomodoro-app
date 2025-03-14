// app/context/TasksContext.tsx
"use client";

import { createContext, useContext, useState, useEffect } from 'react';

interface Task {
  id: number;
  task: string;
  completed: boolean;
}

interface TasksContextType {
  tasks: Task[];
  addTask: (taskName: string) => void;
  deleteTask: (taskId: number) => void;
  completeTask: (taskId: number) => void;
  reorderTasks: (sourceTaskId: number, targetTaskId: number, dropPosition?: 'above' | 'below') => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        // Ensure we don't have duplicate IDs
        const uniqueTasks = deduplicateTasks(parsedTasks);
        setTasks(uniqueTasks);
      } catch (error) {
        console.error("Failed to parse saved tasks", error);
        setTasks([]);
      }
    }
  }, []);
  
  // Utility to ensure no duplicate IDs
  const deduplicateTasks = (taskList: Task[]): Task[] => {
    const seenIds = new Set();
    return taskList.filter(task => {
      if (seenIds.has(task.id)) {
        return false; // Skip duplicate IDs
      }
      seenIds.add(task.id);
      return true;
    });
  };
  
  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  const addTask = (taskName: string) => {
    if (taskName.trim() === '') return;
    
    // Find highest ID to ensure uniqueness even after deletions
    const maxId = tasks.length > 0 
      ? Math.max(...tasks.map(task => task.id)) 
      : 0;
      
    const newTask = {
      id: maxId + 1,
      task: taskName,
      completed: false
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
  };
  
  const deleteTask = (taskId: number) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };
  
  const completeTask = (taskId: number) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, completed: true } : task
      )
    );
  };
  
  // Improved reorder function with safer index calculation
  const reorderTasks = (sourceTaskId: number, targetTaskId: number, dropPosition: 'above' | 'below' = 'below') => {
    // Create a new array to avoid mutation issues
    const updatedTasks = [...tasks];
    
    // Find indices of source and target tasks
    const sourceIndex = updatedTasks.findIndex(task => task.id === sourceTaskId);
    const targetIndex = updatedTasks.findIndex(task => task.id === targetTaskId);
    
    // Ensure both indices are valid and different
    if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) {
      return; // Exit early if invalid
    }
    
    // Don't allow reordering completed tasks
    if (updatedTasks[sourceIndex].completed || updatedTasks[targetIndex].completed) {
      return; // Exit if either task is completed
    }
    
    // Remove the source task first
    const [removedTask] = updatedTasks.splice(sourceIndex, 1);
    
    // Adjust target index if needed - after removing the source task,
    // the target index may have shifted if source was before target
    const adjustedTargetIndex = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
    
    // Calculate insertion index based on drop position
    const insertIndex = dropPosition === 'above' ? 
      adjustedTargetIndex : 
      adjustedTargetIndex + 1;
    
    // Insert at the correct position
    updatedTasks.splice(insertIndex, 0, removedTask);
    
    // Update state with the new order, ensuring we don't have duplicates
    setTasks(deduplicateTasks(updatedTasks));
  };
  
  return (
    <TasksContext.Provider value={{ 
      tasks, 
      addTask, 
      deleteTask, 
      completeTask,
      reorderTasks
    }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};