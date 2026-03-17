import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import ShowcaseSection from "./components/ShowcaseSection";
import ScrollBlocker from "./components/ScrollBlocker";
import TestimonialsSection from "./components/TestimonialsSection";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <ScrollBlocker />
      <HeroSection />
      <div className="sticky top-0">
        <AboutSection />
      </div>
      <ShowcaseSection />
      <TestimonialsSection />
    </div>
  );
}
