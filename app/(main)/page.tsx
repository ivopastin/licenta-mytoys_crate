import HeroSection from "@/components/marketing/HeroSection";
import AboutSection from "@/components/marketing/AboutSection";
import ShowcaseSection from "@/components/marketing/ShowcaseSection";
import TestimonialsSection from "@/components/marketing/TestimonialsSection";
import PricingSection from "@/components/marketing/PricingSection";
import Footer from "@/components/marketing/Footer";

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
