import Image from "next/image";
import Link from "next/link";

interface CourseFeature {
  text: string;
}

interface Course {
  id: number;
  imageUrl: string;
  title: string;
  features: CourseFeature[];
  detailsLink: string;
}

const courseData: Course[] = [
  {
    id: 1,
    imageUrl: "https://assets.example.com/directory/777262092678.png",
    title: "৬ষ্ঠ শ্রেণি ব্যাচ",
    features: [
      { text: "সাপ্তাহিক ৩টি ক্লাস" },
      { text: "প্রতিটি অধ্যায়ে ক্লাস টেস্ট" },
      { text: "মাসিক মূল্যায়ন পরীক্ষা" },
      { text: "PDF ক্লাসনোট প্রদান" },
      { text: "গাইডলাইন ও ফলোআপ সাপোর্ট" },
      { text: "Q&A সাপোর্ট ২৪/৭" },
    ],
    detailsLink: "/batches/class-6",
  },
  {
    id: 2,
    imageUrl: "https://assets.example.com/directory/230627062826.png",
    title: "৭ম শ্রেণি ব্যাচ",
    features: [
      { text: "সাপ্তাহিক ৩টি ক্লাস" },
      { text: "চ্যাপ্টার ফাইনাল পরীক্ষা" },
      { text: "মাসিক প্রগ্রেস রিপোর্ট" },
      { text: "PDF নোটস ও হোমওয়ার্ক" },
      { text: "অভিভাবক ফিডব্যাক সেশন" },
      { text: "Q&A সাপোর্ট ২৪/৭" },
    ],
    detailsLink: "/batches/class-7",
  },
  {
    id: 3,
    imageUrl: "https://assets.example.com/directory/478798258587.png",
    title: "৮ম শ্রেণি ব্যাচ",
    features: [
      { text: "সাপ্তাহিক ৩টি ক্লাস" },
      { text: "টপিকভিত্তিক কুইজ" },
      { text: "মক টেস্ট প্রতি মাসে" },
      { text: "ভিডিও রেকর্ডেড লেকচার" },
      { text: "প্র্যাকটিস শিট ও সমাধান" },
      { text: "Q&A সাপোর্ট ২৪/৭" },
    ],
    detailsLink: "/batches/class-8",
  },
  {
    id: 4,
    imageUrl:
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d5ba9f8f-2bda-4373-89b4-3653bf841833--org/assets/images/160843126220-12.png?",
    title: "৯ম শ্রেণি ব্যাচ",
    features: [
      { text: "সাপ্তাহিক ৪টি ক্লাস" },
      { text: "ক্লাস টেস্ট ও টিউটোরিয়াল" },
      { text: "মাসিক সাবজেক্ট ফাইনাল" },
      { text: "PDF নোটস ও স্লাইড" },
      { text: "প্রজেক্ট/অ্যাসাইনমেন্ট গাইডেন্স" },
      { text: "Q&A সাপোর্ট ২৪/৭" },
    ],
    detailsLink: "/batches/class-9",
  },
  {
    id: 5,
    imageUrl: "https://assets.example.com/directory/325899351696.jpeg",
    title: "১০ম শ্রেণি ব্যাচ",
    features: [
      { text: "সাপ্তাহিক ৪টি ক্লাস" },
      { text: "বোর্ড পরীক্ষার প্রস্তুতি" },
      { text: "পেপার/মডেল টেস্ট" },
      { text: "রিভিশন ও সাজেশন ক্লাস" },
      { text: "PDF নোটস ও প্র্যাকটিস সেট" },
      { text: "Q&A সাপোর্ট ২৪/৭" },
    ],
    detailsLink: "/batches/class-10",
  },
  {
    id: 6,
    imageUrl: "https://assets.example.com/directory/777262092678.png",
    title: "HSC (১১–১২) ব্যাচ",
    features: [
      { text: "টার্গেটেড সিলেবাস কভারেজ" },
      { text: "চ্যাপ্টার ফাইনাল + মডেল টেস্ট" },
      { text: "বোর্ড + এডমিশন ওরিয়েন্টেড গাইডেন্স" },
      { text: "রেকর্ডেড ক্লাস এক্সেস" },
      { text: "PDF নোটস ও প্রশ্নব্যাংক" },
      { text: "Q&A সাপোর্ট ২৪/৭" },
    ],
    detailsLink: "/batches/hsc",
  },
];

const CourseCard = ({ course }: { course: Course }) => (
  <div className="relative w-[92%] md:w-full max-w-md mx-auto h-full bg-white hover:bg-muted backdrop-blur-lg rounded-2xl shadow-2xl flex flex-col justify-between transition-colors duration-200">
    <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20 h-14 flex items-center justify-center">
      <div className="w-14 h-14 rounded-full bg-brand flex items-center justify-center">
        <Image
          alt="icon"
          width={24}
          height={24}
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d5ba9f8f-2bda-4373-89b4-3653bf841833--org/assets/images/next-148421-course-icon.png?"
        />
      </div>
    </div>
    <div className="flex flex-col h-full">
      <Link href={course.detailsLink} className="flex flex-col h-full">
        <div className="bg-gray-200 w-full aspect-video rounded-t-2xl overflow-hidden">
          <Image
            className="aspect-video w-full h-full object-cover"
            src={course.imageUrl}
            alt={course.title}
            width={400}
            height={225}
          />
        </div>
        <div className="px-2 mt-2 md:px-6">
          <p className="text-md md:text-xl font-semibold text-black">
            {course.title}
          </p>
        </div>
        <div className="flex flex-col flex-grow gap-2 py-3 px-6 mt-2">
          {course.features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-row gap-3 items-center text-sm md:text-base text-gray-700"
            >
              <div className="w-2 h-2 shrink-0 bg-brand rounded-full"></div>
              <div>{feature.text}</div>
            </div>
          ))}
        </div>
      </Link>
    </div>
    <div className="w-full flex flex-row flex-wrap gap-2 justify-between p-5 mt-auto">
      {/* <Link
        className="flex-grow px-2 py-2 text-base md:text-lg font-semibold text-center text-black rounded-md border border-brand/50 hover:bg-brand hover:border-brand hover:text-brand-foreground bg-secondary transition-colors duration-300"
        href={course.detailsLink}
      >
        ব্যাচ দেখুন
      </Link> */}
      <div className="flex-grow text-center px-2 py-2 text-base md:text-lg font-semibold text-brand-foreground rounded-md hover:bg-brand-emphasis bg-brand cursor-pointer border border-brand transition-colors duration-300">
        এনরোল করুন
      </div>
    </div>
  </div>
);

const CourseGrid = () => {
  const filters = [
    "সকল ব্যাচ",
    "শ্রেণি ৬",
    "শ্রেণি ৭",
    "শ্রেণি ৮",
    "শ্রেণি ৯",
    "শ্রেণি ১০",
  ];
  return (
    <section className="w-full flex flex-col px-2 sm:px-0 py-8 md:py-16 items-center">
      <div className="max-w-6xl mx-auto w-full flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black">
          আমাদের <span className="text-brand"> ব্যাচ সমূহ</span>
        </h2>

        <div className="w-full h-full py-4 md:py-4 grid mt-16 gap-16 md:gap-12 lg:gap-y-16 lg:gap-x-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {courseData.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
        {/* <div className="mt-12">
          <Link href="/batches">
            <div className="sm:px-5 px-4 rounded-lg py-2 font-semibold  text-center text-brand-foreground bg-brand hover:bg-brand-emphasis transition-colors">
              সকল ব্যাচ দেখুন →
            </div>
          </Link>
        </div> */}
      </div>
    </section>
  );
};

export default CourseGrid;
