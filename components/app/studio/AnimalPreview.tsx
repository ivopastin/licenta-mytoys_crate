import { AnimalType } from "./types";

interface AnimalPreviewProps {
  animal: AnimalType | null;
  color: string | null;
}

const ANIMAL_LABELS: Record<AnimalType, string> = {
  dog: "Dog",
  cat: "Cat",
  rabbit: "Rabbit",
  bear: "Bear",
  fox: "Fox",
  sheep: "Sheep",
};

export default function AnimalPreview({ animal, color }: AnimalPreviewProps) {
  return (
    <div className="w-55 shrink-0 bg-white/15 border border-white/25 backdrop-blur-sm rounded-[20px] flex flex-col items-center justify-center gap-4 self-stretch p-6">
      {color && (
        <div
          className="w-16 h-16 rounded-full border-2 border-white/40 shadow-lg"
          style={{ backgroundColor: color }}
        />
      )}
      <p className="text-[18px] font-bold text-white">
        {animal ? ANIMAL_LABELS[animal] : "Your plushie"}
      </p>
      <p className="text-[12px] text-white/50 text-center">
        Illustration coming soon
      </p>
    </div>
  );
}
