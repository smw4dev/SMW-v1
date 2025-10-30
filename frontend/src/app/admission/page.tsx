import AdmissionForm from "@/components/AdmissionForm";
import AdmissionFormSection from "@/components/sections/admission-form";
import Footer from "@/components/sections/footer";
import Navigation from "@/components/sections/navigation";
import { Clock } from "lucide-react";

export default function AdmissionPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main>
        {/* <AdmissionFormSection /> */}

        {/* Admission Form Section */}
        <section id="admission" className="py-16 md:py-24 bg-muted/30">
            <AdmissionForm />
          {/* <div className="container mx-auto px-4">

          </div> */}
        </section>
      </main>
      <Footer />
    </div>
  );
}
