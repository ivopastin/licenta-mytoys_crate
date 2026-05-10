import { AnimalType } from "../types";

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
    <div className="flex-1 bg-white/10 border border-white/20 rounded-[20px] flex flex-col items-center justify-center gap-4 min-h-[320px] p-8">
      {color && (
        <div
          className="w-16 h-16 rounded-full border-2 border-white/30 shadow-lg"
          style={{ backgroundColor: color }}
        />
      )}
      <p className="text-[18px] font-bold text-white/80">
        {animal ? ANIMAL_LABELS[animal] : "Your plushie"}
      </p>
      <p className="text-[12px] text-white/40 text-center">
        Illustration coming soon
      </p>
    </div>
  );
}
