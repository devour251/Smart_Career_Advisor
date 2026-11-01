# Experimental Results, Ablation Analysis & Fairness Evaluation

All results reported in this document were computed by executing `npm run evaluate` (`scripts/run_experiments.ts`) using real **`Xenova/all-MiniLM-L6-v2` (384-d ONNX)** Sentence-BERT embeddings, `vader-sentiment`, and our 240-profile Stratified Indian Career Guidance Benchmark (`N_train = 80`, `N_test = 160` held-out test profiles, zero data leakage).

---

## 1. Strict Separation: Paper-Reported Reference vs. Our Measured Results

Because the original RVCE 160-profile workshop CGT dataset from *IEEE Access* 2025 (`DOI: 10.1109/ACCESS.2025.3638596`) is private, we present the paper's published numbers solely as literature reference in **Table 1A** and report our executable open-benchmark results in **Table 1B**.

### Table 1A: Published Reference Baselines in Original IEEE Paper (Private RVCE CGT Dataset)

| Paper Configuration | Top-1 Hit Rate | Top-3 Hit Rate | User Satisfaction | Published Notes |
| :--- | :---: | :---: | :---: | :--- |
| **Rule-Only** | `52.5%` | `74.0%` | `3.60 / 5.0` | Deterministic academic & stream filters |
| **SBERT-Only** | `64.4%` | `86.0%` | `4.10 / 5.0` | Flat `all-MiniLM-L6-v2` cosine similarity |
| **Hybrid Base (Rule + SBERT)** | `68.1%` | `88.5%` | `4.35 / 5.0` | Static combination without RL/KG/VADER |
| **Full Sankalp (Paper)** | `77.5%` | `90.5%` | `4.71 / 5.0` | 95% CI `[88.1%, 92.9%]` on Top-3; `350 ms` core AI latency |

---

### Table 1B: Measured Results on Our Held-Out Stratified Test Split (`N = 160`)

| Model Variant | Top-1 Hit Rate (95% CI) | Top-3 Hit Rate (95% CI) | Top-5 (%) | Precision@3 | Recall@3 | F1@3 | MRR | Warm Latency (ms) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Rule-Based Only** | `55.63%` `[48.13, 63.75]` | `73.13%` `[66.25, 80.00]` | `78.13%` | `35.42%` | `35.42%` | `35.42%` | `0.6446` | `32.22 ± 5.41` |
| **SBERT-Only** | `81.88%` `[75.63, 87.50]` | `85.00%` `[79.38, 90.00]` | `86.88%` | `46.25%` | `46.25%` | `46.25%` | `0.8367` | `58.04 ± 13.91` |
| **Hybrid Base (Rule + SBERT)** | `81.25%` `[75.63, 87.50]` | `83.75%` `[78.13, 89.38]` | `86.88%` | `41.67%` | `41.67%` | `41.67%` | `0.8301` | `58.24 ± 14.44` |
| **Original Sankalp (Baseline)** | `76.25%` `[69.38, 83.13]` | `83.13%` `[76.88, 88.75]` | `86.88%` | `38.33%` | `38.33%` | `38.33%` | `0.8015` | `58.91 ± 14.43` |
| **Improved Sankalp (Ours)** | **`83.13%`** `[76.88, 88.75]` | **`97.50%`** `[95.00, 99.38]` | **`98.13%`** | **`52.71%`** | **`52.71%`** | **`52.71%`** | **`0.8995`** | `144.86 ± 62.19` |

#### Key Empirical Observations
1. **Overall Ranking Superiority**: **Improved Sankalp** achieves the highest overall **Top-1 Hit Rate (`83.13%`, `+6.88%` over Original Sankalp)**, **Top-3 Hit Rate (`97.50%`, `+14.37%` over Original Sankalp)**, **F1@3 (`52.71%` vs. `38.33%`)**, and **MRR (`0.8995` vs. `0.8015`)**.
2. **Why Original Sankalp Lagged Pure SBERT on Edge Cases (`76.25%` vs. `81.88%`)**: In our stratified test split, `30%` of profiles contain realistic missing marks, borderline scores (`3–7%` below nominal cutoffs), or cross-stream NEP-2020 transitions. Original Sankalp's multiplicative rigid-rule gate (`origGate = 0.42`) severely suppresses valid semantic matches on those edge cases—empirically confirming the **Rule-Model Rigidity** limitation noted in Section VII-A of the IEEE paper!
3. **Sub-150 ms Latency**: Even while encoding three semantic facets in `Xenova/all-MiniLM-L6-v2` plus baseline comparison vectors, warm CPU latency averages **`144.86 ms`** — more than **2.4× faster** than the paper's `350 ms` Python core budget.

![Top-1 Comparison](docs/results/top1_hit_rate_comparison.png)

![Top-3 Comparison](docs/results/top3_hit_rate_comparison.png)

![Precision Recall F1](docs/results/precision_recall_f1_comparison.png)

---

## 2. Component Ablation Study (`N = 160`)

| Configuration | Top-1 Hit Rate | Top-3 Hit Rate | F1@3 | MRR | Key Diagnostic Insight |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Improved Sankalp (Full Proposed)** | `83.13%` | **`97.50%`** | **`52.71%`** | `0.8995` | Best holistic balance + live online adaptability |
| **w/o Contextual Q-Learning (Static Fusion)** | `83.75%` | `97.50%` | `52.71%` | `0.9028` | Matches static ceiling offline while lacking online session personalization |
| **w/o Multi-Facet Imputation** | `83.13%` | `87.50%` | `46.46%` | `0.8577` | Removing KG imputation & facet attention drops Top-3 by **`-10.00%`** and F1@3 by **`-6.25%`** |
| **w/o Soft Fuzzy Rules (Rigid Rules)** | `78.13%` | `87.50%` | `44.38%` | `0.8345` | Reverting to rigid cutoffs drops Top-1 by **`-5.00%`** and Top-3 by **`-10.00%`** |
| **Original Sankalp (IEEE Baseline)** | `76.25%` | `83.13%` | `38.33%` | `0.8015` | Baseline before all enhancements |

![Ablation Study](docs/results/ablation_study.png)

---

## 3. Incomplete & Borderline Profile Stress Test

| Profile Condition | Count (`n`) | Original Top-1 | Improved Top-1 | Gain ($\Delta$) | Original Top-3 | Improved Top-3 | Gain ($\Delta$) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Complete Profiles** | `112` | `92.86%` | `88.39%` | `-4.47%` | `99.11%` | `99.11%` | `0.00%` |
| **Incomplete / Borderline Edge** | `48` | `37.50%` | **`70.83%`** | **`+33.33%`** | `45.83%` | **`93.75%`** | **`+47.92%`** |

- **Scientific Honesty Note**: On complete profiles where academic scores comfortably exceed rigid cutoffs, hard boolean filtering narrows the candidate pool aggressively (`92.86%` Top-1, `99.11%` Top-3), whereas soft rules keep adjacent NEP-2020 bridge careers competitive (`88.39%` Top-1, `99.11%` Top-3). In exchange, on **incomplete and borderline profiles**, Improved Sankalp delivers a transformative **`+33.33%` Top-1** and **`+47.92%` Top-3** recovery (`45.83% -> 93.75%`)!

![Original vs Improved](docs/results/original_vs_improved_sankalp.png)

---

## 4. Multilingual Performance (`English`, `Hindi`, `Kannada`)

| Language Subgroup | Count (`n`) | Original Top-1 | Improved Top-1 | Top-1 $\Delta$ | Original Top-3 | Improved Top-3 | Top-3 $\Delta$ |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **English (`en`)** | `80` | `81.25%` | `88.75%` | `+7.50%` | `87.50%` | `97.50%` | `+10.00%` |
| **Hindi Devanagari (`hi`)** | `40` | `65.00%` | `80.00%` | **`+15.00%`** | `77.50%` | `97.50%` | **`+20.00%`** |
| **Kannada Script (`kn`)** | `40` | `77.50%` | `75.00%` | `-2.50%` | `80.00%` | `97.50%` | **`+17.50%`** |

- Native domain-stem and valence preservation boosts **Hindi Top-1 by `+15.00%`** and raises **Top-3 accuracy to `97.50%` across all three languages** (`+20.00%` in Hindi, `+17.50%` in Kannada).

![Language Performance](docs/results/language_performance.png)

---

## 5. Geographic Cohort Fairness & Parity Analysis

| Geographic Cohort | Count (`n`) | Original Top-1 | Improved Top-1 | Top-1 $\Delta$ | Original Top-3 | Improved Top-3 | Top-3 $\Delta$ |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Urban** | `56` | `83.93%` | `87.50%` | `+3.57%` | `89.29%` | `100.00%` | `+10.71%` |
| **Semi-Urban** | `52` | `73.08%` | `86.54%` | **`+13.46%`** | `84.62%` | `98.08%` | `+13.46%` |
| **Rural** | `52` | `71.15%` | `75.00%` | `+3.85%` | `75.00%` | `94.23%` | **`+19.23%`** |
| **Demographic Parity Gap** | — | `12.78%` | `12.50%` | `-0.28%` | `14.29%` | **`5.77%`** | **`-8.52%` Gap Reduction** |

![Fairness Cohort Comparison](docs/results/fairness_cohort_comparison.png)

---

## 6. Stage-Wise Performance & Q-Learning Convergence

| Academic Stage | Count (`n`) | Original Top-1 | Improved Top-1 | Original Top-3 | Improved Top-3 |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **After 10th** | `40` | `85.00%` | `77.50%` | `90.00%` | `97.50%` |
| **After 12th** | `40` | `72.50%` | `85.00%` | `80.00%` | `97.50%` |
| **Undergraduate** | `40` | `75.00%` | `87.50%` | `77.50%` | `97.50%` |
| **Graduate** | `40` | `72.50%` | `82.50%` | `85.00%` | `97.50%` |

![Latency Comparison](docs/results/latency_comparison.png)

![Q-Learning Convergence](docs/results/qlearning_convergence.png)
