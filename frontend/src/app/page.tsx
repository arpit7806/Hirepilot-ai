"use client";
import { useState } from "react";
import Navbar from "@/components/navbar";
import Hero from "@/components/Hero";
import ResultsDashboard from "@/components/ResultsDashboard";

interface AnalysisResult {
  match_score: number;
  summary: string;
  strengths: string[];
  missing_skills: string[];
  technical_questions: string[];
  hr_questions: string[];
}

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{ background: "rgba(0,0,0,0.9)", backdropFilter: "blur(10px)" }}>
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-6" />
          <p className="text-cyan-400 text-lg font-semibold tracking-widest uppercase animate-pulse"
            style={{ fontFamily: "Orbitron, sans-serif" }}>
            Analyzing Resume...
          </p>
          <p className="text-gray-500 text-sm mt-3">Groq AI is processing your data</p>
        </div>
      )}

      <Hero onResult={(data) => { setResult(data); }} onLoading={setLoading} />

      {result && (
        <div className="bg-black">
          <ResultsDashboard result={result} />
        </div>
      )}
    </main>
  );
}