"use client";

// Next.js + TailwindCSS coming soon page — upgraded: more attractive, engaging & humorous

import { useEffect, useState, FormEvent } from "react";

export default function ComingSoon() {
  const target = new Date("2026-01-01T00:00:00Z").getTime();

  const calcRemaining = () => {
    const now = Date.now();
    const diff = Math.max(0, target - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(calcRemaining());
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calcRemaining()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleSubscribe = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      // playful client-side validation
      alert(
        "Whoops — that's not a real email. Try something like: you@awesome.com 😄"
      );
      return;
    }
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail("");
    }, 3500);
  };

  const counters = [
    {
      value: timeLeft.days,
      label: "DAYS",
      caption: "of brilliant procrastination",
    },
    { value: timeLeft.hours, label: "HOURS", caption: "of caffeinated hustle" },
    {
      value: timeLeft.minutes,
      label: "MINUTES",
      caption: "of nail-biting suspense",
    },
    {
      value: timeLeft.seconds,
      label: "SECONDS",
      caption: "until we ~ship~ sprinkle magic",
    },
  ];

  return (
    <>
      {/* Removed <Head> usage, use metadata in layout.tsx or page.tsx for Next.js 13+ */}
      <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
        {/* LEFT: Content */}
        <main className="md:w-1/2 w-full flex items-center justify-center p-8 md:p-16">
          <div className="max-w-2xl w-full relative">
            {/* playful small header */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs tracking-widest text-green-300 bg-green-900/10 px-3 py-1 rounded-full">
                SOON.
              </span>
              <span className="text-xs text-gray-400">(but with snacks)</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 font-mono">
              We Are Coming Soon!{" "}
              <span className="inline-block animate-wave">🚀☕</span>
            </h1>

            <p className="text-gray-300 mb-6 text-sm md:text-base">
              We&apos;re brewing an experience — part coffee, part code, and
              100% heart. Background image will be chosen automatically based on
              the vibe (and our mood). Expect surprises, dad jokes and a hint of
              brilliance.
            </p>

            {/* Cool counters */}
            <div className="flex flex-wrap gap-6 mb-8">
              {counters.map((c) => (
                <div key={c.label} className="flex flex-col items-center w-28">
                  <div
                    className={`w-28 h-28 rounded-full bg-gradient-to-tr from-gray-700/80 to-gray-700/60 border border-gray-600 flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-105 ${
                      c.label === "SECONDS" && timeLeft.seconds % 2 === 0
                        ? "animate-pulse"
                        : ""
                    }`}
                    title={c.caption}
                  >
                    <span className="text-3xl md:text-4xl font-semibold">
                      {String(c.value).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-400 text-center">
                    <div className="font-medium tracking-wider">{c.label}</div>
                    <div className="text-[10px] mt-1">{c.caption}</div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-gray-400 text-center mb-6">
              Our website is opening soon. Subscribe and we&apos;ll nag you
              exactly once. Promise. 🤞
            </p>

            {/* Subscribe */}
            <form
              onSubmit={handleSubscribe}
              className="flex items-center gap-3 bg-gray-800/60 rounded-full px-1 py-1 shadow-inner"
            >
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@awesome.com"
                aria-label="email"
                className="flex-1 bg-transparent placeholder-gray-500 outline-none px-6 py-4 rounded-full text-gray-100"
              />
              <button
                type="submit"
                className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 px-5 py-3 rounded-full text-sm font-semibold shadow-md transition-transform active:scale-95"
              >
                <span>SUBSCRIBE</span>
                <span className="text-sm">👉</span>
              </button>
            </form>

            {subscribed && (
              <div className="mt-4 p-3 rounded-lg bg-green-900/60 text-green-200 text-sm shadow-md">
                Thanks — we&apos;ll send smoke signals and an email. ✉️
              </div>
            )}

            {/* playful footer icons */}
            <div className="flex gap-4 items-center justify-center mt-8">
              {["🐦", "📘", "💼", "🎯"].map((s, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-green-500/95 hover:scale-110 transform transition"
                >
                  {s}
                </a>
              ))}
            </div>

            {/* subtle watermark / badge */}
            <div className="absolute -right-10 bottom-6 text-9xl font-black text-white opacity-5 select-none">
              ☕
            </div>
          </div>
        </main>

        {/* RIGHT: image + overlay */}
        <aside className="md:w-1/2 w-full relative flex items-center justify-center min-h-[420px]">
          {/* image background */}
          <div
            className="absolute inset-0 bg-cover bg-center filter saturate-90"
            style={{ backgroundImage: "url('/coming-soon.jpg')" }}
            aria-hidden="true"
          />

          {/* dark overlay with glass card */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/30 to-black/65" />

          {/* content on top of image */}
          <div className="relative z-10 p-6 md:p-12 w-full max-w-md">
            <div className="bg-white/6 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm uppercase tracking-widest text-gray-300">
                    Sneak peek
                  </div>
                  <div className="text-2xl font-extrabold mt-2">
                    COFFEE & CODE
                  </div>
                </div>

                {/* hanging sign effect */}
                <div className="text-4xl md:text-5xl font-black tracking-wider text-white transform -rotate-3">
                  ☕
                </div>
              </div>

              <p className="text-sm text-gray-300 mt-4">
                Peek behind the curtains: there will be tutorials, tools, and
                bad jokes. Lots of bad jokes. You&apos;re
              </p>

              <div className="mt-6 flex items-center gap-3">
                <button className="px-4 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold">
                  Join Beta
                </button>
                <button className="px-4 py-2 rounded-full bg-transparent border border-gray-600 text-gray-200">
                  See Roadmap
                </button>
              </div>
            </div>

            {/* tiny credits */}
            <div className="mt-6 text-[12px] text-gray-400">
              Photo mood courtesy of the internet. Background automatically
              blurred for dramatic effect.
            </div>
          </div>
        </aside>
      </div>

      <style jsx global>{`
        @keyframes wave {
          0% {
            transform: rotate(0deg);
          }
          15% {
            transform: rotate(14deg);
          }
          30% {
            transform: rotate(-8deg);
          }
          40% {
            transform: rotate(14deg);
          }
          50% {
            transform: rotate(-4deg);
          }
          60% {
            transform: rotate(10deg);
          }
          70% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }

        .animate-wave {
          display: inline-block;
          transform-origin: 70% 70%;
          animation: wave 2s infinite;
        }

        /* small float for subtle motion */
        @keyframes floaty {
          from {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
          to {
            transform: translateY(0);
          }
        }
        .floaty {
          animation: floaty 4s ease-in-out infinite;
        }

        /* ensure background covers nicely on small screens */
        @media (max-width: 768px) {
          main {
            padding: 3rem 1.25rem;
          }
        }
      `}</style>
    </>
  );
}
