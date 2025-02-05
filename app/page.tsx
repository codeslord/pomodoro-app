// app/page.tsx
// import dynamic from 'next/dynamic';
import Timer from './components/Timer';
import Tasks from './components/Tasks';
import QuoteBox from './components/QuoteBox';


export default function Home() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8 bg-gradient-to-r from-purple-100 to-blue-100">
          <QuoteBox />
        </div>

        {/* Rest of your existing layout */}
        <div className="bg-gradient-to-br from-[#60dfcd] to-[#1e9afe] text-white p-8">
          <Timer />
        </div>
        <div className="p-8">
          <Tasks />
        </div>
      </div>
    </div>
  );
}
