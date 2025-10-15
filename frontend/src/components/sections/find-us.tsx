import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";

const FindUsHere = () => {
  return (
    <section className="px-4 lg:px-0">
      <div className="relative w-full  mx-auto overflow-hidden rounded-2xl shadow-xl">
        <div className="relative h-[420px] sm:h-[520px] lg:h-[560px]">
          {/* Background map */}
          <Image
            src="/map.png"
            alt="Map showing our location"
            fill
            priority={false}
            className="object-cover"
          />

          {/* Soft left gradient to improve readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/60 to-transparent" />

          {/* Foreground content */}
          <div className="relative z-10 h-full w-full flex items-start">
            <div className="w-full max-w-6xl mx-auto p-5 sm:p-8 md:p-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">
                আমাদের <span className="text-brand">লোকেশন</span>
              </h2>

              {/* Address cards */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-1 gap-6 max-w-xl">
                {/* Address 1 */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-6 h-6 text-brand flex-shrink-0 mt-1" />
                    <p className="text-gray-800 text-base md:text-lg">
                      Allama Iqbal road, Narayanganj, Bangladesh
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-3 text-gray-900">
                    <Phone className="w-5 h-5 text-brand" />
                    <span className="font-semibold">09610000000</span>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-gray-900">
                    <Mail className="w-5 h-5 text-brand" />
                    <span className="font-semibold">info@example.com</span>
                  </div>
                </div>

                {/* Address 2 */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-6 h-6 text-brand flex-shrink-0 mt-1" />
                    <p className="text-gray-800 text-base md:text-lg">
                      Road 27, Dhanmondi, Dhaka, Bangladesh
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-3 text-gray-900">
                    <Phone className="w-5 h-5 text-brand" />
                    <span className="font-semibold">09610000001</span>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-gray-900">
                    <Mail className="w-5 h-5 text-brand" />
                    <span className="font-semibold">dhanmondi@example.com</span>
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

export default FindUsHere;
