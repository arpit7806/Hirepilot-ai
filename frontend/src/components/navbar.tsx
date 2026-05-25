"use client";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut", delay: 4.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5"
      style={{
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,150,255,0.1)",
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm"
          style={{ background: "linear-gradient(135deg, #2563eb, #06b6d4)", fontFamily: "Orbitron, sans-serif" }}>
          H
        </div>
        <span className="font-black text-xl tracking-widest text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
          HIRE<span style={{ color: "#38bdf8" }}>PILOT</span>
        </span>
      </div>

      <div className="hidden md:flex items-center gap-10">
        {["Features", "How it Works", "About"].map((item, i) => (
          <motion.a key={item} href="#"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 4.8 + i * 0.1 }}
            className="text-gray-400 text-xs tracking-widest uppercase hover:text-cyan-400 transition-colors duration-300"
          >
            {item}
          </motion.a>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 5.2 }}
        whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(56,189,248,0.4)" }}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-2 rounded-full text-xs font-semibold tracking-widest uppercase text-white transition-all duration-300"
        style={{ border: "1px solid rgba(56,189,248,0.5)", background: "rgba(56,189,248,0.05)" }}
      >
        Get Started
      </motion.button>
    </motion.nav>
  );
}