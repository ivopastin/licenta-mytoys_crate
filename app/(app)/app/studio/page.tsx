"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import GrainientFade from "../components/GrainientFade";
import { PlushieConfig, EMPTY_CONFIG } from "./types";
import StepMode from "./components/StepMode";
import StepAnimal from "./components/StepAnimal";
import StepSize from "./components/StepSize";
import StepColor from "./components/StepColor";
import StepEyes from "./components/StepEyes";
import StepName from "./components/StepName";
import StepAccessory from "./components/StepAccessory";
import StepGenerating from "./components/StepGenerating";
import StepResult from "./components/StepResult";

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
  const [wizardActive, setWizardActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [config, setConfig] = useState<PlushieConfig>(EMPTY_CONFIG);

  const steps = buildSteps(config);
  const navigableStepCount = steps.length - 2; // exclude generating and result
  const currentStep = steps[stepIndex];
  const stepLabel = `Step ${stepIndex + 1} of ${navigableStepCount}`;

  const handleNext = useCallback((partial: Partial<PlushieConfig>) => {
    const newConfig = { ...config, ...partial };
    setConfig(newConfig);
    const newSteps = buildSteps(newConfig);
    setStepIndex((i) => Math.min(i + 1, newSteps.length - 1));
  }, [config]);

  const handleBack = useCallback(() => {
    setStepIndex((i) => Math.max(i - 1, 0));
  }, []);

  const handleReset = useCallback(() => {
    setConfig(EMPTY_CONFIG);
    setStepIndex(0);
    setWizardActive(false);
  }, []);

  const stepProps = { config, onNext: handleNext, onBack: handleBack, stepLabel };

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

      {/* Texture overlay */}
      <div className="absolute inset-0 pointer-events-none z-1">
        <Image
          src="/images/textures/app/black-sand.jpg"
          alt=""
          fill
          className="object-cover opacity-[0.12] mix-blend-overlay"
        />
      </div>

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
            {currentStep === "mode"          && <StepMode      {...stepProps} />}
            {currentStep === "animal"        && <StepAnimal    {...stepProps} />}
            {currentStep === "size"          && <StepSize      {...stepProps} />}
            {currentStep === "color"         && <StepColor     {...stepProps} field="color"          title="What color should it be?" />}
            {currentStep === "eyes"          && <StepEyes      {...stepProps} />}
            {currentStep === "name"          && <StepName      {...stepProps} />}
            {currentStep === "accessory"     && <StepAccessory {...stepProps} />}
            {currentStep === "accessoryColor"&& <StepColor     {...stepProps} field="accessoryColor" title="What color should the accessory be?" />}
            {currentStep === "generating"    && <StepGenerating onDone={() => setStepIndex((i) => i + 1)} />}
            {currentStep === "result"        && <StepResult    config={config} onReset={handleReset} />}
          </>
        )}
      </div>
    </div>
  );
}
