// app/layout.tsx
import './globals.css';
import Link from 'next/link';
import { TasksProvider } from './context/Taskscontext';
import { FaInfoCircle, FaGithub, FaCoffee } from 'react-icons/fa'; // Import icons from React Icons

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
          <nav className="bg-gradient-to-br from-[#1e9afe] to-[#60dfcd] text-white p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
              <Link href="/">
                <div className="flex items-center cursor-pointer">
                  {/* Favicon (PNG image) */}
                  <img
                    src="/logo.png" // Path to your PNG file in the public directory
                    alt="Pomodoro Timer Icon"
                    className="w-8 h-8 rounded-lg mr-2" // Adjust size and rounded corners
                  />
                  {/* Pomodoro Timer Text */}
                  <h1 className="text-2xl font-bold text-white drop-shadow-lg hover:drop-shadow-xl transition-all">
                    Pomodoro Timer
                  </h1>
                </div>
              </Link>
            </div>
          </nav>

          {/* Main Content */}
          <main>{children}</main>

          {/* Footer */}
          <footer className="text-center text-white text-sm p-4 mt-8">
            <div className="flex flex-col items-center gap-4">
              {/* Info Message */}
              <div className="flex items-center justify-center gap-2">
                <FaInfoCircle className="text-lg" /> {/* Info icon */}
                <p>
                  This app is completely free to use, has no ads, and your data is stored only in your browser.
                </p>
              </div>

              {/* GitHub and Buy Me a Coffee Links */}
              <div className="flex items-center justify-center gap-4">
                {/* GitHub Link */}
                <a
                  href="https://github.com/codeslord/pomodoro-app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <FaGithub className="text-xl" /> {/* GitHub icon */}
                  <span>GitHub</span>
                </a>

                {/* Buy Me a Coffee Link */}
                <a
                  href="https://buymeacoffee.com/rohithrnair"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <FaCoffee className="text-xl" /> {/* Coffee icon */}
                  <span>Buy Me a Coffee</span>
                </a>
              </div>

              {/* Hit Counter */}
              <div className="mt-4">
                <a href="https://hits.seeyoufarm.com" target="_blank" rel="noopener noreferrer">
                  <img
                    src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fneuralnomads.tech&count_bg=%231E9AFE&title_bg=%2360DFCD&icon=&icon_color=%23E7E7E7&title=views&edge_flat=false"
                    alt="Hit Counter"
                    className="h-5" // Adjust the height as needed
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