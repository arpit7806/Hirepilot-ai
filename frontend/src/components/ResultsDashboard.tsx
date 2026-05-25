"use client";
import { motion } from "framer-motion";

interface Result {
  match_score: number;
  summary: string;
  strengths: string[];
  missing_skills: string[];
  technical_questions: string[];
  hr_questions: string[];
}

export default function ResultsDashboard({ result }: { result: Result }) {
  const score = result.match_score;
  const scoreColor = score >= 70 ? "#22d3ee" : score >= 40 ? "#60a5fa" : "#f87171";

  return (
    <motion.section
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-4xl mx-auto px-4 pb-24"
    >
      {/* Match Score */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.01 }}
        className="rounded-2xl p-10 mb-6 text-center"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: `1px solid ${scoreColor}30`,
          boxShadow: `0 0 60px ${scoreColor}10`,
          backdropFilter: "blur(20px)",
        }}
      >
        <p className="text-gray-500 uppercase tracking-widest text-xs mb-4"
          style={{ fontFamily: "Orbitron, sans-serif" }}>ATS Match Score</p>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="text-9xl font-black mb-2"
          style={{ color: scoreColor, textShadow: `0 0 40px ${scoreColor}`, fontFamily: "Orbitron, sans-serif" }}
        >
          {score}<span className="text-4xl text-gray-600">%</span>
        </motion.div>
        <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed mt-4 text-sm">{result.summary}</p>
      </motion.div>

      {/* Strengths + Missing */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }} whileHover={{ scale: 1.02, y: -4 }}
          className="rounded-2xl p-6"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(34,211,238,0.15)", backdropFilter: "blur(20px)" }}
        >
          <h3 className="font-bold text-base mb-5 flex items-center gap-2"
            style={{ color: "#22d3ee", fontFamily: "Orbitron, sans-serif", fontSize: "0.8rem", letterSpacing: "0.1em" }}>
            ✅ STRENGTHS
          </h3>
          <ul className="space-y-3">
            {result.strengths.map((s, i) => (
              <motion.li key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-start gap-2 text-gray-300 text-sm leading-relaxed"
              >
                <span style={{ color: "#22d3ee" }} className="mt-0.5">▸</span> {s}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }} whileHover={{ scale: 1.02, y: -4 }}
          className="rounded-2xl p-6"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(248,113,113,0.15)", backdropFilter: "blur(20px)" }}
        >
          <h3 className="font-bold text-base mb-5 flex items-center gap-2"
            style={{ color: "#f87171", fontFamily: "Orbitron, sans-serif", fontSize: "0.8rem", letterSpacing: "0.1em" }}>
            ⚠️ MISSING SKILLS
          </h3>
          <ul className="space-y-3">
            {result.missing_skills.map((s, i) => (
              <motion.li key={i}
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-start gap-2 text-gray-300 text-sm leading-relaxed"
              >
                <span style={{ color: "#f87171" }} className="mt-0.5">▸</span> {s}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Interview Questions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl p-8"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(96,165,250,0.15)", backdropFilter: "blur(20px)" }}
      >
        <h3 className="font-bold mb-8"
          style={{ color: "#60a5fa", fontFamily: "Orbitron, sans-serif", fontSize: "0.8rem", letterSpacing: "0.15em" }}>
          🎯 INTERVIEW QUESTIONS
        </h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-gray-600 text-xs uppercase tracking-widest mb-4">Technical</p>
            <ul className="space-y-3">
              {result.technical_questions.map((q, i) => (
                <motion.li key={i}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  whileHover={{ x: 4, borderColor: "rgba(96,165,250,0.4)" }}
                  className="text-gray-300 text-sm p-4 rounded-xl transition-all duration-200"
                  style={{ background: "rgba(96,165,250,0.04)", border: "1px solid rgba(96,165,250,0.1)" }}
                >
                  <span style={{ color: "#60a5fa" }}>{i + 1}.</span> {q}
                </motion.li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-gray-600 text-xs uppercase tracking-widest mb-4">HR / Behavioral</p>
            <ul className="space-y-3">
              {result.hr_questions.map((q, i) => (
                <motion.li key={i}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  whileHover={{ x: 4, borderColor: "rgba(34,211,238,0.4)" }}
                  className="text-gray-300 text-sm p-4 rounded-xl transition-all duration-200"
                  style={{ background: "rgba(34,211,238,0.04)", border: "1px solid rgba(34,211,238,0.1)" }}
                >
                  <span style={{ color: "#22d3ee" }}>{i + 1}.</span> {q}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}