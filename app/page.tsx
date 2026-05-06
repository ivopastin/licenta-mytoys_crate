import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import ShowcaseSection from "./components/ShowcaseSection";
import TestimonialsSection from "./components/TestimonialsSection";
import ScrollDebug from "./components/ScrollDebug";

export default function Home() {
  return (
    <div className="relative flex flex-col w-full">
      <ScrollDebug />
      <HeroSection />
      <AboutSection />
      <div className="relative z-20">
        <ShowcaseSection />
      </div>
      <TestimonialsSection />
    </div>
  );
}
