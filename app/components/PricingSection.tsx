"use client";

import Image from "next/image";
import SplitText from "@/components/SplitText";
import FadeUp from "@/components/FadeUp";

const CHECK = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="9" fill="rgba(255,255,255,0.15)" />
    <path
      d="M5 9l3 3 5-5"
      stroke="white"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function PricingCard({
  badge,
  title,
  price,
  priceUnit,
  description,
  features,
  cta,
  featured,
  delay,
}: {
  badge?: string;
  title: string;
  price: string;
  priceUnit: string;
  description: string;
  features: string[];
  cta: string;
  featured?: boolean;
  delay: number;
}) {
  return (
    <FadeUp delay={delay}>
      <div
        className={`w-full flex flex-col gap-4 rounded-[20px] border border-white/20 backdrop-blur-md ${
          featured ? "p-4 scale-105 bg-white/15 shadow-[8px_12px_40px_rgba(0,0,0,0.45)]" : "p-3 bg-white/10 shadow-[6px_10px_30px_rgba(0,0,0,0.35)]"
        }`}
      >
        <div className="flex flex-col gap-4 w-full">
          {/* white inset panel */}
          <div className="flex flex-col gap-4 bg-white rounded-[12px] px-5 py-5">
            {badge && (
              <span className="self-start text-[11px] font-bold uppercase tracking-widest bg-[#591427]/10 text-[#591427] border border-[#591427]/20 rounded-full px-3 py-1">
                {badge}
              </span>
            )}
            <div className="flex flex-col gap-1">
              <p
                className={`font-bold text-[#1a1a1a] ${featured ? "text-[20px]" : "text-[17px]"}`}
              >
                {title}
              </p>
              <p className="text-[#716458] text-[12px] font-medium leading-snug">
                {description}
              </p>
            </div>
            <div className="flex items-end gap-1.5">
              <p
                className={`font-bold text-[#591427] leading-none ${featured ? "text-[48px]" : "text-[36px]"}`}
              >
                {price}
              </p>
              <p className="text-[#716458] text-[13px] font-medium mb-1.5">
                {priceUnit}
              </p>
            </div>
            <button
              className={`w-full rounded-[10px] py-2.5 text-[14px] font-bold cursor-pointer transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-105 active:scale-95 ${
                featured
                  ? "bg-[#591427] text-[#fff1b5] hover:bg-[#7a1c35]"
                  : "bg-[#591427]/10 text-[#591427] border border-[#591427]/20 hover:bg-[#591427]/20"
              }`}
            >
              {cta}
            </button>
          </div>

          {/* features */}
          <div className="flex flex-col gap-2.5 px-2 pb-1">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="mt-0.5 shrink-0">{CHECK}</span>
                <p className="text-white/80 text-[12px] font-medium leading-snug">
                  {f}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FadeUp>
  );
}

export default function PricingSection() {
  return (
    <div className="relative h-[calc(100vh-20px)] overflow-hidden flex flex-col items-center justify-center">
      {/* warm neutral base */}
      <div className="absolute inset-0 bg-[#fff1b5]/60" />

      {/* purple paint texture covering right 2/3 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 28%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 28%, black 100%)",
        }}
      >
        <Image
          src="/images/textures/purple-paint.jpg"
          alt=""
          fill
          className="object-cover opacity-70"
        />
      </div>

      {/* dark tint for readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "rgba(0,0,0,0.25)",
        }}
      />

      {/* top fade from testimonials */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to bottom, #591427, transparent)",
        }}
      />

      <div className="relative z-10 w-full flex flex-col items-center gap-8 px-20">
        <div className="w-full max-w-5xl flex flex-col gap-4">
          <SplitText
            text="Simple, fair pricing"
            tag="p"
            className="text-[48px] font-bold text-white"
            splitType="words"
            from={{ opacity: 0, y: 30 }}
            to={{ opacity: 1, y: 0 }}
            duration={0.7}
            delay={70}
            ease="power3.out"
            textAlign="left"
            threshold={0.2}
            rootMargin="0px"
          />
          <FadeUp delay={150}>
            <p className="text-white/60 text-[16px] font-medium">
              Pay per creation — no subscriptions, no surprises.
            </p>
          </FadeUp>
        </div>

        <div className="flex flex-row items-stretch gap-5 w-full max-w-5xl">
          <div className="flex-1">
            <PricingCard
              title="Accessory Pattern"
              price="$2"
              priceUnit="/ accessory"
              description="Perfect for small add-ons to complement your plushie."
              features={[
                "Custom accessory design",
                "PDF pattern instantly",
                "Beginner-friendly instructions",
                "Size & color customization",
                "Email support",
              ]}
              cta="Get pattern"
              delay={100}
            />
          </div>

          <div className="flex-1">
            <PricingCard
              badge="Most popular"
              title="Your first plushie is free!"
              price="$4"
              priceUnit="/ plushie after first"
              description="Design your dream plushie and bring it to life with a detailed crochet pattern."
              features={[
                "First plushie completely free",
                "Full custom plushie design",
                "Detailed PDF crochet pattern",
                "Choose animal, size & colors",
                "Step-by-step instructions",
                "Priority support",
              ]}
              cta="Start for free"
              featured
              delay={0}
            />
          </div>

          <div className="flex-1">
            <PricingCard
              title="Plushie Pattern"
              price="$4"
              priceUnit="/ plushie"
              description="Already used your free one? Get unlimited patterns at a flat rate."
              features={[
                "Full custom plushie design",
                "PDF pattern instantly",
                "All animal types supported",
                "Size & color customization",
                "Email support",
              ]}
              cta="Get pattern"
              delay={200}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
