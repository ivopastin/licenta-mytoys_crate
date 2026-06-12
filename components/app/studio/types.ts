export type PlushieMode = "plushie" | "accessory" | "both";
export type AnimalType = "dog" | "cat" | "rabbit" | "bear" | "fox" | "sheep";
export type SizeType = "small" | "medium" | "large";
export type EyesType = "safety" | "x-sewed";
export type AccessoryType = "hat" | "bow-tie" | "basket";

// Maps hex → image filename slug (e.g. "#edb658" → "yellow")
export const HEX_TO_COLOR_SLUG: Record<string, string> = {
  "#edb658": "yellow",
  "#b1bb99": "green",
  "#d0ca6c": "light-green", // pistachio → closest is yellow
  "#f59a5a": "orange",
  "#4e6fae": "dark-blue",
  "#cde1de": "cyan",
  "#dab8c1": "pink",
  "#a90321": "dark-red",
  "#ffffff": "grey", // white not in set → grey fallback
  "#1a1a1a": "black",
  "#9e9e9e": "grey",
  "#c690cf": "purple",
  "#92acba": "blue",
  "#530217": "dark-red",
};

// Maps accessory wizard value → image folder name
export const ACCESSORY_FOLDER: Record<AccessoryType, string> = {
  hat: "hat",
  "bow-tie": "bow-tie",
  basket: "crossbody-bag",
};

export type PlushieConfig = {
  mode: PlushieMode | null;
  animal: AnimalType | null;
  size: SizeType | null;
  color: string | null;
  eyes: EyesType | null;
  name: string | null;
  accessory: AccessoryType | null;
  accessoryColor: string | null;
};

export const EMPTY_CONFIG: PlushieConfig = {
  mode: null,
  animal: null,
  size: null,
  color: null,
  eyes: null,
  name: null,
  accessory: null,
  accessoryColor: null,
};

export interface StepProps {
  config: PlushieConfig;
  onNext: (partial: Partial<PlushieConfig>) => void;
  onBack: () => void;
  stepLabel: string;
  direction: "forward" | "backward";
}

export const COLOR_PALETTE: { name: string; hex: string }[] = [
  { name: "Yellow", hex: "#edb658" },
  { name: "Willow Green", hex: "#b1bb99" },
  { name: "Pistachio", hex: "#d0ca6c" },
  { name: "Orange", hex: "#f59a5a" },
  { name: "Dark Blue", hex: "#4e6fae" },
  { name: "Aqua Blue", hex: "#cde1de" },
  { name: "Light Pink", hex: "#dab8c1" },
  { name: "Red", hex: "#a90321" },
  { name: "White", hex: "#ffffff" },
  { name: "Black", hex: "#1a1a1a" },
  { name: "Grey", hex: "#9e9e9e" },
  { name: "Light Purple", hex: "#c690cf" },
  { name: "Light Teal", hex: "#92acba" },
  { name: "Brownish Red", hex: "#530217" },
];
