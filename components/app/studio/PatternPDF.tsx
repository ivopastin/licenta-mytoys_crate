"use client";

import {
  Document,
  Page,
  Text,
  View,
  Image as PDFImage,
  StyleSheet,
  Font,
  pdf,
} from "@react-pdf/renderer";
import type { PatternData } from "@/lib/pattern/types";
import { HEX_TO_COLOR_SLUG, ACCESSORY_FOLDER } from "./types";

// Register Figtree from public/fonts — react-pdf fetches via URL in browser
Font.register({
  family: "Figtree",
  fonts: [
    { src: "/fonts/Figtree-Regular.ttf", fontWeight: 400, fontStyle: "normal" },
    { src: "/fonts/Figtree-Italic.ttf", fontWeight: 400, fontStyle: "italic" },
    {
      src: "/fonts/Figtree-SemiBold.ttf",
      fontWeight: 600,
      fontStyle: "normal",
    },
    { src: "/fonts/Figtree-Bold.ttf", fontWeight: 700, fontStyle: "normal" },
  ],
});

// Suppress hyphenation
Font.registerHyphenationCallback((word) => [word]);

// --- Brand constants ---
const SITE_URL = "mytoys-crate.com";
const CONTACT_EMAIL = "hello@mytoys-crate.com";
const COPYRIGHT = `© ${new Date().getFullYear()} MyToysCrate. All rights reserved.`;
const PERSONAL_USE = "For personal use only. Not for commercial distribution.";

// --- Palette ---
const BRAND = "#417c9c";
const BRAND_DARK = "#2f5c73";
const GOLD = "#c9a96e";
const DEEP = "#3b2a35";
const WHITE = "#ffffff";
const INK = "#1c1917";
const MUTED = "#78716c";
const BORDER = "#e7e2dd";
const PAGE_BG = "#ffffff";
const LIGHT_BG = "#f8f6f4";

const STEP_IMAGES = [
  {
    src: "/images/template-steps/make-head.jpg",
    label: "Step 1 — Make the Head",
  },
  {
    src: "/images/template-steps/make-leg.jpg",
    label: "Step 2 — Make the Legs",
  },
  {
    src: "/images/template-steps/fill-body.jpg",
    label: "Step 3 — Fill the Body",
  },
  { src: "/images/template-steps/assembly.jpg", label: "Step 4 — Assembly" },
];

function resolvePlushieImage(
  animal: string | null,
  colorHex: string | null,
): string | null {
  if (!animal || !colorHex) return null;
  const slug = HEX_TO_COLOR_SLUG[colorHex];
  if (!slug) return null;
  return `/images/plushies/${animal}/${animal}-${slug}.jpg`;
}

function resolveAccessoryImage(
  accessory: string | null,
  colorHex: string | null,
): string | null {
  if (!accessory || !colorHex) return null;
  const slug = HEX_TO_COLOR_SLUG[colorHex];
  if (!slug) return null;
  const folder =
    ACCESSORY_FOLDER[accessory as keyof typeof ACCESSORY_FOLDER] ?? accessory;
  return `/images/accessories/${folder}/${folder}-${slug}.jpg`;
}

const s = StyleSheet.create({
  page: {
    backgroundColor: PAGE_BG,
    fontFamily: "Figtree",
    fontWeight: 400,
    paddingTop: 40,
    paddingBottom: 56,
    paddingHorizontal: 40,
  },
  content: {
    flexDirection: "column",
    gap: 0,
  },
  contentWithHeader: {
    paddingTop: 52,
    flexDirection: "column",
    gap: 0,
  },
  // ── Persistent page header (all pages except cover) ──
  pageHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 36,
    backgroundColor: BRAND,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 40,
  },
  pageHeaderLogo: {
    width: 18,
    height: 18,
    objectFit: "contain",
  },
  pageHeaderTitle: {
    fontSize: 8,
    color: "rgba(255,255,255,0.80)",
    fontWeight: 600,
    letterSpacing: 0.3,
  },
  pageHeaderRight: {
    fontSize: 8,
    color: "rgba(255,255,255,0.55)",
  },
  // ── Cover header band ────────────────────────
  coverBand: {
    backgroundColor: BRAND,
    marginHorizontal: -40,
    marginTop: -40,
    paddingHorizontal: 40,
    paddingTop: 28,
    paddingBottom: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  coverBandLeft: {
    flexDirection: "column",
    gap: 6,
    flex: 1,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  logoImg: {
    width: 28,
    height: 28,
    objectFit: "contain",
  },
  logoText: {
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
    fontWeight: 600,
    letterSpacing: 0.5,
  },
  coverTitle: {
    fontSize: 36,
    fontWeight: 700,
    color: WHITE,
    lineHeight: 1.1,
  },
  coverSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.65)",
    fontWeight: 400,
    marginTop: 4,
  },
  animalImage: {
    width: 130,
    height: 130,
    objectFit: "contain",
  },
  animalPlaceholder: {
    width: 130,
    height: 130,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.20)",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  animalPlaceholderText: {
    fontSize: 9,
    color: "rgba(255,255,255,0.35)",
  },
  // ── Section headings ─────────────────────────
  sectionHeading: {
    fontSize: 9,
    fontWeight: 700,
    color: BRAND,
    textTransform: "uppercase",
    letterSpacing: 1.4,
    marginBottom: 10,
  },
  // ── Divider ───────────────────────────────────
  divider: {
    height: 1,
    backgroundColor: BORDER,
    marginVertical: 18,
  },
  // ── Materials ────────────────────────────────
  materialsBody: {
    flexDirection: "row",
    gap: 0,
  },
  matCol: {
    flex: 1,
    paddingRight: 20,
  },
  matColRight: {
    flex: 1,
    paddingLeft: 20,
    borderLeftWidth: 1,
    borderLeftColor: BORDER,
    borderLeftStyle: "solid",
  },
  matColLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: INK,
    marginBottom: 8,
  },
  matRow: {
    flexDirection: "row",
    marginBottom: 4,
    gap: 8,
  },
  matLabel: {
    fontSize: 9,
    color: MUTED,
    width: 68,
    fontWeight: 600,
  },
  matValue: {
    fontSize: 9,
    color: INK,
    flex: 1,
    lineHeight: 1.4,
  },
  // ── Meta strip ───────────────────────────────
  metaStrip: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
  },
  metaBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 6,
    padding: 10,
    alignItems: "center",
    gap: 3,
  },
  metaLabel: {
    fontSize: 8,
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontWeight: 600,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: 700,
    color: INK,
  },
  starRow: {
    flexDirection: "row",
    gap: 2,
    marginTop: 1,
  },
  star: {
    fontSize: 11,
  },
  // ── Abbreviations ────────────────────────────
  abbrGrid: {
    flexDirection: "row",
    gap: 20,
  },
  abbrCol: {
    flex: 1,
  },
  abbrRow: {
    flexDirection: "row",
    marginBottom: 5,
    gap: 8,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    borderBottomStyle: "solid",
  },
  abbrKey: {
    fontSize: 9,
    fontWeight: 700,
    color: BRAND,
    width: 38,
  },
  abbrVal: {
    fontSize: 9,
    color: INK,
    flex: 1,
  },
  // ── Notes ────────────────────────────────────
  noteRow: {
    flexDirection: "row",
    marginBottom: 5,
    gap: 6,
  },
  noteBullet: {
    fontSize: 9,
    color: GOLD,
    fontWeight: 700,
    width: 8,
    marginTop: 1,
  },
  noteText: {
    fontSize: 9,
    color: INK,
    flex: 1,
    lineHeight: 1.5,
  },
  // ── Pattern parts ────────────────────────────
  partHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  partAccent: {
    width: 3,
    height: 14,
    backgroundColor: GOLD,
    borderRadius: 2,
  },
  partTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: DEEP,
  },
  colorNote: {
    fontSize: 9,
    color: MUTED,
    fontStyle: "italic" as const,
    marginBottom: 8,
    marginLeft: 11,
  },
  roundsGrid: {
    flexDirection: "row",
    gap: 16,
  },
  roundsCol: {
    flex: 1,
  },
  roundRow: {
    flexDirection: "row",
    marginBottom: 3,
    alignItems: "flex-start",
    gap: 4,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f1ee",
    borderBottomStyle: "solid",
  },
  roundLabel: {
    fontSize: 8,
    fontWeight: 700,
    color: GOLD,
    width: 70,
    lineHeight: 1.4,
  },
  roundInstruction: {
    fontSize: 8,
    color: INK,
    flex: 1,
    lineHeight: 1.4,
  },
  roundCount: {
    fontSize: 8,
    color: MUTED,
    width: 28,
    textAlign: "right" as const,
  },
  closingNote: {
    fontSize: 8,
    color: MUTED,
    fontStyle: "italic" as const,
    marginTop: 6,
  },
  partDivider: {
    height: 1,
    backgroundColor: BORDER,
    marginVertical: 14,
  },
  // ── Assembly ─────────────────────────────────
  assemblyRow: {
    flexDirection: "row",
    marginBottom: 6,
    gap: 8,
  },
  assemblyNum: {
    fontSize: 9,
    fontWeight: 700,
    color: BRAND,
    width: 16,
  },
  assemblyText: {
    fontSize: 9,
    color: INK,
    flex: 1,
    lineHeight: 1.5,
  },
  // ── Page footer ──────────────────────────────
  pageFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 36,
    backgroundColor: LIGHT_BG,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    borderTopStyle: "solid",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footerBrand: {
    fontSize: 7,
    color: BRAND,
    fontWeight: 700,
  },
  footerSep: {
    fontSize: 7,
    color: BORDER,
  },
  footerText: {
    fontSize: 7,
    color: MUTED,
  },
  footerPageNum: {
    fontSize: 7,
    color: MUTED,
    fontWeight: 600,
  },
  // ── Process photos ────────────────────────────
  photosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  photoCell: {
    width: "47%",
    flexDirection: "column",
    gap: 4,
  },
  photoImg: {
    width: "100%",
    height: 180,
    objectFit: "cover",
    borderRadius: 6,
    backgroundColor: LIGHT_BG,
  },
  photoLabel: {
    fontSize: 8,
    color: MUTED,
    fontStyle: "italic" as const,
  },
  // ── Last page: copyright block ────────────────
  copyrightPage: {
    backgroundColor: BRAND_DARK,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 60,
    gap: 12,
  },
  copyrightLogo: {
    width: 48,
    height: 48,
    objectFit: "contain",
    marginBottom: 8,
  },
  copyrightTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: WHITE,
    textAlign: "center" as const,
  },
  copyrightSubtitle: {
    fontSize: 10,
    color: "rgba(255,255,255,0.65)",
    textAlign: "center" as const,
    lineHeight: 1.6,
  },
  copyrightDivider: {
    width: 48,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.20)",
    marginVertical: 4,
  },
  copyrightContact: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  copyrightContactItem: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  copyrightContactLabel: {
    fontSize: 8,
    color: "rgba(255,255,255,0.45)",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: 0.6,
  },
  copyrightContactValue: {
    fontSize: 8,
    color: "rgba(255,255,255,0.80)",
  },
  copyrightLegal: {
    fontSize: 7,
    color: "rgba(255,255,255,0.35)",
    textAlign: "center" as const,
    marginTop: 8,
    lineHeight: 1.6,
  },
});

function SkillStars({ level }: { level: string }) {
  const count = level === "beginner" ? 1 : level === "intermediate" ? 2 : 3;
  return (
    <View style={s.starRow}>
      {[0, 1, 2].map((i) => (
        <Text key={i} style={[s.star, { color: i < count ? GOLD : "#ddd" }]}>
          ★
        </Text>
      ))}
    </View>
  );
}

function cap(str: string | null | undefined) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function PageHeader({ patternName }: { patternName: string }) {
  return (
    <View style={s.pageHeader} fixed>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <PDFImage
          src="/images/logos/logo-alb-deschis.png"
          style={s.pageHeaderLogo}
        />
        <Text style={s.pageHeaderTitle}>MyToysCrate</Text>
      </View>
      <Text style={s.pageHeaderTitle}>{patternName}</Text>
      <Text style={s.pageHeaderRight}>{SITE_URL}</Text>
    </View>
  );
}

function PageFooter() {
  return (
    <View style={s.pageFooter} fixed>
      <View style={s.footerLeft}>
        <Text style={s.footerBrand}>MyToysCrate</Text>
        <Text style={s.footerSep}>·</Text>
        <Text style={s.footerText}>{CONTACT_EMAIL}</Text>
        <Text style={s.footerSep}>·</Text>
        <Text style={s.footerText}>{SITE_URL}</Text>
      </View>
      <Text
        style={s.footerPageNum}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
      />
    </View>
  );
}

function PartSection({
  part,
  splitRounds,
}: {
  part: PatternData["parts"][0];
  splitRounds: (
    r: PatternData["parts"][0]["rounds"],
  ) => [PatternData["parts"][0]["rounds"], PatternData["parts"][0]["rounds"]];
}) {
  const [leftRounds, rightRounds] = splitRounds(part.rounds);
  return (
    <>
      <View style={s.partHeader}>
        <View style={s.partAccent} />
        <Text style={s.partTitle}>{part.name}</Text>
      </View>
      {part.colorNote && <Text style={s.colorNote}>{part.colorNote}</Text>}
      <View style={s.roundsGrid}>
        <View style={s.roundsCol}>
          {leftRounds.map((r, i) => (
            <View key={i} style={s.roundRow}>
              <Text style={s.roundLabel}>{r.label}:</Text>
              <Text style={s.roundInstruction}>{r.instruction}</Text>
              {r.stitchCount !== null && (
                <Text style={s.roundCount}>({r.stitchCount})</Text>
              )}
            </View>
          ))}
        </View>
        {rightRounds.length > 0 && (
          <View style={s.roundsCol}>
            {rightRounds.map((r, i) => (
              <View key={i} style={s.roundRow}>
                <Text style={s.roundLabel}>{r.label}:</Text>
                <Text style={s.roundInstruction}>{r.instruction}</Text>
                {r.stitchCount !== null && (
                  <Text style={s.roundCount}>({r.stitchCount})</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
      {part.closingNote && (
        <Text style={s.closingNote}>{part.closingNote}</Text>
      )}
    </>
  );
}

function PatternDocument({ data }: { data: PatternData }) {
  const mainYarnHex = data.materials.yarn[0]?.hex ?? null;
  const animalImg = resolvePlushieImage(data.animal, mainYarnHex);
  // Accessory yarn is typically the last yarn entry
  const accessoryYarnHex =
    data.materials.yarn.length > 1
      ? data.materials.yarn[data.materials.yarn.length - 1].hex
      : mainYarnHex;
  const accessoryImg = data.accessoryName
    ? resolveAccessoryImage(
        data.accessoryName.toLowerCase().replace(/\s+/g, "-"),
        accessoryYarnHex,
      )
    : null;
  const patternName = data.animal
    ? `${data.plushieName} the ${cap(data.animal)}`
    : data.plushieName;
  const docTitle = `${patternName} — Crochet Pattern`;

  function splitRounds(rounds: PatternData["parts"][0]["rounds"]) {
    const mid = Math.ceil(rounds.length / 2);
    return [rounds.slice(0, mid), rounds.slice(mid)] as [
      typeof rounds,
      typeof rounds,
    ];
  }

  return (
    <Document title={docTitle}>
      {/* ── Page 1: Cover + Materials ───────────────────────────────── */}
      {data.parts.length > 0 && (
        <Page size="A4" style={s.page}>
          <View style={s.content}>
            {/* Brand header band */}
            <View style={s.coverBand}>
              <View style={s.coverBandLeft}>
                <View style={s.logoRow}>
                  <PDFImage
                    src="/images/logos/logo-alb-deschis.png"
                    style={s.logoImg}
                  />
                  <Text style={s.logoText}>MyToysCrate</Text>
                </View>
                <Text style={s.coverTitle}>{data.plushieName}</Text>
                <Text style={s.coverSubtitle}>
                  {cap(data.animal)} · {cap(data.size)} · {cap(data.skillLevel)}
                </Text>
              </View>
              <View style={{ position: "relative", width: 130, height: 130 }}>
                {animalImg ? (
                  <PDFImage src={animalImg} style={s.animalImage} />
                ) : (
                  <View style={s.animalPlaceholder}>
                    <Text style={s.animalPlaceholderText}>
                      {cap(data.animal)}
                    </Text>
                  </View>
                )}
                {accessoryImg && (
                  <PDFImage
                    src={accessoryImg}
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: -10,
                      width: 56,
                      height: 56,
                      objectFit: "contain",
                    }}
                  />
                )}
              </View>
            </View>

            {/* Materials */}
            <Text style={s.sectionHeading}>Materials</Text>
            <View style={s.materialsBody}>
              <View style={s.matCol}>
                <Text style={s.matColLabel}>Yarn</Text>
                {data.materials.yarn.map((y, i) => (
                  <View key={i} style={s.matRow}>
                    <Text style={s.matLabel}>{y.colorName}</Text>
                    <Text style={s.matValue}>{y.label}</Text>
                  </View>
                ))}
              </View>
              <View style={s.matColRight}>
                <Text style={s.matColLabel}>Tools</Text>
                <View style={s.matRow}>
                  <Text style={s.matLabel}>Hook</Text>
                  <Text style={s.matValue}>{data.materials.hook}</Text>
                </View>
                {data.materials.eyes && (
                  <View style={s.matRow}>
                    <Text style={s.matLabel}>Eyes</Text>
                    <Text style={s.matValue}>{data.materials.eyes}</Text>
                  </View>
                )}
                {data.materials.other.map((o, i) => (
                  <View key={i} style={s.matRow}>
                    <Text style={s.matLabel}>{i === 0 ? "Other" : ""}</Text>
                    <Text style={s.matValue}>{o}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Finished size + skill level */}
            <View style={s.metaStrip}>
              <View style={s.metaBox}>
                <Text style={s.metaLabel}>Finished Size</Text>
                <Text style={s.metaValue}>{data.finishedSize}</Text>
              </View>
              <View style={s.metaBox}>
                <Text style={s.metaLabel}>Skill Level</Text>
                <Text style={s.metaValue}>{cap(data.skillLevel)}</Text>
                <SkillStars level={data.skillLevel} />
              </View>
            </View>
          </View>
          <PageFooter />
        </Page>
      )}

      {/* ── Page 2: Abbreviations + Notes ───────────────────────────── */}
      {data.parts.length > 0 && (
        <Page size="A4" style={s.page}>
          <PageHeader patternName={patternName} />
          <View style={s.contentWithHeader}>
            <Text style={s.sectionHeading}>Abbreviations</Text>
            <View style={s.abbrGrid}>
              {[
                data.abbreviations.slice(0, 5),
                data.abbreviations.slice(5),
              ].map((half, col) => (
                <View key={col} style={s.abbrCol}>
                  {half.map((a) => (
                    <View key={a.abbr} style={s.abbrRow}>
                      <Text style={s.abbrKey}>{a.abbr}</Text>
                      <Text style={s.abbrVal}>{a.meaning}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>

            <View style={s.divider} />

            <Text style={s.sectionHeading}>Notes</Text>
            {data.notes.map((n, i) => (
              <View key={i} style={s.noteRow}>
                <Text style={s.noteBullet}>•</Text>
                <Text style={s.noteText}>{n}</Text>
              </View>
            ))}
          </View>
          <PageFooter />
        </Page>
      )}

      {/* ── Page 3+: Pattern Parts ───────────────────────────────────── */}
      {data.parts.length > 0 && (
        <Page size="A4" style={s.page}>
          <PageHeader patternName={patternName} />
          <View style={s.contentWithHeader}>
            <Text style={s.sectionHeading}>Pattern</Text>
            {data.parts.map((part, pi) => (
              <View key={part.name}>
                {pi > 0 && <View style={s.partDivider} />}
                <PartSection part={part} splitRounds={splitRounds} />
              </View>
            ))}
          </View>
          <PageFooter />
        </Page>
      )}

      {/* ── Assembly ────────────────────────────────────────────────── */}
      {data.assembly.length > 0 && (
        <Page size="A4" style={s.page}>
          <PageHeader patternName={patternName} />
          <View style={s.contentWithHeader}>
            <Text style={s.sectionHeading}>Assembly</Text>
            {data.assembly.map((a, i) => (
              <View key={i} style={s.assemblyRow}>
                <Text style={s.assemblyNum}>{i + 1}.</Text>
                <Text style={s.assemblyText}>{a.step}</Text>
              </View>
            ))}
          </View>
          <PageFooter />
        </Page>
      )}

      {/* ── Accessory Parts ─────────────────────────────────────────── */}
      {data.accessoryParts && data.accessoryParts.length > 0 && (
        <Page size="A4" style={s.page}>
          <PageHeader patternName={patternName} />
          <View style={s.contentWithHeader}>
            <Text style={s.sectionHeading}>
              {data.accessoryName ?? "Accessory"}
            </Text>
            {data.accessoryParts.map((part, pi) => (
              <View key={part.name}>
                {pi > 0 && <View style={s.partDivider} />}
                <PartSection part={part} splitRounds={splitRounds} />
              </View>
            ))}
            {data.accessoryAssembly && data.accessoryAssembly.length > 0 && (
              <>
                <View style={s.divider} />
                <Text style={s.sectionHeading}>Accessory Assembly</Text>
                {data.accessoryAssembly.map((a, i) => (
                  <View key={i} style={s.assemblyRow}>
                    <Text style={s.assemblyNum}>{i + 1}.</Text>
                    <Text style={s.assemblyText}>{a.step}</Text>
                  </View>
                ))}
              </>
            )}
          </View>
          <PageFooter />
        </Page>
      )}

      {/* ── Process photos ──────────────────────────────────────────── */}
      <Page size="A4" style={s.page}>
        <PageHeader patternName={patternName} />
        <View style={s.contentWithHeader}>
          <Text style={s.sectionHeading}>Making Your Plushie</Text>
          <View style={s.photosGrid}>
            {STEP_IMAGES.map(({ src, label }) => (
              <View key={src} style={s.photoCell}>
                <PDFImage src={src} style={s.photoImg} />
                <Text style={s.photoLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </View>
        <PageFooter />
      </Page>

      {/* ── Copyright / last page ───────────────────────────────────── */}
      <Page size="A4" style={[s.page, { padding: 0 }]}>
        <View style={s.copyrightPage}>
          <PDFImage
            src="/images/logos/logo-alb-deschis.png"
            style={s.copyrightLogo}
          />
          <Text style={s.copyrightTitle}>MyToysCrate</Text>
          <Text style={s.copyrightSubtitle}>
            Thank you for using MyToysCrate!{"\n"}
            We hope you enjoy making {data.plushieName}.
          </Text>
          <View style={s.copyrightDivider} />
          <View style={s.copyrightContact}>
            <View style={s.copyrightContactItem}>
              <Text style={s.copyrightContactLabel}>Web</Text>
              <Text style={s.copyrightContactValue}>{SITE_URL}</Text>
            </View>
            <View style={s.copyrightContactItem}>
              <Text style={s.copyrightContactLabel}>Email</Text>
              <Text style={s.copyrightContactValue}>{CONTACT_EMAIL}</Text>
            </View>
          </View>
          <Text style={s.copyrightLegal}>
            {COPYRIGHT}
            {"\n"}
            {PERSONAL_USE}
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export async function downloadPatternPDF(data: PatternData, filename: string) {
  // it returns a blob - the binary content of the file
  //i create a temporary address for that blob with createObjectURL() then
  //i create an invisible link with atribute download, i click it to start the downloading
  //and in final i free the memory with revokeObjectURL()
  const blob = await pdf(<PatternDocument data={data} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function openPatternPDF(data: PatternData) {
  // i generate the pdf as blob - binary content of file
  //then pack the blob in a File Object with name and type
  //then create the temporary address
  //open in a new tab
  const blob = await pdf(<PatternDocument data={data} />).toBlob();
  const filename = data.animal
    ? `${data.plushieName}-the-${data.animal}-pattern.pdf`
    : `${data.plushieName}-pattern.pdf`;
  const file = new File([blob], filename, { type: "application/pdf" });
  const url = URL.createObjectURL(file);
  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
