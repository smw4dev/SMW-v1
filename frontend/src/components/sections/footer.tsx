import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-brand text-brand-foreground">
      <div className="max-w-6xl mx-auto py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          <div className="col-span-2">
            <Link href="/" className="flex-shrink-0">
              <Image
                height={64}
                width={160}
                src="/logo.png?"
                alt="Test Logo"
                className="h-42 w-auto"
              />
            </Link>
          </div>

          <div className="col-span-1">
            <h3 className="text-brand-foreground text-lg font-semibold">
              কোম্পানি
            </h3>
            <ul className="mt-4 space-y-2 text-base">
              <li>
                <Link
                  href="/branches"
                  className="text-brand-foreground hover:underline"
                >
                  শাখা গ্যালারী
                </Link>
              </li>
              <li>
                <Link
                  href="/Test-ending-program"
                  className="text-brand-foreground hover:underline"
                >
                  শিক্ষক হিসেবে যোগ দিন
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-brand-foreground hover:underline"
                >
                  প্রাইভেসি পলিসি
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-brand-foreground hover:underline"
                >
                  টার্মস অফ ইউস
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-brand-foreground text-lg font-semibold">
              অন্যান্য
            </h3>
            <ul className="mt-4 space-y-2 text-base">
              <li>
                <a
                  href="https://shop.example.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-foreground hover:underline"
                >
                  বুক স্টোর
                </a>
              </li>
              <li>
                <a
                  href="https://result.example.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-foreground hover:underline"
                >
                  লাইভ রেজাল্ট
                </a>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-brand-foreground hover:underline"
                >
                  Result দেখুন
                </Link>
              </li>
              <li>
                <Link
                  href="/admit-card"
                  className="text-brand-foreground hover:underline"
                >
                  Admit Card ডাউনলোড
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-2">
            <h3 className="text-brand-foreground text-lg font-semibold">
              আমাদের যোগাযোগের মাধ্যম
            </h3>
            <p className="mt-4 text-brand-foreground text-base">
              কল করুন: 09677999666
            </p>
            <div className="mt-4 flex space-x-4">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-foreground hover:opacity-80"
              >
                <Facebook className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="https://www.instagram.com/.official"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-foreground hover:opacity-80"
              >
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="https://www.threads.net/@.official"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-foreground hover:opacity-80"
              >
                <Twitter className="h-6 w-6" />
                <span className="sr-only">Threads</span>
              </a>
              <a
                href="https://www.youtube.com/@"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-foreground hover:opacity-80"
              >
                <Youtube className="h-6 w-6" />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-brand-foreground/20 text-center">
          <p className="text-base text-brand-foreground">কপিরাইট © ১৯৮০-২০২৫</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
