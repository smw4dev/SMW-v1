"use client";

import * as React from "react";
import Image from "next/image";

type Story = {
  id: number;
  image: string;
  name: string;
  excerpt: string;
  href?: string;
};

const stories: Story[] = [
  {
    id: 1,
    image: "https://retinabd.org/images/doctor/2nd.jpg",
    name: "Samiha Nazifa Ahasan,",
    excerpt:
      "I am currently pursuing the BSc (Hons) in Computing Systems program at Ulster University in the UK. Thanks to Mentors' Study Abroad for guidance...",
    href: "#",
  },
  {
    id: 2,
    image:
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d5ba9f8f-2bda-4373-89b4-3653bf841833-retinabd-org/assets/images/3rd-30.jpg",
    name: "Ayman Fayyaz,",
    excerpt:
      "My journey to study Bachelor of Information Technology (Cyber Security) at Macquarie University was made possible by Mentors' Study Abroad...",
    href: "#",
  },
  {
    id: 3,
    image: "https://retinabd.org/images/doctor/4th.jpg",
    name: "Tasnuva Bashar Tanni (PTE),",
    excerpt:
      "I chose the PTE program to migrate to Australia. I am happy to have scored an 86 overall in PTE. This achievement was only possible because o...",
    href: "#",
  },
  {
    id: 4,
    image:
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=800",
    name: "Rafid Tahsin Imam (IBA BBA),",
    excerpt:
      "I'm a student of IBA BBA 32nd batch, and I prepared for my admission at Mentors' Kalabagan branch. The instructors were highly supportive, a...",
    href: "#",
  },
];

const SuccessStories = () => {
  return (
    <section className="w-full h-full py-14 px-2 sm:px-4 md:px-0 flex flex-col items-center">
      <div className="max-w-6xl w-full mx-auto">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-black">
          শিক্ষার্থীদের <span className="text-brand">অভিমত</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
          {stories.map((s) => (
            <div
              key={s.id}
              className="flex flex-col bg-white text-card-foreground rounded-2xl shadow-xl p-4"
            >
              <div className="w-full overflow-hidden rounded-2xl shadow-md">
                <Image
                  src={s.image}
                  alt={s.name}
                  width={420}
                  height={300}
                  className="w-full h-56 object-cover"
                />
              </div>

              <div className="mt-4">
                <h3 className="text-brand font-semibold">{s.name}</h3>
                <p className="mt-2 text-[15px] leading-7 text-muted-foreground">
                  {s.excerpt}
                </p>

                <div className="mt-4">
                  <a
                    href={s.href || "#"}
                    className="inline-block bg-brand hover:bg-brand-emphasis text-brand-foreground font-medium px-4 py-2 rounded-md shadow-sm transition-colors"
                  >
                    Read more
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
