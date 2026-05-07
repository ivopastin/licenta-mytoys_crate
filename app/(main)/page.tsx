import HeroSection from "@/app/components/HeroSection";
import AboutSection from "@/app/components/AboutSection";
import ShowcaseSection from "@/app/components/ShowcaseSection";
import TestimonialsSection from "@/app/components/TestimonialsSection";
import PricingSection from "@/app/components/PricingSection";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <div className="relative flex flex-col w-full">
      <HeroSection />
      <AboutSection />
      <div id="showcase" className="relative z-20">
        <ShowcaseSection />
      </div>
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </div>
  );
}
