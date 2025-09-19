import React, { useState } from 'react';
import { motion } from 'framer-motion';

function App() {
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFiles = (e) => {
    const newFiles = Array.from(e.target.files).slice(0, 3);
    setFiles(newFiles);
  };

  const analyzeDocs = () => {
    setLoading(true);
    setTimeout(() => {
      setResults({
        conflicts: [
          {
            label: "contradiction",
            confidence: 0.92,
            a: { source: "Doc A", text: "Submit before 10 PM" },
            b: { source: "Doc B", text: "Deadline is midnight" },
            why: "Different deadlines mentioned",
            suggested_fix: "Unify deadline to 11:59 PM"
          },
          {
            label: "contradiction",
            confidence: 0.81,
            a: { source: "HR Policy", text: "2 weeks’ notice required" },
            b: { source: "Employment Contract", text: "1 month notice required" },
            why: "Mismatch in notice period",
            suggested_fix: "Clarify notice period as 1 month"
          }
        ]
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <motion.h1
        className="text-4xl font-bold mb-8 text-center"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        Smart Doc Checker — Detect Conflicts Instantly
      </motion.h1>

      <input type="file" multiple onChange={handleFiles} className="mb-4" />
      <div className="flex gap-2 mb-4">
        {files.map((f, i) => (
          <span key={i} className="px-2 py-1 bg-purple-700 rounded-lg">{f.name}</span>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-3 bg-purple-600 rounded-xl shadow-lg mb-6"
        onClick={analyzeDocs}
      >
        Analyze Docs
      </motion.button>

      {loading && <p>Scanning policies<span className="animate-pulse">...</span></p>}

      {results && (
        <div className="grid gap-4 w-full max-w-2xl">
          {results.conflicts.map((c, i) => (
            <div key={i} className="bg-gray-800 p-4 rounded-xl shadow">
              <p className="font-bold">Conflict {i + 1}: {c.label}</p>
              <p>Confidence: {(c.confidence * 100).toFixed(0)}%</p>
              <p><b>{c.a.source}:</b> {c.a.text}</p>
              <p><b>{c.b.source}:</b> {c.b.text}</p>
              <p className="text-red-400">{c.why}</p>
              <p className="text-green-400">Fix: {c.suggested_fix}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
