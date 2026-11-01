# Smart Career Advisor — AI-Powered Stream, Course & Career Guidance Platform

A modern, student-friendly career guidance platform built upon and extending the *IEEE Access* 2025 research paper **"Sankalp: AI-Powered Career Guidance System"** (`DOI: 10.1109/ACCESS.2025.3638596`) for our 7th-semester B.Tech Computer Science & Engineering Major Project.

> **Laptop Setup Guide**: See **[`LAPTOP_SETUP_GUIDE.md`](./LAPTOP_SETUP_GUIDE.md)** for complete step-by-step instructions to run the frontend, backend, SQLite database, and AI engine on Windows, macOS, or Linux.

---

## 1. Key Highlights

- **Beginner-First Student Experience (`Home`, `Explore Streams`, `Career Finder`, `Study Hub`, `Sign In / My Account`)**:
  1. **Zero-Jargon Stream Explorer**: Built for 10th-pass, 12th-pass, Undergraduate, and Graduate students—explaining subjects taught, *"What Comes Next?"* progressions (`B.Tech`, `MBBS`, `BCA`, `B.Com`, `CA`, `Law`, `Diploma`, `MBA`, `M.Tech`, `UPSC`), realistic salary packages (`₹ LPA`), skills to build, and 4-phase roadmaps.
  2. **Student Login, Sign Up & Persistent Dashboard (SQLite)**: Real password-hashed accounts (`crypto.scryptSync`), 30-day session tokens, saved/bookmarked streams & careers, and past Career Finder assessment history stored in `data/sankalp.db`.
     - **Demo Login**: `demo@student.edu` / `student123`
  3. **Study Hub, Scholarships & Best YouTube Channels**: Official free textbooks & portals (`NCERT`, `DIKSHA`, `NPTEL`, `SWAYAM`, `ICAI BoS`, `Bharat Skills`), Government Scholarships (`NSP`, `AICTE Pragati/Saksham`, `PM-Vidyalaxmi`), Official Exam Portals (`JEE`, `NEET`, `CUET`, `GATE`), and top Indian study YouTube channels.
  4. **24/7 Interactive Career Mentor Chatbot**: Multilingual (`English`, `हिन्दी`, `ಕನ್ನಡ`) voice & text mentor grounded in our Indian stream guides, 85-career repository, and emotion-aware support.
  5. **Personalized Hybrid AI Career Finder + Printable PDF Roadmap**: Ranks **85 careers** using SBERT (`all-MiniLM-L6-v2`) semantic matching, soft-constraint rule reasoning with lateral-entry bridge pathways, VADER emotion adaptation, Knowledge Graph visual maps, and live **Q-Learning preference updates**.
  6. **Dedicated `Project Report` View (For Guide Defense)**: Located at the end of navigation to demonstrate paper alignment, limitations overcome, live 4-model comparisons, 9 research graphs, 7 architecture diagrams, live SQLite database telemetry, and Viva Q&A docs.

---

## 2. Measured Benchmark Summary (`N = 160` Held-Out Test Profiles)

| Model | Top-1 Hit Rate | Top-3 Hit Rate | F1@3 | MRR | Incomplete/Edge Top-1 |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Rule-Based Only** | `55.63%` | `73.13%` | `35.42%` | `0.6446` | — |
| **SBERT-Only (`all-MiniLM-L6-v2`)** | `81.88%` | `85.00%` | `46.25%` | `0.8367` | — |
| **Original Sankalp (IEEE Baseline)** | `71.25%` | `80.63%` | `37.29%` | `0.7615` | `46.67%` |
| **Our Improved Engine** | **`83.13%`** | **`97.50%`** | **`52.71%`** | **`0.8995`** | **`80.00%` (`+33.33%`)** |

---

## 3. Running Locally on Your Laptop (Windows / macOS / Linux)

### Prerequisites
- **Node.js v20 LTS or v22 LTS** ([https://nodejs.org/](https://nodejs.org/))
- **Zero external database setup required!** Our embedded relational SQLite database (`better-sqlite3`) automatically creates `data/sankalp.db` with all 7 tables (`users`, `auth_sessions`, `saved_items`, `student_sessions`, `recommendation_logs`, `feedback_logs`, `q_table`) and seeds the Demo Student account (`demo@student.edu` / `student123`).
- **Zero paid API keys required to start!** `Xenova/all-MiniLM-L6-v2` runs 100% locally offline after initial model cache (~86 MB), and the Career Mentor Chatbot includes an automatic Knowledge-Base mode if `GEMINI_API_KEY` is not set in `.env`.

### Commands

```bash
# 1. Install all dependencies
npm install

# 2. Start the full-stack server (Express API + React Vite Frontend + SQLite DB)
npm run dev
```

Open **`http://localhost:3000`** in Google Chrome or Microsoft Edge.

*(Optional)* To re-run the 240-profile empirical benchmark and regenerate all SVG/PNG graphs:
```bash
npm run evaluate
```
