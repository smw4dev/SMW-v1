import Image from "next/image";
import type { ElementType } from "react";
import { Book, ClipboardCheck, Files } from "lucide-react";

type Feature =
  | { type: "image"; src: string; text: string }
  | { type: "icon"; Icon: ElementType; text: string };

const features: Feature[] = [
  {
    type: "image",
    src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d5ba9f8f-2bda-4373-89b4-3653bf841833--org/assets/icons/offline-class-1.png?",
    text: "মাস্টার ক্লাস (অফলাইন)",
  },
  {
    type: "image",
    src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d5ba9f8f-2bda-4373-89b4-3653bf841833--org/assets/icons/online-class-2.png?",
    text: "মাস্টার ক্লাস (অনলাইন)",
  },
  {
    type: "image",
    src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d5ba9f8f-2bda-4373-89b4-3653bf841833--org/assets/icons/exam1-3.png?",
    text: "মেডিকেল ভর্তি পরীক্ষার স্ট্যান্ডার্ড প্রশ্নে পরীক্ষা (১ম পর্যায়)",
  },
  {
    type: "icon",
    Icon: ClipboardCheck,
    text: "মেডিকেল ভর্তি পরীক্ষার স্ট্যান্ডার্ড প্রশ্নে পরীক্ষা (২য় পর্যায়)",
  },
  {
    type: "image",
    src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d5ba9f8f-2bda-4373-89b4-3653bf841833--org/assets/icons/exam1-3.png?",
    text: "স্পেশাল পরীক্ষাসমূহ",
  },
  {
    type: "icon",
    Icon: Book,
    text: "মানসম্মত প্রকাশনা (১৮টি)",
  },
  {
    type: "image",
    src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d5ba9f8f-2bda-4373-89b4-3653bf841833--org/assets/icons/mentoring-7.png?",
    text: "Medical Mentor Support",
  },
  {
    type: "icon",
    Icon: Files,
    text: "Extra Information Sheet",
  },
  {
    type: "image",
    src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d5ba9f8f-2bda-4373-89b4-3653bf841833--org/assets/icons/customer-service1-9.png?",
    text: "Q&A",
  },
  {
    type: "image",
    src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d5ba9f8f-2bda-4373-89b4-3653bf841833--org/assets/icons/scoring-10.png?",
    text: "কেন্দ্রীয় মেধাতালিকা",
  },
  {
    type: "image",
    src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d5ba9f8f-2bda-4373-89b4-3653bf841833--org/assets/icons/help-11.png?",
    text: "LMS Service",
  },
  {
    type: "image",
    src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d5ba9f8f-2bda-4373-89b4-3653bf841833--org/assets/icons/smartphone-12.png?",
    text: "Test App",
  },
];

const ServicesIntro = () => {
  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center pt-8 pb-12 gap-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl text-black font-bold text-center">
          আমাদের <span className="text-brand">সেবা সমূহ</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full">
          {features.map((feature, index) => (
            <div
              key={index}
              className="w-full flex-col flex items-center justify-start px-4 py-12 rounded-xl border border-solid border-brand hover:shadow-2xl hover:scale-105 transition-all text-center"
            >
              <div className="w-[55px] h-[55px] flex items-center justify-center">
                {feature.type === "image" ? (
                  <Image
                    src={feature.src}
                    alt={feature.text}
                    width={55}
                    height={55}
                    className="object-contain"
                  />
                ) : (
                  <feature.Icon className="w-10 h-10 text-brand" />
                )}
              </div>
              <div className="text-xl font-medium text-black mt-2 flex items-center justify-center min-h-[56px]">
                {feature.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesIntro;
