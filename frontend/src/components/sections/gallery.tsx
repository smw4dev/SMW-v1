"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

// Curated image sets from Unsplash (royalty-free) to showcase different events
const galleryData = [
  {
    title: "মেডিকেল টপ ২০",
    images: [
      unsplash("photo-1523580846011-d3a5bc25702b"),
      unsplash("photo-1519452575417-564c1401ecc0"),
      unsplash("photo-1522202176988-66273c2fd55f"),
      unsplash("photo-1516321497487-e288fb19713f"),
    ],
  },
  {
    title: "ডেন্টাল টপ ২০",
    images: [
      unsplash("photo-1517486808906-6ca8b3f04846"),
      unsplash("photo-1509062522246-3755977927d7"),
      unsplash("photo-1504439468489-c8920d796a29"),
      unsplash("photo-1491841550275-ad7854e35ca6"),
    ],
  },
  {
    title: " গ্রান্ড সেলিব্রেশন",
    images: [
      unsplash("photo-1427504494785-3a9ca7044f45"),
      unsplash("photo-1524178232363-1fb2b075b655"),
      unsplash("photo-1523240795612-9a054b0db644"),
      unsplash("photo-1532012197267-da84d127e765"),
    ],
  },
  {
    title: " পুরস্কার বিতরণী",
    images: [
      unsplash("photo-1543269865-cbf427effbad"),
      unsplash("photo-1544717305-2782549b5136"),
      unsplash("photo-1571260899304-425eee4c7efc"),
      unsplash("photo-1527613426441-4da17471b66d"),
    ],
  },
  {
    title: " ডক্টরস হান্ট",
    images: [
      unsplash("photo-1497633762265-9d179a990aa6"),
      unsplash("photo-1522071820081-009f0129c71c"),
      unsplash("photo-1516841273335-e39b37888115"),
      unsplash("photo-1524995997946-a1c2e315a42f"),
    ],
  },
  {
    title: " স্টার",
    images: [
      unsplash("photo-1503676260728-1c00da094a0b"),
      unsplash("photo-1516321318423-f06f85e504b3"),
      unsplash("photo-1549057446-9f5c6ac91a04"),
      unsplash("photo-1579684385127-1ef15d508118"),
    ],
  },
  {
    title: "বায়োলজি অলিম্পিয়াড",
    images: [
      unsplash("photo-1516979187457-637abb4f9353"),
      unsplash("photo-1501504905252-473c47e087f8"),
      unsplash("photo-1521737604893-d14cc237f11d"),
      unsplash("photo-1576091160550-2173dba999ef"),
    ],
  },
  {
    title: " রিস্টার্ট সেলিব্রেশন",
    images: [
      unsplash("photo-1481627834876-b7833e8f5570"),
      unsplash("photo-1488190211105-8b0e65b80b4e"),
      unsplash("photo-1454165804606-c3d57bc86b40"),
      unsplash("photo-1513258496099-48168024aec0"),
    ],
  },
  {
    title: " বিদায়ী প্রোগ্রাম",
    images: [
      unsplash("photo-1513542789411-b6a5d4f31634"),
      unsplash("photo-1516534775068-ba3e7458af70"),
      unsplash("photo-1495968283540-e1df41995ba6"),
      unsplash("photo-1503676382389-4809596d5290"),
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
          onClick={close}
        >
          {/* Close button */}
          <button
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
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

          {/* Image container - shrink to image so clicks outside close */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <img
              key={current}
              src={allImages[current]}
              alt={`gallery-large-${current + 1}`}
              className="max-h-[96vh] max-w-[96vw] object-contain select-none rounded-md animate-fade-in"
            />
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
