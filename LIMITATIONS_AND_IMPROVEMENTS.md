# Original IEEE Paper Limitations & Proposed Scientific Improvements

This document addresses **Phase 4** of the project specification by mapping every concrete limitation identified in *"Sankalp: AI-Powered Career Guidance System"* (`DOI: 10.1109/ACCESS.2025.3638596`) to our implemented engineering solution and empirical evaluation protocol.

---

## 1. Master Limitation-to-Solution Matrix

| Original Paper Limitation | Our Proposed Solution | Modular Implementation | Empirical Evaluation |
| :--- | :--- | :--- | :--- |
| **1. Rule-Model Rigidity (Explicitly acknowledged in Paper Section VII-A)**: Hard boolean cutoffs (`marks >= minScore` and exact stream match) drastically penalize borderline students (missing cutoffs by 2–5%) and ignore NEP-2020 lateral transitions. | **Soft Fuzzy-Constraint & NEP-2020 Bridge Reasoning Engine**: Replaces step-function cliffs with calibrated logistic decay curves and explicit cross-stream bridge pathways (e.g., Diploma $\to$ B.Tech Lateral Entry; Commerce+Math $\to$ FinTech/Analytics) + Holland RIASEC cosine congruence. | `src/engine/ruleEngine.ts` (`evaluateImprovedSoftRules` vs. `evaluateOriginalRigidRules`) | Evaluated via `improved_no_soft_rules` ablation and the `incomplete_edge` borderline test cohort (`N = 48`). |
| **2. Single-String SBERT Dilution & Incomplete-Profile Fragility**: Concatenating all fields into one flat string causes blank skills or omitted marks to dilute `all-MiniLM-L6-v2` embeddings and trigger punitive rule penalties. | **Multi-Facet Attention SBERT + Conditional Bipartite KG Imputation**: Separately embeds *Skills*, *Domain Interests*, and *Academic Context* facets with dynamic confidence weights, and imputes omitted skills from 2-hop Knowledge Graph neighborhood consensus. | `src/engine/sbertModule.ts` & `src/engine/knowledgeGraphModule.ts` (`imputeMissingProfileAttributes`) | Evaluated via `improved_no_imputation` ablation and Complete (`n = 112`) vs. Incomplete/Edge (`n = 48`) subgroup benchmark. |
| **3. Translation-Induced Semantic & Sentiment Loss in Hindi & Kannada**: Literal pre-translation drops Indian academic idioms (*SSLC, PUC, डिप्लोमा, ಸೌರಶಕ್ತಿ*) and flattens regional emotional anxiety/confidence cues before VADER runs. | **Native Academic Lexicon & Multilingual Valence Preservation**: Expands Devanagari Hindi and Kannada script educational/career stems into rich domain concepts prior to SBERT encoding and calibrates VADER compound polarity with native emotional valence markers. | `src/engine/multilingualModule.ts` & `src/engine/vaderEmotionModule.ts` | Evaluated across stratified English (`n = 80`), Hindi (`n = 40`), and Kannada (`n = 40`) test splits. |
| **4. Context-Free Scalar Q-Learning**: Binary $+1/-1$ scalar updates per career ID fail to generalize to unseen careers and introduce training-set popularity bias. | **Contextual Sentiment-Augmented Bellman Policy**: Formulates state $S_t = (\text{Stage}, \text{DominantRIASEC}, \text{Completeness}, \text{Emotion})$ to select optimal hybrid fusion weights $\mathbf{w}^*$ trained with continuous shaped reward $R_t = r_{\text{explicit}} + 0.35\,\text{VADER} - 0.15\,\text{SkillGap}$. | `src/engine/qLearningModule.ts` (`selectContextualFusionWeights`, `trainQLearningPolicyOnTrainSplit`) | Trained strictly on held-out `train` split (`N = 80`, 100 epochs) and evaluated on unseen `test` split (`N = 160`) + `improved_no_contextual_rl` ablation. |
| **5. Urban Jargon Bias & Lack of Subgroup Fairness Auditing**: Urban students listing corporate technical buzzwords receive systematically higher cosine scores than rural/semi-urban students describing practical subject strengths. | **Geographic Fairness Calibration & Demographic Parity Auditing**: Incorporates subject + RIASEC + KG structural alignment to prevent vocabulary-density penalties on rural/semi-urban cohorts and measures Demographic Parity Gaps. | `src/engine/hybridRecommender.ts` & `scripts/run_experiments.ts` | Measured across Urban (`n = 56`), Semi-Urban (`n = 52`), and Rural (`n = 52`) cohorts (`fairness_cohort_comparison.png`). |
| **6. Flat One-Shot Career Output Without Multi-Stage Education Pathways**: Original Sankalp outputs job titles without guiding students through Indian educational transitions (`10th -> 12th -> UG -> Graduate`) or side-by-side course comparison. | **NEP-2020 Multi-Stage Pathway Explorer, Roadmap & SVG Knowledge Graph**: Adds 5-step guided stage selection, stream-eligible course cards, NPTEL/SWAYAM skill-gap courses, multi-career comparison tables, and interactive 2-hop Plan-B subgraphs. | `src/data/educationPathways.ts`, `Step1And2Pathways.tsx`, `Step5RoadmapAndGraph.tsx` | Verified across all 4 academic stages (`40` test profiles per stage) and interactive website workflow. |
| **7. Proprietary Naukri API & Cloud STT/TTS Bottlenecks**: Reliance on closed job-portal scraping and 1,250 ms cloud audio round-trips hinders reproducibility and offline lab deployment. | **Self-Contained Curated Indian Market Index + Browser Web Speech API**: Structured 85-career Indian salary/growth index + zero-key client-side STT/TTS + local SQLite WAL persistence. | `src/engine/sectorMarketModule.ts`, `src/db/database.ts`, `Step3Assessment.tsx` | Verified reproducible execution on Windows & Linux with `< 150 ms` warm core inference latency. |

---

## 2. Mathematical Formulation of Key Enhancements

### 2.1 Soft-Constraint Logistic Academic Feasibility
Instead of the original rigid indicator $\mathbb{I}(\text{score} \ge \tau_c)$, Improved Sankalp models academic feasibility for career $c$ with threshold $\tau_c$ and student score $m$ ($\Delta = m - \tau_c$) as:

$$f_{\text{acad}}(\Delta) = \begin{cases} \min\!\left(1.0,\; 0.92 + 0.08 \cdot \min(1, \Delta / 15)\right), & \Delta \ge 0 \\[4pt] \dfrac{0.90}{1 + \exp(-0.28(\Delta + 4))}, & -8 \le \Delta < 0 \quad \text{(Borderline Bridge Zone)} \\[8pt] \max\!\left(0.42,\; \dfrac{0.65}{1 + \exp(-0.15(\Delta + 12))}\right), & \Delta < -8 \end{cases}$$

When $m$ is omitted (`null`), a non-punitive neutral prior $f_{\text{acad}} = 0.86$ is applied rather than penalizing incomplete profiles.

### 2.2 Multi-Facet Attention SBERT Similarity
For student query facets $(q_{\text{skills}}, q_{\text{interests}}, q_{\text{academic}})$ and pre-computed 384-d career facet vectors $(\mathbf{e}_{c,\text{skills}}, \mathbf{e}_{c,\text{domain}}, \mathbf{e}_{c,\text{academic}})$:

$$\text{Sim}_{\text{facet}}(u, c) = \frac{\sum_{k \in \{\text{skills, domain, acad}\}} \beta_k(u)\, \cos(\mathbf{e}_{u,k}, \mathbf{e}_{c,k})}{\sum_{k} \beta_k(u)}$$

where $\beta_k(u)$ dynamically down-weights missing facets so empty fields never collapse overall semantic similarity.

### 2.3 Sentiment-Shaped Contextual Q-Learning
Given contextual state $s_t = (\text{Level}, \text{RIASEC}_{\max}, \text{Completeness}, \text{Emotion})$ and weight-profile action $a_t \in \mathcal{A}$:

$$R_t = r_{\text{explicit}} + 0.35 \cdot v_{\text{VADER}} - 0.15 \cdot \rho_{\text{missing\_skills}}$$

$$Q(s_t, a_t) \leftarrow Q(s_t, a_t) + \alpha \left[ (1 - \gamma)\tilde{R}_t + \gamma \max_{a'} Q(s_{t+1}, a') - Q(s_t, a_t) \right]$$

with $\alpha = 0.1$, $\gamma = 0.9$, and linear $\varepsilon: 1.0 \to 0.1$ over 100 training epochs.
