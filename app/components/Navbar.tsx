import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full flex flex-row items-center justify-between px-[120px] py-[50px]">
      <Image
        src="/images/logos/logo-font-principal.png"
        alt="logo"
        width={64}
        height={64}
      />
      <div className="glass-navbar min-w-[200px] h-[64px] rounded-full flex flex-row px-[36px] gap-[40px] py-[6px] items-center">
        {["About", "Showcase", "Testimonials", "Pricing", "Contact Us"].map(
          (label) => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-[18px] text-white font-semibold hover:text-white/80 transition-colors"
            >
              {label}
            </a>
          ),
        )}
      </div>
      <Button className="px-6 py-2.5 h-auto bg-[#fff1b5]/90 text-[#716458] text-[18px] font-bold rounded-[16px] hover:bg-[#fff1b5]">
        Try now
      </Button>
    </div>
  );
}
