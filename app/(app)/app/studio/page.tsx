"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import LeaveConfirmDialog from "@/components/app/studio/LeaveConfirmDialog";
import PatternReadyToast from "@/components/app/studio/PatternReadyToast";
import GrainientFade from "@/components/app/GrainientFade";
import { PlushieConfig, EMPTY_CONFIG } from "@/components/app/studio/types";
import StepMode from "@/components/app/studio/StepMode";
import StepAnimal from "@/components/app/studio/StepAnimal";
import StepSize from "@/components/app/studio/StepSize";
import StepColor from "@/components/app/studio/StepColor";
import StepEyes from "@/components/app/studio/StepEyes";
import StepName from "@/components/app/studio/StepName";
import StepAccessory from "@/components/app/studio/StepAccessory";
import StepGenerating from "@/components/app/studio/StepGenerating";
import StepResult from "@/components/app/studio/StepResult";
import WizardPlushiesBg from "@/components/app/studio/WizardPlushiesBg";
import type { PatternData } from "@/lib/pattern/types";

type WizardStepId =
  | "mode"
  | "animal"
  | "size"
  | "color"
  | "eyes"
  | "name"
  | "accessory"
  | "accessoryColor"
  | "generating"
  | "result";

function buildSteps(config: PlushieConfig): WizardStepId[] {
  const steps: WizardStepId[] = ["mode"];
  if (config.mode !== "accessory") {
    steps.push("animal", "size", "color", "eyes", "name");
  }
  if (config.mode === "accessory" || config.mode === "both") {
    steps.push("accessory", "accessoryColor");
  }
  steps.push("generating", "result");
  return steps;
}

export default function StudioPage() {
  const router = useRouter();
  const [wizardActive, setWizardActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [config, setConfig] = useState<PlushieConfig>(EMPTY_CONFIG);
  const [patternId, setPatternId] = useState<string | null>(null);
  const [patternData, setPatternData] = useState<PatternData | null>(null);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  const steps = buildSteps(config);
  const navigableStepCount = steps.length - 2; // exclude generating and result
  const currentStep = steps[stepIndex];
  const stepLabel = `Step ${stepIndex + 1} of ${navigableStepCount}`;

  const handleNext = useCallback((partial: Partial<PlushieConfig>) => {
    setDirection("forward");
    const newConfig = { ...config, ...partial };
    setConfig(newConfig);
    const newSteps = buildSteps(newConfig);
    setStepIndex((i) => Math.min(i + 1, newSteps.length - 1));
  }, [config]);

  const handleBack = useCallback(() => {
    setDirection("backward");
    setStepIndex((i) => Math.max(i - 1, 0));
  }, []);

  const handleReset = useCallback(() => {
    setConfig(EMPTY_CONFIG);
    setStepIndex(0);
    setWizardActive(false);
  }, []);

  const isInProgress = wizardActive && currentStep !== "result";

  // Warn on browser-level navigation (refresh, tab close)
  useEffect(() => {
    if (!isInProgress) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isInProgress]);

  // Intercept Next.js client-side navigation (sidebar links, etc.)
  useEffect(() => {
    if (!isInProgress) return;
    const handler = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("/app/studio")) return;
      e.preventDefault();
      setPendingHref(href);
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [isInProgress]);

  const handleGeneratingDone = useCallback(
    (result: { patternId: string; patternData: PatternData }) => {
      setPatternId(result.patternId);
      setPatternData(result.patternData);
      setStepIndex((i) => i + 1);
      setShowToast(true);
    },
    []
  );

  const handleLeaveConfirm = useCallback(() => {
    if (pendingHref) router.push(pendingHref);
    setPendingHref(null);
  }, [pendingHref, router]);

  const handleLeaveCancel = useCallback(() => {
    setPendingHref(null);
  }, []);

  const stepProps = { config, onNext: handleNext, onBack: handleBack, stepLabel, direction };

  return (
    <div className="relative h-full w-full overflow-hidden flex flex-col items-center justify-center">
      {/* Grainient background */}
      <GrainientFade
        color1="#591427"
        color2="#76a0b3"
        color3="#716458"
        timeSpeed={0.2}
        warpStrength={1}
        warpFrequency={5}
        warpSpeed={2}
        warpAmplitude={50}
        blendAngle={0}
        blendSoftness={0.05}
        rotationAmount={400}
        noiseScale={2}
        grainAmount={0.08}
        grainScale={2}
        contrast={1.3}
        saturation={0.9}
        zoom={0.9}
      />


      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-8">
        {/* Landing */}
        {!wizardActive && (
          <div className="flex flex-col items-center gap-6 text-center max-w-120">
            <div className="flex flex-col gap-2">
              <h1 className="text-[40px] font-bold text-white leading-tight">
                Let&apos;s start creating.
              </h1>
              <p className="text-[16px] text-white/70 font-medium leading-relaxed">
                Design your custom plushie step by step — pick your animal, size,
                colors, and accessories. Your pattern will be ready in minutes.
              </p>
            </div>
            <button
              onClick={() => setWizardActive(true)}
              className="px-8 py-3.5 rounded-[14px] bg-(--color-accent) text-deep text-[16px] font-bold transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:bg-white hover:scale-105 active:scale-95 cursor-pointer"
            >
              Start designing
            </button>
          </div>
        )}

        {/* Wizard */}
        {wizardActive && (
          <>
            <WizardPlushiesBg />
            {currentStep === "mode"          && <StepMode      {...stepProps} />}
            {currentStep === "animal"        && <StepAnimal    {...stepProps} />}
            {currentStep === "size"          && <StepSize      {...stepProps} />}
            {currentStep === "color"         && <StepColor     {...stepProps} field="color"          title="What color should it be?" />}
            {currentStep === "eyes"          && <StepEyes      {...stepProps} />}
            {currentStep === "name"          && <StepName      {...stepProps} />}
            {currentStep === "accessory"     && <StepAccessory {...stepProps} />}
            {currentStep === "accessoryColor"&& <StepColor     {...stepProps} field="accessoryColor" title="What color should the accessory be?" />}
            {currentStep === "generating"    && <StepGenerating config={config} onDone={handleGeneratingDone} />}
            {currentStep === "result"        && <StepResult    config={config} patternId={patternId} patternData={patternData} onReset={handleReset} />}
          </>
        )}
      </div>

      {showToast && (
        <PatternReadyToast onDismiss={() => setShowToast(false)} />
      )}

      {pendingHref && (
        <LeaveConfirmDialog
          onConfirm={handleLeaveConfirm}
          onCancel={handleLeaveCancel}
        />
      )}
    </div>
  );
}
