"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme/ThemeProvider";

interface NavLink {
  href: string;
  label: string;
  external?: boolean;
}

const navLinks: NavLink[] = [
  { href: "/", label: "হোম" },
  { href: "/#batch", label: "ব্যাচ" },
  { href: "/#service", label: "সেবা সমূহ" },
  { href: "/#gallery", label: "গ্যালারি" },
  { href: "/#admission", label: "অ্যাডমিশন" },
];

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const renderNavLink = (link: NavLink, isMobile: boolean) => {
    const isActive = pathname === link.href;
    const commonClasses = isMobile
      ? `font-semibold w-full block px-2 py-4`
      : `text-md md:text-lg font-semibold hover:text-brand-emphasis transition-colors`;
    const activeClass = "text-brand";
    const inactiveClass = "text-black";

    const className = `${commonClasses} ${
      isActive ? activeClass : inactiveClass
    }`;

    const props = {
      href: link.href,
      className,
      ...(isMobile && { onClick: () => setIsMenuOpen(false) }),
      ...(link.external && { target: "_blank", rel: "noopener noreferrer" }),
    };

    return link.external ? (
      <a {...props}>{link.label}</a>
    ) : (
      <Link {...props} href={props.href}>
        {link.label}
      </Link>
    );
  };

  return (
    <header
      className={`sticky top-0 z-[500] w-full transition-colors duration-300 md:px-[80px] ${
        isScrolled ? "bg-white shadow-sm" : "bg-white"
      }`}
    >
      <div className="mx-auto max-w-6xl">
        {/* Desktop Navigation */}
        <div className="hidden items-center justify-between py-2 lg:flex">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Brand logo"
              width={140}
              height={48}
              className="h-12 w-auto object-contain"
              priority
            />
            <div className="text-sm font-bold text-center leading-tight">
              <div>SuNnY&apos;s</div>
              <div className="text-brand text-xl">MaTh WORLD</div>
            </div>
          </Link>
          <nav className="flex flex-row items-center justify-center gap-10">
            {navLinks.map((link) => (
              <div key={link.label}>{renderNavLink(link, false)}</div>
            ))}
          </nav>
          <div className="flex items-center gap-10">
            <div className="flex gap-2">
              <Link
                href="/auth/signin"
                className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-lg bg-brand px-4 py-2 text-center text-sm font-medium text-brand-foreground shadow transition-colors hover:bg-brand-emphasis disabled:pointer-events-none disabled:opacity-50 md:text-lg"
              >
                লগইন
              </Link>
              <button className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-lg border-2 border-solid border-brand bg-white px-3 py-2 text-sm font-medium text-brand shadow transition-colors hover:bg-brand hover:text-brand-foreground disabled:pointer-events-none disabled:opacity-50">
                Admission
              </button>
            </div>
            <ThemeSwitcher />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center justify-between px-4 py-4 lg:hidden">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="logo"
              width={120}
              height={60}
              className="h-10 w-auto object-contain"
            />
          </Link>
          <div className="flex items-center gap-2">
            <button className="rounded-lg border-2 border-solid border-brand bg-white px-3 py-2 text-sm font-medium text-brand transition-colors hover:bg-brand hover:text-brand-foreground">
              Retina LMS
            </button>
            <button
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg p-2 text-sm text-gray-500"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed top-0 right-0 h-screen w-screen bg-white p-4 transition-transform duration-700 lg:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ zIndex: 1000 }}
      >
        <button
          className="absolute top-0 right-0 p-4 text-black hover:text-gray-700 focus:outline-none"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close menu"
        >
          <X className="h-7 w-7" />
        </button>
        <Link href="/" onClick={() => setIsMenuOpen(false)}>
          <Image
            src="/logo.png"
            alt="logo"
            width={100}
            height={50}
            className="h-10 w-auto object-contain"
          />
        </Link>
        <nav className="flex w-full flex-col items-start divide-y-2 pt-2 text-base font-[600]">
          {navLinks.map((link) => (
            <div key={link.label} className="w-full">
              {renderNavLink(link, true)}
            </div>
          ))}
          <a
            href="tel:09677999666"
            className="my-2 flex h-[44px] w-full items-center justify-center gap-2 rounded-lg border-2 border-solid bg-success text-success-foreground px-4 py-4 text-center text-[18px] font-light"
          >
            <Phone className="h-5 w-5" /> ০৯৬৭৭৯৯৯৬৬৬
          </a>
          <Link
            href="/auth/signin"
            onClick={() => setIsMenuOpen(false)}
            className="flex h-[44px] w-full items-center justify-center rounded-lg border-2 border-solid bg-brand px-4 py-4 text-center text-[16px] text-brand-foreground"
          >
            লগইন
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navigation;
