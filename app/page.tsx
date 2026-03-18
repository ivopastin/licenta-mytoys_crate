import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import ShowcaseSection from "./components/ShowcaseSection";
import TestimonialsSection from "./components/TestimonialsSection";

export default function Home() {
  return (
    <div className="relative flex flex-col w-full">
      <HeroSection />
      <AboutSection />
      <div className="relative z-20 -mt-[100vh]">
        <ShowcaseSection />
      </div>
      <TestimonialsSection />
    </div>
  );
}
