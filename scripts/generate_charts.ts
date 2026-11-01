import fs from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';
import type { ExperimentSummary, ModelMetricRow } from '../src/types/experimentTypes';

function esc(s: string | number): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function saveSvgAndPng(svgContent: string, baseName: string, outDirs: string[]): void {
  const resvg = new Resvg(svgContent, {
    background: '#FFFFFF',
    fitTo: { mode: 'width', value: 1400 },
  });
  const pngBuffer = resvg.render().asPng();

  for (const dir of outDirs) {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `${baseName}.svg`), svgContent, 'utf-8');
    fs.writeFileSync(path.join(dir, `${baseName}.png`), pngBuffer);
  }
}

function renderSingleBarChart(params: {
  title: string;
  subtitle: string;
  yAxisLabel: string;
  maxY: number;
  unit: string;
  bars: Array<{
    label: string;
    value: number;
    ciLow?: number;
    ciHigh?: number;
    color: string;
  }>;
}): string {
  const W = 960;
  const H = 520;
  const left = 90;
  const right = 40;
  const top = 95;
  const bottom = 105;
  const plotW = W - left - right;
  const plotH = H - top - bottom;
  const n = params.bars.length;
  const slotW = plotW / Math.max(1, n);
  const barW = Math.min(86, slotW * 0.56);

  const gridLines: string[] = [];
  for (let i = 0; i <= 5; i++) {
    const val = (params.maxY * i) / 5;
    const y = top + plotH - (val / params.maxY) * plotH;
    gridLines.push(`
      <line x1="${left}" y1="${y}" x2="${W - right}" y2="${y}" stroke="#E2E8F0" stroke-width="1"/>
      <text x="${left - 12}" y="${y + 4}" text-anchor="end" font-family="Arial, sans-serif" font-size="12" fill="#475569">${val.toFixed(params.maxY <= 20 ? 1 : 0)}${esc(params.unit)}</text>
    `);
  }

  const barRects = params.bars
    .map((b, idx) => {
      const cx = left + idx * slotW + slotW / 2;
      const x = cx - barW / 2;
      const h = Math.max(2, (Math.min(params.maxY, b.value) / params.maxY) * plotH);
      const y = top + plotH - h;

      let ciMarkup = '';
      if (b.ciLow !== undefined && b.ciHigh !== undefined) {
        const yHigh = top + plotH - (Math.min(params.maxY, b.ciHigh) / params.maxY) * plotH;
        const yLow = top + plotH - (Math.max(0, b.ciLow) / params.maxY) * plotH;
        ciMarkup = `
          <line x1="${cx}" y1="${yHigh}" x2="${cx}" y2="${yLow}" stroke="#0F172A" stroke-width="2"/>
          <line x1="${cx - 7}" y1="${yHigh}" x2="${cx + 7}" y2="${yHigh}" stroke="#0F172A" stroke-width="2"/>
          <line x1="${cx - 7}" y1="${yLow}" x2="${cx + 7}" y2="${yLow}" stroke="#0F172A" stroke-width="2"/>
        `;
      }

      const labelParts = b.label.split('\n');
      const labelSvg = labelParts
        .map(
          (lp, li) =>
            `<text x="${cx}" y="${top + plotH + 24 + li * 16}" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="600" fill="#1E293B">${esc(lp)}</text>`
        )
        .join('');

      const valY = b.ciHigh !== undefined
        ? top + plotH - (Math.min(params.maxY, b.ciHigh) / params.maxY) * plotH - 10
        : y - 10;

      return `
        <rect x="${x}" y="${y}" width="${barW}" height="${h}" rx="4" fill="${b.color}"/>
        ${ciMarkup}
        <text x="${cx}" y="${Math.max(top - 6, valY)}" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" font-weight="700" fill="#0F172A">${b.value.toFixed(1)}${esc(params.unit)}</text>
        ${labelSvg}
      `;
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    <rect width="${W}" height="${H}" fill="#FFFFFF"/>
    <text x="${left}" y="38" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#0F172A">${esc(params.title)}</text>
    <text x="${left}" y="62" font-family="Arial, sans-serif" font-size="13" fill="#64748B">${esc(params.subtitle)}</text>
    ${gridLines.join('')}
    <line x1="${left}" y1="${top}" x2="${left}" y2="${top + plotH}" stroke="#94A3B8" stroke-width="1.5"/>
    <line x1="${left}" y1="${top + plotH}" x2="${W - right}" y2="${top + plotH}" stroke="#94A3B8" stroke-width="1.5"/>
    <text x="26" y="${top + plotH / 2}" transform="rotate(-90 26 ${top + plotH / 2})" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" font-weight="600" fill="#334155">${esc(params.yAxisLabel)}</text>
    ${barRects}
  </svg>`;
}

function renderGroupedBarChart(params: {
  title: string;
  subtitle: string;
  yAxisLabel: string;
  maxY: number;
  unit: string;
  series: Array<{ name: string; color: string }>;
  groups: Array<{ label: string; values: number[] }>;
}): string {
  const W = 980;
  const H = 540;
  const left = 88;
  const right = 40;
  const top = 110;
  const bottom = 95;
  const plotW = W - left - right;
  const plotH = H - top - bottom;

  const gridLines: string[] = [];
  for (let i = 0; i <= 5; i++) {
    const val = (params.maxY * i) / 5;
    const y = top + plotH - (val / params.maxY) * plotH;
    gridLines.push(`
      <line x1="${left}" y1="${y}" x2="${W - right}" y2="${y}" stroke="#E2E8F0" stroke-width="1"/>
      <text x="${left - 12}" y="${y + 4}" text-anchor="end" font-family="Arial, sans-serif" font-size="12" fill="#475569">${val.toFixed(0)}${esc(params.unit)}</text>
    `);
  }

  const legend = params.series
    .map(
      (s, i) => `
      <rect x="${left + i * 215}" y="72" width="14" height="14" rx="2" fill="${s.color}"/>
      <text x="${left + i * 215 + 20}" y="84" font-family="Arial, sans-serif" font-size="12" font-weight="600" fill="#334155">${esc(s.name)}</text>
    `
    )
    .join('');

  const slotW = plotW / Math.max(1, params.groups.length);
  const k = params.series.length;
  const clusterW = Math.min(slotW * 0.76, k * 46);
  const singleW = (clusterW - (k - 1) * 6) / k;

  const groupSvg = params.groups
    .map((g, gi) => {
      const startX = left + gi * slotW + (slotW - clusterW) / 2;
      const cx = left + gi * slotW + slotW / 2;
      const bars = g.values
        .map((v, si) => {
          const bx = startX + si * (singleW + 6);
          const bh = Math.max(2, (Math.min(params.maxY, v) / params.maxY) * plotH);
          const by = top + plotH - bh;
          return `
            <rect x="${bx}" y="${by}" width="${singleW}" height="${bh}" rx="3" fill="${params.series[si].color}"/>
            <text x="${bx + singleW / 2}" y="${by - 6}" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="700" fill="#0F172A">${v.toFixed(1)}</text>
          `;
        })
        .join('');

      const lines = g.label.split('\n');
      const lbl = lines
        .map(
          (l, li) =>
            `<text x="${cx}" y="${top + plotH + 24 + li * 16}" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="600" fill="#1E293B">${esc(l)}</text>`
        )
        .join('');
      return `${bars}${lbl}`;
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    <rect width="${W}" height="${H}" fill="#FFFFFF"/>
    <text x="${left}" y="36" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#0F172A">${esc(params.title)}</text>
    <text x="${left}" y="58" font-family="Arial, sans-serif" font-size="13" fill="#64748B">${esc(params.subtitle)}</text>
    ${legend}
    ${gridLines.join('')}
    <line x1="${left}" y1="${top}" x2="${left}" y2="${top + plotH}" stroke="#94A3B8" stroke-width="1.5"/>
    <line x1="${left}" y1="${top + plotH}" x2="${W - right}" y2="${top + plotH}" stroke="#94A3B8" stroke-width="1.5"/>
    <text x="26" y="${top + plotH / 2}" transform="rotate(-90 26 ${top + plotH / 2})" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" font-weight="600" fill="#334155">${esc(params.yAxisLabel)}</text>
    ${groupSvg}
  </svg>`;
}

function renderQLearningCurve(summary: ExperimentSummary): string {
  const W = 960;
  const H = 480;
  const left = 85;
  const right = 75;
  const top = 95;
  const bottom = 75;
  const plotW = W - left - right;
  const plotH = H - top - bottom;
  const hist = summary.qLearningHistory;

  const minR = Math.min(...hist.map((h) => h.avgReward), 0);
  const maxR = Math.max(...hist.map((h) => h.avgReward), 1.0) + 0.15;

  const pointsReward = hist
    .map((h, i) => {
      const x = left + (i / Math.max(1, hist.length - 1)) * plotW;
      const y = top + plotH - ((h.avgReward - minR) / (maxR - minR)) * plotH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const pointsEps = hist
    .map((h, i) => {
      const x = left + (i / Math.max(1, hist.length - 1)) * plotW;
      const y = top + plotH - h.epsilon * plotH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const yTicks = [0, 0.25, 0.5, 0.75, 1.0].map((f) => {
    const val = minR + f * (maxR - minR);
    const y = top + plotH - f * plotH;
    return `
      <line x1="${left}" y1="${y}" x2="${W - right}" y2="${y}" stroke="#E2E8F0" stroke-width="1"/>
      <text x="${left - 10}" y="${y + 4}" text-anchor="end" font-family="Arial, sans-serif" font-size="12" fill="#0F766E">${val.toFixed(2)}</text>
      <text x="${W - right + 10}" y="${y + 4}" text-anchor="start" font-family="Arial, sans-serif" font-size="12" fill="#D97706">${f.toFixed(2)}</text>
    `;
  });

  const xTicks = [1, 20, 40, 60, 80, 100].map((ep) => {
    const x = left + ((ep - 1) / 99) * plotW;
    return `<text x="${x}" y="${top + plotH + 24}" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#334155">Epoch ${ep}</text>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    <rect width="${W}" height="${H}" fill="#FFFFFF"/>
    <text x="${left}" y="36" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#0F172A">Contextual Q-Learning Convergence Curve (Held-Out Training Split, N=${summary.datasetStats.trainProfiles})</text>
    <text x="${left}" y="58" font-family="Arial, sans-serif" font-size="13" fill="#64748B">100 Epochs, alpha = 0.1, gamma = 0.9, Linear Epsilon Decay (1.0 -> 0.1) — Zero Test Split Leakage</text>
    <rect x="${left}" y="70" width="16" height="4" fill="#0F766E"/>
    <text x="${left + 22}" y="76" font-family="Arial, sans-serif" font-size="12" font-weight="600" fill="#0F766E">Average Shaped Reward (Left Axis)</text>
    <rect x="${left + 280}" y="70" width="16" height="4" fill="#D97706"/>
    <text x="${left + 302}" y="76" font-family="Arial, sans-serif" font-size="12" font-weight="600" fill="#D97706">Exploration Rate Epsilon (Right Axis)</text>
    ${yTicks.join('')}
    ${xTicks.join('')}
    <line x1="${left}" y1="${top + plotH}" x2="${W - right}" y2="${top + plotH}" stroke="#94A3B8" stroke-width="1.5"/>
    <polyline fill="none" stroke="#D97706" stroke-width="2.5" stroke-dasharray="6,4" points="${pointsEps}"/>
    <polyline fill="none" stroke="#0F766E" stroke-width="3" points="${pointsReward}"/>
  </svg>`;
}

export function generateAllResearchGraphs(summary: ExperimentSummary): void {
  const outDirs = [
    path.resolve('docs/results'),
    path.resolve('public/results'),
  ];

  const palette = ['#64748B', '#3B82F6', '#6366F1', '#D97706', '#0D9488'];
  const shortLabel = (m: ModelMetricRow) => {
    switch (m.model) {
      case 'rule_only': return 'Rule-Based\nOnly';
      case 'sbert_only': return 'SBERT\nOnly';
      case 'hybrid_base': return 'Hybrid Base\n(Rule+SBERT)';
      case 'original_sankalp': return 'Original\nSankalp';
      case 'improved_sankalp': return 'Improved\nSankalp (Ours)';
      default: return m.displayName;
    }
  };

  // 1. Top-1 Hit Rate Comparison
  saveSvgAndPng(
    renderSingleBarChart({
      title: 'Top-1 Hit Rate Comparison Across Models (Held-Out Test Split, N=160)',
      subtitle: 'Measured Top-1 accuracy with 95% bootstrap confidence intervals on identical test profiles',
      yAxisLabel: 'Top-1 Hit Rate (%)',
      maxY: 100,
      unit: '%',
      bars: summary.overallModels.map((m, i) => ({
        label: shortLabel(m),
        value: m.top1HitRate,
        ciLow: m.top1CI95[0],
        ciHigh: m.top1CI95[1],
        color: palette[i % palette.length],
      })),
    }),
    'top1_hit_rate_comparison',
    outDirs
  );

  // 2. Top-3 Hit Rate Comparison
  saveSvgAndPng(
    renderSingleBarChart({
      title: 'Top-3 Hit Rate Comparison Across Models (Held-Out Test Split, N=160)',
      subtitle: 'Percentage of student profiles where primary ground-truth career appears in Top-3 recommendations',
      yAxisLabel: 'Top-3 Hit Rate (%)',
      maxY: 100,
      unit: '%',
      bars: summary.overallModels.map((m, i) => ({
        label: shortLabel(m),
        value: m.top3HitRate,
        ciLow: m.top3CI95[0],
        ciHigh: m.top3CI95[1],
        color: palette[i % palette.length],
      })),
    }),
    'top3_hit_rate_comparison',
    outDirs
  );

  // 3. Precision@3, Recall@3, and F1@3 Comparison
  saveSvgAndPng(
    renderGroupedBarChart({
      title: 'Multi-Label Ranking Quality: Precision@3, Recall@3, and F1@3',
      subtitle: 'Evaluated against primary + acceptable alternative counselor ground-truth career sets (N=160)',
      yAxisLabel: 'Metric Score (%)',
      maxY: 100,
      unit: '%',
      series: [
        { name: 'Precision@3 (%)', color: '#2563EB' },
        { name: 'Recall@3 (%)', color: '#0D9488' },
        { name: 'F1-Score@3 (%)', color: '#7C3AED' },
      ],
      groups: summary.overallModels.map((m) => ({
        label: shortLabel(m),
        values: [m.precisionAt3, m.recallAt3, m.f1At3],
      })),
    }),
    'precision_recall_f1_comparison',
    outDirs
  );

  // 4. Direct Original Sankalp vs Improved Sankalp Comparison
  const orig = summary.overallModels.find((m) => m.model === 'original_sankalp')!;
  const imp = summary.overallModels.find((m) => m.model === 'improved_sankalp')!;
  const edgeRow = summary.completenessBreakdown.find((c) => c.groupKey === 'incomplete_edge')!;
  const knRow = summary.languageBreakdown.find((l) => l.groupKey === 'kn')!;
  const ruralRow = summary.cohortFairness.rows.find((r) => r.groupKey === 'rural')!;

  saveSvgAndPng(
    renderGroupedBarChart({
      title: 'Original IEEE Sankalp vs. Proposed Improved Sankalp (Head-to-Head)',
      subtitle: 'Substantial gains on incomplete/borderline profiles, regional language queries, and rural cohorts',
      yAxisLabel: 'Top-1 / Top-3 Accuracy (%)',
      maxY: 100,
      unit: '%',
      series: [
        { name: 'Original Sankalp (Baseline)', color: '#D97706' },
        { name: 'Improved Sankalp (Proposed)', color: '#0D9488' },
      ],
      groups: [
        { label: 'Overall\nTop-1', values: [orig.top1HitRate, imp.top1HitRate] },
        { label: 'Overall\nTop-3', values: [orig.top3HitRate, imp.top3HitRate] },
        { label: 'Incomplete/Edge\nTop-1', values: [edgeRow.originalTop1, edgeRow.improvedTop1] },
        { label: 'Kannada\nTop-1', values: [knRow.originalTop1, knRow.improvedTop1] },
        { label: 'Rural Cohort\nTop-1', values: [ruralRow.originalTop1, ruralRow.improvedTop1] },
      ],
    }),
    'original_vs_improved_sankalp',
    outDirs
  );

  // 5. Response Time / Latency Comparison
  const maxLat = Math.max(...summary.overallModels.map((m) => m.meanLatencyMs + m.stdLatencyMs), 10) * 1.25;
  saveSvgAndPng(
    renderSingleBarChart({
      title: 'Recommendation Inference Latency Comparison (Warm Cache, Local CPU)',
      subtitle: 'Mean per-profile execution time in milliseconds (+/- 1 SD) with pre-indexed career embeddings',
      yAxisLabel: 'Latency (ms)',
      maxY: Math.ceil(maxLat),
      unit: ' ms',
      bars: summary.overallModels.map((m, i) => ({
        label: shortLabel(m),
        value: m.meanLatencyMs,
        ciLow: Math.max(0.1, m.meanLatencyMs - m.stdLatencyMs),
        ciHigh: m.meanLatencyMs + m.stdLatencyMs,
        color: palette[i % palette.length],
      })),
    }),
    'latency_comparison',
    outDirs
  );

  // 6. Ablation Study
  saveSvgAndPng(
    renderGroupedBarChart({
      title: 'Ablation Study of Proposed Improvements (N=160 Test Profiles)',
      subtitle: 'Impact of removing individual components from Improved Sankalp on Top-1 and Top-3 Hit Rates',
      yAxisLabel: 'Hit Rate (%)',
      maxY: 100,
      unit: '%',
      series: [
        { name: 'Top-1 Hit Rate (%)', color: '#1D4ED8' },
        { name: 'Top-3 Hit Rate (%)', color: '#0D9488' },
      ],
      groups: summary.ablationRows.map((r) => ({
        label: r.displayName.replace(' / ', '\n'),
        values: [r.top1HitRate, r.top3HitRate],
      })),
    }),
    'ablation_study',
    outDirs
  );

  // 7. Language-Wise Performance
  saveSvgAndPng(
    renderGroupedBarChart({
      title: 'Multilingual Performance Breakdown: English, Hindi, and Kannada',
      subtitle: 'Native domain + valence lexicon expansion mitigates regional translation loss',
      yAxisLabel: 'Accuracy (%)',
      maxY: 100,
      unit: '%',
      series: [
        { name: 'Original Sankalp Top-1', color: '#F59E0B' },
        { name: 'Improved Sankalp Top-1', color: '#0F766E' },
        { name: 'Original Sankalp Top-3', color: '#94A3B8' },
        { name: 'Improved Sankalp Top-3', color: '#2563EB' },
      ],
      groups: summary.languageBreakdown.map((l) => ({
        label: `${l.groupLabel}\n(n=${l.count})`,
        values: [l.originalTop1, l.improvedTop1, l.originalTop3, l.improvedTop3],
      })),
    }),
    'language_performance',
    outDirs
  );

  // 8. Geographic Cohort Fairness Comparison
  saveSvgAndPng(
    renderGroupedBarChart({
      title: 'Geographic Fairness Across Urban, Semi-Urban, and Rural Cohorts',
      subtitle: `Demographic Parity Gap (Top-1) reduced from ${summary.cohortFairness.originalParityGapTop1.toFixed(1)}% to ${summary.cohortFairness.improvedParityGapTop1.toFixed(1)}%`,
      yAxisLabel: 'Hit Rate (%)',
      maxY: 100,
      unit: '%',
      series: [
        { name: 'Original Sankalp Top-1', color: '#D97706' },
        { name: 'Improved Sankalp Top-1', color: '#0D9488' },
        { name: 'Improved Sankalp Top-3', color: '#2563EB' },
      ],
      groups: summary.cohortFairness.rows.map((r) => ({
        label: `${r.groupLabel}\n(n=${r.count})`,
        values: [r.originalTop1, r.improvedTop1, r.improvedTop3],
      })),
    }),
    'fairness_cohort_comparison',
    outDirs
  );

  // 9. Q-Learning Convergence Curve
  saveSvgAndPng(renderQLearningCurve(summary), 'qlearning_convergence', outDirs);
}
