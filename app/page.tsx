import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import ShowcaseSection from "./components/ShowcaseSection";
import TestimonialsSection from "./components/TestimonialsSection";
import PricingSection from "./components/PricingSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="relative flex flex-col w-full">
      <HeroSection />
      <AboutSection />
      <div className="relative z-20">
        <ShowcaseSection />
      </div>
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </div>
  );
}
