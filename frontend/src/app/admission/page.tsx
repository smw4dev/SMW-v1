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
        <section id="admission" className="pb-16 md:pb-24 bg-muted/30">
          <div className="w-full bg-brand">
            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
              <h2 className="text-center text-2xl font-semibold text-brand-foreground sm:text-3xl">
                ভর্তি ফরম
              </h2>
            </div>
          </div>
          <AdmissionForm />
          {/* <div className="container mx-auto px-4">

          </div> */}
        </section>
      </main>
      <Footer />
    </div>
  );
}
