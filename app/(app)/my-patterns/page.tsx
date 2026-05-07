import Image from "next/image";

export default function MyPatternsPage() {
  return (
    <div className="relative h-full w-full overflow-hidden flex flex-col items-center justify-center">
      {/* wall texture */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/textures/app/wall.jpg"
          alt=""
          fill
          className="object-cover opacity-[0.06]"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-3 text-center max-w-[400px] px-8">
        <div className="w-14 h-14 rounded-full bg-[#e0d9d5] flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 2h9l5 5v15a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"
              stroke="#716458"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 2v6h6M9 13h6M9 17h4"
              stroke="#716458"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h1 className="text-[26px] font-bold text-[#1a1a1a]">
          No patterns yet
        </h1>
        <p className="text-[15px] text-[#716458] font-medium leading-relaxed">
          Your downloaded patterns will appear here. Head to the Studio to
          design your first plushie.
        </p>
      </div>
    </div>
  );
}
