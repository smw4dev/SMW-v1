import type { ElementType } from "react";
import {
  Award,
  BookOpen,
  ClipboardCheck,
  ClipboardList,
  Files,
  ListChecks,
  MessageCircle,
  MonitorPlay,
  School,
  Server,
  Smartphone,
  Users,
} from "lucide-react";

type Feature = { Icon: ElementType; text: string };

const features: Feature[] = [
  {
    Icon: School,
    text: "মাস্টার ক্লাস (অফলাইন)",
  },
  {
    Icon: MonitorPlay,
    text: "মাস্টার ক্লাস (অনলাইন)",
  },
  {
    Icon: ClipboardCheck,
    text: "মেডিকেল ভর্তি পরীক্ষার স্ট্যান্ডার্ড প্রশ্নে পরীক্ষা (১ম পর্যায়)",
  },
  {
    Icon: ClipboardList,
    text: "মেডিকেল ভর্তি পরীক্ষার স্ট্যান্ডার্ড প্রশ্নে পরীক্ষা (২য় পর্যায়)",
  },
  {
    Icon: ListChecks,
    text: "স্পেশাল পরীক্ষাসমূহ",
  },
  {
    Icon: BookOpen,
    text: "মানসম্মত প্রকাশনা (১৮টি)",
  },
  {
    Icon: Users,
    text: "Medical Mentor Support",
  },
  {
    Icon: Files,
    text: "Extra Information Sheet",
  },
  {
    Icon: MessageCircle,
    text: "Q&A",
  },
  {
    Icon: Award,
    text: "কেন্দ্রীয় মেধাতালিকা",
  },
  {
    Icon: Server,
    text: "LMS Service",
  },
  {
    Icon: Smartphone,
    text: "Test App",
  },
];

const ServicesIntro = () => {
  return (
    <section id="service" className="bg-white scroll-mt-32">
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
                <feature.Icon className="w-10 h-10 text-brand" />
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
