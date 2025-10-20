"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, CheckCircle2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const PromotionalBanner = () => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="max-w-6xl w-full bg-gradient-to-r from-brand to-brand-emphasis text-white py-3 px-4 shadow-md mt-4 sm:mt-6 rounded-md">
      <div className="mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 overflow-hidden">
        <a
          href="https://shop.retinabd.org/"
          className="text-sm sm:text-base flex-grow text-center sm:text-left transition-transform duration-500"
        >
          🎉 বিশেষ ছাড়ে ঘরে বসে রেটিনার প্রকাশনা কিনুন এখনই! ডাইজেস্ট |
          প্রশ্নব্যংক | গাইড | অর্ডার করতে ক্লিক করুন
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
  const carouselImages = ["/hero_2.png"];

  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  return (
    <section className="px-0 md:px-[80px] lg:px-[120px]">
      <div className="w-full flex flex-col items-center relative">
        <PromotionalBanner />
        <div className="relative w-full h-full overflow-hidden px-4 py-[30px] lg:py-[40px] rounded-3xl lg:mt-0">
          <div className="flex flex-col lg:flex-row h-full w-full max-w-6xl mx-auto items-center justify-between gap-3 lg:gap-8">
            <div className="w-full flex flex-col gap-5">
              <div className="w-full">
                <h1 className="text-2xl text-center lg:text-left sm:text-6xl lg:text-[3rem] lg:leading-[1.2] sm:pt-0 font-bold mb-4 text-black">
                  <span>তোমার স্বপ্নগুলো সত্যি হোক</span>
                  <span className="ml-2 text-brand">আমাদের সাথে</span>
                </h1>
                <p className="text-sm text-center lg:text-left sm:text-xl lg:text-2xl text-black mb-2">
                  রেটاমেডিকেল এন্ড ডেন্টাল এ্যাডমিশন কোচিংয়ে আপনাকে স্বাগতম !
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2 text-sm lg:text-lg">
                <div className="flex items-center justify-center lg:justify-start gap-6 flex-wrap">
                  <div className="py-1 flex flex-row gap-2 items-center rounded-lg">
                    <CheckCircle2
                      width={20}
                      height={20}
                      className="text-brand"
                    />
                    <p className="text-[#595959] font-bold italic">
                      সফলতার বর্ণিল ৪৫ বছর
                    </p>
                  </div>
                  <div className="py-1 flex flex-row gap-2 items-center rounded-lg">
                    <CheckCircle2
                      width={20}
                      height={20}
                      className="text-brand"
                    />
                    <p className="text-[#595959] font-bold italic">
                      অনুপম আন্তরিকতা
                    </p>
                  </div>
                </div>
                <div className="py-1 w-full h-full justify-center lg:justify-start flex flex-row gap-2 items-center rounded-lg">
                  <CheckCircle2 width={20} height={20} className="text-brand" />
                  <p className="text-[#595959] font-bold italic">
                    দক্ষ ও অভিজ্ঞ মেন্টর প্যানেল
                  </p>
                </div>
                <div className="py-1 w-full h-full justify-center lg:justify-start flex flex-row gap-2 items-center rounded-lg">
                  <CheckCircle2 width={20} height={20} className="text-brand" />
                  <p className="text-[#595959] font-bold italic">
                    অভিজ্ঞতা ও আধুনিকতার চমৎকার সমন্বয়
                  </p>
                </div>
              </div>
              <div className="w-full flex flex-wrap items-center gap-2 text-sm lg:text-xl justify-center lg:justify-start">
                <div className="w-full lg:w-auto">
                  <Link href="/courses">
                    <div className="sm:px-5 px-4 rounded-lg py-2 font-semibold text-center text-brand-foreground bg-brand hover:bg-brand-emphasis transition-colors">
                      কোর্সগুলো দেখুন →
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            <div className="w-full">
              <Carousel
                plugins={[plugin.current]}
                className="w-full"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
                opts={{ loop: true }}
              >
                <CarouselContent>
                  {carouselImages.map((src, index) => (
                    <CarouselItem key={index}>
                      <div>
                        <Image
                          src={src}
                          alt="Podcast host recording"
                          width={600}
                          height={450}
                          className="rounded-2xl cursor-grab object-cover w-full h-full"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
