# Dr. (Major) Amlan's ENT Clinic — Frontend

Official marketing and **online appointment** site for Dr. (Major) Amlan's ENT Clinic (Agartala, West Tripura). This repository is the **SPA only**. Business logic for payments and protected APIs lives in a **separate backend** repository, deployed as its own Vercel project. The frontend still ships a tiny **Vercel serverless** proxy under `api/` for PhonePe webhooks (see below).

Canonical production host (from app SEO and `vercel.json`): [www.dr-major-amlan-ent.in](https://www.dr-major-amlan-ent.in/)

## About the clinic

- Comprehensive ENT consultations, allergy testing and immunotherapy, endoscopic/microscopic procedures, serum-specific IgE testing.
- Consultation fees are exempt for serving and retired Armed Forces personnel (and dependants with valid ID), per clinic policy reflected on the site.

## Location & contact

1st Floor, Capital Pathlab  
Bijoykumar Chowmuhani  
Agartala, West Tripura — 799001

- Phone: +91 7085548785  
- WhatsApp: +91 6033521499  
- Email: debbarmaamlan@gmail.com  

## Technology stack (as in `package.json`)

| Layer | Packages |
|--------|-----------|
| UI | React 19, TypeScript |
| Build | Vite 8, `@vitejs/plugin-react`, production minify via **oxc** |
| CSS | Tailwind CSS 4, `@tailwindcss/vite`, `tailwind.config.ts` (dark mode: `class`, custom breakpoints) |
| Routing | `react-router-dom` 7 (lazy-loaded pages, `Suspense`) |
| State | Zustand 5 + Immer (`src/appStore/*` slices) |
| Auth & realtime data | Firebase 12 (Auth + Firestore client SDK) |
| Integrations | Google sign-in (admin), PhonePe (**redirect** flow via backend), Google Maps / Places (via CSP allowlist), Cloudinary assets |
| PDF / capture | `jspdf`, `html-to-image` |
| Icons | Font Awesome subset loaded from `src/utils/icons.ts` |
| Tooling | ESLint flat config (`eslint.config.ts`), Prettier, Bun for scripts |

**Lockfile:** this project uses **Bun** (`bun.lock`). Vercel is configured with `bun install --frozen-lockfile` and `bun run build` in `vercel.json`.

## Security, supply chain, and CI

- **Dependency versions:** Runtime and most tooling use **exact** versions in `package.json` (a few dev deps may still use semver ranges; adjust if you require full pinning).
- **Install policy:** `bun install --frozen-lockfile` on **Vercel** and in **GitHub Actions** so deploys and CI match `bun.lock`.
- **Build:** Vite production **`minify: 'oxc'`** (`vite.config.ts`) — OXC minifier (faster builds vs typical SWC-only setups, smaller attack surface than ad-hoc minifier churn).
- **Postinstall scripts:** `@lavamoat/allow-scripts` with `package.json` script `bun run allow-scripts` (`allow-scripts auto`), **`lavamoat.allowScripts`** + Bun **`trustedDependencies`** aligned to only the packages that need lifecycle scripts (e.g. `esbuild`, `protobufjs`, `core-js`, `unrs-resolver`).
- **GitHub Actions:** [`.github/workflows/audit.yml`](.github/workflows/audit.yml) runs on pushes/PRs that touch `package.json` or `bun.lock`: `bun install --frozen-lockfile`, `bun audit`, and a check that no unexpected `node_modules` install scripts appear beyond the same allowlist.
- **Socket.dev:** The **Socket.dev** GitHub app is installed on this repository for ongoing dependency/supply-chain visibility (complements `bun audit` and the workflow).

Production is deployed on **Vercel** with the above install/build commands.

## Architecture at a glance

- **React SPA**: `index.html` + `src/main.tsx` → `App` → `AuthWrapper` → `Routing`.
- **Firestore (browser)**: Reads `appointment_bookings` documents keyed by booking date (`DD-MM-YYYY`) to compute remaining **online** slots (default cap **10**/day); local 30s cache in `appointmentService.ts`. Writes for bookings happen on the backend after payment, not directly from arbitrary client writes in this flow.
- **HTTP backend** (`import.meta.env.VITE_API_BACKEND_URL`): Creates PhonePe orders, checks payment/webhook status, clinic override status, appointment search, protected admin downloads and clinic toggles.
- **Admin UI**: Firebase Google popup sign-in; only emails listed in env vars are treated as admins in the client (-navbar modals, download/control tools). Server-side authorization for APIs is enforced on the backend.
- **`AuthWrapper`**: Syncs Firebase `onIdTokenChanged` into Zustand; initializes theme from cookie.
- **`ProtectedRoute`** (wraps `/admin-login`): If an admin session already exists, user is redirected to **`/home`** so the login screen is only for unauthenticated visitors.
- **`useSEO`**: Per-route `<title>`, meta, and canonical URLs (defaults align with production domain).

## Routes

| Path | Purpose |
|------|---------|
| `/`, `/home` | Landing |
| `/about`, `/contact`, `/faq`, `/privacy-policy` | Static content |
| `/appointment` | Slot check, booking form, PhonePe return handling, receipts, admin shortcuts when logged in |
| `/admin-login` | Google admin login |

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

SPA routing, apex→www redirect, security headers (CSP covering Firebase, Google, PhonePe, Maps, backend host), and build/install commands are declared in **`vercel.json`**.

## Project layout

```
dr_amlan-s_ent_clinic/
├── .github/workflows/        # e.g. Security Audit (audit.yml)
├── api/                      # Vercel Node handlers (webhook proxy)
├── public/                   # Static assets (favicons, robots.txt, sitemap, manifest)
├── src/
│   ├── appComponents/        # Navbar, Footer, ProtectedRoute, loading/floating UI
│   ├── appStore/             # Zustand slices (admin, button, theme, clinic)
│   ├── assets/
│   ├── components/           # Pages sections + modals + appointment UI
│   ├── constants/
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
├── eslint.config.ts
├── tailwind.config.ts
├── tsconfig*.json
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
bun install                 # install dependencies (uses bun.lock)
bun run dev                 # Vite dev server
bun run build               # tsc project build + vite production build
bun run preview             # preview production build locally
bun run lint                # ESLint
bun run format              # Prettier (src)
bun run tsc                 # typecheck only
bun run allow-scripts       # Lavamoat allow-scripts (dependency postinstall policy)
```

## Repository

Git remote (from `package.json`): `https://github.com/debbarmaatanu-dev/dr_amlan-s_ent_clinic`

## License

**PROPRIETARY — NOT OPEN SOURCE**

This software is confidential and owned by Dr. (Major) Amlan Debbarma. Unauthorized copying, distribution, or use is prohibited. See [LICENSE](./LICENSE).

## Developer

**Atanu Debbarma** — [@AtanuDebbarma](https://github.com/AtanuDebbarma)

---

© 2026 Dr. (Major) Amlan's ENT Clinic. All rights reserved.
