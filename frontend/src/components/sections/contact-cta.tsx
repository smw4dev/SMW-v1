import { Facebook, Youtube, Phone } from "lucide-react";

const ContactCta = () => {
  return (
    <section className="px-4 py-10 md:py-14">
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-[32px] bg-[#1E1E1E] text-white shadow-2xl px-6 py-10 md:px-12 md:py-14">
          {/* subtle decorative pattern on the left */}
          <svg
            className="pointer-events-none absolute left-0 top-0 h-full w-1/2 opacity-20 text-gray-500"
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g stroke="currentColor" strokeWidth="2" opacity="0.35">
              <circle cx="40" cy="60" r="10" />
              <circle cx="80" cy="100" r="10" />
              <circle cx="120" cy="60" r="10" />
              <path d="M40 60 L80 100 L120 60 L160 100 L200 60" />
              <circle cx="160" cy="100" r="10" />
              <circle cx="200" cy="60" r="10" />
              <circle cx="60" cy="180" r="12" />
              <circle cx="120" cy="220" r="12" />
              <path d="M60 180 L120 220 L180 180 L240 220" />
              <circle cx="180" cy="180" r="12" />
              <circle cx="240" cy="220" r="12" />
            </g>
          </svg>

          <div className="relative z-10 flex flex-col items-center text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">
              <span>যেকোনো প্রয়োজনে</span>
              <span className="text-[#ff4d4f]"> কল করো এখনই!</span>
            </h2>
            <p className="mt-4 text-gray-300">
              চলমান কোর্স বা ব্যাচ সম্পর্কে যেকোনো জিজ্ঞাসায় আমাদেরকে কল করো..
            </p>
            <p className="text-gray-300">সকাল ৯টা থেকে রাত ৯টা পর্যন্ত!</p>

            <p className="mt-2 text-[#ff6b6b] font-semibold">
              সকাল ৯ টা – রাত ৯ টা
            </p>

            <div className="mt-6">
              <a
                href="tel:09677999666"
                className="inline-flex items-center gap-3 rounded-lg bg-[#E44747] px-5 py-3 text-white font-semibold shadow-lg hover:bg-[#cf3b3b] transition-colors"
              >
                <Phone className="h-5 w-5" /> 09677999666
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#e9f2ff] px-4 py-2 text-black font-medium hover:bg-[#dbe8ff] transition-colors"
              >
                <Facebook className="h-5 w-5" /> ফেসবুক পেজ
              </a>
              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#fde7ee] px-4 py-2 text-black font-medium hover:bg-[#f9d6e3] transition-colors"
              >
                <Youtube className="h-5 w-5" /> ইউটিউব চ্যানেল
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCta;
