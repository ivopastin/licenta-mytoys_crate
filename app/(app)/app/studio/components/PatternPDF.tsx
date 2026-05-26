"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import type { PatternData } from "@/lib/pattern/types";

const BG = "#2a3f4f";
const BRAND = "#417c9c";
const GOLD = "#c9a96e";
const WHITE = "#ffffff";
const CARD_RADIUS = 10;

const styles = StyleSheet.create({
  page: {
    backgroundColor: BG,
    padding: 32,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 36,
    fontFamily: "Helvetica-Bold",
    color: WHITE,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 20,
  },
  card: {
    backgroundColor: WHITE,
    borderRadius: CARD_RADIUS,
    padding: 16,
    marginBottom: 14,
  },
  cardHeader: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: BRAND,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    color: "#555",
    width: 90,
  },
  value: {
    fontSize: 11,
    color: "#1a1a1a",
    flex: 1,
  },
  twoCol: {
    flexDirection: "row",
    gap: 12,
  },
  col: {
    flex: 1,
  },
  abbr: {
    flexDirection: "row",
    marginBottom: 3,
  },
  abbrKey: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: BRAND,
    width: 42,
  },
  abbrVal: {
    fontSize: 10,
    color: "#333",
    flex: 1,
  },
  note: {
    fontSize: 10,
    color: "#444",
    marginBottom: 4,
  },
  partHeader: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: BRAND,
    marginBottom: 2,
  },
  colorNote: {
    fontSize: 10,
    color: "#888",
    fontFamily: "Helvetica-Oblique",
    marginBottom: 6,
  },
  roundRow: {
    flexDirection: "row",
    marginBottom: 3,
    alignItems: "flex-start",
  },
  roundLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: GOLD,
    width: 80,
  },
  roundInstruction: {
    fontSize: 10,
    color: "#333",
    flex: 1,
  },
  roundCount: {
    fontSize: 10,
    color: "#888",
    width: 50,
    textAlign: "right",
  },
  closingNote: {
    fontSize: 10,
    color: "#666",
    fontFamily: "Helvetica-Oblique",
    marginTop: 6,
  },
  assemblyStep: {
    flexDirection: "row",
    marginBottom: 4,
  },
  stepNum: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: BRAND,
    width: 20,
  },
  stepText: {
    fontSize: 10,
    color: "#333",
    flex: 1,
  },
  star: {
    fontSize: 13,
    color: GOLD,
  },
  starRow: {
    flexDirection: "row",
    gap: 2,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  metaCard: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: CARD_RADIUS,
    padding: 12,
    alignItems: "center",
  },
  metaLabel: {
    fontSize: 9,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
  },
});

function skillStars(level: string) {
  const count = level === "beginner" ? 1 : level === "intermediate" ? 2 : 3;
  return (
    <View style={styles.starRow}>
      {Array.from({ length: 3 }).map((_, i) => (
        <Text key={i} style={[styles.star, { color: i < count ? GOLD : "#ddd" }]}>
          ★
        </Text>
      ))}
    </View>
  );
}

function PatternDocument({ data }: { data: PatternData }) {
  const animal = data.animal.charAt(0).toUpperCase() + data.animal.slice(1);

  return (
    <Document>
      {/* Page 1 — Cover & Materials */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{data.plushieName}</Text>
        <Text style={styles.subtitle}>
          {animal} · {data.size.charAt(0).toUpperCase() + data.size.slice(1)} · {data.skillLevel.charAt(0).toUpperCase() + data.skillLevel.slice(1)}
        </Text>

        {/* Placeholder image */}
        <View
          style={{
            width: "100%",
            height: 160,
            backgroundColor: "rgba(255,255,255,0.06)",
            borderRadius: CARD_RADIUS,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.15)",
            borderStyle: "dashed",
            marginBottom: 14,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
            {data.plushieName} illustration
          </Text>
        </View>

        {/* Materials */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Materials</Text>
          <View style={styles.twoCol}>
            <View style={styles.col}>
              <Text style={[styles.label, { marginBottom: 6, fontFamily: "Helvetica-Bold", color: "#333" }]}>Yarn</Text>
              {data.materials.yarn.map((y, i) => (
                <View key={i} style={styles.row}>
                  <Text style={styles.label}>{y.colorName}</Text>
                  <Text style={styles.value}>{y.label}</Text>
                </View>
              ))}
            </View>
            <View style={styles.col}>
              <View style={styles.row}>
                <Text style={styles.label}>Hook</Text>
                <Text style={styles.value}>{data.materials.hook}</Text>
              </View>
              {data.materials.eyes && (
                <View style={styles.row}>
                  <Text style={styles.label}>Eyes</Text>
                  <Text style={styles.value}>{data.materials.eyes}</Text>
                </View>
              )}
              {data.materials.other.map((o, i) => (
                <View key={i} style={styles.row}>
                  <Text style={styles.label}>{i === 0 ? "Other" : ""}</Text>
                  <Text style={styles.value}>{o}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Finished size + skill */}
        <View style={styles.metaRow}>
          <View style={styles.metaCard}>
            <Text style={styles.metaLabel}>Finished Size</Text>
            <Text style={styles.metaValue}>{data.finishedSize}</Text>
          </View>
          <View style={styles.metaCard}>
            <Text style={styles.metaLabel}>Skill Level</Text>
            <Text style={styles.metaValue}>
              {data.skillLevel.charAt(0).toUpperCase() + data.skillLevel.slice(1)}
            </Text>
            {skillStars(data.skillLevel)}
          </View>
        </View>
      </Page>

      {/* Page 2 — Abbreviations & Notes */}
      <Page size="A4" style={styles.page}>
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Abbreviations</Text>
          <View style={styles.twoCol}>
            {[data.abbreviations.slice(0, 5), data.abbreviations.slice(5)].map((half, col) => (
              <View key={col} style={styles.col}>
                {half.map((a) => (
                  <View key={a.abbr} style={styles.abbr}>
                    <Text style={styles.abbrKey}>{a.abbr}</Text>
                    <Text style={styles.abbrVal}>{a.meaning}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeader}>Notes</Text>
          {data.notes.map((n, i) => (
            <Text key={i} style={styles.note}>• {n}</Text>
          ))}
        </View>
      </Page>

      {/* Page 3+ — Pattern Parts */}
      <Page size="A4" style={styles.page}>
        {data.parts.map((part) => (
          <View key={part.name} style={styles.card}>
            <Text style={styles.partHeader}>{part.name}</Text>
            {part.colorNote && (
              <Text style={styles.colorNote}>{part.colorNote}</Text>
            )}
            {part.rounds.map((r, i) => (
              <View key={i} style={styles.roundRow}>
                <Text style={styles.roundLabel}>{r.label}:</Text>
                <Text style={styles.roundInstruction}>{r.instruction}</Text>
                {r.stitchCount !== null && (
                  <Text style={styles.roundCount}>({r.stitchCount} sc)</Text>
                )}
              </View>
            ))}
            {part.closingNote && (
              <Text style={styles.closingNote}>{part.closingNote}</Text>
            )}
          </View>
        ))}
      </Page>

      {/* Assembly page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Assembly</Text>
          {data.assembly.map((a, i) => (
            <View key={i} style={styles.assemblyStep}>
              <Text style={styles.stepNum}>{i + 1}.</Text>
              <Text style={styles.stepText}>{a.step}</Text>
            </View>
          ))}
        </View>
      </Page>
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
