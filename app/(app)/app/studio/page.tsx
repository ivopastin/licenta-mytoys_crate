import Image from "next/image";

export default function StudioPage() {
  return (
    <div className="relative h-full w-full overflow-hidden flex flex-col items-center justify-center">
      {/* black-sand texture */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/textures/app/black-sand.jpg"
          alt=""
          fill
          className="object-cover opacity-[0.05]"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 text-center max-w-[480px] px-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-[40px] font-bold text-[#1a1a1a] leading-tight">
            Let&apos;s start creating.
          </h1>
          <p className="text-[16px] text-[#716458] font-medium leading-relaxed">
            Design your custom plushie step by step — pick your animal, size,
            colors, and accessories. Your pattern will be ready in minutes.
          </p>
        </div>
        <button className="px-8 py-3.5 rounded-[14px] bg-[#417c9c] text-white text-[16px] font-bold transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:bg-[#35657f] hover:scale-105 active:scale-95 cursor-pointer">
          Start designing
        </button>
      </div>
    </div>
  );
}
