import React, { useEffect, useMemo, useRef, useState } from "react";

/*
  LoveSync — Mobile-first React single-file app
  - Tailwind CSS utility classes (assumed present in the host project)
  - Uses recharts for RadarChart (install: recharts)
  - Exports a therapist-ready report (html2canvas + jspdf recommended)

  Default export = LoveSyncApp component
*/

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

const LABELS = [
  { short: "Words", full: "Words of Affirmation" },
  { short: "Acts", full: "Acts of Service" },
  { short: "Gifts", full: "Receiving Gifts" },
  { short: "Time", full: "Quality Time" },
  { short: "Touch", full: "Physical Touch" },
];

const DEFAULT_SCORE = 5;

function makeDefault() {
  return LABELS.map(() => ({ rec: DEFAULT_SCORE, give: DEFAULT_SCORE }));
}

function clamp(n, a = 0, b = 10) {
  return Math.max(a, Math.min(b, n));
}

export default function LoveSyncApp() {
  const [mode, setMode] = useState("solo"); // "solo" | "couple"
  const [activePerson, setActivePerson] = useState("A"); // A or B (for couple mobile flow)

  // Data structures: arrays of {rec, give} for each language
  const [solo, setSolo] = useState(makeDefault());
  const [pA, setPA] = useState(makeDefault());
  const [pB, setPB] = useState(makeDefault());

  const reportRef = useRef(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    // keep active person sensible on mode change
    if (mode === "solo") setActivePerson("A");
  }, [mode]);

  const current = useMemo(() => {
    if (mode === "solo") return solo;
    return activePerson === "A" ? pA : pB;
  }, [mode, activePerson, solo, pA, pB]);

  const setCurrent = (updater) => {
    if (mode === "solo") setSolo((s) => updater(s));
    else if (activePerson === "A") setPA((s) => updater(s));
    else setPB((s) => updater(s));
  };

  // Recharts wants data in a map with name + values
  const chartData = useMemo(() => {
    const arr = current.map((d, i) => ({
      subject: LABELS[i].short,
      Receive: d.rec,
      Give: d.give,
      full: LABELS[i].full,
    }));
    return arr;
  }, [current]);

  function updateScore(index, type, value) {
    const v = clamp(Number(value));
    setCurrent((prev) => {
      const next = prev.map((it, i) => (i === index ? { ...it, [type]: v } : it));
      return next;
    });
  }

  // Couple insights (therapist-ready)
  const coupleInsights = useMemo(() => {
    if (mode !== "couple") return null;
    // compute mismatches and strengths
    const gaps = LABELS.map((_, i) => {
      const gap = Math.abs(pA[i].give - pB[i].rec);
      return { i, gap, aGive: pA[i].give, bRec: pB[i].rec };
    });

    const maxGap = gaps.reduce((acc, g) => (g.gap > acc.gap ? g : acc), { gap: -1 });

    const mutual = LABELS.map((_, i) => ({
      i,
      score: Math.min(pA[i].give, pB[i].rec),
    })).sort((a, b) => b.score - a.score)[0];

    const unmet = [];
    LABELS.forEach((_, i) => {
      if (pA[i].give <= 3 && pB[i].rec >= 7) unmet.push(`B needs ${LABELS[i].full} (${pB[i].rec}), A gives ${pA[i].give}`);
      if (pB[i].give <= 3 && pA[i].rec >= 7) unmet.push(`A needs ${LABELS[i].full} (${pA[i].rec}), B gives ${pB[i].give}`);
    });

    const blind = [];
    LABELS.forEach((_, i) => {
      if (pA[i].give >= 7 && pB[i].rec <= 3) blind.push(`A gives a lot of ${LABELS[i].full}, B doesn't value it`);
      if (pB[i].give >= 7 && pA[i].rec <= 3) blind.push(`B gives a lot of ${LABELS[i].full}, A doesn't value it`);
    });

    return {
      maxGap,
      mutual: mutual ? { i: mutual.i, score: mutual.score } : null,
      unmet,
      blind,
    };
  }, [pA, pB, mode]);

  function resetAll() {
    setSolo(makeDefault());
    setPA(makeDefault());
    setPB(makeDefault());
  }

  async function exportReportPDF() {
    // Basic implementation suggestion: use html2canvas + jspdf
    // This function assumes those libraries are loaded in the app/build.
    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).jsPDF;
      const node = reportRef.current;
      if (!node) return;
      const canvas = await html2canvas(node, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: [canvas.width, canvas.height] });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`LoveSync_report_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (e) {
      // graceful fallback: open print dialog
      console.error("Export failed", e);
      window.print();
    }
  }

  // Small helper to render slider rows
  function SliderRow({ i }) {
    const item = current[i];
    return (
      <div className="flex items-center gap-3 py-2">
        <div className="flex-1">
          <div className="text-sm font-semibold">{LABELS[i].full}</div>
          <div className="text-xs text-muted-foreground">Receiving: {item.rec} · Giving: {item.give}</div>
        </div>
        <div className="w-36">
          <label className="block text-[10px] mb-1">Rec</label>
          <input
            aria-label={`Receiving ${LABELS[i].full}`}
            className="w-full h-2 appearance-none rounded-lg bg-slate-200 dark:bg-slate-700"
            type="range"
            min={0}
            max={10}
            value={item.rec}
            onChange={(e) => updateScore(i, "rec", e.target.value)}
          />
          <label className="block text-[10px] mt-1">Give</label>
          <input
            aria-label={`Giving ${LABELS[i].full}`}
            className="w-full h-2 mt-1 appearance-none rounded-lg bg-slate-200 dark:bg-slate-700"
            type="range"
            min={0}
            max={10}
            value={item.give}
            onChange={(e) => updateScore(i, "give", e.target.value)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-4 sm:p-6">
      <header className="max-w-xl mx-auto">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-xl font-bold">LoveSync</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setMode("solo")}
              className={`px-3 py-1 rounded-md font-semibold ${mode === "solo" ? "bg-indigo-600 text-white" : "bg-white/60 dark:bg-slate-700"}`}>
              Solo
            </button>
            <button
              onClick={() => setMode("couple")}
              className={`px-3 py-1 rounded-md font-semibold ${mode === "couple" ? "bg-indigo-600 text-white" : "bg-white/60 dark:bg-slate-700"}`}>
              Couple
            </button>
          </div>
        </div>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Mobile-first UI — Therapist-ready report. Tap sliders, preview chart, and generate exportable summary.</p>
      </header>

      <main className="max-w-xl mx-auto mt-4 space-y-4">
        {/* Mode specific top controls */}
        {mode === "couple" && (
          <div className="flex items-center gap-3">
            <button
              className={`flex-1 py-2 rounded-md ${activePerson === "A" ? "bg-emerald-500 text-white" : "bg-white/60 dark:bg-slate-700"}`}
              onClick={() => setActivePerson("A")}
            >
              Partner A
            </button>
            <button
              className={`flex-1 py-2 rounded-md ${activePerson === "B" ? "bg-emerald-500 text-white" : "bg-white/60 dark:bg-slate-700"}`}
              onClick={() => setActivePerson("B")}
            >
              Partner B
            </button>
            <button
              className="px-3 py-2 rounded-md bg-white/60 dark:bg-slate-700"
              onClick={() => { setActivePerson((p) => (p === "A" ? "B" : "A")); }}
              aria-label="Switch partner"
            >
              Switch
            </button>
          </div>
        )}

        <section className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">{mode === "solo" ? "Your Love Profile" : `Partner ${activePerson}`}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Slide to set how you receive and give love (0–10)</p>
            </div>
            <div className="w-28 h-20">
              <ResponsiveContainer width="100%" height={80}>
                <RadarChart cx="50%" cy="50%" outerRadius={30} data={chartData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} />
                  <Radar name="Receive" dataKey="Receive" stroke="#2563eb" fill="#2563eb" fillOpacity={0.2} />
                  <Radar name="Give" dataKey="Give" stroke="#16a34a" fill="#16a34a" fillOpacity={0.15} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-3 space-y-2">
            {current.map((_, i) => (
              <SliderRow key={i} i={i} />
            ))}
          </div>
        </section>

        {/* Quick summary cards */}
        <section className="grid grid-cols-1 gap-3">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Snapshot</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Highest need & top strength</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">
                  {/* Highest receiving */}
                  {(() => {
                    const recIdx = current.reduce((acc, cur, i) => (cur.rec > current[acc].rec ? i : acc), 0);
                    const giveIdx = current.reduce((acc, cur, i) => (cur.give > current[acc].give ? i : acc), 0);
                    return `${LABELS[recIdx].short} needs ${current[recIdx].rec} · Gives most in ${LABELS[giveIdx].short} (${current[giveIdx].give})`;
                  })()}
                </div>
              </div>
            </div>
          </div>

          {mode === "couple" && (
            <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl p-3 shadow-sm">
              <div className="text-sm font-medium">Couple Insights</div>
              <div className="text-xs mt-2 text-slate-600 dark:text-slate-300">
                {coupleInsights && (
                  <>
                    <div className="text-sm">{coupleInsights.maxGap.gap > 3 ? (
                      <span className="font-semibold">Love Gap:</span>
                    ) : (
                      <span className="font-semibold text-green-700">Good alignment</span>
                    )} {LABELS[coupleInsights.maxGap.i].full} {coupleInsights.maxGap.gap > 3 ? `(gap ${coupleInsights.maxGap.gap})` : ''}</div>

                    {coupleInsights.unmet.length > 0 && (
                      <ul className="mt-2 list-disc list-inside text-xs">
                        {coupleInsights.unmet.map((u, j) => <li key={j}>{u}</li>)}
                      </ul>
                    )}

                    {coupleInsights.blind.length > 0 && (
                      <div className="mt-2 text-xs">Blind spots: {coupleInsights.blind.join('; ')}</div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Controls */}
        <div className="flex gap-3">
          <button
            onClick={() => setReportOpen(true)}
            className="flex-1 bg-indigo-600 text-white py-2 rounded-md font-semibold"
          >
            Generate Report
          </button>
          <button
            onClick={resetAll}
            className="px-3 py-2 rounded-md bg-white/60 dark:bg-slate-700"
          >
            Reset
          </button>
        </div>

        {/* Report Modal / Panel (printable) */}
        {reportOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={() => setReportOpen(false)} />
            <div ref={reportRef} className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-auto p-5 z-10">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold">Therapist Report</h3>
                  <div className="text-xs text-slate-600 dark:text-slate-300">{new Date().toLocaleString()}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setReportOpen(false)} className="px-3 py-1 rounded bg-white/60 dark:bg-slate-700">Close</button>
                  <button onClick={exportReportPDF} className="px-3 py-1 rounded bg-emerald-500 text-white">Export</button>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                {/* Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                    <div className="text-sm font-semibold">Mode</div>
                    <div className="text-xs mt-1">{mode === 'solo' ? 'Solo' : 'Couple'}</div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                    <div className="text-sm font-semibold">Active</div>
                    <div className="text-xs mt-1">{mode === 'solo' ? 'Participant' : `Partner ${activePerson}`}</div>
                  </div>
                </div>

                {/* Detailed cards */}
                <div className="space-y-3">
                  {mode === 'solo' ? (
                    <ProfileCards data={solo} title="Your Profile" notes={notes} />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <ProfileCards data={pA} title="Partner A" />
                      <ProfileCards data={pB} title="Partner B" />
                    </div>
                  )}
                </div>

                {/* Therapist prompts + notes */}
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10">
                  <div className="text-sm font-semibold">Discussion Prompts</div>
                  <ul className="mt-2 text-xs list-disc list-inside">
                    <li>When were you last feeling truly seen by your partner?</li>
                    <li>What small, concrete action would increase your sense of being loved?</li>
                    <li>Is there a language your partner uses that feels wasted or not received?</li>
                  </ul>

                  <div className="mt-3">
                    <label className="block text-xs font-medium">Session Notes (optional)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="mt-1 w-full rounded-md p-2 bg-white/80 dark:bg-slate-700 text-xs"
                      rows={4}
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        <footer className="text-center text-xs text-slate-400 mt-6">Designed for therapists & couples — mobile-first. Exportable, printable, and private.</footer>
      </main>
    </div>
  );
}


/* ------------------ Helper components ------------------ */

function ProfileCards({ data, title }) {
  return (
    <div>
      <div className="text-sm font-semibold mb-2">{title}</div>
      <div className="space-y-2">
        {data.map((d, i) => (
          <div key={i} className={`p-3 rounded-md border-l-4 ${scoreClass(d.rec)} bg-white/50 dark:bg-slate-900` }>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{LABELS[i].full}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Receive {d.rec} · Give {d.give}</div>
              </div>
              <div className="text-xs text-right">
                <div>{langObservation(i, d.rec, true)}</div>
                <div className="mt-1 text-muted-foreground text-[11px]">{langObservation(i, d.give, false)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function scoreClass(score) {
  // This generates a small tailwind border color class depending on score
  // We'll return a fallback set (these rely on common tailwind colors)
  if (score >= 7) return "border-emerald-400";
  if (score >= 4) return "border-amber-400";
  return "border-rose-400";
}

function langObservation(index, score, isReceive) {
  // empathetic, concise text for report
  const full = LABELS[index].full;
  if (isReceive) {
    if (score >= 7) return `${full}: High need for this connection.`;
    if (score >= 4) return `${full}: Moderate preference.`;
    return `${full}: Low need — emotionally independent in this area.`;
  } else {
    if (score >= 7) return `${full}: Frequently expressed.`;
    if (score >= 4) return `${full}: Sometimes shown.`;
    return `${full}: Rarely used as primary expression.`;
  }
}
