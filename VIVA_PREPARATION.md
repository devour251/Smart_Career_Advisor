# Viva-Voce & Project Defense Preparation Guide

This guide equips all four B.Tech CSE team members to confidently explain the IEEE paper, software architecture, mathematical equations, and experimental findings during project reviews and final Viva-Voce examination.

---

## 1. Core Viva Questions & Crisp Model Answers

### Q1. What is the main research problem addressed by the Sankalp IEEE paper, and why isn't a normal chatbot enough?
**Answer**: Career counseling in India suffers from severe counselor scarcity, rigid percentage cutoffs in traditional aptitude portals, and English-only interfaces. A pure generative chatbot is non-deterministic, can hallucinate course eligibility (for example, suggesting MBBS without Biology), and lacks formal user-feedback learning. Sankalp solves this via a **hybrid neuro-symbolic architecture** combining **Sentence-BERT (`all-MiniLM-L6-v2`)** semantic similarity, **rule-based academic reasoning**, **VADER sentiment analysis**, **Q-learning reinforcement learning**, and **Knowledge Graph explainability**.

---

### Q2. Why did you remove features from your earlier EduPath Navigator repository instead of just adding more pages?
**Answer**: Legacy EduPath Navigator contained unfocused utility pages (EMI/loan calculators, parent-zone marketing pages, static exam calendars, and black-box cloud LLM prompts) that did not contribute to measurable recommendation accuracy or research validation. We redesigned it into **Improved Sankalp**, focusing cleanly on a **5-step NEP-2020 education-to-career workflow** (`After 10th`, `After 12th`, `Undergraduate`, `Graduate`) backed by reproducible local AI modules and a live benchmark suite.

---

### Q3. What is "Rule-Model Rigidity" in the IEEE paper, and how did your team overcome it?
**Answer**: In Section VII-A of the IEEE paper, the authors explicitly note **Rule-Model Rigidity**: hard IF-THEN cutoffs severely penalize a student who scores `62%` when a career's nominal benchmark is `65%`, or a Polytechnic Diploma / Commerce+Math student transitioning laterally under NEP-2020. We replaced step-function cutoffs with a **smooth logistic feasibility curve** across the borderline zone (`-8%` to `0%`) and encoded **NEP-2020 multidisciplinary bridge pathways**, recovering viable careers while transparently displaying the required bridge step.

---

### Q4. How does your Multi-Facet SBERT + Knowledge Graph Imputation handle incomplete student profiles?
**Answer**: In the original paper, student skills, interests, and subjects are concatenated into one flat string. If a rural or undecided student leaves skills or marks blank, flat cosine similarity drops and rigid rules penalize missing marks. Our **Conditional Bipartite Knowledge-Graph Imputation** traverses 2-hop paths from observed `(Stage + Preferred Subjects + Interests + RIASEC)` to neighbor careers to infer high-consensus latent skills, while **Multi-Facet SBERT** encodes *Skills*, *Domain Interests*, and *Academic Context* separately with dynamic confidence weights.

---

### Q5. How did you improve Q-Learning over Algorithm 3 of the IEEE paper?
**Answer**: The original paper applies binary $+1/-1$ scalar updates to individual `(Stage, CareerID)` entries, which memorizes training-set career popularity and cannot generalize to unseen careers. We introduced **Contextual Sentiment-Augmented Q-Learning**, where state $S_t = (\text{Stage}, \text{DominantRIASEC}, \text{Completeness}, \text{Emotion})$ selects optimal hybrid fusion weights $\mathbf{w}^* = [w_{\text{sbert}}, w_{\text{rule}}, w_{\text{kg}}, w_{\text{riasec}}, w_{\text{market}}]$ using a shaped reward $R_t = r_{\text{explicit}} + 0.35\,\text{VADER} - 0.15\,\text{SkillGap}$ ($\alpha = 0.1, \gamma = 0.9$, $\varepsilon: 1.0 \to 0.1$ over 100 epochs). Crucially, we train strictly on `N = 80` training profiles and evaluate on `N = 160` held-out test profiles with **zero data leakage**.

---

### Q6. Did you use the original RVCE dataset from the IEEE paper?
**Answer**: No — and we state this transparently. In the IEEE paper's Appendix (p. 18), the authors note their repository *"will be activated after publication,"* and their 160-profile RVCE workshop CGT dataset is not publicly downloadable. We constructed a documented, deterministic **240-profile Stratified Indian Career Guidance Benchmark** (`80 train` + `160 held-out test`) across **85 careers**, 4 academic stages, 3 languages (`EN`, `HI`, `KN`), 3 geographic cohorts (`Urban`, `Semi-Urban`, `Rural`), and dual counselor ground-truth rubrics achieving **Cohen's $\kappa = 0.9281$**. We report paper-reported reference numbers and our measured benchmark numbers in separate tables.

---

### Q7. How does multilingual support work for Hindi and Kannada, and why did it improve accuracy?
**Answer**: Literal translation often loses Indian educational terms (*SSLC, PUC, डिप्लोमा, अभियांत्रिकी, ಗಣಿತ, ಸೌರಶಕ್ತಿ*) and neutralizes native emotional anxiety expressions before VADER runs. Our `multilingualModule.ts` applies boundary-aware **Native Academic & Career Stem Expansion** plus **Native Emotional Valence Calibration** before SBERT and VADER processing, paired with browser `SpeechRecognition` (`en-IN`, `hi-IN`, `kn-IN`) and `speechSynthesis` TTS.

---

### Q8. What is the role of Holland's RIASEC and Social Cognitive Career Theory (SCCT) in your code?
**Answer**:
- **Holland's RIASEC** (`src/engine/ruleEngine.ts`): Computes 6-dimensional cosine congruence between the student's `[R, I, A, S, E, C]` vector and each career's O*NET-aligned RIASEC vector.
- **SCCT** (`src/engine/vaderEmotionModule.ts` & `hybridRecommender.ts`): Detects career anxiety or low self-efficacy (`VADER compound <= -0.15`) and provides supportive framing plus attainability-calibrated career pathways with clear bridge steps.

---

## 2. Suggested 4-Member Team Role Split for Project Presentation

| Team Member | Ownership Module & Live Demo Responsibility |
| :--- | :--- |
| **Member 1** | **Problem Statement, IEEE Paper Analysis & NEP-2020 Multi-Stage Redesign** (`HeroOverview`, `Step1And2Pathways`, `educationPathways.ts`, `careerRepository.ts`). |
| **Member 2** | **Multi-Facet SBERT, Multilingual HI/KN Lexicon & VADER-SCCT Emotion Engine** (`sbertModule.ts`, `multilingualModule.ts`, `vaderEmotionModule.ts`, Voice STT/TTS demo). |
| **Member 3** | **Soft-Constraint Reasoning, Knowledge Graph Imputation & Contextual Q-Learning** (`ruleEngine.ts`, `knowledgeGraphModule.ts`, `qLearningModule.ts`, live Accept/Reject Q-update demo). |
| **Member 4** | **Benchmark Dataset, Statistical Evaluation, Ablation Study & Fairness Analysis** (`benchmarkDataset.ts`, `scripts/run_experiments.ts`, `ResearchBenchmarksSection.tsx`, SVG/PNG charts). |

---

## 3. 3-Minute Live Demo Script for Your Project Guide

1. **Show Overview & Research Grounding (30s)**: Point out the 85-career scope, zero-leakage `N = 160` benchmark summary, and the 5-step journey.
2. **Demo Borderline Cutoff Recovery (60s)**: Click *"Begin Your Journey"* $\to$ Step 3 $\to$ click the **After 12th · Borderline Marks (62%) · AI Aspirant** persona $\to$ click *"Generate Hybrid AI Recommendations"*. Point out how **Improved Sankalp** scores significantly higher than **Original Baseline** and displays the NEP-2020 bridge note, then click **"Compare All 4 Models Live"**.
3. **Demo Rural Kannada + Q-Learning Feedback + Knowledge Graph (60s)**: Load the **After 10th · Rural Kannada** persona $\to$ run recommendations $\to$ test **Voice Readout (TTS)** $\to$ click **Accept (+Q Reward)** on a career to show the live Bellman reward update $\to$ open **Step 5** to showcase the multi-stage roadmap, NPTEL courses, comparison table, and interactive SVG Knowledge Graph.
4. **Show Executable Research Evidence (30s)**: Open **Research & Benchmarks** and **Architecture & Docs** tabs to present the measured Top-1/Top-3/F1/Ablation/Fairness tables and downloadable publication PNG/SVG figures.
