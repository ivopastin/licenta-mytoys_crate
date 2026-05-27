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

// Register Figtree from public/fonts — react-pdf fetches via URL in browser
Font.register({
  family: "Figtree",
  fonts: [
    { src: "/fonts/Figtree-Regular.ttf", fontWeight: 400, fontStyle: "normal" },
    { src: "/fonts/Figtree-Italic.ttf", fontWeight: 400, fontStyle: "italic" },
    { src: "/fonts/Figtree-SemiBold.ttf", fontWeight: 600, fontStyle: "normal" },
    { src: "/fonts/Figtree-Bold.ttf", fontWeight: 700, fontStyle: "normal" },
  ],
});

// Suppress hyphenation
Font.registerHyphenationCallback((word) => [word]);

// --- Palette matching the app ---
const BG = "#2a3f4f";
const BRAND = "#417c9c";
const GOLD = "#c9a96e";
const DEEP = "#591427";
const WHITE = "#ffffff";
const INK = "#1a1a1a";
const CARD_BG = "#ffffff";
const CARD_RADIUS = 10;
const SOFT_TEXT = "#716458";

const ANIMAL_IMAGE: Record<string, string> = {
  bear: "/images/bear.png",
  rabbit: "/images/bunny.png",
  cat: "/images/cat.png",
};

const s = StyleSheet.create({
  page: {
    backgroundColor: BG,
    fontFamily: "Figtree",
    fontWeight: 400,
    position: "relative",
  },
  content: {
    padding: 36,
    flexDirection: "column",
    gap: 14,
  },
  // ── Cover ────────────────────────────────────
  coverRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 20,
    marginBottom: 2,
  },
  coverLeft: {
    flex: 1,
    flexDirection: "column",
    gap: 6,
  },
  logoImg: {
    width: 36,
    height: 36,
    objectFit: "contain",
    marginBottom: 4,
  },
  coverTitle: {
    fontSize: 40,
    fontWeight: 700,
    color: WHITE,
    lineHeight: 1.1,
  },
  coverSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.55)",
    fontWeight: 400,
  },
  animalImage: {
    width: 160,
    height: 160,
    objectFit: "contain",
    borderRadius: 12,
  },
  animalPlaceholder: {
    width: 160,
    height: 160,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  animalPlaceholderText: {
    fontSize: 10,
    color: "rgba(255,255,255,0.25)",
  },
  // ── Cards ─────────────────────────────────────
  card: {
    backgroundColor: CARD_BG,
    borderRadius: CARD_RADIUS,
    padding: 16,
  },
  cardHeader: {
    fontSize: 10,
    fontWeight: 700,
    color: BRAND,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  // Materials
  materialsBody: {
    flexDirection: "row",
    gap: 16,
  },
  matCol: {
    flex: 1,
  },
  matColLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: INK,
    marginBottom: 6,
  },
  matRow: {
    flexDirection: "row",
    marginBottom: 3,
    gap: 6,
  },
  matLabel: {
    fontSize: 10,
    color: SOFT_TEXT,
    width: 72,
    fontWeight: 600,
  },
  matValue: {
    fontSize: 10,
    color: INK,
    flex: 1,
  },
  matDivider: {
    width: 1,
    backgroundColor: "#f0ece8",
    marginHorizontal: 4,
  },
  // Meta row (finished size + skill)
  metaRow: {
    flexDirection: "row",
    gap: 12,
  },
  metaCard: {
    flex: 1,
    backgroundColor: CARD_BG,
    borderRadius: CARD_RADIUS,
    padding: 14,
    alignItems: "center",
    gap: 4,
  },
  metaLabel: {
    fontSize: 9,
    color: SOFT_TEXT,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontWeight: 600,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: 700,
    color: INK,
  },
  starRow: {
    flexDirection: "row",
    gap: 2,
    marginTop: 2,
  },
  star: {
    fontSize: 13,
  },
  // ── Abbreviations ────────────────────────────
  abbrGrid: {
    flexDirection: "row",
    gap: 16,
  },
  abbrCol: {
    flex: 1,
  },
  abbrRow: {
    flexDirection: "row",
    marginBottom: 4,
    gap: 6,
  },
  abbrKey: {
    fontSize: 10,
    fontWeight: 700,
    color: BRAND,
    width: 40,
  },
  abbrVal: {
    fontSize: 10,
    color: "#333",
    flex: 1,
  },
  // Notes
  noteRow: {
    flexDirection: "row",
    marginBottom: 5,
    gap: 4,
  },
  noteBullet: {
    fontSize: 10,
    color: GOLD,
    fontWeight: 700,
    width: 10,
  },
  noteText: {
    fontSize: 10,
    color: "#444",
    flex: 1,
    lineHeight: 1.5,
  },
  // ── Pattern parts ────────────────────────────
  partTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: DEEP,
    marginBottom: 2,
  },
  colorNote: {
    fontSize: 10,
    color: SOFT_TEXT,
    fontStyle: "italic" as const,
    marginBottom: 8,
  },
  roundsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  roundsCol: {
    flex: 1,
  },
  roundRow: {
    flexDirection: "row",
    marginBottom: 4,
    alignItems: "flex-start",
    gap: 4,
  },
  roundLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: GOLD,
    width: 72,
    lineHeight: 1.4,
  },
  roundInstruction: {
    fontSize: 9,
    color: INK,
    flex: 1,
    lineHeight: 1.4,
  },
  roundCount: {
    fontSize: 9,
    color: "#999",
    width: 36,
    textAlign: "right" as const,
  },
  closingNote: {
    fontSize: 9,
    color: SOFT_TEXT,
    fontStyle: "italic" as const,
    marginTop: 6,
  },
  // ── Assembly ─────────────────────────────────
  assemblyRow: {
    flexDirection: "row",
    marginBottom: 5,
    gap: 6,
  },
  assemblyNum: {
    fontSize: 10,
    fontWeight: 700,
    color: BRAND,
    width: 18,
  },
  assemblyText: {
    fontSize: 10,
    color: INK,
    flex: 1,
    lineHeight: 1.5,
  },
  // Divider between parts
  partDivider: {
    height: 1,
    backgroundColor: "#f0ece8",
    marginVertical: 10,
  },
});

function SkillStars({ level }: { level: string }) {
  const count = level === "beginner" ? 1 : level === "intermediate" ? 2 : 3;
  return (
    <View style={s.starRow}>
      {[0, 1, 2].map((i) => (
        <Text key={i} style={[s.star, { color: i < count ? GOLD : "#ddd" }]}>★</Text>
      ))}
    </View>
  );
}

function cap(str: string | null | undefined) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function PatternDocument({ data }: { data: PatternData }) {
  const animalImg = ANIMAL_IMAGE[data.animal];

  // Split rounds into two halves for two-column layout
  function splitRounds(rounds: PatternData["parts"][0]["rounds"]) {
    const mid = Math.ceil(rounds.length / 2);
    return [rounds.slice(0, mid), rounds.slice(mid)];
  }

  return (
    <Document title={data.animal ? `${data.plushieName} the ${cap(data.animal)} — Pattern` : `${data.plushieName} — Pattern`}>
      {/* ── Page 1: Cover + Materials (skipped for accessory-only) ─── */}
      {data.parts.length > 0 && <Page size="A4" style={s.page}>
        <View style={s.content}>
          {/* Header row: text + animal image */}
          <View style={s.coverRow}>
            <View style={s.coverLeft}>
              <PDFImage src="/images/logos/logo-alb-deschis.png" style={s.logoImg} />
              <Text style={s.coverTitle}>{data.plushieName}</Text>
              <Text style={s.coverSubtitle}>
                {cap(data.animal)} · {cap(data.size)} · {cap(data.skillLevel)}
              </Text>
            </View>
            {animalImg ? (
              <PDFImage src={animalImg} style={s.animalImage} />
            ) : (
              <View style={s.animalPlaceholder}>
                <Text style={s.animalPlaceholderText}>{cap(data.animal)} illustration</Text>
              </View>
            )}
          </View>

          {/* Materials card */}
          <View style={s.card}>
            <Text style={s.cardHeader}>Materials</Text>
            <View style={s.materialsBody}>
              {/* Left: yarn list */}
              <View style={s.matCol}>
                <Text style={s.matColLabel}>Yarn</Text>
                {data.materials.yarn.map((y, i) => (
                  <View key={i} style={s.matRow}>
                    <Text style={s.matLabel}>{y.colorName}</Text>
                    <Text style={s.matValue}>{y.label}</Text>
                  </View>
                ))}
              </View>

              <View style={s.matDivider} />

              {/* Right: hook + eyes + other */}
              <View style={s.matCol}>
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
          </View>

          {/* Finished size + skill level */}
          <View style={s.metaRow}>
            <View style={s.metaCard}>
              <Text style={s.metaLabel}>Finished Size</Text>
              <Text style={s.metaValue}>{data.finishedSize}</Text>
            </View>
            <View style={s.metaCard}>
              <Text style={s.metaLabel}>Skill Level</Text>
              <Text style={s.metaValue}>{cap(data.skillLevel)}</Text>
              <SkillStars level={data.skillLevel} />
            </View>
          </View>
        </View>
      </Page>}

      {/* ── Page 2: Abbreviations + Notes (skipped for accessory-only) */}
      {data.parts.length > 0 && <Page size="A4" style={s.page}>
        <View style={s.content}>
          <View style={s.card}>
            <Text style={s.cardHeader}>Abbreviations</Text>
            <View style={s.abbrGrid}>
              {[data.abbreviations.slice(0, 5), data.abbreviations.slice(5)].map((half, col) => (
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
          </View>

          <View style={s.card}>
            <Text style={s.cardHeader}>Notes</Text>
            {data.notes.map((n, i) => (
              <View key={i} style={s.noteRow}>
                <Text style={s.noteBullet}>•</Text>
                <Text style={s.noteText}>{n}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>}

      {/* ── Page 3+: Pattern Parts (skipped for accessory-only) ───── */}
      {data.parts.length > 0 && <Page size="A4" style={s.page}>
        <View style={s.content}>
          {data.parts.map((part, pi) => {
            const [leftRounds, rightRounds] = splitRounds(part.rounds);
            return (
              <View key={part.name}>
                {pi > 0 && <View style={s.partDivider} />}
                <View style={s.card}>
                  <Text style={s.partTitle}>{part.name}</Text>
                  {part.colorNote && (
                    <Text style={s.colorNote}>{part.colorNote}</Text>
                  )}
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
                </View>
              </View>
            );
          })}
        </View>
      </Page>}

      {/* ── Assembly (skipped for accessory-only) ──────────────────── */}
      {data.assembly.length > 0 && <Page size="A4" style={s.page}>
        <View style={s.content}>
          <View style={s.card}>
            <Text style={s.cardHeader}>Assembly</Text>
            {data.assembly.map((a, i) => (
              <View key={i} style={s.assemblyRow}>
                <Text style={s.assemblyNum}>{i + 1}.</Text>
                <Text style={s.assemblyText}>{a.step}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>}

      {/* ── Accessory Parts ────────────────────────────────────────── */}
      {data.accessoryParts && data.accessoryParts.length > 0 && (
        <Page size="A4" style={s.page}>
          <View style={s.content}>
            <Text style={[s.cardHeader, { marginBottom: 12 }]}>
              {data.accessoryName ?? "Accessory"}
            </Text>
            {data.accessoryParts.map((part, pi) => {
              const [leftRounds, rightRounds] = splitRounds(part.rounds);
              return (
                <View key={part.name}>
                  {pi > 0 && <View style={s.partDivider} />}
                  <View style={s.card}>
                    <Text style={s.partTitle}>{part.name}</Text>
                    {part.colorNote && (
                      <Text style={s.colorNote}>{part.colorNote}</Text>
                    )}
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
                  </View>
                </View>
              );
            })}
            {data.accessoryAssembly && data.accessoryAssembly.length > 0 && (
              <>
                <View style={s.partDivider} />
                <View style={s.card}>
                  <Text style={s.cardHeader}>Accessory Assembly</Text>
                  {data.accessoryAssembly.map((a, i) => (
                    <View key={i} style={s.assemblyRow}>
                      <Text style={s.assemblyNum}>{i + 1}.</Text>
                      <Text style={s.assemblyText}>{a.step}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        </Page>
      )}
    </Document>
  );
}

export async function downloadPatternPDF(data: PatternData, filename: string) {
  const blob = await pdf(<PatternDocument data={data} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function openPatternPDF(data: PatternData) {
  const blob = await pdf(<PatternDocument data={data} />).toBlob();
  const filename = data.animal
    ? `${data.plushieName}-the-${data.animal}-pattern.pdf`
    : `${data.plushieName}-pattern.pdf`;
  const file = new File([blob], filename, { type: "application/pdf" });
  const url = URL.createObjectURL(file);
  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
