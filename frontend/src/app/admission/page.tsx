import AdmissionFormSection from "@/components/sections/admission-form";
import Footer from "@/components/sections/footer";
import Navigation from "@/components/sections/navigation";

export default function AdmissionPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main>
        <AdmissionFormSection />
      </main>
      <Footer />
    </div>
  );
}
