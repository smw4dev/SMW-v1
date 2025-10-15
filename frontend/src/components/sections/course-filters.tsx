"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const filterButtons = [
  "সকল কোর্স",
  "মেডিকেল এডমিশন",
  "একাডেমিক",
  "ভার্সিটি এডমিশন",
  "অনলাইন",
  "অফলাইন",
];

const CourseFilters = () => {
  const buttonClasses =
    "text-center cursor-pointer hover:bg-brand hover:text-brand-foreground px-4 py-2 text-xs sm:text-sm text-black bg-white rounded-lg border border-brand transition-colors";

  return (
    <section className="w-full flex-col sm:px-0 px-2 py-2 items-center mt-4 max-w-6xl mx-auto flex">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black text-center">
        আমাদের <span className="text-brand">জনপ্রিয় কোর্স সমূহ</span>
      </h2>
      <div className="w-full flex justify-center flex-row flex-wrap gap-3 mt-4">
        {filterButtons.map((label) => (
          <button key={label} className={buttonClasses}>
            {label}
          </button>
        ))}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={`${buttonClasses} flex items-center justify-center gap-1`}
            >
              সকল সেশন
              <ChevronDown className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>সকল সেশন</DropdownMenuItem>
            <DropdownMenuItem>2025-26</DropdownMenuItem>
            <DropdownMenuItem>2024-25</DropdownMenuItem>
            <DropdownMenuItem>2023-24</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </section>
  );
};

export default CourseFilters;
