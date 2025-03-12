"use client";

import { useState } from 'react';
import { RefreshCw } from 'lucide-react'; // Removed the unused Quote import

export default function ClientBox() {
  const [quote, setQuote] = useState("Click refresh for motivation! 👉");
  const [loading, setLoading] = useState(false);

  const generateQuote = async () => {
    if (loading) return;

    setLoading(true);
    setQuote(""); // Clear previous quote
    try {
      const response = await fetch('/api/generate-quote', {
        method: 'POST',
      });

      // Handle stream response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No response body");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        // Update quote incrementally
        setQuote(prev => prev + decoder.decode(value));
      }
    } catch (error) {
      console.error("Stream error:", error);
      setQuote("Error generating quote");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-6 pt-2">
      <div className="glass p-5 rounded-xl shadow-lg flex-1 max-w-2xl">
        <p className="text-lg italic text-center">
          {quote || "Your motivational quote will appear here..."}
        </p>
      </div>
      <button
        onClick={generateQuote}
        disabled={loading}
        className="glass-button p-3 rounded-full hover:bg-primary/30 transition-all disabled:opacity-50"
        aria-label="Generate quote"
      >
        {loading ? (
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
        ) : (
          <RefreshCw 
            size={24} 
            style={{ 
              color: '#ec4899', 
              filter: 'drop-shadow(0 0 3px rgba(236, 72, 153, 0.6))' 
            }} 
          />
        )}
      </button>
    </div>
  );
}