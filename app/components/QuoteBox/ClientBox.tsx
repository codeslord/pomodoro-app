"use client";

import { useState } from 'react';

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
    <div className="flex items-center justify-center mb-8 gap-4 pt-6">
      <div className="bg-white p-4 rounded-lg shadow-lg flex-1 max-w-2xl">
        <p className="text-lg italic text-center">
          {quote || <span className="text-gray-400">Generating...</span>}
        </p>
      </div>
      <button
        onClick={generateQuote}
        disabled={loading}
        className="p-2 hover:bg-white rounded-full transition-colors disabled:opacity-50"
      >
        {loading ? (
          <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              fill="none"
              strokeWidth="4"
              strokeLinecap="round"
              className="opacity-25"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        )}
      </button>
    </div>
  );
}