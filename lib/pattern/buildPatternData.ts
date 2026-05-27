import type { PatternData, PatternPart } from "./types";
import { ABBREVIATIONS, PATTERN_NOTES } from "./abbreviations";
import type { PlushieConfig } from "@/app/(app)/app/studio/types";
import { COLOR_PALETTE as STUDIO_PALETTE } from "@/app/(app)/app/studio/types";

type TemplateRow = {
  skill_level: string;
  finished_size_small: string;
  finished_size_medium: string;
  finished_size_large: string;
  accent_colors: Record<string, string>;
  parts: PatternPart[];
  assembly: { step: string }[];
};

const YARN_BY_SIZE: Record<string, { label: string; yarnBrand: string }> = {
  small: { label: "Katia Capri (100% cotton)", yarnBrand: "Capri" },
  medium: {
    label: "Katia Alabama (50% cotton, 50% acrylic)",
    yarnBrand: "Alabama",
  },
  large: { label: "Katia Bambi (plush)", yarnBrand: "Bambi" },
};

const HOOK_BY_SIZE: Record<string, string> = {
  small: "2mm",
  medium: "4mm",
  large: "6mm",
};

const EYES_BY_SIZE: Record<string, string> = {
  small: "4-6mm safety eyes",
  medium: "8mm safety eyes",
  large: "10-12mm safety eyes",
};

const ACCENT_COLOR_HEX: Record<string, string> = {
  black: "#212121",
  white: "#f5f5f5",
  brown: "#8b5e3c",
  "light pink": "#f48fb1",
  opposite: "#ffffff",
};

const ACCENT_COLOR_NAMES: Record<string, string> = {
  black: "Black",
  white: "White",
  brown: "Brown",
  "light pink": "Light Pink",
  opposite: "Contrast color",
};

export function buildPatternData(
  template: TemplateRow,
  config: PlushieConfig,
): PatternData {
  const size = config.size ?? "medium";
  const animal = config.animal ?? "dog";
  const color = config.color ?? "#ffffff";
  const eyes = config.eyes ?? "safety";
  const name = config.name ?? "My Plushie";

  const yarn = YARN_BY_SIZE[size];
  const colorName =
    STUDIO_PALETTE.find((c) => c.hex === color)?.name ?? "Custom";

  const mainYarn = {
    label: yarn.label,
    colorName,
    hex: color,
    yarnBrand: yarn.yarnBrand,
  };

  const accentYarns = Object.entries(template.accent_colors).map(
    ([part, accentColor]) => ({
      label: `${yarn.label} — for ${part}`,
      colorName: ACCENT_COLOR_NAMES[accentColor] ?? accentColor,
      hex: ACCENT_COLOR_HEX[accentColor] ?? "#9e9e9e",
      yarnBrand: yarn.yarnBrand,
    }),
  );

  const finishedSize =
    size === "small"
      ? template.finished_size_small
      : size === "medium"
        ? template.finished_size_medium
        : template.finished_size_large;

  const parts: PatternPart[] = template.parts.map((part) => ({
    ...part,
    colorNote: part.colorNote ?? `In ${colorName} yarn`,
  }));

  return {
    plushieName: name,
    animal,
    size,
    skillLevel: template.skill_level,
    finishedSize,
    materials: {
      yarn: [mainYarn, ...accentYarns],
      hook: HOOK_BY_SIZE[size],
      eyes: eyes === "x-sewed" ? null : EYES_BY_SIZE[size],
      other: ["Yarn needle", "Stitch markers", "Toy stuffing"],
    },
    abbreviations: ABBREVIATIONS,
    notes: PATTERN_NOTES,
    parts,
    assembly: template.assembly,
  };
}
