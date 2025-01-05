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
      completed: false,
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const deleteTask = (taskId: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const completeTask = (taskId: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: true } : task
      )
    );
  };

  return (
    <TasksContext.Provider value={{ tasks, addTask, deleteTask, completeTask }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};