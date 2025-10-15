"use client";

import { useState, FormEvent, useRef, useEffect } from "react";
import { Phone, Sparkles, User, School, Mail, ArrowRight } from "lucide-react";

const batches = [
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
];

const QuickAdmissionForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    // Reset the form fields after submission for a clean state
    form.reset();
    setIsSubmitted(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Hide the message after a short while to keep the UI tidy
    timeoutRef.current = setTimeout(() => {
      setIsSubmitted(false);
      timeoutRef.current = null;
    }, 4000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <section className="px-4 py-16 lg:px-0">
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] bg-brand/5 p-5 sm:p-8 md:p-10">
          {/* Content grid: keep the admission form on the right */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-center">
            {/* Left: Title and contact info */}
            <div className="order-2 md:order-1">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1 text-sm font-medium text-brand shadow-sm">
                <Sparkles className="h-4 w-4" /> এখনই সিট নিশ্চিত কর, সময় শেষ
                হবার আগে!
              </span>
              <h2 className="mt-5 text-2xl sm:text-3xl lg:text-4xl font-extrabold">
                <span className="text-brand">অ্যাডমিশন ফর্ম</span> পূরণ কর
              </h2>
              <p className="mt-3 text-gray-600">
                ক্লাস সম্পর্কে আরও জানতে যোগাযোগ করো।
              </p>

              <div className="mt-8 flex flex-col gap-4 max-w-md">
                <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-lg border border-gray-100">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm text-gray-500">ইমেইল</p>
                    <p className="font-semibold text-gray-900">
                      support@example.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-lg border border-gray-100">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm text-gray-500">ফোন</p>
                    <p className="font-semibold text-gray-900">09610123456</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Admission form card */}
            <div className="order-1 md:order-2">
              <div className="relative mx-auto w-full max-w-xl rounded-2xl bg-white p-5 sm:p-6 md:p-8 shadow-2xl border border-gray-200">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  অ্যাডমিশন ফর্ম
                </h3>
                <form
                  className="mt-6 grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2"
                  onSubmit={handleSubmit}
                >
                  {/* Student name */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="studentName"
                      className="text-sm font-medium text-gray-700"
                    >
                      তোমার নাম <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                        <User className="h-5 w-5" />
                      </span>
                      <input
                        id="studentName"
                        name="studentName"
                        type="text"
                        required
                        placeholder="তোমার নাম"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm font-medium text-gray-900 shadow-sm focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30"
                      />
                    </div>
                  </div>

                  {/* Guardian name */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="guardianName"
                      className="text-sm font-medium text-gray-700"
                    >
                      তোমার অভিভাবকের নাম{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                        <User className="h-5 w-5" />
                      </span>
                      <input
                        id="guardianName"
                        name="guardianName"
                        type="text"
                        required
                        placeholder="অভিভাবকের নাম"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm font-medium text-gray-900 shadow-sm focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30"
                      />
                    </div>
                  </div>

                  {/* Student phone */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="studentPhone"
                      className="text-sm font-medium text-gray-700"
                    >
                      শিক্ষার্থীর মোবাইল নাম্বার{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                        <Phone className="h-5 w-5" />
                      </span>
                      <input
                        id="studentPhone"
                        name="studentPhone"
                        type="tel"
                        inputMode="tel"
                        required
                        placeholder="01XXXXXXXXX"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm font-medium text-gray-900 shadow-sm focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30"
                      />
                    </div>
                  </div>

                  {/* Guardian phone */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="guardianPhone"
                      className="text-sm font-medium text-gray-700"
                    >
                      অভিভাবকের মোবাইল নাম্বার{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                        <Phone className="h-5 w-5" />
                      </span>
                      <input
                        id="guardianPhone"
                        name="guardianPhone"
                        type="tel"
                        inputMode="tel"
                        required
                        placeholder="01XXXXXXXXX"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm font-medium text-gray-900 shadow-sm focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30"
                      />
                    </div>
                  </div>

                  {/* School name */}
                  <div className="sm:col-span-2 flex flex-col gap-2">
                    <label
                      htmlFor="schoolName"
                      className="text-sm font-medium text-gray-700"
                    >
                      বিদ্যালয়ের নাম <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                        <School className="h-5 w-5" />
                      </span>
                      <input
                        id="schoolName"
                        name="schoolName"
                        type="text"
                        required
                        placeholder="বিদ্যালয়ের নাম"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm font-medium text-gray-900 shadow-sm focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30"
                      />
                    </div>
                  </div>

                  {/* Batch */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="batch"
                      className="text-sm font-medium text-gray-700"
                    >
                      তোমার ক্লাস
                    </label>
                    <select
                      id="batch"
                      name="batch"
                      required
                      defaultValue=""
                      className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 shadow-sm focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30"
                    >
                      <option value="" disabled>
                        ক্লাস নির্বাচন করো
                      </option>
                      {batches.map((batch) => (
                        <option key={batch} value={batch}>
                          {batch}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Previous student */}
                  <div className="flex items-center gap-2 pt-2 sm:col-span-2">
                    <input
                      id="previousStudent"
                      name="previousStudent"
                      type="checkbox"
                      className="h-5 w-5 rounded border border-gray-300 text-brand focus:ring-brand"
                    />
                    <label
                      htmlFor="previousStudent"
                      className="text-sm text-gray-700"
                    >
                      আমি SuNnY&apos;s MaTh WORLD এর পূর্ববর্তী শিক্ষার্থী
                    </label>
                  </div>

                  {/* Submit */}
                  <div className="sm:col-span-2 flex flex-col gap-3 pt-2">
                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-base font-semibold text-brand-foreground shadow-lg transition-transform duration-200 hover:-translate-y-0.5 hover:bg-brand-emphasis focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
                    >
                      জমা দাও
                      <ArrowRight className="h-5 w-5" />
                    </button>
                    {isSubmitted && (
                      <p className="text-sm font-medium text-success">
                        ধন্যবাদ! খুব শীঘ্রই আমাদের টিম আপনার সাথে যোগাযোগ করবে।
                      </p>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickAdmissionForm;
