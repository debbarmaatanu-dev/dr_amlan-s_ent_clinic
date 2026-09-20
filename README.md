# Major Amlan's ENT & Allergy Clinic — Frontend

Official marketing and **online appointment** site for Major Amlan's ENT & Allergy Clinic (Agartala, West Tripura). This repository is the **SPA only**. Business logic for payments and protected APIs lives in a **separate backend** repository, deployed as its own Vercel project. The frontend still ships a tiny **Vercel serverless** proxy under `api/` for PhonePe webhooks (see below).

Canonical production host (from app SEO and `vercel.json`): [www.dr-major-amlan-ent.in](https://www.dr-major-amlan-ent.in/)

## Developer documentation

- [Frontend architecture and folder structure](docs/ARCHITECTURE.md)
- [User flows and backend API](docs/FLOWS_AND_API.md)

## About the clinic

- Comprehensive ENT consultations, allergy testing and immunotherapy, endoscopic/microscopic procedures, serum-specific IgE testing.
- Consultation fee: ₹400 per visit.

## Clinic schedule & online booking rules

Schedule copy and client-side date validation live in **`src/constants/clinicSchedule.ts`**. Keep this file in sync with the backend mirror (`clinicSchedule.ts` in the backend repo).

| Rule                 | Detail                                                                           |
| -------------------- | -------------------------------------------------------------------------------- |
| **Evening clinic**   | Mon, Tue, Thu, Fri, and most Sat — **6:00 PM – 8:30 PM**                         |
| **Sunday clinic**    | **10:30 AM – 1:00 PM** (online booking allowed)                                  |
| **Closed**           | Every **Wednesday**; **2nd & 4th Saturday** of each month                        |
| **Advance window**   | Up to **10 days** ahead                                                          |
| **Same-day cutoffs** | **7:00 PM** (evening days); **12:00 PM** (Sundays)                               |
| **Admin override**   | Manual closure via backend `clinic_control` (banner + booking block when active) |

**Where it is enforced in the frontend**

- **Booking form:** `appointmentService.validateDateConstraints()` → `validateBookingDate()` before slot check / payment.
- **Navbar banner:** `getNavbarScheduleStatus()` — open/closed messaging and colors (orange = scheduled/off-hours closed, red = admin override, blue = open).
- **Sticky header:** On **Wednesday**, **2nd/4th Saturday**, and **admin override**, the top info banner stays pinned with the nav while scrolling; on other days only the main nav is sticky.
- **Patient copy:** `CLINIC_SCHEDULE_SUMMARY` (plain text) and `ClinicScheduleSummaryText` (styled JSX for appointment help + home FAQ).
- **SEO:** `useSEO.ts` meta + JSON-LD; static fallback in `index.html`; `public/sitemap.xml` lastmod on content pages.

Server-side enforcement on payment order creation is on the **backend**; the frontend rules improve UX and catch invalid dates early.

## Location & contact

Capital pathlab, in between Sankar Chowmuhani and Bijoykumar Chowmuhani, near Lenskart  
Agartala, West Tripura — 799001

- Phone: +91 6033521499
- WhatsApp: +91 6033521499
- Email: debbarmaamlan@gmail.com

## Technology stack (as in `package.json`)

| Layer         | Packages                                                                                                                                  |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| UI            | React 19, TypeScript 7                                                                                                                    |
| Build         | Vite 8 (Rolldown + Oxc minify), `@vitejs/plugin-react` with **React Compiler** (`oxc-transform-react`)                                    |
| CSS           | Tailwind CSS 4 (`tailwindcss`, `@tailwindcss/vite` in **devDependencies**), `tailwind.config.ts` (dark mode: `class`, custom breakpoints) |
| Routing       | `react-router-dom` 7 (lazy-loaded pages, `Suspense`)                                                                                      |
| State         | Zustand 5 + Immer (`src/appStore/*` slices)                                                                                               |
| Auth          | Firebase 12 browser SDK for Google sign-in and ID tokens; booking data comes from the backend                                             |
| Integrations  | Google sign-in (admin), PhonePe (**redirect** flow via backend), Google Maps / Places (via CSP allowlist), Cloudinary assets              |
| PDF / capture | `jspdf`, `html-to-image`                                                                                                                  |
| Icons         | Font Awesome subset loaded from `src/utils/icons.ts`                                                                                      |
| Lint / format | oxlint (type-aware) + oxfmt (no ESLint/Prettier)                                                                                          |
| Tests         | Jest + Testing Library — co-located `src/**/*.test.ts(x)` for services, helpers, and selected components                                  |
| Dead code     | [Fallow](https://fallow.tools) (`.fallowrc.json`)                                                                                         |

**Lockfile:** this project uses **Bun** (`bun.lock`). Check the Vercel project settings for its install and build commands; `vercel.json` does not set either command.

## Security, supply chain, and CI

- **Dependency versions:** Runtime and tooling use **exact** versions in `package.json`. `bunfig.toml` sets `exact = true`, `ignoreScripts = true`, and a 3-day `minimumReleaseAge`.
- **Install policy:** GitHub Actions runs `bun install --frozen-lockfile` then `bun run allow-scripts`. For Vercel, confirm the install-command override in project settings before relying on the same sequence.
- **Build:** Vite 8 uses **Rolldown**; production **`minify: 'oxc'`** (`vite.config.ts`).
- **Postinstall scripts:** `@lavamoat/allow-scripts` with `package.json` script `bun run allow-scripts`, **`lavamoat.allowScripts`** + Bun **`trustedDependencies`** aligned to only the packages that need lifecycle scripts (e.g. `esbuild`, `protobufjs`, `core-js`, `unrs-resolver`). `bun run check-install-scripts` fails if a top-level package grows an unexpected install script.
- **GitHub Actions:** [`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs verify (oxlint, oxfmt check, `tsc`, Jest, Fallow dead-code) plus a non-blocking `bun audit` summary.
- **Socket.dev:** The **Socket.dev** GitHub app is installed on this repository for ongoing dependency/supply-chain visibility (complements `bun audit` and the workflow).

Production is deployed on **Vercel**; the repository does not record the Vercel project's install/build command overrides.

## Architecture at a glance

- **React SPA**: `index.html` + `src/main.tsx` → `App` → `AuthWrapper` → `Routing`.
- **HTTP backend** (`import.meta.env.VITE_API_BACKEND_URL`): All booking-critical reads/writes happen via the backend (slot availability, payment order creation, payment status, clinic status, appointment search, and protected admin operations). The frontend keeps a small **30s in-memory cache** for slot availability in `src/services/appointmentService.ts`.
- **Firestore (browser)**: **Not used** for booking slots/availability in the current code paths (intentionally moved to backend Admin SDK so client Firestore rules can be tightened safely).
- **Admin UI**: Firebase Google popup sign-in; only emails listed in env vars are treated as admins in the client (-navbar modals, download/control tools). Server-side authorization for APIs is enforced on the backend.
- **`AuthWrapper`**: Syncs Firebase `onIdTokenChanged` into Zustand; initializes theme from cookie.
- **`ProtectedRoute`** (wraps `/admin-login`): If an admin session already exists, user is redirected to **`/home`** so the login screen is only for unauthenticated visitors.
- **`useSEO`**: Per-route `<title>`, meta, canonical URLs, and structured data (including `openingHours`; Wednesday omitted — 2nd/4th Sat not expressible in JSON-LD). Defaults align with production domain; `index.html` provides a no-JS fallback description.

## Routes

| Path                                            | Purpose                                                                                     |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `/`, `/home`                                    | Landing                                                                                     |
| `/about`, `/contact`, `/faq`, `/privacy-policy` | Static content                                                                              |
| `/appointment`                                  | Slot check, booking form, PhonePe return handling, receipts, admin shortcuts when logged in |
| `/admin-login`                                  | Google admin login                                                                          |

Floating WhatsApp / “scroll to top” controls are hidden on `/admin-login` and paths that mimic a payment-return experience where noted in layout code.

## Environment variables (`VITE_*` = exposed to browser)

Create `.env.local` (or set in Vercel **Environment Variables**) with:

**Backend**

- `VITE_API_BACKEND_URL` — Base URL of the separate backend deployment (no trailing slash required consistently; code concatenates paths like `/api/...`).

**Firebase (web app)**

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID` (Analytics, if used)

**Admin allowlist (client-side UX only; backend must still verify)**

- `VITE_FIREBASE_ADMIN_EMAIL1`
- `VITE_FIREBASE_ADMIN_EMAIL2`

Never commit real secrets; keep them in local env files (gitignored) or Vercel.

## Vercel serverless (`api/`)

- `api/payment/webhook.js` — Proxies PhonePe webhooks to the real backend (`BACKEND_URL`, optional `WEBHOOK_ENDPOINT_PATH`) so webhook URLs can use the frontend-approved domain while processing stays on the backend.
- `api/payment/webhook-test.js` — Test counterpart.

**Note:** The webhook proxy currently has a fallback default backend URL in code if `BACKEND_URL` is not set. Prefer setting `BACKEND_URL` in Vercel env for correctness across Preview/Production.

SPA routing, apex→www redirect, and security headers (CSP covering Firebase, Google, PhonePe, Maps, backend host) are declared in **`vercel.json`**.

## Project layout

```
dr_amlan-s_ent_clinic/
├── .github/workflows/        # CI verify + audit (ci.yml)
├── .fallowrc.json            # Fallow config (dead-code, dupes, health)
├── .oxlintrc.json            # oxlint (type-aware)
├── .oxfmtrc.json             # oxfmt
├── api/                      # Vercel Node handlers (webhook proxy)
├── docs/                     # Architecture and backend flow documentation
├── public/                   # Static assets (favicons, robots.txt, sitemap, manifest)
├── scripts/                  # install-script allowlist checker
├── tests/__mocks__/          # Jest CSS/asset stubs
├── src/
│   ├── appComponents/        # Navbar, Footer, ProtectedRoute, loading/floating UI
│   │   └── bottomFloatingIcons/   # WhatsApp, scroll-to-top
│   ├── appStore/             # Zustand slices (admin, button, theme, clinic)
│   ├── assets/
│   ├── components/           # Pages sections + modals + appointment UI
│   │   └── ClinicScheduleSummaryText.tsx   # Styled schedule copy (semibold highlights)
│   ├── constants/
│   │   └── clinicSchedule.ts # Schedule rules, validation, navbar status, display strings
│   ├── hooks/                # SEO, theme, clinic status, modals, etc.
│   ├── pages/                # Route-level screens
│   ├── services/             # firebase.ts, appointmentService.ts, googleLoginHelper.ts
│   ├── types/
│   ├── utils/                # logger, icons, pdf, modal helpers
│   ├── App.tsx
│   ├── AuthWrapper.tsx
│   ├── main.tsx
│   ├── Routing.tsx
│   └── index.css
├── babel.jest.cjs / jest.config.cjs / jest.setup.cjs
├── bunfig.toml
├── tailwind.config.ts
├── tsconfig*.json            # including tsconfig.no-tests.json
├── vite.config.ts            # `@` → ./src (path alias mirrors tsconfig paths)
├── vercel.json
├── package.json
└── bun.lock
```

Path alias: **`@/`** → **`src/`** (see `tsconfig.app.json` and `vite.config.ts`).

## Prerequisites

- [Bun](https://bun.sh/) (recommended; matches CI/Vercel and `bun.lock`)
- Alternatively Node 20+ if you invoke Vite/tsc via `npx`; you must keep lockfiles and install commands consistent with your team.

## Scripts

```bash
bun install                 # install dependencies (uses bun.lock; skips lifecycle scripts)
bun run allow-scripts       # run allow-listed package install scripts
bun run dev                 # Vite dev server
bun run build               # app typecheck + vite production build
bun run preview             # preview production build locally
bun run lint                # oxlint
bun run format              # oxfmt
bun run format:check        # oxfmt check (no writes)
bun run tsc                 # typecheck (project references)
bun run tsc:app             # typecheck app sources, excluding tests
bun run test                # Jest (co-located src/**/*.test.ts)
bun verify                  # lint + format:check + tsc + tsc:app + test + fallow dead-code
bun run fallow:dead         # Fallow dead-code
bun run check-install-scripts
bun audit                   # dependency security audit (also run in CI)
```

Tests live next to the code they cover (e.g. `src/services/appointmentService.test.ts`). They are excluded from `tsconfig.app.json` / production `build` and ignored by Fallow; Vite never bundles them because nothing in the app entry imports them.

## Repository

Git remote (from `package.json`): `https://github.com/debbarmaatanu-dev/dr_amlan-s_ent_clinic`

## License

**PROPRIETARY — NOT OPEN SOURCE**

This software is confidential and owned by Dr. (Major) Amlan Debbarma. Unauthorized copying, distribution, or use is prohibited. See [LICENSE](./LICENSE).

## Developer

**Atanu Debbarma** — [@AtanuDebbarma](https://github.com/AtanuDebbarma)

---

© 2026 Major Amlan's ENT & Allergy Clinic. All rights reserved.
