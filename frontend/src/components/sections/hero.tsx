"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  CheckCircle2,
  GraduationCap,
  Users,
  Star,
} from "lucide-react";

const PromotionalBanner = () => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="max-w-6xl w-full bg-gradient-to-r from-brand to-brand-emphasis text-white py-3 px-4 shadow-md mt-4 sm:mt-6 rounded-md">
      <div className="mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 overflow-hidden">
        <a
          href="https://shop.example.com/"
          className="text-sm sm:text-base flex-grow text-center sm:text-left transition-transform duration-500"
        >
          🎉 বিশেষ ছাড়ে এখনই কোচিংয়ে ভর্তি হয়ে তোমার প্রস্তুতি শুরু করো!
        </a>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-black transition self-center sm:self-auto"
          aria-label="Close promo banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const HeroSection = () => {
  const collageImages = [
    {
      src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80",
      alt: "Study group collaborating",
    },
    {
      src: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1000&q=80",
      alt: "Focused student in class",
    },
    {
      src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80",
      alt: "Teacher guiding students",
    },
  ];

  return (
    <section className="px-0 md:px-[80px] lg:px-[120px]">
      <div className="w-full flex flex-col items-center relative">
        <PromotionalBanner />

        {/* Decorative background with brand gradient + subtle grid */}
        <div className="relative w-full overflow-hidden px-4 py-10 lg:py-14 rounded-3xl mt-4">
          <div
            className="absolute inset-0 -z-10"
            aria-hidden
            style={{
              background:
                "radial-gradient(1200px 400px at 10% 10%, color-mix(in oklch, var(--brand) 18%, white), transparent 60%), radial-gradient(800px 300px at 90% 20%, color-mix(in oklch, var(--brand-emphasis) 24%, white), transparent 60%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(0,0,0,.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,.6) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="flex flex-col lg:flex-row h-full w-full max-w-6xl mx-auto items-center justify-between gap-10 lg:gap-12">
            {/* Left: Headline, search, CTAs, trust */}
            <div className="w-full flex flex-col gap-5 lg:gap-6">
              <div className="w-full text-center lg:text-left">
                <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-extrabold leading-tight text-black">
                  স্বপ্নপূরণের যাত্রা শুরু হোক
                  <span className="ml-2 bg-clip-text text-transparent bg-gradient-to-r from-brand to-brand-emphasis">আমাদের সাথে</span>!
                </h1>
                <p className="mt-3 text-base sm:text-xl lg:text-2xl text-black/80">
                  প্রতিটি পদক্ষেপে আত্মবিশ্বাস রাখো, সাফল্য তোমারই হবে।
                </p>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-1 gap-2 text-sm lg:text-base mt-1">
                <div className="flex items-center justify-center lg:justify-start gap-6 flex-wrap">
                  <div className="py-1 flex flex-row gap-2 items-center rounded-lg">
                    <CheckCircle2 width={20} height={20} className="text-brand" />
                    <p className="text-[#595959] font-bold italic">৪৫ বছরের উজ্জ্বল অর্জনের গল্প</p>
                  </div>
                  <div className="py-1 flex flex-row gap-2 items-center rounded-lg">
                    <CheckCircle2 width={20} height={20} className="text-brand" />
                    <p className="text-[#595959] font-bold italic">আন্তরিক ও যত্নশীল সহায়তা</p>
                  </div>
                </div>
                <div className="py-1 w-full h-full justify-center lg:justify-start flex flex-row gap-2 items-center rounded-lg">
                  <CheckCircle2 width={20} height={20} className="text-brand" />
                  <p className="text-[#595959] font-bold italic">দক্ষ ও অভিজ্ঞ মেন্টর টিম</p>
                </div>
                <div className="py-1 w-full h-full justify-center lg:justify-start flex flex-row gap-2 items-center rounded-lg">
                  <CheckCircle2 width={20} height={20} className="text-brand" />
                  <p className="text-[#595959] font-bold italic">ঐতিহ্য ও প্রযুক্তির সুষম সমন্বয়</p>
                </div>
              </div>

              {/* CTAs */}
              <div className="w-full flex flex-wrap items-center gap-3 text-sm lg:text-base justify-center lg:justify-start mt-1">
                <Link href="/admission" className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 font-semibold text-brand-foreground shadow hover:bg-brand-emphasis transition-colors">
                  <GraduationCap className="h-5 w-5" /> এখনই ভর্তি হও
                </Link>
                <Link href="/courses" className="inline-flex items-center gap-2 rounded-lg border-2 border-brand px-5 py-2.5 font-semibold text-brand hover:bg-brand hover:text-brand-foreground transition-colors">
                  কোর্সগুলো দেখুন →
                </Link>
              </div>

            </div>

            {/* Right: Animated collage instead of carousel */}
            <div className="w-full relative">
              {/* floating math/equation hints */}
              <div className="pointer-events-none absolute -top-4 right-8 hidden lg:block select-none text-4xl font-semibold text-black/10 animate-float-equation-0">
                ∑
              </div>
              <div className="pointer-events-none absolute top-24 -left-2 hidden lg:block select-none text-3xl font-semibold text-black/10 animate-float-equation-1">
                π
              </div>
              <div className="pointer-events-none absolute -bottom-2 right-10 hidden lg:block select-none text-3xl font-semibold text-black/10 animate-float-equation-2">
                f(x)
              </div>

              {/* glow orbs */}
              <div className="absolute -z-10 right-10 top-6 h-40 w-40 rounded-full bg-brand/20 blur-2xl" />
              <div className="absolute -z-10 left-8 bottom-0 h-28 w-28 rounded-full bg-brand-emphasis/20 blur-2xl" />

              {/* Collage grid */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div className="col-span-2 row-span-2">
                  <div className="relative rounded-2xl ring-2 ring-white/60 shadow-2xl overflow-hidden animate-float">
                    <Image
                      src={collageImages[0].src}
                      alt={collageImages[0].alt}
                      width={800}
                      height={600}
                      className="h-full w-full object-cover"
                      priority
                    />
                    <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2 py-1 text-xs text-black shadow backdrop-blur">
                      <Users className="h-3.5 w-3.5 text-brand" /> লাইভ ব্যাচ
                    </div>
                  </div>
                </div>
                <div className="col-span-1 row-span-1">
                  <div className="relative rounded-2xl ring-2 ring-white/60 shadow-2xl overflow-hidden animate-float-delayed">
                    <Image
                      src={collageImages[1].src}
                      alt={collageImages[1].alt}
                      width={500}
                      height={400}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2 py-1 text-xs text-black shadow backdrop-blur">
                      <Star className="h-3.5 w-3.5 text-brand" /> MCQ Marathon
                    </div>
                  </div>
                </div>
                <div className="col-span-1 row-span-1">
                  <div className="relative rounded-2xl ring-2 ring-white/60 shadow-2xl overflow-hidden animate-float-slow">
                    <Image
                      src={collageImages[2].src}
                      alt={collageImages[2].alt}
                      width={500}
                      height={400}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute left-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2 py-1 text-xs text-black shadow backdrop-blur">
                      <GraduationCap className="h-3.5 w-3.5 text-brand" /> Mentor Support
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
