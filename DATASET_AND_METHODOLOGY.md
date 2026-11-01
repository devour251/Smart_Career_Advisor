# Dataset Provenance & Experimental Methodology

## 1. Investigation of the Original Paper's Dataset

In Phase 5, we first investigated whether the original dataset from *"Sankalp: AI-Powered Career Guidance System"* (Nandi et al., *IEEE Access*, 2025, DOI: `10.1109/ACCESS.2025.3638596`) is publicly available:

1. **Paper Appendix Inspection (Page 18)**: The Appendix explicitly states that the GitHub repository link *"will be activated after publication"* and does not host downloadable CSV/JSON ground-truth student records.
2. **Dataset Nature in Section V-A**: The paper's **160-profile Curated Ground Truth (CGT)** dataset was collected privately from student counseling workshops at RV College of Engineering (RVCE), Bengaluru, paired with an internal **85-career JSON repository** and live Naukri API queries.
3. **Scientific Transparency Commitment**: We **never** claim to have run on the private RVCE CGT file. Instead, we constructed a fully documented, deterministic, open benchmark (`src/data/benchmarkDataset.ts`) matching the paper's **85-career taxonomy** and **N = 160 held-out test set size**, and we report **Paper-Reported Reference Results** and **Our Measured Benchmark Results** in strictly separate tables.

---

## 2. Career & Pathway Knowledge Repository (`85 Careers · 21 Pathways`)

Located in `src/data/careerRepository.ts` (split cleanly across `careersVocationalTech.ts`, `careersEngineeringCore.ts`, `careersHealthCommerce.ts`, and `careersHumanitiesDesignGrad.ts`):

- **85 Career Categories** across **11 sectors**: Skilled Trades & Polytechnic, Software & AI, Data & Cloud, Core Engineering, Healthcare & Biosciences, Commerce & Finance, Law & Public Policy, Design & Media, Pure Science & AgriTech, and Management & Strategy.
- **Rich Multi-Stage Schema**: Every career specifies `applicableLevels` (`after_10th`, `after_12th`, `undergraduate`, `graduate`), `eligibleStreams`, `minAcademicScore`, `requiredSubjects`, `requiredSkills`, 6-D O*NET-aligned `riasecProfile`, native `titleHi` and `titleKn`, 4-step `pathwaySteps`, a NEP-2020 `bridgePathway`, curated NPTEL/SWAYAM/AICTE courses, and `alternativeCareerIds`.

---

## 3. Stratified 240-Profile Student Benchmark (`Zero Data Leakage`)

Generated deterministically via seeded PRNG in `src/data/benchmarkDataset.ts` so any examiner can reproduce identical numbers with `npm run evaluate`:

| Split | Profiles (`N`) | Purpose | Leakage Control |
| :--- | :---: | :--- | :--- |
| **Training Split (`train`)** | `80` | Used **exclusively** for 100-epoch Q-learning policy training ($\alpha=0.1, \gamma=0.9, \varepsilon: 1.0 \to 0.1$). | Distinct career offsets, seeds, and phrasings; never evaluated during testing. |
| **Held-Out Test Split (`test`)** | `160` | Used **exclusively** for final evaluation of all 8 baseline, ablation, and proposed models. | Matches IEEE Paper's exact `N = 160` evaluation count; frozen Q-policy ($\varepsilon = 0$). |

### Stratification of the 160 Held-Out Test Profiles
1. **By Education Stage**: `40` After 10th · `40` After 12th · `40` Undergraduate · `40` Graduate.
2. **By Language**: `80` English (`en`) · `40` Devanagari Hindi (`hi`) · `40` Kannada script (`kn`). Non-English profiles use authentic native academic and emotional expressions without parenthetical English keyword hints.
3. **By Geographic Cohort**: `56` Urban · `52` Semi-Urban · `52` Rural (testing vocabulary sparsity and demographic fairness).
4. **By Profile Completeness & Edge Cases**:
   - `112` **Complete Profiles (70%)**: Standard academic marks above cutoff, 1–2 skills, preferred subjects, and full RIASEC scores.
   - `48` **Incomplete / Borderline Edge Profiles (30%)**: Includes omitted marks (`academicPercentage = null`), empty `skills = []`, borderline marks `3–7%` below rigid `minAcademicScore`, and NEP-2020 cross-stream transitions (e.g., Diploma $\to$ Engineering, Commerce+Math $\to$ Data/Analytics).

---

## 4. Dual Counselor Ground-Truth Rubrics & Inter-Rater Reliability

Following Section V-B3c of the IEEE Sankalp paper, each benchmark profile is annotated under two independent domain rubrics:
- **Counselor Rubric A**: Academic stream eligibility, subject mastery, and stage progression fit (`primaryTargetCareerId`).
- **Counselor Rubric B**: O*NET Holland RIASEC psychometric congruence and transferable skill-interest fit (`counselorRubricB`), plus `acceptableSecondaryIds` for multi-label `@3` evaluation.
- **Measured Inter-Rater Agreement**: Across all 240 profiles, Rubric A and Rubric B achieve **92.92% raw agreement** and **Cohen's $\kappa = 0.9281$** (*almost perfect agreement*, consistent with the high counselor concordance protocol in the IEEE paper).

---

## 5. Evaluation Metrics & Statistical Protocol

Executed end-to-end by `scripts/run_experiments.ts`:

1. **Top-1 Hit Rate (%)**: Percentage of test profiles where `primaryTargetCareerId` is ranked `#1`.
2. **Top-3 Hit Rate (%)**: Percentage of test profiles where `primaryTargetCareerId` appears in ranks `#1..#3`.
3. **Precision@3, Recall@3, and F1-Score@3 (%)**: Computed against the full relevant ground-truth set `{primaryTargetCareerId} ∪ acceptableSecondaryIds`.
4. **Mean Reciprocal Rank (MRR)**: $\frac{1}{N}\sum_{i=1}^N \frac{1}{\text{rank}_i}$.
5. **95% Bootstrap Confidence Intervals**: 1,000-iteration percentile bootstrap resampling on `N = 160` binary hit vectors.
6. **Demographic Parity Gap**: $\max_{g \in \{\text{urban, semi\_urban, rural}\}} \text{Acc}(g) - \min_{g} \text{Acc}(g)$.
7. **Warm Inference Latency (`ms ± SD`)**: Measured via `perf_hooks.performance.now()` on local CPU with pre-cached career embeddings.
