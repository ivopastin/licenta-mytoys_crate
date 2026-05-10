export type PlushieMode = "plushie" | "accessory" | "both";
export type AnimalType = "dog" | "cat" | "rabbit" | "bear" | "fox" | "sheep";
export type SizeType = "small" | "medium" | "large";
export type EyesType = "safety" | "x-sewed";
export type AccessoryType = "tshirt" | "ribbon" | "crossbody-bag" | "hat" | "sunglasses" | "dress";

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
}

export const COLOR_PALETTE: { name: string; hex: string }[] = [
  { name: "Yellow",       hex: "#edb658" },
  { name: "Willow Green", hex: "#b1bb99" },
  { name: "Pistachio",    hex: "#d0ca6c" },
  { name: "Orange",       hex: "#f59a5a" },
  { name: "Dark Blue",    hex: "#4e6fae" },
  { name: "Aqua Blue",    hex: "#cde1de" },
  { name: "Light Pink",   hex: "#dab8c1" },
  { name: "Red",          hex: "#a90321" },
  { name: "White",        hex: "#ffffff" },
  { name: "Black",        hex: "#1a1a1a" },
  { name: "Grey",         hex: "#9e9e9e" },
  { name: "Light Purple", hex: "#c690cf" },
  { name: "Light Teal",   hex: "#92acba" },
  { name: "Brownish Red", hex: "#530217" },
];
