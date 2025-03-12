// app/layout.tsx
"use client"
import './globals.css';
import Image from 'next/image';
import Link from 'next/link';
import { TasksProvider } from './context/Taskscontext';
import { Info, Github, Coffee, Sun, Moon, Clock } from 'lucide-react'; 
import { useState, useEffect } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize with dark mode and get any saved preference
  const [theme, setTheme] = useState('dark');
  
  // Apply theme when component mounts and when theme changes
  useEffect(() => {
    // Set the data-theme attribute on the documentElement
    document.documentElement.setAttribute('data-theme', theme);
    // Save preference to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // Initial load - check for saved preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <html lang="en" data-theme={theme}>
      <body>
        <TasksProvider>
          {/* Navbar with Glassmorphism */}
          <nav className="nav-container fixed top-0 left-0 right-0 p-4 z-50">
            <div className="container mx-auto flex justify-between items-center">
              {/* Logo */}
              <Link href="/">
                <div className="flex items-center cursor-pointer">
                  <Image
                    src="/logo.png"
                    alt="Pomodoro Timer Icon"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-lg"
                  />
                </div>
              </Link>
              
              {/* Centered Bromodoro title with gradient and subtitle */}
              <Link href="/">
                <div className="flex flex-col items-center cursor-pointer">
                  <div className="flex items-center mb-1">
                    <Clock 
                      className="mr-2" 
                      size={24} 
                      style={{ 
                        color: theme === 'light' ? '#1e9afe' : '#60dfcd',
                        filter: 'drop-shadow(0 0 2px rgba(96, 223, 205, 0.5))'
                      }} 
                    />
                    <h1 className="text-2xl font-bold transition-all" 
                        style={{
                          backgroundImage: theme === 'light' 
                            ? 'linear-gradient(45deg, #0c64b6, #0a876c)' 
                            : 'linear-gradient(45deg, #60dfcd, #1e9afe)', 
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          color: 'transparent'
                        }}>
                      Bromodoro
                    </h1>
                  </div>
                  <p className="text-xs text-text-secondary max-w-[200px] text-center">
                    Focus timer based on the Pomodoro Technique to boost your productivity
                  </p>
                </div>
              </Link>
              
              {/* Theme toggle - icon only with colorful styling */}
              <button
                onClick={toggleTheme}
                className="glass-button p-2 rounded-full transition-colors flex items-center justify-center"
                aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? 
                  <Moon 
                    size={24} 
                    style={{ 
                      color: '#4c4cdd',
                      filter: 'drop-shadow(0 0 3px rgba(255, 255, 0, 0.3))'
                    }}
                  /> : 
                  <Sun 
                    size={24} 
                    style={{ 
                      color: '#ffcc00',
                      filter: 'drop-shadow(0 0 5px rgba(255, 204, 0, 0.5))'
                    }}
                  />
                }
              </button>
            </div>
          </nav>

          {/* Main Content - Added padding-top for fixed navbar */}
          <main className="container mx-auto px-4 py-8 pt-24">{children}</main>

          {/* Footer with Glassmorphism */}
          <footer className="footer text-center p-6 mt-8">
            <div className="flex flex-col items-center gap-4 max-w-3xl mx-auto">
              {/* Info Message */}
              <div className="flex items-center justify-center gap-2 text-sm">
                <Info 
                  size={18}
                  style={{ 
                    color: '#1e9afe',
                    filter: 'drop-shadow(0 0 2px rgba(30, 154, 254, 0.5))'
                  }}
                /> 
                <p>
                  This app is open source, completely free to use, has no ads, and your data is stored only in your browser.
                </p>
              </div>

              {/* GitHub and Buy Me a Coffee Links */}
              <div className="flex items-center justify-center gap-6">
                {/* GitHub Link */}
                <a
                  href="https://github.com/codeslord/pomodoro-app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <Github 
                    size={20} 
                    style={{
                      color: theme === 'light' ? '#6e5494' : '#9c7fd1',
                      filter: 'drop-shadow(0 0 2px rgba(110, 84, 148, 0.3))'
                    }}
                  />
                  <span>GitHub</span>
                </a>

                {/* Buy Me a Coffee Link */}
                <a
                  href="https://buymeacoffee.com/rohithrnair"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <Coffee 
                    size={20} 
                    style={{
                      color: '#ffdd00',
                      filter: 'drop-shadow(0 0 2px rgba(255, 221, 0, 0.5))'
                    }}
                  />
                  <span>Buy Me a Coffee</span>
                </a>
              </div>
              
              {/* Hit Counter */}
              <div className="mt-2">
                <a href="https://hits.seeyoufarm.com" target="_blank" rel="noopener noreferrer">
                  <Image
                    src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fbromodoro.live&count_bg=%23231E9AFE&title_bg=%231BC83FCD&icon=&icon_color=%2323E7E7E7&title=views&edge_flat=false"
                    alt="Hit Counter"
                    width={80}
                    height={20}
                    className="h-5 w-auto"
                    unoptimized // Use this for external images that can't be optimized by Next.js
                  />
                </a>
              </div>
            </div>
          </footer>
        </TasksProvider>
      </body>
    </html>
  );
}