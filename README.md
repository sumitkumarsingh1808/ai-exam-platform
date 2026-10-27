# AI-Powered Online Examination Platform (NTA Pattern)

A complete, production-ready, responsive Computer Based Test (CBT) web application inspired by the official **National Testing Agency (NTA)** examination interface (`https://nta.ac.in/Quiz/Home/Paper?Lng=1`).

The platform incorporates automated **Google Gemini AI** question authoring from uploaded study materials (PDFs and images), the signature **5-status NTA Question Palette**, countdown timer with server-authoritative deadline, real-time auto-saving, server-side negative marking, anti-cheating key isolation, and a controller administration suite.

---

## Key Highlights & Features

### 1. Authentic NTA Examination Interface
- **Top Examination Header**: Application logo, candidate identity card, examination and subject metadata, digital countdown clock, language toggle (`English` / `हिन्दी`), question paper overview, and instructions.
- **Two-Column Desktop Examination Layout**:
  - **Left Section (Question Panel)**: Large typography question viewer, marking scheme badge (`+4.00` correct, `-1.00` negative), 4 radio-selectable option rows with hover and selection highlights, bottom action bar with:
    - `Save & Next` (Green)
    - `Clear Response` (White outline)
    - `Save & Mark for Review` (Purple with green evaluation badge)
    - `Mark for Review & Next` (Violet)
    - `<< Previous` and `Next >>` navigation
    - `Submit Examination` button
  - **Right Section (Question Palette)**:
    - Candidate mini photo card
    - The **5 official NTA statuses** with exact counts:
      1. **Answered** (Green badge) — Evaluated
      2. **Not Answered** (Red badge)
      3. **Not Visited** (Gray box)
      4. **Marked for Review** (Violet circle)
      5. **Answered & Marked for Review** (Violet circle with green badge) — Considered for evaluation
    - Numbered question grid (1 to N) with instant status feedback and direct jumping.
- **Mobile Responsive Navigation**: Drawer-based question palette, sticky top countdown timer, touch-friendly touch targets with zero horizontal scrolling.
- **Server-Authoritative Countdown Timer**: Ticks down based on server timestamps and automatically triggers submission when time reaches zero.
- **Auto-Save & Progress Persistence**: Answers are continuously saved to the backend; refreshing the page or temporary network loss restores the exact state without losing answers.

### 2. Administrator & Controller Portal (`/admin`)
- **Initial Dev Credentials**:
  - **Username**: `sumit045`
  - **Password**: `sumit045`
- **Security & RBAC**:
  - Passwords hashed using `bcrypt` (10 rounds).
  - Rate-limited login (max 5 attempts per 15 minutes).
  - Signed HTTP-only session cookies (`nta_admin_session`).
  - Mandatory prompt and dedicated Settings page to change the default password.
- **Dashboard Telemetry**: Real-time stats cards (Total Users, Total Quizzes, Published Quizzes, Attempts, Average Score, Highest Score), candidate score distribution progress bars, recent attempts, and new registrations.
- **Quiz Management**:
  - Full CRUD operations with search and status filtering (Draft, Published, Archived).
  - 1-click publish / unpublish toggle.
  - Safe archival deletion preserving historical attempt audit trails.
- **Study Material Upload & AI Question Authoring**:
  - Upload study documents in PDF, PNG, JPG, JPEG, and WebP (up to 15MB).
  - Serverless text extraction via `pdf-parse` and Gemini vision multimodal integration.
  - Configure title, subject, question count, difficulty, marks, and negative marking.
  - Generates 4-option multiple choice questions with explanations and source references.
  - Interactive Question Builder: Edit question prompts, tweak option text, click radio buttons to set the official answer key, add manual questions, or delete questions before publishing.
- **User & Attempt Management**:
  - Registered user directory with search.
  - View individual candidate attempt history.
  - Sanitized CSV export with formula injection prevention (`=`, `+`, `-`, `@` escaped).

### 3. Candidate & Student Experience
- **Authentication**: Google Sign-In via Firebase Auth and a 1-click Instant Demo Sign-In for rapid evaluation.
- **Pre-Exam Instructions**: Official NTA instructions, marking scheme table, and mandatory declaration checkbox.
- **Results & Scorecard**: Instant breakdown of score obtained vs maximum marks, percentage, accuracy, time taken, and question-by-question review with Gemini AI educational explanations.

---

## Technology Stack

- **Framework**: Next.js 15 (App Router, Server Actions & Route Handlers)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS with custom NTA color schemes and clip-paths
- **Icons**: Lucide React
- **AI Engine**: Google Gemini API (`@google/generative-ai` & `@google/genai`)
- **Authentication**: Firebase Auth (Google Sign-In) & Secure Admin JWT Cookies
- **Database**: Google Cloud Firestore (Firebase Admin SDK) with zero-dependency local JSON fallback for local testing
- **Document Processing**: `pdf-parse` (Vercel serverless compatible)
- **Testing**: Vitest automated test suite

---

## Directory Structure

```
├── .env.example              # Environment variables template
├── firestore.rules           # Cloud Firestore security rules
├── firestore.indexes.json    # Composite query indexes
├── package.json              # Dependencies and scripts
├── vitest.config.ts          # Automated testing configuration
├── src/
│   ├── app/
│   │   ├── page.tsx          # Public Examination Portal home
│   │   ├── login/page.tsx    # Candidate sign in
│   │   ├── dashboard/        # Candidate dashboard & history
│   │   ├── exam/[id]/        # Live NTA CBT interface
│   │   │   ├── instructions/ # Pre-exam instructions & declaration
│   │   │   ├── page.tsx      # Authentic 2-column examination layout
│   │   │   └── result/[att]/ # Scorecard & question review
│   │   ├── admin/            # Protected administrator panel
│   │   │   ├── page.tsx      # Telemetry dashboard
│   │   │   ├── login/        # Admin sign in (sumit045)
│   │   │   ├── quizzes/      # Quiz directory & editor
│   │   │   ├── materials/    # PDF/image study material upload
│   │   │   ├── users/        # Registered candidate directory
│   │   │   ├── analytics/    # Attempt logs & CSV export
│   │   │   └── settings/     # Admin password change
│   │   └── api/              # Secure Next.js route handlers
│   │       ├── auth/         # Admin login, session, password change
│   │       ├── admin/        # Materials, quizzes, analytics, CSV
│   │       ├── quizzes/      # Published papers, attempts, safe exam
│   │       └── attempts/     # Auto-save, submission, results
│   ├── components/
│   │   ├── exam/             # ExamHeader, QuestionPanel, QuestionPalette, Modals
│   │   ├── admin/            # AdminSidebar, AdminHeader
│   │   └── Navbar.tsx        # Responsive navigation
│   └── lib/
│       ├── types.ts          # Core TypeScript data contracts
│       ├── db.ts             # Database layer (Firestore + local fallback)
│       ├── gemini.ts         # Google Gemini AI question generator
│       ├── auth.ts           # bcrypt hashing, JWT tokens, rate limiting
│       ├── scoring.ts        # NTA evaluation & negative marking engine
│       ├── validation.ts     # Zod request validators
│       ├── utils.ts          # CSV sanitizer & exam status calculator
│       └── firebase.ts       # Firebase client configuration
└── tests/
    ├── scoring.test.ts       # NTA evaluation & negative marks tests
    ├── auth.test.ts          # bcrypt hashing & JWT token tests
    └── utils.test.ts         # CSV formula injection & summary tests
```

---

## Local Setup & Development

### 1. Prerequisites
- Node.js 18+ (tested on Node 24)
- `pnpm` (or `npm`)

### 2. Installation
```bash
# Clone the repository and navigate into it
cd ai-exam-platform

# Install dependencies
pnpm install
```

### 3. Configure Environment Variables
Create a `.env.local` file by copying `.env.example`:
```bash
cp .env.example .env.local
```

Fill in your configuration keys:
```env
# Gemini API Key (Get from https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash

# Firebase Client SDK (For Google Sign-In)
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (For Server-Side Firestore)
FIREBASE_ADMIN_PROJECT_ID=your-project
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Admin Authentication
ADMIN_USERNAME=sumit045
ADMIN_INITIAL_PASSWORD=sumit045
SESSION_SECRET=a_secure_random_32_character_string
```

> **Note on Zero-Configuration Local Development**: If you do not yet have Firebase credentials configured, the application automatically uses a resilient, atomic local fallback database (`.data/db.json`). All features (including sample NTA mock exams, candidate login, test taking, scoring, and admin controls) work immediately out of the box!

### 4. Run Automated Tests
```bash
pnpm test
```

### 5. Start the Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Default Administrator Access

1. Open `/admin/login` in your browser.
2. Enter the initial administrator credentials:
   - **Username**: `sumit045`
   - **Password**: `sumit045`
3. Click **Sign In as Admin**.
4. You will see an administrative banner advising you to change the default password. Navigate to **Settings** (`/admin/settings`) to update your password securely.

---

## Deploying to Vercel

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Log in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Select your repository.
4. In **Environment Variables**, add the variables from `.env.example`:
   - `GEMINI_API_KEY`: Your Gemini API key
   - `GEMINI_MODEL`: `gemini-2.5-flash`
   - `NEXT_PUBLIC_FIREBASE_API_KEY`: Firebase web API key
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Firebase auth domain
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Firebase project ID
   - `NEXT_PUBLIC_FIREBASE_APP_ID`: Firebase app ID
   - `FIREBASE_ADMIN_PROJECT_ID`: Firebase project ID
   - `FIREBASE_ADMIN_CLIENT_EMAIL`: Service account client email
   - `FIREBASE_ADMIN_PRIVATE_KEY`: Service account private key (including `\n` linebreaks)
   - `ADMIN_USERNAME`: `sumit045`
   - `ADMIN_INITIAL_PASSWORD`: Secure initial password
   - `SESSION_SECRET`: Random 32+ character string
5. Click **Deploy**. Vercel will build and deploy the Next.js application.
6. Open your production URL, log in to `/admin`, and change the administrator password.

---

## Security Safeguards

- **Question Key Isolation**: Raw question objects containing `correctAnswerIndex` and `explanation` are strictly filtered out in `/api/quizzes/[id]/exam`. Examinees receive only question texts, option choices, and difficulty ratings.
- **Server-Authoritative Evaluation**: Candidate scores are calculated on the server using verified keys. No scores are computed in the browser.
- **Duplicate Submission Lock**: Submissions check the attempt status atomically to prevent re-submission or replay attacks.
- **Formula Injection Prevention**: CSV export cells are sanitized to neutralize spreadsheet execution vectors (`=`, `+`, `-`, `@`).
- **Rate-Limited Admin Auth**: Protects against brute-force attacks by locking credentials after 5 failed attempts per IP.
- **Strict Role Enforcement**: Google-authenticated users receive the `user` role on the server; client-provided roles are ignored.
