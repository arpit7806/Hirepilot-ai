"use client";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

interface AnalysisResult {
  match_score: number;
  summary: string;
  strengths: string[];
  missing_skills: string[];
  technical_questions: string[];
  hr_questions: string[];
}

interface HeroProps {
  onResult: (result: AnalysisResult) => void;
  onLoading: (loading: boolean) => void;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface SmokeBlob {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

export default function Hero({ onResult, onLoading }: HeroProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [phase, setPhase] = useState<"plane" | "smoke" | "ui">("plane");
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const bgX = useTransform(mouseX, [-500, 500], [-20, 20]);
  const bgY = useTransform(mouseY, [-500, 500], [-20, 20]);
  const orb1X = useTransform(mouseX, [-500, 500], [-40, 40]);
  const orb1Y = useTransform(mouseY, [-500, 500], [-40, 40]);
  const orb2X = useTransform(mouseX, [-500, 500], [30, -30]);
  const orb2Y = useTransform(mouseY, [-500, 500], [30, -30]);

  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 3,
    }))
  );

  const [smokeBlobs] = useState<SmokeBlob[]>(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 80 + Math.random() * 180,
      delay: Math.random() * 0.4,
    }))
  );

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newRipple: Ripple = { id: Date.now(), x: e.clientX, y: e.clientY };
      setRipples(prev => [...prev, newRipple]);
      setTimeout(() => setRipples(prev => prev.filter(r => r.id !== newRipple.id)), 1200);
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("smoke"), 3200);
    const t2 = setTimeout(() => setPhase("ui"), 5200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleFile = (f: File) => {
    if (f.type !== "application/pdf") { setError("PDF files only."); return; }
    setFile(f); setFileName(f.name); setError("");
  };

  const handleAnalyze = async () => {
    if (!file || !jobDescription.trim()) {
      setError("Please upload a resume and enter a job description.");
      return;
    }
    setError(""); onLoading(true);
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("job_description", jobDescription);
    try {
      const res = await fetch("https://hirepilot-ai-f8ee.onrender.com/analyze", { method: "POST", body: formData });
      const data = await res.json();
      onResult(data);
    } catch {
      setError("Failed to connect to backend. Make sure FastAPI is running.");
    } finally {
      onLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-32 pb-20 overflow-hidden">

      {/* Electric click ripples */}
      {ripples.map(r => (
        <motion.div key={r.id} className="fixed pointer-events-none z-[999] rounded-full"
          style={{ left: r.x, top: r.y, x: "-50%", y: "-50%", border: "2px solid rgba(56,189,248,0.9)" }}
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ width: 400, height: 400, opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      ))}
      {ripples.map(r => (
        <motion.div key={r.id + "b"} className="fixed pointer-events-none z-[999] rounded-full"
          style={{ left: r.x, top: r.y, x: "-50%", y: "-50%", border: "1.5px solid rgba(96,165,250,0.6)" }}
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ width: 240, height: 240, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        />
      ))}
      {ripples.map(r => (
        <motion.div key={r.id + "c"} className="fixed pointer-events-none z-[999] rounded-full"
          style={{ left: r.x, top: r.y, x: "-50%", y: "-50%", border: "1px solid rgba(6,182,212,0.4)" }}
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ width: 140, height: 140, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
        />
      ))}

      {/* Animated grid */}
      <motion.div className="fixed inset-0 -z-20" style={{ x: bgX, y: bgY }}>
        <div style={{
          width: "120%", height: "120%", marginLeft: "-10%", marginTop: "-10%",
          backgroundImage: `linear-gradient(rgba(0,150,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,150,255,0.04) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />
      </motion.div>

      {/* Parallax orbs */}
      <motion.div className="fixed -z-10 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ x: orb1X, y: orb1Y, top: "10%", left: "10%",
          background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)", filter: "blur(40px)" }}
      />
      <motion.div className="fixed -z-10 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ x: orb2X, y: orb2Y, bottom: "10%", right: "10%",
          background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)", filter: "blur(40px)" }}
      />

      {/* Floating particles */}
      {particles.map(p => (
        <motion.div key={p.id} className="fixed rounded-full pointer-events-none -z-10"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%`,
            background: p.id % 2 === 0 ? "#38bdf8" : "#2563eb", opacity: 0.3 }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
        />
      ))}

      {/* ====== PHASE 1: PLANE — pure black, only plane visible ====== */}
      <AnimatePresence>
        {phase === "plane" && (
          <motion.div
            key="plane-screen"
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{ background: "#000000" }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            {/* Cinematic top/bottom bars */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-black z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-black z-10" />

            {/* The Plane — SVG detailed commercial airliner */}
            <motion.div
              initial={{ x: -900, y: 80, scale: 0.08, opacity: 0 }}
              animate={{
                x: [-900, -400, 0, 500, 1200],
                y: [80, 40, 0, -30, -80],
                scale: [0.08, 0.18, 0.45, 1.2, 3.5],
                opacity: [0, 1, 1, 1, 0],
              }}
              transition={{ duration: 3.2, times: [0, 0.25, 0.55, 0.8, 1], ease: [0.25, 0.1, 0.6, 1] }}
              style={{ filter: "drop-shadow(0 0 25px rgba(56,189,248,0.7)) drop-shadow(0 0 60px rgba(37,99,235,0.4))" }}
            >
              <svg width="340" height="120" viewBox="0 0 340 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* ── Fuselage ── */}
                <path d="M40 55 Q80 42 160 44 Q240 44 310 54 Q330 58 322 62 Q310 70 240 66 Q160 68 80 68 Q50 68 40 65 Z" fill="#d1d5db"/>
                {/* Fuselage shading top */}
                <path d="M40 55 Q80 42 160 44 Q240 44 310 54 L310 57 Q240 47 160 47 Q80 45 40 58 Z" fill="#e5e7eb"/>
                {/* Fuselage shading bottom */}
                <path d="M40 65 Q80 68 160 68 Q240 68 310 62 L310 66 Q240 72 160 72 Q80 72 40 67 Z" fill="#9ca3af"/>

                {/* ── Nose cone ── */}
                <path d="M310 54 Q338 58 338 61 Q338 64 310 66 Z" fill="#e5e7eb"/>
                <path d="M310 54 Q325 55 335 59 Q338 61 335 63 Q325 65 310 66 Z" fill="#f3f4f6"/>

                {/* ── Tail ── */}
                <path d="M40 60 Q25 60 18 58 Q10 55 15 52 Q22 48 40 55 Z" fill="#d1d5db"/>

                {/* ── Vertical stabilizer ── */}
                <path d="M52 55 L45 22 Q48 18 54 20 L62 55 Z" fill="#9ca3af"/>
                <path d="M52 55 L45 22 Q48 18 50 19 L58 55 Z" fill="#b0b7c3"/>
                {/* Tail logo stripe */}
                <path d="M47 30 L56 30 L58 40 L49 40 Z" fill="#38bdf8" opacity="0.8"/>

                {/* ── Horizontal stabilizers ── */}
                <path d="M42 64 L28 76 Q24 78 26 73 L42 66 Z" fill="#9ca3af"/>
                <path d="M42 56 L28 44 Q24 42 26 47 L42 54 Z" fill="#9ca3af"/>

                {/* ── Main wings ── */}
                {/* Right wing (top) */}
                <path d="M140 54 L175 12 Q182 8 188 12 L165 54 Z" fill="#6b7280"/>
                <path d="M140 54 L175 12 Q178 9 180 11 L158 54 Z" fill="#9ca3af"/>
                {/* Wing tip */}
                <path d="M175 12 Q185 8 188 12 L185 16 Q183 13 175 16 Z" fill="#38bdf8" opacity="0.7"/>

                {/* Left wing (bottom) */}
                <path d="M140 66 L175 108 Q182 112 188 108 L165 66 Z" fill="#6b7280"/>
                <path d="M140 66 L175 108 Q178 111 180 109 L158 66 Z" fill="#9ca3af"/>
                {/* Wing tip */}
                <path d="M175 108 Q185 112 188 108 L185 104 Q183 107 175 104 Z" fill="#38bdf8" opacity="0.7"/>

                {/* ── Engines ── */}
                {/* Engine 1 on top wing */}
                <ellipse cx="162" cy="36" rx="18" ry="7" fill="#4b5563"/>
                <ellipse cx="162" cy="36" rx="14" ry="5" fill="#374151"/>
                <ellipse cx="172" cy="36" rx="4" ry="5" fill="#1f2937"/>
                {/* Engine intake glow */}
                <ellipse cx="148" cy="36" rx="4" ry="5" fill="#06b6d4" opacity="0.6"/>

                {/* Engine 2 on bottom wing */}
                <ellipse cx="162" cy="84" rx="18" ry="7" fill="#4b5563"/>
                <ellipse cx="162" cy="84" rx="14" ry="5" fill="#374151"/>
                <ellipse cx="172" cy="84" rx="4" ry="5" fill="#1f2937"/>
                <ellipse cx="148" cy="84" rx="4" ry="5" fill="#06b6d4" opacity="0.6"/>

                {/* ── Windows row ── */}
                <rect x="220" y="52" width="8" height="7" rx="2" fill="#38bdf8" opacity="0.85"/>
                <rect x="234" y="52" width="8" height="7" rx="2" fill="#38bdf8" opacity="0.85"/>
                <rect x="248" y="52" width="8" height="7" rx="2" fill="#7dd3fc" opacity="0.75"/>
                <rect x="262" y="52" width="8" height="7" rx="2" fill="#7dd3fc" opacity="0.65"/>
                <rect x="276" y="53" width="8" height="7" rx="2" fill="#bae6fd" opacity="0.55"/>
                <rect x="290" y="53" width="8" height="7" rx="2" fill="#bae6fd" opacity="0.45"/>

                {/* ── Cockpit windows ── */}
                <path d="M305 53 Q312 52 318 55 Q318 58 312 60 Q305 61 303 58 Z" fill="#0ea5e9" opacity="0.9"/>
                <path d="M305 53 Q309 52 312 54 Q310 52 305 53 Z" fill="#7dd3fc" opacity="0.7"/>

                {/* ── Airline stripe ── */}
                <path d="M80 44 Q160 43 260 50 L260 52 Q160 45 80 46 Z" fill="#38bdf8" opacity="0.4"/>

                {/* ── Landing gear (retracted bumps) ── */}
                <ellipse cx="200" cy="68" rx="8" ry="3" fill="#6b7280" opacity="0.5"/>
                <ellipse cx="130" cy="67" rx="6" ry="2.5" fill="#6b7280" opacity="0.5"/>

                {/* ── Outer fuselage glow ── */}
                <path d="M40 55 Q80 42 160 44 Q240 44 310 54 Q330 58 322 62 Q310 70 240 66 Q160 68 80 68 Q50 68 40 65 Z"
                  fill="none" stroke="#38bdf8" strokeWidth="0.8" opacity="0.5"/>
              </svg>
            </motion.div>

            {/* Engine exhaust trails */}
            <motion.div
              initial={{ x: -900, y: 32, opacity: 0, scaleX: 0 }}
              animate={{ x: [-900, 600], y: [32, -52], opacity: [0, 0.7, 0.5, 0], scaleX: [0, 1, 1, 0.3] }}
              transition={{ duration: 3, delay: 0.3, ease: "easeIn" }}
              className="fixed pointer-events-none origin-left"
              style={{ width: 180, height: 3,
                background: "linear-gradient(90deg, rgba(56,189,248,0.8), rgba(56,189,248,0.2), transparent)",
                filter: "blur(2px)" }}
            />
            <motion.div
              initial={{ x: -900, y: 52, opacity: 0, scaleX: 0 }}
              animate={{ x: [-900, 600], y: [52, -28], opacity: [0, 0.7, 0.5, 0], scaleX: [0, 1, 1, 0.3] }}
              transition={{ duration: 3, delay: 0.3, ease: "easeIn" }}
              className="fixed pointer-events-none origin-left"
              style={{ width: 180, height: 3,
                background: "linear-gradient(90deg, rgba(56,189,248,0.8), rgba(56,189,248,0.2), transparent)",
                filter: "blur(2px)" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== PHASE 2: CARTOON BLUE SMOKE fills entire screen ====== */}
      <AnimatePresence>
        {phase === "smoke" && (
          <motion.div
            key="smoke-screen"
            className="fixed inset-0 z-[90] pointer-events-none overflow-hidden"
            style={{ background: "#000" }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
          >
            {/* Full screen smoke wash */}
            <motion.div className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.8, 0] }}
              transition={{ duration: 2, times: [0, 0.15, 0.6, 1] }}
              style={{
                background: "radial-gradient(ellipse at 55% 48%, rgba(56,189,248,0.55) 0%, rgba(6,182,212,0.35) 25%, rgba(37,99,235,0.2) 55%, rgba(0,0,0,0.9) 80%)",
                filter: "blur(8px)",
              }}
            />

            {/* Cartoon smoke blob SVGs scattered across screen */}
            {smokeBlobs.map((b) => (
              <motion.div key={b.id}
                className="absolute pointer-events-none"
                style={{ left: `${b.x}%`, top: `${b.y}%`, width: b.size, height: b.size }}
                initial={{ opacity: 0, scale: 0.2 }}
                animate={{ opacity: [0, 0.85, 0.5, 0], scale: [0.2, 1.1, 1.4, 1.8] }}
                transition={{ duration: 2, delay: b.delay, ease: "easeOut" }}
              >
                <svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                  <ellipse cx="50" cy="55" rx="38" ry="22" fill="rgba(56,189,248,0.18)" />
                  <circle cx="30" cy="42" r="18" fill="rgba(56,189,248,0.22)" />
                  <circle cx="50" cy="34" r="22" fill="rgba(56,189,248,0.28)" />
                  <circle cx="68" cy="40" r="16" fill="rgba(56,189,248,0.22)" />
                  <circle cx="80" cy="50" r="12" fill="rgba(6,182,212,0.18)" />
                  <circle cx="20" cy="52" r="10" fill="rgba(6,182,212,0.16)" />
                </svg>
              </motion.div>
            ))}

            {/* Big central cartoon puff */}
            <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: [0, 1, 0.6, 0], scale: [0.3, 1.2, 1.6, 2.2] }}
              transition={{ duration: 2, ease: "easeOut" }}
            >
              <svg viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" width="900" height="600">
                <ellipse cx="200" cy="200" rx="160" ry="70" fill="rgba(56,189,248,0.12)" />
                <circle cx="100" cy="160" r="70" fill="rgba(56,189,248,0.16)" />
                <circle cx="170" cy="120" r="90" fill="rgba(56,189,248,0.22)" />
                <circle cx="250" cy="110" r="80" fill="rgba(56,189,248,0.20)" />
                <circle cx="320" cy="150" r="65" fill="rgba(6,182,212,0.16)" />
                <circle cx="200" cy="90" r="70" fill="rgba(37,99,235,0.15)" />
                <circle cx="140" cy="80" r="50" fill="rgba(56,189,248,0.18)" />
                <circle cx="280" cy="80" r="55" fill="rgba(56,189,248,0.18)" />
              </svg>
            </motion.div>

            {/* Light sweep left to right */}
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: "150%", opacity: [0, 0.4, 0] }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="absolute inset-y-0 pointer-events-none"
              style={{
                width: "50%",
                background: "linear-gradient(90deg, transparent, rgba(56,189,248,0.25), transparent)",
                filter: "blur(20px)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== PHASE 3: MAIN UI ====== */}
      <AnimatePresence>
        {phase === "ui" && (
          <>
            {/* Hero text */}
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-center mb-20"
            >
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="inline-block px-6 py-2 rounded-full text-xs tracking-widest uppercase mb-8"
                style={{ border: "1px solid rgba(56,189,248,0.3)", background: "rgba(56,189,248,0.05)", color: "#38bdf8", fontFamily: "Orbitron, sans-serif" }}
              >
                ✦ AI-Powered Recruitment
              </motion.div>

              <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white mb-6"
                style={{ fontFamily: "Orbitron, sans-serif" }}>
                HIRE<span style={{ color: "#38bdf8", textShadow: "0 0 50px rgba(56,189,248,0.7)" }}>PILOT</span>
              </h1>
              <h2 className="text-3xl md:text-4xl font-black tracking-widest mb-8"
                style={{ color: "#06b6d4", fontFamily: "Orbitron, sans-serif", textShadow: "0 0 30px rgba(6,182,212,0.5)" }}>
                AI
              </h2>

              <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                Upload a resume. Paste a job description.<br />
                Get instant AI-powered candidate analysis, ATS scoring, and interview questions.
              </p>
            </motion.div>

            {/* Upload card */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="w-full max-w-2xl rounded-3xl p-12"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(56,189,248,0.15)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 0 80px rgba(0,100,255,0.07)",
              }}
            >
              {/* Drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
                onClick={() => fileInputRef.current?.click()}
                className="rounded-2xl p-14 text-center cursor-pointer transition-all duration-300 mb-10"
                style={{
                  border: `2px dashed ${dragging ? "#38bdf8" : "rgba(56,189,248,0.2)"}`,
                  background: dragging ? "rgba(56,189,248,0.06)" : "rgba(255,255,255,0.01)",
                }}
              >
                <input ref={fileInputRef} type="file" accept=".pdf" className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                <div className="text-7xl mb-5">📄</div>
                {fileName ? (
                  <p className="text-cyan-400 font-semibold text-lg">{fileName}</p>
                ) : (
                  <>
                    <p className="text-gray-200 font-semibold text-xl mb-3">Drop your resume here</p>
                    <p className="text-gray-500 text-sm tracking-wide">or click to browse — PDF only</p>
                  </>
                )}
              </div>

              {/* Job description */}
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                rows={6}
                className="w-full rounded-2xl p-6 text-sm text-gray-300 placeholder-gray-600 resize-none outline-none transition-all duration-300 mb-10"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(56,189,248,0.15)",
                  color: "#e2e8f0",
                  lineHeight: "1.9",
                  fontSize: "0.95rem",
                }}
                onFocus={(e) => e.target.style.borderColor = "rgba(56,189,248,0.5)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(56,189,248,0.15)"}
              />

              {error && <p className="text-red-400 text-sm mb-6 text-center">{error}</p>}

              {/* Analyze button */}
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 0 60px rgba(56,189,248,0.5)" }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAnalyze}
                className="w-full py-6 rounded-2xl font-black text-white tracking-widest uppercase transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #1d4ed8, #0891b2)",
                  boxShadow: "0 0 30px rgba(29,78,216,0.3)",
                  fontFamily: "Orbitron, sans-serif",
                  fontSize: "0.9rem",
                  letterSpacing: "0.2em",
                }}
              >
                ⚡ Analyze Resume
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
