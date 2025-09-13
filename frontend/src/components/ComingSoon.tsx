"use client";
import React, { useState, useEffect } from "react";
import { Mail, Twitter, Facebook, Instagram, Linkedin } from "lucide-react";

// Set your target date here
const TARGET_DATE = new Date("2025-11-01T00:00:00Z");

function getTimeLeft(target: Date) {
  const now = new Date();
  let diff = Math.max(0, target.getTime() - now.getTime());

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * (1000 * 60 * 60 * 24);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * (1000 * 60 * 60);
  const minutes = Math.floor(diff / (1000 * 60));
  diff -= minutes * (1000 * 60);
  const seconds = Math.floor(diff / 1000);

  return { days, hours, minutes, seconds };
}

const MathComingSoonPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(TARGET_DATE));

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(TARGET_DATE));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Mouse tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 20,
        y: (e.clientY / window.innerHeight) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
      setEmail("");
    }
  };

  // Data for components
  const timeUnits = [
    { label: "Days", value: timeLeft.days, symbol: "+" },
    { label: "Hours", value: timeLeft.hours, symbol: "−" },
    { label: "Minutes", value: timeLeft.minutes, symbol: "×" },
    { label: "Seconds", value: timeLeft.seconds, symbol: "÷" },
  ];

  const socialLinks = [
    {
      name: "Twitter",
      symbol: "π",
      href: "#",
      color: "hover:text-blue-400",
      Icon: Twitter,
    },
    {
      name: "Facebook",
      symbol: "∑",
      href: "#",
      color: "hover:text-blue-500",
      Icon: Facebook,
    },
    {
      name: "Instagram",
      symbol: "∫",
      href: "#",
      color: "hover:text-pink-400",
      Icon: Instagram,
    },
    {
      name: "LinkedIn",
      symbol: "∂",
      href: "#",
      color: "hover:text-blue-300",
      Icon: Linkedin,
    },
  ];

  const floatingSymbols = [
    {
      symbol: "π",
      x: 10,
      y: 20,
      size: "text-2xl",
      color: "text-cyan-400/20",
      animation: "animate-float",
    },
    {
      symbol: "∑",
      x: 85,
      y: 15,
      size: "text-3xl",
      color: "text-blue-400/20",
      animation: "animate-float-delayed",
    },
    {
      symbol: "∫",
      x: 15,
      y: 70,
      size: "text-2xl",
      color: "text-purple-400/20",
      animation: "animate-float-slow",
    },
    {
      symbol: "∂",
      x: 80,
      y: 75,
      size: "text-xl",
      color: "text-green-400/20",
      animation: "animate-float-delayed-slow",
    },
    {
      symbol: "√",
      x: 50,
      y: 10,
      size: "text-2xl",
      color: "text-yellow-400/20",
      animation: "animate-float",
    },
    {
      symbol: "≠",
      x: 5,
      y: 50,
      size: "text-xl",
      color: "text-pink-400/20",
      animation: "animate-float-delayed",
    },
    {
      symbol: "∞",
      x: 90,
      y: 45,
      size: "text-3xl",
      color: "text-indigo-400/20",
      animation: "animate-float-slow",
    },
    {
      symbol: "φ",
      x: 25,
      y: 30,
      size: "text-xl",
      color: "text-red-400/20",
      animation: "animate-float-delayed-slow",
    },
  ];

  const equations = [
    "E = mc²",
    "∫ f(x)dx",
    "lim(x→∞)",
    "Σ(n=1 to ∞)",
    "f(x) = ax² + bx + c",
    "∂f/∂x",
    "π ≈ 3.14159",
    "√(a² + b²)",
    "sin²θ + cos²θ = 1",
    "e^(iπ) + 1 = 0",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-hidden relative font-sans">
      {/* Import attractive Google Fonts */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&family=Fira+Mono:wght@400;700&family=Quicksand:wght@500;700&display=swap");
        html,
        body {
          font-family: "Quicksand", "Montserrat", "Fira Mono", "ui-sans-serif",
            "system-ui", sans-serif;
        }
        .math-mono {
          font-family: "Fira Mono", "Menlo", "Monaco", "Consolas", monospace;
        }
        .math-label {
          font-family: "Montserrat", "Quicksand", "ui-sans-serif", sans-serif;
          font-weight: 700;
        }
        .math-symbol {
          font-family: "Fira Mono", "Menlo", "Monaco", "Consolas", monospace;
        }
        .math-quote {
          font-family: "Quicksand", "Montserrat", "ui-sans-serif", sans-serif;
          font-style: italic;
        }
      `}</style>

      {/* Mathematical Grid Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(180deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Floating Math Symbols */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingSymbols.map((item, index) => (
          <div
            key={index}
            className={`absolute ${item.size} ${item.color} ${item.animation} math-symbol`}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              animationDelay: `${index * 0.5}s`,
            }}
          >
            {item.symbol}
          </div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        {/* Left Section - The Excitement Zone */}
        <div className="flex-5 flex flex-col justify-center items-center px-8 py-16 lg:py-16">
          <div className="w-full space-y-4 text-center">
            {/* Header */}
            <div className="space-y-4">
              <h1
                id="hero-title"
                className="font-mono animate-bounce-gentle text-4xl md:text-5xl leading-tight font-extrabold tracking-wide mb-4 bg-gradient-to-r from-white via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x"
                style={{ animationDelay: "0.1s" }}
              >
                we&apos;re almost there
              </h1>

              {/* Mathematical decoration */}
              <div className="flex justify-center items-center gap-4 text-2xl text-cyan-400 opacity-60 math-symbol">
                <span className="animate-pulse">∑</span>
                <span
                  className="animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                >
                  ∂
                </span>
                <span
                  className="animate-pulse"
                  style={{ animationDelay: "1s" }}
                >
                  ∫
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-lg md:text-lg text-gray-300 leading-relaxed font-light animate-fade-in-up math-label">
                Get ready to{" "}
                <span className="text-cyan-400 font-semibold">multiply</span>{" "}
                your knowledge – without the boring lectures!
              </p>

              {/* Countdown Timer */}
              <div className="relative">
                {/* Floating math symbols around timer */}
                <div className="absolute -inset-8 pointer-events-none">
                  <div className="absolute top-0 left-0 text-cyan-400 text-2xl animate-float math-symbol">
                    π
                  </div>
                  <div className="absolute top-0 right-0 text-blue-400 text-2xl animate-float-delayed math-symbol">
                    √
                  </div>
                  <div className="absolute bottom-0 left-0 text-purple-400 text-2xl animate-float-slow math-symbol">
                    ∞
                  </div>
                  <div className="absolute bottom-0 right-0 text-green-400 text-2xl animate-float-delayed-slow math-symbol">
                    ≠
                  </div>
                </div>

                <div className="">
                  {/* Countdown Timer - Circular Progress Bars in a Single Line */}
                  <div className="relative flex flex-wrap justify-center gap-8 py-4">
                    {timeUnits.map((unit, idx) => {
                      // Set max for each unit
                      let max = 60;
                      if (unit.label === "Days") max = 99;
                      if (unit.label === "Hours") max = 24;
                      if (unit.label === "Minutes") max = 60;
                      if (unit.label === "Seconds") max = 60;
                      const value = Number(unit.value);
                      const progress = Math.max(0, Math.min(1, value / max));
                      const circumference = 2 * Math.PI * 44;
                      const offset = circumference * (1 - progress);

                      // Color for each unit
                      const colors = [
                        "#a78bfa", // Days - purple
                        "#38bdf8", // Hours - blue
                        "#34d399", // Minutes - green
                        "#f472b6", // Seconds - pink
                      ];

                      return (
                        <div
                          key={unit.label}
                          className="flex flex-col items-center"
                        >
                          <div className="relative w-28 h-28 flex items-center justify-center">
                            <svg
                              width={96}
                              height={96}
                              viewBox="0 0 96 96"
                              className="absolute"
                            >
                              <circle
                                cx="48"
                                cy="48"
                                r="44"
                                stroke="#2a2a2a"
                                strokeWidth="8"
                                fill="none"
                              />
                              <circle
                                cx="48"
                                cy="48"
                                r="44"
                                stroke={colors[idx]}
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                strokeLinecap="round"
                                style={{
                                  transition: "stroke-dashoffset 1s linear",
                                }}
                              />
                            </svg>
                            <span className="text-3xl font-bold z-10 text-white math-mono">
                              {value.toString().padStart(2, "0")}
                            </span>
                            <span className="absolute top-2 right-2 text-cyan-400 text-lg opacity-70 animate-pulse math-symbol">
                              {unit.symbol}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400 mt-2 tracking-wider uppercase math-label">
                            {unit.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-md text-gray-400 flex items-center justify-center gap-2 math-label">
                  Want to be the first to solve this equation?
                  <span className="text-cyan-400 math-symbol">∫</span> Register
                  to get notified!
                </p>

                {/* Email Signup */}
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 math-label"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitted}
                      className="group relative px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed math-label"
                    >
                      {isSubmitted ? (
                        <span className="flex items-center gap-2">
                          ✓ Solved!
                        </span>
                      ) : (
                        <>
                          <span className="group-hover:hidden">Solve It!</span>
                          <span className="hidden group-hover:inline-flex items-center gap-2">
                            x² + y² = ∞
                          </span>
                        </>
                      )}
                    </button>
                  </div>

                  {isSubmitted && (
                    <div className="text-green-400 text-sm animate-fade-in math-label">
                      Thanks! We&apos;ll notify you when we launch! 🎉
                    </div>
                  )}
                </form>
              </div>

              {/* Social Icons */}
              <div className="flex justify-center items-center space-x-6 pt-4">
                {socialLinks.map(({ name, href, color, symbol, Icon }) => (
                  <a
                    key={name}
                    href={href}
                    className={`group relative w-12 h-12 overflow-hidden bg-white/10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-cyan-400 hover:scale-110 hover:rotate-12 ${color} math-label`}
                    aria-label={name}
                  >
                    {/* Placeholder math symbol (default view) */}
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-xl font-bold math-symbol transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-100 scale-100 blur-0 group-hover:opacity-0 group-hover:scale-75 group-hover:blur-sm">
                      {symbol}
                    </span>

                    {/* Actual social icon (reveals on hover) */}
                    {Icon && (
                      <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <Icon className="w-5 h-5 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-0 scale-125 group-hover:opacity-100 group-hover:scale-100 group-hover:blur-0" />
                      </span>
                    )}

                    {/* Ripple highlight for extra satisfaction */}
                    <span className="pointer-events-none absolute inset-0 rounded-full bg-cyan-400/0 group-hover:bg-cyan-400/5 transition-colors duration-500" />

                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap math-label">
                      {name}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - The Visual Impact Zone */}
        <div className="flex-4 relative overflow-hidden lg:min-h-screen">
          {/* Parallax Background */}
          <div
            className="absolute inset-0 bg-cover bg-center filter blur-sm scale-110 transition-transform duration-1000"
            style={{
              backgroundImage: `url('https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg')`,
              transform: `translate(${-mousePos.x}px, ${-mousePos.y}px)`,
            }}
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-l from-slate-900/70 via-blue-900/50 to-purple-900/60" />

          {/* Floating Equations */}
          <div className="absolute inset-0 pointer-events-none">
            {equations.map((equation, index) => (
              <div
                key={equation}
                className={`absolute text-white/20 text-lg math-mono animate-float-equation-${
                  index % 3
                }`}
                style={{
                  left: `${15 + ((index * 13) % 70)}%`,
                  top: `${10 + ((index * 17) % 80)}%`,
                  animationDelay: `${index * 0.5}s`,
                }}
              >
                {equation}
              </div>
            ))}
          </div>

          {/* Central Content */}
          <div className="relative z-10 flex items-center justify-center h-full p-8">
            <div className="text-center max-w-md">
              <div className="bg-black/30 backdrop-blur-md rounded-2xl p-8 border border-cyan-400/20 shadow-2xl">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 math-label">
                  Your next <span className="text-cyan-400">equation</span>
                </h2>
                <h3 className="text-xl md:text-2xl text-gray-300 mb-6 math-label">
                  Starts Here
                </h3>

                {/* Mathematical decoration */}
                <div className="flex justify-center items-center space-x-4 text-cyan-400 text-2xl opacity-60 math-symbol">
                  <span className="animate-pulse">∮</span>
                  <span className="animate-spin-slow">⊕</span>
                  <span
                    className="animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  >
                    ∇
                  </span>
                </div>

                <p className="text-gray-400 mt-6 math-quote">
                  &quot;Mathematics is the language with which God has written
                  the universe.&quot;
                </p>
              </div>
            </div>
          </div>

          {/* Corner Math Symbols */}
          <div className="absolute top-8 right-8 text-6xl text-cyan-400/30 animate-pulse math-symbol">
            ∞
          </div>
          <div className="absolute bottom-8 left-8 text-4xl text-blue-400/30 animate-bounce math-symbol">
            φ
          </div>
        </div>
      </div>

      {/* Bottom Mathematical Pattern */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none">
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-600 text-sm opacity-50 math-mono">
          π = 3.14159... ∞
        </div>
      </div>
    </div>
  );
};

export default MathComingSoonPage;
