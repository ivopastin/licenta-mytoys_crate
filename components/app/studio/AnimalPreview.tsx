import Image from "next/image";
import { AnimalType, AccessoryType, HEX_TO_COLOR_SLUG, ACCESSORY_FOLDER } from "./types";

interface AnimalPreviewProps {
  animal: AnimalType | null;
  color: string | null;
  accessory?: AccessoryType | null;
  accessoryColor?: string | null;
}

function plushieImagePath(animal: AnimalType, colorHex: string | null): string | null {
  if (!colorHex) return null;
  const slug = HEX_TO_COLOR_SLUG[colorHex];
  if (!slug) return null;
  return `/images/plushies/${animal}/${animal}-${slug}.webp`;
}

function accessoryImagePath(accessory: AccessoryType, colorHex: string | null): string | null {
  if (!colorHex) return null;
  const slug = HEX_TO_COLOR_SLUG[colorHex];
  if (!slug) return null;
  const folder = ACCESSORY_FOLDER[accessory];
  return `/images/accessories/${folder}/${folder}-${slug}.webp`;
}

export default function AnimalPreview({ animal, color, accessory, accessoryColor }: AnimalPreviewProps) {
  const plushieSrc = animal ? plushieImagePath(animal, color) : null;
  const accessorySrc = accessory ? accessoryImagePath(accessory, accessoryColor ?? color) : null;

  const showTwoColumns = plushieSrc && accessorySrc;

  return (
    <div className={`shrink-0 bg-white/15 border border-white/25 backdrop-blur-sm rounded-[20px] flex flex-col self-stretch overflow-hidden ${showTwoColumns ? "w-80" : "w-55"}`}>
      {showTwoColumns ? (
        /* Two-column layout: plushie | accessory */
        <>
          <div className="flex flex-1 min-h-0">
            <div className="flex-1 flex flex-col items-center justify-center gap-2 p-4 border-r border-white/15">
              <Image
                src={plushieSrc}
                alt={animal ?? "plushie"}
                width={120}
                height={120}
                className="object-contain drop-shadow-lg"
                unoptimized
              />
              <p className="text-[11px] font-semibold text-white/50 capitalize">{animal}</p>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-2 p-4">
              <Image
                src={accessorySrc}
                alt={accessory ?? "accessory"}
                width={120}
                height={120}
                className="object-contain drop-shadow-lg"
                unoptimized
              />
              <p className="text-[11px] font-semibold text-white/50 capitalize">{accessory?.replace("-", " ")}</p>
            </div>
          </div>
        </>
      ) : (
        /* Single column */
        <div className="flex flex-col items-center justify-center gap-3 flex-1 p-6">
          {plushieSrc ? (
            <Image
              src={plushieSrc}
              alt={animal ?? "plushie"}
              width={160}
              height={160}
              className="object-contain drop-shadow-lg"
              unoptimized
            />
          ) : (
            <div className="w-20 h-20 rounded-full border-2 border-white/20 bg-white/10 flex items-center justify-center">
              {color && (
                <div className="w-14 h-14 rounded-full border border-white/30" style={{ backgroundColor: color }} />
              )}
            </div>
          )}
          {animal && (
            <p className="text-[13px] font-semibold text-white/70 capitalize">{animal}</p>
          )}
        </div>
      )}
    </div>
  );
}
