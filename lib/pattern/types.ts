export type PatternRound = {
  label: string;
  instruction: string;
  stitchCount: number | null;
};

export type PatternPart = {
  name: string;
  colorNote?: string;
  rounds: PatternRound[];
  closingNote?: string;
};

export type PatternData = {
  plushieName: string;
  animal: string;
  size: string;
  skillLevel: string;
  finishedSize: string;
  materials: {
    yarn: { label: string; colorName: string; hex: string; yarnBrand: string }[];
    hook: string;
    eyes: string | null;
    other: string[];
  };
  abbreviations: { abbr: string; meaning: string }[];
  notes: string[];
  parts: PatternPart[];
  assembly: { step: string }[];
};

export const COLOR_PALETTE: Record<string, string> = {
  "#f5e6cc": "Cream",
  "#e8c9a0": "Sand",
  "#d4a96a": "Honey",
  "#c17f24": "Caramel",
  "#8b5e3c": "Brown",
  "#4a2c0a": "Dark Brown",
  "#ffd700": "Yellow",
  "#ffb347": "Orange",
  "#ff6b6b": "Coral",
  "#e63946": "Red",
  "#c9a96e": "Gold",
  "#a8d8a8": "Mint",
  "#7bc67e": "Green",
  "#2d6a4f": "Dark Green",
  "#90caf9": "Light Blue",
  "#42a5f5": "Blue",
  "#1565c0": "Dark Blue",
  "#ce93d8": "Lavender",
  "#ab47bc": "Purple",
  "#f48fb1": "Pink",
  "#e91e63": "Hot Pink",
  "#f5f5f5": "White",
  "#9e9e9e": "Grey",
  "#424242": "Dark Grey",
  "#212121": "Black",
};
