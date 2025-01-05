// app/layout.tsx
import './globals.css';
import Link from 'next/link';
import { TasksProvider } from './context/Taskscontext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-[#60dfcd] to-[#1e9afe] min-h-screen">
        <TasksProvider>
          {/* Navbar with Gradient Background */}
          <nav className="bg-gradient-to-br from-[#60dfcd] to-[#1e9afe] text-white p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
              <Link href="/">
              <h1 className="text-2xl font-bold cursor-pointer text-white drop-shadow-lg hover:drop-shadow-xl transition-all">
                  Pomodoro Timer
                </h1>
              </Link>
              {/* <ul className="flex space-x-4">
                <li>
                  <Link href="/" className="hover:underline">Timer</Link>
                </li>
                <li>
                  <Link href="/tasks" className="hover:underline">Tasks</Link>
                </li>
              </ul> */}
            </div>
          </nav>

          {/* Main Content */}
          <main>{children}</main>
        </TasksProvider>
      </body>
    </html>
  );
}