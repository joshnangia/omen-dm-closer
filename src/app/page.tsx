'use client';

import React, { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOutput('');
    try {
      const res = await fetch('/api/closer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      setOutput(data.output);
    } catch (err) {
      setOutput('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 flex flex-col items-center border border-white/20">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white text-center mb-2">
          Close more deals in your DMs — <span className="text-blue-400">instantly.</span>
        </h1>
        <p className="text-gray-200 text-center mb-6">
          Paste your convo and let our AI craft the perfect closing message.
        </p>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <textarea
            className="w-full p-4 rounded-lg border border-gray-700 bg-black/40 text-white focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg resize-vertical min-h-[120px] transition"
            placeholder="Paste your DM conversation here..."
            value={input}
            onChange={e => setInput(e.target.value)}
            required
            rows={6}
          />
          <button
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-pink-500 text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform duration-200"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              'Generate Response'
            )}
          </button>
        </form>
        {output && (
          <div className="w-full mt-8 bg-white/20 border border-white/30 rounded-xl p-6 shadow-inner">
            <div className="font-semibold text-white mb-2">AI Reply:</div>
            <div className="text-white whitespace-pre-line">{output}</div>
          </div>
        )}
      </div>
    </main>
  );
}
