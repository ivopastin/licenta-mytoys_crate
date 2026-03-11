import Image from "next/image";

export default function Navbar() {
  return (
    <div className="sticky top-[50px] z-50 w-full flex flex-row items-center justify-between">
      <Image
        src="/images/logos/logo-font-principal.png"
        alt="logo"
        width={64}
        height={64}
      />
      <div className="glass-navbar min-w-[200px] h-[64px] rounded-full flex flex-row px-[36px] gap-[40px] py-[6px] items-center">
        <p className="text-[18px] text-white">About</p>
        <p className="text-[18px] text-white">Showcase</p>
        <p className="text-[18px] text-white">Testimonials</p>
        <p className="text-[18px] text-white">Pricing</p>
        <p className="text-[18px] text-white">Contact Us</p>
      </div>
      <div className="flex flex-row items-center justify-center px-[24px] py-[10px] bg-[#fff1b5]/90 rounded-[16px]">
        <p className="text-[18px] text-[#716458] font-bold">Try now</p>
      </div>
    </div>
  );
}
