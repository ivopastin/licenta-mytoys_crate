import Image from "next/image";
import Link from "next/link";

export default function AppHomePage() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-white flex flex-col items-center justify-center">
      {/* smooth-flow texture */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/textures/app/smooth-flow.jpg"
          alt=""
          fill
          className="object-cover opacity-[0.06]"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-5 text-center max-w-[480px] px-8">
        <div className="w-16 h-16 rounded-[16px] bg-[#417c9c]/10 flex items-center justify-center">
          <Image
            src="/images/logos/logo-black.png"
            alt=""
            width={36}
            height={36}
            className="object-contain opacity-60"
          />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-[32px] font-bold text-[#1a1a1a] leading-tight">
            Welcome back!
          </h1>
          <p className="text-[16px] text-[#716458] font-medium leading-relaxed">
            Ready to bring a new plushie to life? Head to the Studio whenever
            you&apos;re ready.
          </p>
        </div>
        <Link
          href="/app/studio"
          className="px-7 py-3 rounded-[14px] bg-[#591427] text-[#fff1b5] text-[15px] font-bold transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:bg-[#7a1c35] hover:scale-105 active:scale-95"
        >
          Go to Studio
        </Link>
      </div>
    </div>
  );
}
