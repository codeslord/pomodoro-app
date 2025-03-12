// app/page.tsx
import Timer from './components/Timer';
import Tasks from './components/Tasks';
import QuoteBox from './components/QuoteBox';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-3xl glass rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 glass rounded-t-xl">
          <QuoteBox />
        </div>

        {/* Timer Section */}
        <div className="p-8 glass border-t border-b border-border">
          <Timer />
        </div>
        
        {/* Tasks Section */}
        <div className="p-8 glass rounded-b-xl">
          <Tasks />
        </div>
      </div>
    </div>
  );
}
