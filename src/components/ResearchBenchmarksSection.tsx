import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { Download } from 'lucide-react';
import type { ExperimentSummary } from '../types/experimentTypes';

interface ResearchBenchmarksSectionProps {
  experimentData: ExperimentSummary | null;
  liveAnalytics: {
    totalSessions: number;
    totalRecommendationsServed: number;
    meanLiveLatencyMs: number | null;
    totalFeedbackEvents: number;
    acceptanceCount: number;
    meanLiveSatisfaction: number | null;
  } | null;
}

const GENERATED_GRAPH_FILES = [
  { id: 'top1_hit_rate_comparison', title: '1. Top-1 Hit Rate Comparison (95% CI)' },
  { id: 'top3_hit_rate_comparison', title: '2. Top-3 Hit Rate Comparison (95% CI)' },
  { id: 'precision_recall_f1_comparison', title: '3. Precision@3, Recall@3 & F1@3' },
  { id: 'original_vs_improved_sankalp', title: '4. Original vs. Improved Sankalp' },
  { id: 'ablation_study', title: '5. Component Ablation Study' },
  { id: 'language_performance', title: '6. Multilingual Breakdown (EN / HI / KN)' },
  { id: 'fairness_cohort_comparison', title: '7. Geographic Cohort Fairness' },
  { id: 'latency_comparison', title: '8. Warm Inference Latency (ms)' },
  { id: 'qlearning_convergence', title: '9. 100-Epoch Q-Learning Convergence' },
];

export function ResearchBenchmarksSection({
  experimentData,
  liveAnalytics,
}: ResearchBenchmarksSectionProps) {
  const [selectedFigure, setSelectedFigure] = useState(GENERATED_GRAPH_FILES[0].id);

  if (!experimentData) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-sm text-slate-600">
          Loading measured experimental evaluation data from benchmark suite...
        </div>
      </div>
    );
  }

  const ds = experimentData.datasetStats;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Header & Scientific Integrity Notice */}
      <section className="glass-card rounded-3xl p-6 sm:p-9 space-y-4">
        <p className="font-mono text-xs font-bold uppercase tracking-wider text-teal-800">
          Phase 5 &amp; Phase 6 · Executable Empirical Evaluation
        </p>
        <h2 className="font-['Bricolage_Grotesque'] text-2xl font-extrabold text-slate-950 sm:text-3xl">
          Experimental Evaluation, Ablation Study &amp; Subgroup Fairness
        </h2>
        <p className="max-w-4xl text-[15px] leading-relaxed text-slate-600">
          All metrics and figures below are computed by executing <code className="rounded bg-teal-900/8 px-1.5 py-0.5 font-mono text-xs">npm run evaluate</code> (<code className="rounded bg-teal-900/8 px-1.5 py-0.5 font-mono text-xs">scripts/run_experiments.ts</code>) using real <code className="rounded bg-teal-900/8 px-1.5 py-0.5 font-mono text-xs">Xenova/all-MiniLM-L6-v2</code> 384-d SBERT embeddings. Because the original RVCE 160-profile Curated Ground Truth (CGT) file from IEEE Access 2025 is private, paper-reported figures and our measured open-benchmark figures are strictly separated below.
        </p>

        {/* Dataset & Live System Summary Strip */}
        <div className="grid grid-cols-2 gap-4 pt-2 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: 'Career Categories', val: ds.careerCategories },
            { label: 'Unique Keywords', val: ds.uniqueKeywords },
            { label: 'Q-Train Split', val: `N = ${ds.trainProfiles}` },
            { label: 'Held-Out Test Split', val: `N = ${ds.testProfiles}` },
            { label: "Counselor Cohen's κ", val: ds.counselorKappa.toFixed(3) },
            {
              label: 'Live User Satisfaction',
              val:
                liveAnalytics?.meanLiveSatisfaction !== null &&
                liveAnalytics?.meanLiveSatisfaction !== undefined
                  ? `${liveAnalytics.meanLiveSatisfaction.toFixed(2)} / 5`
                  : `${liveAnalytics?.totalFeedbackEvents ?? 0} Ratings`,
            },
          ].map((stat) => (
            <div key={stat.label} className="tinted-panel rounded-xl p-3.5">
              <p className="text-xs font-semibold text-slate-600">{stat.label}</p>
              <p className="mt-1 font-mono text-lg font-bold tabular-nums text-slate-950">
                {stat.val}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Recharts Comparison Row */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Measured Model Accuracy Comparison (Held-Out Test N = 160)
            </h2>
            <p className="text-xs text-slate-500">
              Top-1 Hit Rate, Top-3 Hit Rate, and F1-Score@3 (%) across identical held-out student profiles.
            </p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={experimentData.overallModels} margin={{ top: 10, right: 16, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="displayName"
                  tick={{ fontSize: 10, fill: '#334155' }}
                  interval={0}
                  angle={-12}
                  textAnchor="end"
                />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="top1HitRate" name="Top-1 (%)" fill="#0F766E" radius={[3, 3, 0, 0]} />
                <Bar dataKey="top3HitRate" name="Top-3 (%)" fill="#2563EB" radius={[3, 3, 0, 0]} />
                <Bar dataKey="f1At3" name="F1@3 (%)" fill="#7C3AED" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Q-Learning Training Convergence (Held-Out Train Split N = 80)
            </h2>
            <p className="text-xs text-slate-500">
              100 epochs, α = 0.1, γ = 0.9, linear ε decay (1.0 → 0.1) with zero test-split data leakage.
            </p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={experimentData.qLearningHistory} margin={{ top: 10, right: 16, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="epoch" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="avgReward"
                  name="Avg Shaped Reward"
                  stroke="#0F766E"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="epsilon"
                  name="Exploration ε"
                  stroke="#D97706"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* High-Resolution Generated Publication Figures Gallery (SVG + PNG) */}
      <section className="rounded-lg border border-slate-200 bg-white p-6 sm:p-8 space-y-5">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Generated Publication-Grade Research Figures (SVG &amp; PNG)
            </h2>
            <p className="text-xs text-slate-600">
              Saved automatically in <code className="font-mono">docs/results/</code> and <code className="font-mono">public/results/</code> for direct inclusion in your B.Tech Project Report and Viva slides.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`/results/${selectedFigure}.png`}
              download={`${selectedFigure}.png`}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download PNG</span>
            </a>
            <a
              href={`/results/${selectedFigure}.svg`}
              download={`${selectedFigure}.svg`}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download SVG</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4 space-y-1.5">
            {GENERATED_GRAPH_FILES.map((gf) => (
              <button
                key={gf.id}
                type="button"
                onClick={() => setSelectedFigure(gf.id)}
                className={`w-full rounded-md border px-3.5 py-2.5 text-left text-xs font-medium transition-colors ${
                  selectedFigure === gf.id
                    ? 'border-teal-700 bg-teal-50 text-teal-900 font-semibold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {gf.title}
              </button>
            ))}
          </div>

          <div className="lg:col-span-8 rounded-lg border border-slate-200 bg-slate-50 p-4 flex items-center justify-center">
            <img
              src={`/results/${selectedFigure}.svg`}
              alt={selectedFigure}
              className="max-h-[480px] w-auto rounded bg-white shadow-xs"
            />
          </div>
        </div>
      </section>

      {/* Table 1: Measured Benchmark Results vs. Table 2: Paper-Reported Results */}
      <section className="rounded-lg border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Table A: Measured Experimental Results on Stratified Open Benchmark (Held-Out Test N = 160)
          </h2>
          <p className="text-xs text-slate-600">
            Evaluated on identical held-out student profiles across 4 academic stages, 3 languages, 3 geographic cohorts, and 30% incomplete/borderline edge profiles.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <th className="p-3 font-semibold">Model Configuration</th>
                <th className="p-3 font-semibold">Top-1 Hit Rate (95% CI)</th>
                <th className="p-3 font-semibold">Top-3 Hit Rate (95% CI)</th>
                <th className="p-3 font-semibold">Precision@3</th>
                <th className="p-3 font-semibold">Recall@3</th>
                <th className="p-3 font-semibold">F1@3</th>
                <th className="p-3 font-semibold">MRR</th>
                <th className="p-3 font-semibold">Latency (ms)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono tabular-nums">
              {experimentData.overallModels.map((m) => {
                const isProposed = m.model === 'improved_sankalp';
                return (
                  <tr key={m.model} className={isProposed ? 'bg-teal-50/40 font-semibold' : ''}>
                    <td className="p-3 font-sans text-slate-900">{m.displayName}</td>
                    <td className="p-3 text-slate-900">
                      {m.top1HitRate.toFixed(2)}% [{m.top1CI95[0]}, {m.top1CI95[1]}]
                    </td>
                    <td className="p-3 text-slate-900">
                      {m.top3HitRate.toFixed(2)}% [{m.top3CI95[0]}, {m.top3CI95[1]}]
                    </td>
                    <td className="p-3 text-slate-700">{m.precisionAt3.toFixed(2)}%</td>
                    <td className="p-3 text-slate-700">{m.recallAt3.toFixed(2)}%</td>
                    <td className="p-3 text-slate-700">{m.f1At3.toFixed(2)}%</td>
                    <td className="p-3 text-slate-700">{m.mrr.toFixed(4)}</td>
                    <td className="p-3 text-slate-700">
                      {m.meanLatencyMs.toFixed(2)} ± {m.stdLatencyMs.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Paper Reference Table */}
        <div className="pt-4 space-y-3 border-t border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Table B: Reference Baseline Results Reported in IEEE Access Paper (Table 5, RVCE Private CGT Dataset)
            </h3>
            <p className="text-xs text-slate-500">
              Included strictly as published literature reference from Nandi et al. (2025) — never conflated with our open-benchmark runs above.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="p-3 font-semibold">IEEE Paper Configuration</th>
                  <th className="p-3 font-semibold">Paper Top-1 (%)</th>
                  <th className="p-3 font-semibold">Paper Top-3 (%)</th>
                  <th className="p-3 font-semibold">Reported User Satisfaction</th>
                  <th className="p-3 font-semibold">Dataset &amp; Latency Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {experimentData.paperReportedBaselines.map((pr) => (
                  <tr key={pr.configuration}>
                    <td className="p-3 font-medium text-slate-900">{pr.configuration}</td>
                    <td className="p-3 font-mono tabular-nums text-slate-800">{pr.paperTop1.toFixed(1)}%</td>
                    <td className="p-3 font-mono tabular-nums text-slate-800">{pr.paperTop3.toFixed(1)}%</td>
                    <td className="p-3 font-mono tabular-nums text-slate-700">{pr.paperUserSatisfaction}</td>
                    <td className="p-3 text-slate-600">{pr.paperNotes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Subgroup Tables: Ablation + Multilingual + Completeness + Fairness */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Ablation Table */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 space-y-3">
          <h3 className="text-base font-bold text-slate-900">
            Table C: Component Ablation Study (N = 160)
          </h3>
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <th className="p-2.5 font-semibold">Variant</th>
                <th className="p-2.5 font-semibold">Top-1 (%)</th>
                <th className="p-2.5 font-semibold">Top-3 (%)</th>
                <th className="p-2.5 font-semibold">MRR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono tabular-nums">
              {experimentData.ablationRows.map((a) => (
                <tr key={a.model}>
                  <td className="p-2.5 font-sans text-slate-800">{a.displayName}</td>
                  <td className="p-2.5 text-slate-900">{a.top1HitRate.toFixed(2)}%</td>
                  <td className="p-2.5 text-slate-900">{a.top3HitRate.toFixed(2)}%</td>
                  <td className="p-2.5 text-slate-700">{a.mrr.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Multilingual Breakdown */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 space-y-3">
          <h3 className="text-base font-bold text-slate-900">
            Table D: Language-Wise Performance (EN / HI / KN)
          </h3>
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <th className="p-2.5 font-semibold">Language</th>
                <th className="p-2.5 font-semibold">Orig Top-1</th>
                <th className="p-2.5 font-semibold">Imp Top-1</th>
                <th className="p-2.5 font-semibold">Gain (Δ)</th>
                <th className="p-2.5 font-semibold">Imp Top-3</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono tabular-nums">
              {experimentData.languageBreakdown.map((l) => (
                <tr key={l.groupKey}>
                  <td className="p-2.5 font-sans text-slate-800">
                    {l.groupLabel} (n={l.count})
                  </td>
                  <td className="p-2.5 text-slate-700">{l.originalTop1.toFixed(2)}%</td>
                  <td className="p-2.5 font-semibold text-teal-800">{l.improvedTop1.toFixed(2)}%</td>
                  <td className="p-2.5 text-teal-700">
                    {l.deltaTop1 >= 0 ? `+${l.deltaTop1.toFixed(2)}%` : `${l.deltaTop1.toFixed(2)}%`}
                  </td>
                  <td className="p-2.5 text-slate-900">{l.improvedTop3.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Incomplete & Borderline Profile Robustness */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 space-y-3">
          <h3 className="text-base font-bold text-slate-900">
            Table E: Incomplete &amp; Borderline Profile Robustness
          </h3>
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <th className="p-2.5 font-semibold">Profile Condition</th>
                <th className="p-2.5 font-semibold">Orig Top-1</th>
                <th className="p-2.5 font-semibold">Imp Top-1</th>
                <th className="p-2.5 font-semibold">Orig Top-3</th>
                <th className="p-2.5 font-semibold">Imp Top-3</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono tabular-nums">
              {experimentData.completenessBreakdown.map((c) => (
                <tr key={c.groupKey}>
                  <td className="p-2.5 font-sans text-slate-800">
                    {c.groupLabel} (n={c.count})
                  </td>
                  <td className="p-2.5 text-slate-700">{c.originalTop1.toFixed(2)}%</td>
                  <td className="p-2.5 font-semibold text-teal-800">{c.improvedTop1.toFixed(2)}%</td>
                  <td className="p-2.5 text-slate-700">{c.originalTop3.toFixed(2)}%</td>
                  <td className="p-2.5 font-semibold text-teal-800">{c.improvedTop3.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Geographic Cohort Fairness */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 space-y-3">
          <div className="flex items-baseline justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Table F: Geographic Cohort Fairness
            </h3>
            <span className="font-mono text-xs text-teal-800">
              Top-1 Parity Gap: {experimentData.cohortFairness.originalParityGapTop1.toFixed(1)}% →{' '}
              {experimentData.cohortFairness.improvedParityGapTop1.toFixed(1)}%
            </span>
          </div>
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <th className="p-2.5 font-semibold">Cohort</th>
                <th className="p-2.5 font-semibold">Orig Top-1</th>
                <th className="p-2.5 font-semibold">Imp Top-1</th>
                <th className="p-2.5 font-semibold">Orig Top-3</th>
                <th className="p-2.5 font-semibold">Imp Top-3</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono tabular-nums">
              {experimentData.cohortFairness.rows.map((r) => (
                <tr key={r.groupKey}>
                  <td className="p-2.5 font-sans text-slate-800">
                    {r.groupLabel} (n={r.count})
                  </td>
                  <td className="p-2.5 text-slate-700">{r.originalTop1.toFixed(2)}%</td>
                  <td className="p-2.5 font-semibold text-teal-800">{r.improvedTop1.toFixed(2)}%</td>
                  <td className="p-2.5 text-slate-700">{r.originalTop3.toFixed(2)}%</td>
                  <td className="p-2.5 font-semibold text-teal-800">{r.improvedTop3.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
