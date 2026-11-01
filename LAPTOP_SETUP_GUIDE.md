# Laptop Setup, Database & Authentication Guide

This guide explains how **Smart Career Advisor** works on your personal laptop (Windows, macOS, or Linux), how **Login / Sign Up** and the **Database** work out-of-the-box, and how to demonstrate every feature smoothly to your Project Guide ("Sir").

---

## 1. How the Database Works (Zero External Installation Needed!)

You do **not** need to install MySQL, MongoDB, PostgreSQL, or XAMPP on your laptop.

- **Database Engine**: Embedded Relational **SQLite 3** (`better-sqlite3` with Write-Ahead Logging `WAL`).
- **Database File Location**: `data/sankalp.db` (created **automatically** in the project folder the very first time you run `npm run dev`!).
- **7 Relational Tables Automatically Created**:
  1. `users` — Stores student accounts (`id`, `full_name`, `email`, salted `scrypt` `password_hash`, `education_level`, `current_stream`, `preferred_language`, `created_at`).
  2. `auth_sessions` — Stores secure 30-day session tokens (`token`, `user_id`, `expires_at`).
  3. `saved_items` — Stores bookmarked streams & careers per logged-in student (`user_id`, `item_type`, `item_id`, `item_title`).
  4. `student_sessions` — Stores guest & logged-in student assessment profiles (`profile_json`, `academic_percentage`, `cohort`).
  5. `recommendation_logs` — Stores every Career Finder recommendation run, latency (`ms`), VADER sentiment score, and top matched careers linked to `user_id`.
  6. `user_feedback` — Stores student **Like / Show Different** feedback events and shaped Bellman rewards.
  7. `q_learning_state` — Persists the learned contextual Q-learning policy matrix across server restarts.

### Pre-Seeded Demo Student Account
For instant testing or live Viva demonstration, a demo account is automatically created in `data/sankalp.db`:
- **Email**: `demo@student.edu`
- **Password**: `student123`
- You can also register any number of new student accounts via the **Sign Up** tab!

### How to Show the Database Tables to Your Sir
If your guide asks *"Show me the live database tables and records on your laptop"*:
1. Install the free VS Code extension **"SQLite Viewer"** (by Florian Klampfer) or **"DB Browser for SQLite"** (`https://sqlitebrowser.org/`).
2. Click `data/sankalp.db` inside VS Code — all 7 tables (`users`, `saved_items`, `recommendation_logs`, `user_feedback`, etc.) open visually in a spreadsheet grid!

---

## 2. Step-by-Step Setup on Your Windows / Mac / Linux Laptop

### Step 1: Install Node.js LTS
1. Download and install **Node.js v20 LTS or v22 LTS** from `https://nodejs.org/`.
2. Verify in PowerShell / Terminal:
   ```bash
   node -v
   npm -v
   ```
   *(Windows Tip: During the Node.js installer, if asked about "Tools for Native Modules", leave it checked or use Node 20/22 LTS which automatically downloads prebuilt `better-sqlite3` binaries).*

### Step 2: Download / Extract the Project Folder
1. Download or clone the project folder onto your laptop (for example `C:\Projects\smart-career-advisor`) and open a terminal inside that folder:
   ```bash
   cd smart-career-advisor
   ```

### Step 3: Install Project Dependencies
```bash
npm install
```

### Step 4: (Optional) Configure `.env` for Cloud AI Chatbot
1. Copy `.env.example` to `.env`:
   - **Windows PowerShell**: `Copy-Item .env.example .env`
   - **Mac / Linux**: `cp .env.example .env`
2. **Important**:
   - Even **without** any API key (100% offline in your college lab!), the entire website works—including Login/Signup, Stream Explorer, SBERT (`Xenova/all-MiniLM-L6-v2`) Career Finder, Q-Learning, Voice Input, and the built-in Knowledge-Base Career Mentor!
   - On the very first run, the local SBERT model (`~86 MB`) downloads once into `.cache/transformers/` and runs offline forever after.
   - If you also want enhanced cloud conversational replies in the Chatbot on your laptop, paste a free Gemini API key into `.env` (`GEMINI_API_KEY="your_key_here"`).

### Step 5: Start the Full-Stack Website (Frontend + Backend + SQLite)
```bash
npm run dev
```
Open your browser at:
**`http://localhost:3000`**

---

## 3. Useful Commands for Evaluation & Viva

| Command | What It Does |
| :--- | :--- |
| `npm run dev` | Starts Express + SQLite + AI Engine + React UI on `http://localhost:3000` |
| `npm run evaluate` | Runs the 240-profile benchmark (`80` train / `160` test) and regenerates all 9 PNG/SVG graphs & 7 architecture diagrams |
| `npm run build` | Compiles optimized production frontend into `dist/` |
| `npm run lint` | Verifies zero TypeScript errors across the entire project |

---

## 4. Recommended Presentation Flow for Your Sir (5–7 Minutes)

1. **Show `Home` & `Explore Streams` (Student View)**: Demonstrate how a 10th-pass student who knows nothing can explore Science PCM/PCB, Commerce, Arts, and Polytechnic Diploma—seeing subjects, *"What Next?"* (`B.Tech`, `MBBS`, `CA`, `MBA`), salaries, roadmaps, free notes, and best YouTube channels.
2. **Show `Sign In / Sign Up` & `My Dashboard`**: Create a student account (or click **Demo Student Login**), bookmark a stream and career, and show how SQLite persists user accounts, bookmarks, and past assessments.
3. **Run `Career Finder` + `Ask Mentor`**: Pick interests/subjects (or use Hindi/Kannada voice/text), view personalized career matches, click **I Like This Option** (live Q-learning update), and print/view the roadmap.
4. **Open `Project Report` (Final Tab — Guide View)**: Show your Sir the module-by-module alignment with the *Sankalp* IEEE paper, the Limitations Overcome table, the **Live 4-Model Comparison** (`Rule-Only` vs `SBERT-Only` vs `Original Baseline` vs `Our Improved Engine`), and the 9 measured research graphs!
