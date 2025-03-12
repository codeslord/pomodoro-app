// app/page.tsx
import Timer from './components/Timer';
import Tasks from './components/Tasks';
import QuoteBox from './components/QuoteBox';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Single glass container for all three components */}
      <div className="w-full max-w-3xl glass rounded-xl shadow-lg overflow-visible relative">
        {/* All components in a single visual unit */}
        <div className="rounded-xl">
          {/* QuoteBox section - adjusted padding */}
          <div className="p-6 pb-0">
            <QuoteBox />
          </div>
          
          {/* Timer section - minimal separation */}
          <div className="p-8 py-6">
            <Timer />
          </div>
          
          {/* Tasks section - minimal separation */}
          <div className="p-8 pt-2">
            <Tasks />
          </div>
        </div>
      </div>
    </div>
  );
}
