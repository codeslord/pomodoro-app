// app/page.tsx
import Timer from './components/Timer';
import Tasks from './components/Tasks';

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Timer Section */}
        <div className="bg-gradient-to-br from-[#60dfcd] to-[#1e9afe] text-white p-8">
          <Timer />
        </div>

        {/* Tasks Section */}
        <div className="p-8">
          <Tasks />
        </div>
      </div>
    </div>
  );
}