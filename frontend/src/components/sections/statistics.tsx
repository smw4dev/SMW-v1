import React from "react";

const statisticsData = [
  { value: "০+", label: "চান্সপ্রাপ্ত শিক্ষার্থী" },
  { value: "০", label: "প্রথম ২০ এ" },
  { value: "০", label: "DMC তে চান্সপ্রাপ্ত" },
  { value: "০+", label: "বছরের অভিজ্ঞতা" },
];

const StatisticsSection = () => {
  return (
    <section className="px-5 py-20 lg:py-28 bg-brand w-full flex flex-col justify-center items-center">
      <div className="flex flex-col lg:flex-row justify-center items-center gap-10 lg:gap-14 max-w-screen-xl mx-auto">
        <div className="flex flex-col gap-3 max-w-xl">
          <h2 className="text-3xl text-center lg:text-left lg:text-[2.5rem] lg:leading-[1.2] font-bold text-white">
            সফলতার গল্প
          </h2>
          <p className="text-lg text-justify text-[#dedede]">
            রেটিনা, মেডিকেল কলেজে ভর্তিচ্ছু শিক্ষার্থীদের জীবনের সবচাইতে নাজুক
            কিন্তু গুরুত্বপূর্ণ সময়ে স্বার্থহীন দিকনির্দেশনার দায়িত্ব কাঁধে
            তুলে নিয়েছে স্বেচ্ছায়। ১৯৮০ সালে প্রতিষ্ঠার পর থেকে আজ পর্যন্ত
            রেটিনা ছুঁয়েছে অজস্র প্রাণ, অসংখ্য হাসিমুখ। সাদা অ্যাপ্রনকে সঙ্গী
            করবার এই যাত্রায় তোমাকেও স্বাগত জানাচ্ছি, বন্ধু।
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-xl text-center font-bold text-white">
            ২০২৪-২৫ শিক্ষাবর্ষে
            <br />
            রেটিনা কোচিং এর সাফল্য
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-4 lg:gap-x-4 mt-4">
            {statisticsData.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col justify-center items-center border-[2px] border-white/40 p-3 lg:p-4 rounded-xl text-center"
              >
                <h2 className="text-[2rem] lg:text-[4rem] lg:leading-[1.2] font-bold text-white">
                  {stat.value}
                </h2>
                <h3 className="text-sm lg:text-[1.1rem] lg:leading-[1.2] font-semibold text-white">
                  {stat.label}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
