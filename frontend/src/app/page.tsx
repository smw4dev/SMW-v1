import Navigation from "@/components/sections/navigation";
import HeroSection from "@/components/sections/hero";
import CourseGrid from "@/components/sections/course-grid";
import ServicesIntro from "@/components/sections/services-intro";
import SuccessStories from "@/components/sections/success-stories";
import StatisticsSection from "@/components/sections/statistics";
import GallerySection from "@/components/sections/gallery";
import QuickAdmissionForm from "@/components/sections/quick-admission-form";
import FindUsHere from "@/components/sections/find-us";
import ContactCta from "@/components/sections/contact-cta";
import Footer from "@/components/sections/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main>
        <HeroSection />
        <CourseGrid />
        <ServicesIntro />
        <SuccessStories />
        {/* <StatisticsSection /> */}
        <GallerySection />
        <QuickAdmissionForm />
        <FindUsHere />
        {/* <ContactCta /> */}
      </main>
      <Footer />
    </div>
  );
}
