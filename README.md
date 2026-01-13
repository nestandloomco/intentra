# intentra
intentra
npm install netlify-cli -g
netlify functions:create
import React, { useState } from "react";

/**
 * Lightweight, conversion-focused refactor of the Market Tool page.
 *
 * Purpose:
 * - Move the primary inputs + CTA near the top.
 * - Short, punchy hero that sparks curiosity.
 * - Compact form inside a highlighted card for quick interaction.
 * - Results show dynamically in a result card; secondary CTA appears only after results.
 *
 * Integration notes (preserve existing logic & handlers):
 * - Replace the placeholder `computeMarketScore` below with your existing scoring / AI call.
 *   e.g. import { computeMarketScore } from "../lib/market"; or call the existing submit handler.
 * - The form field names are intentionally simple (year, make, model, mileage, zip, condition).
 *   If your current form uses different names, map them in the onSubmit wrapper you attach.
 * - This component does not change any calculation. It only moves UI and copies.
 */

type VehicleInput = {
  year?: string;
  make?: string;
  model?: string;
  mileage?: string;
  zip?: string;
  condition?: "Excellent" | "Good" | "Fair" | "Poor";
};

type Props = {
  // Optional: existing submit handler that performs the real scoring / submission.
  // If provided, this component will call it and show its returned result.
  onSubmit?: (input: VehicleInput) => Promise<{ score: number; note?: string }>;
  // Optional: initial values if needed
  initial?: Partial<VehicleInput>;
};

const accent = "#FF6B35"; // example accent color (change to match brand)
const cardBg = "#ffffff";
const pageBg = "#F7F8FA";

export default function MarketCheck({ onSubmit, initial = {} }: Props) {
  const [input, setInput] = useState<VehicleInput>({
    year: initial.year ?? "",
    make: initial.make ?? "",
    model: initial.model ?? "",
    mileage: initial.mileage ?? "",
    zip: initial.zip ?? "",
    condition: (initial.condition as any) ?? "Good",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ score: number; note?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // PLACEHOLDER: keep calculations and scoring untouched.
  // Replace this with your existing compute/submit logic.
  const computeMarketScore = async (payload: VehicleInput) => {
    // Example stub: returns a score 0-100 based on mileage/year heuristics.
    // DO NOT use this for production — wire your actual logic here.
    const yearNum = Number(payload.year) || 2015;
    const mileageNum = Number(payload.mileage) || 60_000;
    const base = Math.max(0, Math.min(100, 70 - (mileageNum / 1000) * 0.5 - (2026 - yearNum) * 1.5));
    return { score: Math.round(base), note: "Sample score — replace with real calculation" };
  };

  const handleChange = (k: keyof VehicleInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setInput((s) => ({ ...s, [k]: e.target.value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const response = onSubmit ? await onSubmit(input) : await computeMarketScore(input);
      setResult(response);
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Short, punchy helper text used across the UI
  const micro = (text: string) => (
    <div style={{ fontSize: 13, color: "#6B7280", marginTop: 6 }}>{text}</div>
  );

  return (
    <div style={{ minHeight: "100vh", background: pageBg, padding: "36px 16px", fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" }}>
      {/* HERO */}
      <header style={{ maxWidth: 980, margin: "0 auto", display: "flex", gap: 24, alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 28, margin: 0, lineHeight: 1.05, color: "#111827" }}>
            Wondering how the market feels about your vehicle right now?
          </h1>
          <p style={{ margin: "10px 0 0", color: "#374151", fontSize: 15 }}>
            Quick market interest check — no pricing, no pressure.
          </p>

          <div style={{ marginTop: 18, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => {
                // Focus the first input (year) to encourage immediate action
                const el = document.querySelector<HTMLInputElement>('input[name="year"]');
                if (el) el.focus();
                window.scrollTo({ top: 240, behavior: "smooth" });
              }}
              style={{
                background: `linear-gradient(90deg, ${accent}, #FF9A66)`,
                color: "white",
                border: "none",
                padding: "10px 16px",
                borderRadius: 10,
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 6px 18px rgba(255,107,53,0.18)",
              }}
            >
              Check Market Interest
            </button>

            <button
              onClick={() => {
                // second CTA is minimal and noncommittal — opens form area
                const el = document.getElementById("quick-form");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              style={{
                background: "transparent",
                border: "1px solid rgba(17,24,39,0.06)",
                padding: "8px 12px",
                borderRadius: 8,
                color: "#374151",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Start a Quick Check
            </button>
          </div>

          {micro("Takes ~30 seconds. You’ll see a simple interest score and a short note.")}
        </div>

        {/* Accent visual — simple illustrative panel */}
        <div style={{ width: 160, height: 110, borderRadius: 12, background: `linear-gradient(135deg, rgba(255,107,53,0.12), rgba(255,154,102,0.06))`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", color: accent, fontWeight: 700 }}>
            <div style={{ fontSize: 22 }}>Market</div>
            <div style={{ fontSize: 12, marginTop: 6 }}>Interest Pulse</div>
          </div>
        </div>
      </header>

      {/* MAIN: immediate form card placed just below hero */}
      <main style={{ maxWidth: 980, margin: "22px auto 80px", display: "grid", gap: 16 }}>
        <form id="quick-form" onSubmit={handleSubmit} style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{
            flex: "1 1 560px",
            background: cardBg,
            borderRadius: 12,
            padding: 18,
            boxShadow: "0 6px 20px rgba(17,24,39,0.04)",
            border: "1px solid rgba(17,24,39,0.04)"
          }}>
            {/* Compact input grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              <input name="year" value={input.year} onChange={handleChange("year")} placeholder="Year" style={inputStyle()} />
              <input name="make" value={input.make} onChange={handleChange("make")} placeholder="Make" style={inputStyle()} />
              <input name="model" value={input.model} onChange={handleChange("model")} placeholder="Model" style={inputStyle()} />
              <input name="mileage" value={input.mileage} onChange={handleChange("mileage")} placeholder="Mileage" style={inputStyle()} />
              <input name="zip" value={input.zip} onChange={handleChange("zip")} placeholder="ZIP" style={inputStyle()} />
              <select name="condition" value={input.condition} onChange={handleChange("condition")} style={selectStyle()}>
                <option>Excellent</option>
                <option>Good</option>
                <option>Fair</option>
                <option>Poor</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 14, alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <button type="submit" disabled={loading} style={{
                  background: accent,
                  color: "white",
                  border: "none",
                  padding: "10px 14px",
                  borderRadius: 10,
                  fontWeight: 700,
                  cursor: "pointer"
                }}>
                  {loading ? "Checking..." : "Check Market Interest"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setInput({ year: "", make: "", model: "", mileage: "", zip: "", condition: "Good" });
                    setResult(null);
                    setError(null);
                  }}
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(17,24,39,0.06)",
                    padding: "8px 12px",
                    borderRadius: 8,
                    color: "#374151",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Clear
                </button>
              </div>

              <div style={{ textAlign: "right", color: "#6B7280", fontSize: 13 }}>
                <div style={{ fontWeight: 600, color: "#374151" }}>{microShort(input)}</div>
                <div style={{ marginTop: 6 }}>{micro("No sales pressure. Quick, private check.")}</div>
              </div>
            </div>
          </div>

          {/* Right column: dynamic result card (appears after submit) */}
          <div style={{ width: 320 }}>
            <div style={{ background: cardBg, borderRadius: 12, padding: 18, boxShadow: "0 6px 20px rgba(17,24,39,0.04)", minHeight: 160, border: "1px solid rgba(17,24,39,0.04)" }}>
              {!result && !loading && (
                <>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Your quick result</div>
                  <div style={{ marginTop: 8, color: "#6B7280", fontSize: 13 }}>Submit the simple details to see a short interest score and note.</div>
                </>
              )}

              {loading && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center", justifyContent: "center", height: 110 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 20, border: `4px solid ${accent}`, borderLeftColor: "rgba(0,0,0,0.06)", animation: "spin 1s linear infinite" }} />
                  <div style={{ color: "#6B7280", fontSize: 13 }}>Analyzing market signals…</div>
                </div>
              )}

              {result && !loading && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: accent }}>{result.score}</div>
                      <div style={{ fontSize: 13, color: "#374151", marginTop: 6 }}>Market Interest Score (0–100)</div>
                    </div>

                    <div style={{ background: `linear-gradient(180deg, rgba(255,107,53,0.08), rgba(255,154,102,0.03))`, padding: 8, borderRadius: 8, textAlign: "center" }}>
                      <div style={{ fontSize: 12, color: "#374151", fontWeight: 700 }}>Pulse</div>
                      <div style={{ fontSize: 12, color: "#6B7280" }}>{interpretScore(result.score)}</div>
                    </div>
                  </div>

                  <div style={{ marginTop: 12, color: "#374151", fontSize: 13 }}>
                    {result.note || "Short note about what that score means for interest and next steps."}
                  </div>

                  <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                    <button
                      onClick={() => {
                        // Secondary CTA — optional deeper dive, shown only after results.
                        // It's intentionally soft: "Want to learn more?"
                        window.alert("Show more detail / open details drawer (hook into your existing flow).");
                      }}
                      style={{
                        background: "transparent",
                        border: `1px solid ${accent}`,
                        color: accent,
                        padding: "8px 12px",
                        borderRadius: 10,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Want to learn more?
                    </button>

                    <button
                      onClick={() => {
                        // lightweight share or save action placeholder; integrate as needed
                        window.alert("Save or share this result (hook into your existing flow).");
                      }}
                      style={{
                        background: "#111827",
                        color: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: 10,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Save result
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div style={{ marginTop: 10, color: "#B91C1C", fontSize: 13 }}>{error}</div>
              )}
            </div>
          </div>
        </form>

        {/* Optional: a very short explaining row below the form — keep punchy */}
        <div style={{ maxWidth: 980, margin: "0 auto", display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ color: "#6B7280", fontSize: 13 }}>
            <strong style={{ color: "#111827" }}>Fast. Private. Exploratory.</strong> No pricing, just a sense of market interest.
          </div>

          <div style={{ color: "#9CA3AF", fontSize: 13 }}>Questions? See the results to find a next step.</div>
        </div>
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

/* Helpers for small UI snippets */
function inputStyle(): React.CSSProperties {
  return {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid rgba(17,24,39,0.06)",
    background: "#FBFDFF",
    fontSize: 14,
  };
}
function selectStyle(): React.CSSProperties {
  return {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid rgba(17,24,39,0.06)",
    background: "#FBFDFF",
    fontSize: 14,
  };
}

function interpretScore(n: number) {
  if (n >= 75) return "High interest";
  if (n >= 50) return "Moderate interest";
  if (n >= 30) return "Low interest";
  return "Limited interest";
}

function microShort(input: VehicleInput) {
  const parts = [];
  if (input.year) parts.push(input.year);
  if (input.make) parts.push(input.make);
  if (input.model) parts.push(input.model);
  return parts.length ? parts.join(" ") : "Enter year, make, model";
}

