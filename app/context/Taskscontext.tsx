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
      setTasks(JSON.parse(savedTasks));
    }
  }, []);
  
  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  const addTask = (taskName: string) => {
    if (taskName.trim() === '') return;
    const newTask = {
      id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
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
  
  // Enhanced reorder function with drop position awareness
  const reorderTasks = (sourceTaskId: number, targetTaskId: number, dropPosition: 'above' | 'below' = 'below') => {
    const sourceIndex = tasks.findIndex(task => task.id === sourceTaskId);
    const targetIndex = tasks.findIndex(task => task.id === targetTaskId);
    
    // Ensure both indices are valid and different
    if (sourceIndex !== -1 && targetIndex !== -1 && sourceIndex !== targetIndex) {
      const reorderedTasks = [...tasks];
      const [removedTask] = reorderedTasks.splice(sourceIndex, 1);
      
      // Determine insertion index based on drop position
      let insertIndex;
      
      if (dropPosition === 'above') {
        // If dropping above, insert at target's position
        insertIndex = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
      } else {
        // If dropping below, insert after target
        insertIndex = sourceIndex < targetIndex ? targetIndex : targetIndex + 1;
      }
      
      reorderedTasks.splice(insertIndex, 0, removedTask);
      setTasks(reorderedTasks);
    }
  };
  
  return (
    <TasksContext.Provider value={{ 
      tasks, 
      addTask, 
      deleteTask, 
      completeTask,
      reorderTasks // Exposing the updated function 
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