"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

// Source images (grouped as before, but used flat in the grid)
const galleryData = [
  {
    title: "মেডিকেল টপ ২০",
    images: [
      "https://example.com/images/topResult/Test-top2.jpg",
      "https://example.com/images/topResult/Test-top3.jpg",
      "https://example.com/images/topResult/Test-top4.jpg",
      "https://example.com/images/topResult/Test-top5.jpg",
    ],
  },
  {
    title: "ডেন্টাল টপ ২০",
    images: [
      "https://example.com/images/dental/Test-dental1.jpg",
      "https://example.com/images/dental/Test-dental2.jpg",
      "https://example.com/images/dental/Test-dental3.jpg",
      "https://example.com/images/dental/Test-dental4.jpg",
    ],
  },
  {
    title: " গ্রান্ড সেলিব্রেশন",
    images: [
      "https://example.com/images/grandCelebration/Test-grand-1.jpg",
      "https://example.com/images/grandCelebration/Test-grand-2.jpg",
      "https://example.com/images/grandCelebration/Test-grand-3.jpg",
      "https://example.com/images/grandCelebration/Test-grand-4.jpg",
    ],
  },
  {
    title: " পুরস্কার বিতরণী",
    images: [
      "https://example.com/images/prize/prize-1.jpg",
      "https://example.com/images/prize/prize-2.jpg",
      "https://example.com/images/prize/prize-3.jpg",
      "https://example.com/images/prize/prize-4.jpg",
    ],
  },
  {
    title: " ডক্টরস হান্ট",
    images: [
      "https://example.com/images/doctorhunt/doctor-hunt1.jpg",
      "https://example.com/images/doctorhunt/doctor-hunt2.jpg",
      "https://example.com/images/doctorhunt/doctor-hunt3.jpg",
      "https://example.com/images/doctorhunt/doctor-hunt4.jpg",
    ],
  },
  {
    title: " স্টার",
    images: [
      "https://example.com/images/Teststar/TestStar1.jpg",
      "https://example.com/images/Teststar/TestStar2.jpg",
      "https://example.com/images/Teststar/TestStar3.jpg",
      "https://example.com/images/Teststar/TestStar4.jpg",
    ],
  },
  {
    title: "বায়োলজি অলিম্পিয়াড",
    images: [
      "https://example.com/images/biologyOlimpiad/biology1.jpg",
      "https://example.com/images/biologyOlimpiad/biology2.jpg",
      "https://example.com/images/biologyOlimpiad/biology3.jpg",
      "https://example.com/images/biologyOlimpiad/biology4.jpg",
    ],
  },
  {
    title: " রিস্টার্ট সেলিব্রেশন",
    images: [
      "https://example.com/images/TestRestart/Test-restart1.jpg",
      "https://example.com/images/TestRestart/Test-restart2.jpg",
      "https://example.com/images/TestRestart/Test-restart3.jpg",
      "https://example.com/images/TestRestart/Test-restart4.jpg",
    ],
  },
  {
    title: " বিদায়ী প্রোগ্রাম",
    images: [
      "https://example.com/images/endingprogram/ending-program1.jpg",
      "https://example.com/images/endingprogram/ending-program2.jpg",
      "https://example.com/images/endingprogram/ending-program3.jpg",
      "https://example.com/images/endingprogram/ending-program4.jpg",
    ],
  },
];

import React from "react";

const allImages: string[] = galleryData.flatMap((g) => g.images);
const previewImages = allImages.slice(0, 6);

const GallerySection = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [current, setCurrent] = React.useState(0);

  const openAt = (index: number) => {
    setCurrent(index);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);
  const next = () => setCurrent((i) => (i + 1) % allImages.length);
  const prev = () =>
    setCurrent((i) => (i - 1 + allImages.length) % allImages.length);

  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-14 lg:px-0">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold text-black md:text-3xl lg:text-4xl">
          ফটো <span className="text-brand">গ্যালারী</span>
        </h2>
      </div>

      <div className="shadow-xl rounded-xl p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 ">
          {previewImages.map((src, idx) => (
            <button
              type="button"
              key={`${src}-${idx}`}
              onClick={() => openAt(idx)}
              className="relative group w-full overflow-hidden rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <div className="relative h-52 sm:h-56 lg:h-60">
                <Image
                  src={src}
                  alt={`gallery-${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/55 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#ff6a2b] shadow-md">
                  <ZoomIn className="w-6 h-6 text-white" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
          aria-modal
          role="dialog"
        >
          {/* Background click to close */}
          <div className="absolute inset-0" onClick={close} />

          {/* Close button */}
          <button
            aria-label="Close"
            onClick={close}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2"
          >
            <X className="w-7 h-7" />
          </button>

          {/* Prev / Next buttons */}
          <button
            aria-label="Previous"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2"
          >
            <ChevronLeft className="w-9 h-9" />
          </button>
          <button
            aria-label="Next"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2"
          >
            <ChevronRight className="w-9 h-9" />
          </button>

          {/* Image container */}
          <div
            className="relative max-w-6xl w-full px-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[78vh] animate-fade-in">
              <Image
                key={current}
                src={allImages[current]}
                alt={`gallery-large-${current + 1}`}
                fill
                className="object-contain select-none"
                sizes="100vw"
                priority
              />
            </div>
            <div className="absolute bottom-4 right-6 text-white/80 text-sm">
              {current + 1} of {allImages.length}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
