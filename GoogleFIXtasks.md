# Google PageSpeed / Core Web Vitals Fix Plan

> **Scope:** Home route (`/` and `/home`) — Desktop & Mobile  
> **Constraint:** No functionality changes. Every fix is a pure performance or configuration improvement. Nothing that changes how the app behaves for users.  
> **Diagnostics:** Run `bun run build` after each task group to verify the build passes. Run `bun run tsc` to catch any TypeScript errors introduced. Use `bun run lint` to check for linting issues.  
> **Stack:** Vite 8 + React 19 + Tailwind v4 + Firebase Auth + Cloudinary images + Font Awesome (runtime-injected subset)

### Available diagnostic commands (from `package.json`)

```bash
bun run build      # Full production build — run after every task to confirm nothing broke
bun run tsc        # TypeScript type check only — fast, no emit
bun run lint       # ESLint across all .ts/.tsx files
bun run dev        # Local dev server — visually verify changes before building
bun run preview    # Serve the production build locally — closest to real deployment
```

Run `bun run build` + `bun run preview` after completing all tasks in a group to verify both the build output and visual appearance before deploying.

---

## Current Scores (Baseline)

The diagnostics were run separately on desktop and mobile, which is why the numbers differ. The underlying problems are identical in the code — desktop hardware and faster connections mask the severity. Every fix here is a single code change that improves both environments. Some issues only appeared in the mobile Lighthouse report because mobile simulation is more aggressive (throttled CPU, slower network), but the code path is the same. There are no separate mobile-only or desktop-only fixes.

| Metric      | Desktop  | Mobile       |
| ----------- | -------- | ------------ |
| FCP         | 0.7s ✅  | 3.6s ❌      |
| LCP         | 1.6s ✅  | 8.6s ❌      |
| TBT         | 50ms ✅  | 40ms ✅      |
| CLS         | 0.015 ✅ | **0.386 ❌** |
| Speed Index | 1.8s     | 3.6s         |
| Performance | ~90+     | **64**       |

Desktop CLS of 0.015 and LCP of 1.6s look acceptable only because desktop CPUs parse JS faster and connections are faster — the same layout shift and image discovery problems exist in the code. Fixing them improves both.

**Primary targets:** LCP and CLS — universal fixes, one change covers both environments.

## Files Touched — Master Reference

All files that will be modified across all tasks. No new files are created. No files are deleted. No logic, routing, auth, or UI behaviour changes.

| File                                                | Task(s)     | Type of Change                                                                                              |
| --------------------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------- |
| `index.html`                                        | 2, 3, 7, 11 | Add preload/preconnect hints, remove unused preconnects, add CSP meta tag, confirm Maps dns-prefetch        |
| `src/components/homeComponents/Landing.tsx`         | 1           | Replace `display:none` toggle with `opacity` transition, add `aspect-ratio` to wrapper, add `fetchPriority` |
| `src/utils/icons.ts`                                | 3           | Remove the `@import` line inside the injected style block                                                   |
| `src/assets/Logo_SVG.tsx`                           | 4           | File becomes unused — can be deleted after LogoSection is updated                                           |
| `src/appComponents/nav/topNavbar/LogoSection.tsx`   | 4           | Replace `<LogoSVG />` with a plain `<img>` tag                                                              |
| `src/appComponents/nav/topNavbar/Navbar.tsx`        | 9, 12       | Touch target sizing on nav buttons; fix forced reflow in clock `useEffect`                                  |
| `src/appComponents/nav/topNavbar/NavLinks.tsx`      | 9           | Touch target sizing audit on desktop and mobile nav link buttons                                            |
| `src/constants/images.ts`                           | 8           | Add Cloudinary transformation parameters to all URLs                                                        |
| `vite.config.ts`                                    | 5           | Add `rollupOptions.output.manualChunks`                                                                     |
| `src/appStore/clinicSlice.ts`                       | 6           | Add 403 guard in `fetchClinicStatus` to stop retrying a dead endpoint                                       |
| `src/AuthWrapper.tsx`                               | 10          | Call `setAuthInitialized(true)` inside the `onIdTokenChanged` callback                                      |
| `src/components/homeComponents/FAQSection.tsx`      | 9           | ARIA role audit                                                                                             |
| `src/components/homeComponents/FeaturesSection.tsx` | 9           | ARIA role audit + touch target sizing                                                                       |
| `src/appComponents/nav/footer/Footer.tsx`           | 11          | Wrap Maps iframe in an `IntersectionObserver`-based lazy mount so it only loads when scrolled into view     |

---

## Root Cause Analysis

### CLS (0.386 measured on mobile, same code path on desktop) — Culprit: Right Box Text Content in `Landing.tsx`

The `Landing` component renders a 2-column grid (`grid-cols-1 md:grid-cols-2`). The **Left Box (image)** has no reserved height — it renders a `<figure>` with `h-full w-full max-w-md` but no explicit height. The image is hidden (`display: none`) while loading and replaced by a `ClipLoader` spinner. When the image loads and the spinner disappears, the layout shifts. The **Right Box (text)** also shifts because the grid row height is determined by the image column. Desktop's faster connection means the image loads before the user sees the shift — but the shift still happens in the code. This is the primary CLS source.

### LCP (8.6s mobile / 1.6s desktop, same root cause) — Culprit: Left Box Image in `Landing.tsx`

The LCP element is `DOCTOR_PHOTO` from Cloudinary. Problems:

1. The image is loaded via React JS (lazy-loaded page via `React.lazy`) — it is **not discoverable from the initial HTML**. The browser cannot start fetching it until JS parses, React renders, and the `<img>` tag appears in the DOM.
2. No `<link rel="preload">` for the image in `index.html`.
3. No `fetchpriority="high"` on the `<img>` tag (though `loading="eager"` is set).
4. The `display: none` trick while loading prevents the browser from treating it as the LCP candidate early.
5. Font Awesome is injected via JS (`loadFontAwesome()` in `main.tsx`) which triggers a render-blocking `@import` of `fontawesome.min.css` from cdnjs CDN — this is in the critical path.
6. Firebase auth iframe (`dr-amlan-s-ent-clinic.firebaseapp.com`) loads 90 KiB of JS — unavoidable but can be preconnected.
7. The Vercel clinic-status API (`debbarmaatanu-dev-dramlan-sentclini.vercel.app`) returns 403 — this is a console error and a wasted network request.

### Render-Blocking CSS

`/assets/index-oZE80qzN.css` is the Vite-bundled CSS. It's render-blocking by nature (correct behavior for above-fold styles). The Font Awesome `@import` inside the runtime-injected `<style>` tag creates an **additional render-blocking chain**: JS runs → style injected → browser fetches `fontawesome.min.css` → browser fetches `fa-solid-900.woff2` (147 KiB) + `fa-brands-400.woff2` (106 KiB).

### Google Maps iframe — in Footer, loads on EVERY route including `/`

The Google Maps `<iframe>` is **not** isolated to the `/contact` page. It lives in `Footer.tsx`, which is rendered outside the `<Suspense>` boundary in `Routing.tsx` — meaning it is part of the initial render tree on every single route, including `/` (home). The `<Footer />` sits at the same level as `<NavBar />`, both eagerly loaded before any route-specific content.

```
Routing.tsx
├── <NavBar />          ← eager, every route
├── <Suspense>
│   └── <Routes> ...   ← lazy per route
├── <Footer />          ← eager, every route ← Google Maps iframe is HERE
```

The iframe has `loading="lazy"` set, which means the browser defers loading it until it is near the viewport. On desktop this is fine — the footer is below the fold. On mobile with a short viewport or fast scroll, it can enter the viewport quickly and trigger the Maps JS API load (`maps.googleapis.com` scripts totalling ~350 KiB). This is why the Maps JS API appeared in the Lighthouse network dependency tree for the home route audit.

**Fix:** The iframe already has `loading="lazy"` which is the correct and maximum deferral available for iframes without breaking functionality. The Maps JS API load is triggered by the iframe itself — we cannot control what Google loads inside it. What we can do is add a `preconnect` hint for `https://maps.googleapis.com` so that when the iframe does load, the connection is already established.

Add to `index.html`:

```html
<link rel="dns-prefetch" href="https://maps.googleapis.com" />
<link rel="dns-prefetch" href="https://maps.gstatic.com" />
```

> These are already partially present (`maps.googleapis.com` dns-prefetch exists). Confirm `maps.gstatic.com` is also covered since the Maps JS loads assets from both origins.

**Also note:** The Footer also loads `IMAGES.CLINIC_LOGO` (`DrAmlanLogo_2_spt68s.webp`) as an `<img>` with `loading="lazy"`. This is correct — it is below the fold and should not be preloaded. No change needed there.

**The previous statement in this document that said "Google Maps is on /contact only" was incorrect.** The Maps iframe is in the Footer and renders on every route.

### Firebase Auth (Unavoidable Compromise)

`firebase/auth` initializes on every page load via `AuthWrapper` (which wraps the entire app). The `firebaseapp.com/auth/iframe.js` (90 KiB) is loaded by Firebase Auth for cross-origin session management. **This cannot be removed without breaking auth functionality.** We can only add a `preconnect` hint to reduce connection latency.

### Unused Preconnects

`fonts.googleapis.com` and `fonts.gstatic.com` are preconnected in `index.html` but **no Google Fonts are used** (font stack is `system-ui`). These are wasted connections.

### Forced Reflow — Culprit: Clock `useEffect` in `Navbar.tsx`

Lighthouse explicitly flagged "Forced reflow" in the diagnostics. The source is in `Navbar.tsx`:

```ts
// useEffect runs after mount, queries DOM directly
const hourHand = document.querySelector(`.${styles.hourHand}`) as HTMLElement;
const minuteHand = document.querySelector(
  `.${styles.minuteHand}`,
) as HTMLElement;

hourHand.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
minuteHand.style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
```

`document.querySelector` followed immediately by writing `.style.transform` forces the browser to recalculate layout (reflow) synchronously. Since `NavBar` is eagerly loaded and renders on every route, this reflow happens on every page load including `/`. The fix is to use a `useRef` to hold direct references to the DOM elements instead of querying the DOM imperatively after every render.

### NavBar is eagerly loaded on every route — touch targets

`NavBar` renders outside the `<Suspense>` boundary in `Routing.tsx`, meaning it is part of the initial paint on every route. The nav buttons in `NavLinks.tsx` (desktop) and `MobileLinks` (mobile) use `<button>` elements with `text-sm` sizing and `px-2 py-2` padding. Some of these fall below the 44×44px minimum touch target size that Lighthouse and WCAG require. This is the same issue flagged in the accessibility audit — it applies to navbar buttons as much as to the home page cards.

`LogoSVG` renders a `<svg><image xlinkHref={CLOUDINARY_URL}>`. SVG `<image>` elements are **not preloadable** via standard `<link rel="preload">` and are not treated as high-priority by browsers. The logo is in the navbar which is eagerly loaded (outside Suspense). This contributes to LCP if the logo is the largest visible element before the hero image loads.

---

## Fix Tasks

### TASK 1 — Fix CLS: Reserve image dimensions in `Landing.tsx`

**Files to touch:**

- `src/components/homeComponents/Landing.tsx` — only change is the `<img>` attributes and wrapper `<div>` style. No logic, no state, no routing changes.

**Priority:** 🔴 Critical (CLS 0.386 → target < 0.1)  
**No functionality change:** The image still loads from the same Cloudinary URL. The spinner still shows while loading. The only difference is the image occupies space (invisible) instead of collapsing the container while loading. Visual result is identical once loaded.

**Diagnostic:** Run `bun run dev` and open `/` — confirm the hero image area does not jump when the page loads. Then run `bun run build` to confirm no build errors.

**Problem:** The image container has no fixed height on mobile. The spinner/image swap causes layout shift. The `display: none` on the `<img>` while loading means the container collapses, then expands when the image loads.

**Fix:**

- Remove the `display: none / block` toggle pattern. Instead use `opacity-0 / opacity-100` transition — the image occupies space even while loading, preventing layout shift.
- Set an explicit `aspect-ratio` on the image container so the browser reserves space before the image loads.
- Keep the spinner as an overlay (`position: absolute`) so it doesn't affect layout flow.
- Add `fetchpriority="high"` to the `<img>` tag.

```tsx
// BEFORE (causes CLS):
<img
  src={landingImage}
  style={{ display: loading ? 'none' : 'block' }}
  onLoad={() => setLoading(false)}
  loading="eager"
  width="400"
  height="600"
/>

// AFTER (no CLS):
<img
  src={landingImage}
  className={`h-full w-full object-cover transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
  onLoad={() => setLoading(false)}
  loading="eager"
  fetchPriority="high"
  width="400"
  height="600"
  decoding="async"
/>
```

- Add `aspect-ratio: 2/3` (400/600) to the image wrapper `<div>` so the browser reserves the correct height before the image loads:

```tsx
// Add to the wrapper div:
<div className="relative w-full max-w-md overflow-hidden rounded-3xl shadow-md"
     style={{ aspectRatio: '2/3' }}>
```

**Why this fixes CLS:** The container now has a reserved height from the start. The spinner is absolutely positioned inside it. The image fades in without shifting anything.

---

### TASK 2 — Fix LCP: Preload the hero image in `index.html`

**Files to touch:**

- `index.html` — add `<link rel="preload">` tags and two new `<link rel="preconnect">` tags. Remove two unused `<link rel="preconnect">` tags for Google Fonts. No script changes, no component changes.

**Priority:** 🔴 Critical (LCP 8.6s → target < 2.5s)  
**No functionality change:** Preload hints are purely advisory to the browser. Removing the unused Google Fonts preconnects has no effect on the app since no Google Fonts are used anywhere — the font stack is `system-ui` defined in `src/index.css`.

**Diagnostic:** Run `bun run build` then `bun run preview`. Open DevTools → Network tab → filter by `DOCTOR_PHOTO` — confirm it starts downloading before the JS bundle finishes parsing (it should appear near the top of the waterfall).

**Problem:** The LCP image (`DOCTOR_PHOTO` from Cloudinary) is not discoverable from the initial HTML. The browser only finds it after React JS executes and renders the `Landing` component. On slow mobile connections this adds 3–5 seconds.

**Fix:** Add a `<link rel="preload">` for the hero image directly in `index.html`. This makes it discoverable from the HTML parser immediately, before any JS runs.

```html
<!-- Add to <head> in index.html, after existing preconnect tags -->
<link
  rel="preload"
  as="image"
  href="https://res.cloudinary.com/mobeet/image/upload/WEBP/DOCTOR_PHOTO_zgnaz1.webp"
  fetchpriority="high"
  type="image/webp" />
```

**Also add preconnect for Firebase Auth** (currently missing, Google recommends it, saves ~300ms):

```html
<link
  rel="preconnect"
  href="https://dr-amlan-s-ent-clinic.firebaseapp.com"
  crossorigin />
<link rel="preconnect" href="https://apis.google.com" crossorigin />
```

**Remove unused preconnects** (fonts are not used — system-ui stack):

```html
<!-- REMOVE these two lines: -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

**Also preload the navbar logo** (it's in the eagerly-loaded NavBar, above the fold):

```html
<link
  rel="preload"
  as="image"
  href="https://res.cloudinary.com/mobeet/image/upload/WEBP/DrAmlanLogoTop_oxkvbz.webp"
  type="image/webp" />
```

> **Note:** Keep `<link rel="preconnect" href="https://res.cloudinary.com" />` — it's correct and used.

---

### TASK 3 — Fix Font Awesome render-blocking chain

**Files to touch:**

- `src/utils/icons.ts` — remove one line (`@import url(...)`) from inside the `style.textContent` string. Nothing else changes. All icon definitions stay. The `loadFontAwesome()` function still works exactly the same way.
- `index.html` — add two `<link rel="preload">` tags for the FA woff2 font files.

**Priority:** 🔴 Critical (saves ~150ms font-render blocking on both desktop and mobile)  
**No functionality change:** All icons continue to render identically. The `@import` was redundant — the icon unicode definitions and `@font-face` rules already in the file are sufficient. Removing the `@import` just eliminates the extra network round-trip to fetch `fontawesome.min.css` before fonts can load.

**Diagnostic:** Run `bun run dev`, open `/`, and confirm all icons render correctly — navbar phone icon, calendar icon on the appointment button, service section icons, WhatsApp floating icon, up-arrow floating icon. Then run `bun run build`.

**Problem:** `loadFontAwesome()` in `main.tsx` injects a `<style>` tag containing `@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/fontawesome.min.css')`. This `@import` inside a dynamically injected style is not render-blocking in the traditional HTML-parser sense, but it does block **font rendering** — the browser must fetch `fontawesome.min.css` before it can resolve the `@font-face` rules, which means icons render as blank boxes until the chain completes. This causes FOUT (Flash of Unstyled/missing icons) and contributes to CLS on both desktop and mobile. The dependency chain is:

```
JS executes → style injected → @import fetches fontawesome.min.css (15 KiB)
→ browser fetches fa-solid-900.woff2 (147 KiB) + fa-brands-400.woff2 (106 KiB)
```

**Fix:**

1. **Remove the `@import` line** from `icons.ts` — the full `fontawesome.min.css` is not needed since we define all icon unicode values manually in the same style block. The `@import` only adds the base `.fas`, `.fab` class definitions which we already replicate manually.

2. **Move the Font Awesome `<link>` to `index.html`** as a proper `<link rel="stylesheet">` with `media="print" onload` trick for non-render-blocking load, OR keep it as a regular stylesheet but add `<link rel="preload">` for the woff2 fonts.

**Recommended approach** (least disruptive — just remove the `@import`):

In `src/utils/icons.ts`, remove this line from `style.textContent`:

```css
/* REMOVE THIS LINE: */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/fontawesome.min.css');
```

The icon definitions already in the file (`.fa-phone:before { content: "\\f095"; }` etc.) are sufficient. The `fontawesome.min.css` only adds the base `.fa`, `.fas`, `.fab` class rules — which are already replicated in the custom block.

3. **Add preload hints for the FA woff2 fonts** in `index.html` so they start downloading early:

```html
<link
  rel="preload"
  as="font"
  type="font/woff2"
  crossorigin
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2" />
<link
  rel="preload"
  as="font"
  type="font/woff2"
  crossorigin
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-brands-400.woff2" />
```

> **Compromise note:** Google suggests eliminating Font Awesome CDN entirely and using SVG icons or an npm package. We keep the CDN approach because the current custom subset in `icons.ts` is already a good compromise — it defines only the ~40 icons actually used. Switching to `@fortawesome/react-fontawesome` npm package would require refactoring every `<i className="fa-solid ...">` tag across the entire app. **Not worth the disruption.**

---

### TASK 4 — Fix Logo SVG: Replace `<svg><image>` with `<img>` tag

**Files to touch:**

- `src/appComponents/nav/topNavbar/LogoSection.tsx` — replace `<LogoSVG />` with a plain `<img>` tag inline. Remove the `LogoSVG` import.
- `src/assets/Logo_SVG.tsx` — this file becomes unused after the above change. It should be deleted as cleanup.

**Priority:** 🟡 Medium (improves LCP candidate detection, reduces forced reflow)  
**No functionality change:** The logo image is the same Cloudinary URL, same visual appearance, same rounded-full styling. The only difference is the HTML element type — `<img>` instead of `<svg><image>`. The preload hint added in Task 2 will now actually work because browsers match preloads to `<img>` elements, not SVG `<image>` elements.

**Diagnostic:** Run `bun run tsc` to confirm no TypeScript errors after removing the import. Run `bun run dev` and visually confirm the navbar logo looks identical.

**Problem:** The logo is loaded as `<svg><image xlinkHref={CLOUDINARY_URL}>`. SVG `<image>` elements:

- Are not treated as preloadable resources by browsers
- Can cause forced reflow (Lighthouse flags this)
- `xlink:href` is deprecated in SVG 2.0
- The browser cannot apply `fetchpriority` to SVG image elements

**Fix:** Replace `Logo_SVG.tsx` with a plain `<img>` tag in `LogoSection.tsx`:

```tsx
// LogoSection.tsx — replace <LogoSVG /> with:
<img
  src="https://res.cloudinary.com/mobeet/image/upload/WEBP/DrAmlanLogoTop_oxkvbz.webp"
  alt="Dr. (Major) Amlan's ENT & Allergy Clinic Logo"
  width="64"
  height="64"
  className="h-full w-full rounded-full object-cover"
  loading="eager"
  fetchPriority="high"
  decoding="async"
/>
```

This allows the preload hint added in Task 2 to actually work (preload + `<img>` = cache hit; preload + SVG `<image>` = cache miss).

---

### TASK 5 — Fix Vite build: Add manual chunk splitting

**Files to touch:**

- `vite.config.ts` — add `rollupOptions.output.manualChunks` inside the existing `build` config. No plugin changes, no alias changes.

**Priority:** 🟡 Medium (reduces unused JS loaded on the home route, improves TBT)  
**No functionality change:** Manual chunking only affects how Vite splits the output bundle files. The app loads and runs identically. Firebase, jsPDF, and html-to-image still work — they just load in separate chunk files that are only fetched when the routes that need them are visited.

**Diagnostic:** Run `bun run build` and inspect the `dist/assets/` folder. You should see separate chunk files named `firebase-vendor-*.js`, `pdf-vendor-*.js`, and `react-vendor-*.js`. Run `bun run preview` and confirm the home page loads and all routes still work.

**Problem:** No manual chunking means Firebase, jsPDF, html-to-image, and react-spinners all end up in the main bundle or a single vendor chunk. Firebase alone is ~33 KiB (after tree-shaking) but the full firebase package is 12 MB — Vite tree-shakes it but only if imports are clean.

**Fix:** Add `rollupOptions.output.manualChunks` to split heavy dependencies:

```ts
// vite.config.ts
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {'@': path.resolve(__dirname, './src')},
  },
  build: {
    minify: 'oxc',
    rollupOptions: {
      output: {
        manualChunks: {
          // Firebase in its own chunk (only loaded when auth is needed)
          'firebase-vendor': ['firebase/app', 'firebase/auth'],
          // PDF generation — only used in admin download flow
          'pdf-vendor': ['jspdf', 'html-to-image'],
          // React core
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});
```

> **Note:** `jspdf` and `html-to-image` are only used in `AdminDownloadModal.tsx`. Splitting them ensures they are never loaded on the home route.

---

### TASK 6 — Fix Vercel clinic-status API 403 error

**Files to touch:**

- `src/appStore/clinicSlice.ts` — add a 403 status guard inside `fetchClinicStatus`. No other store changes, no component changes.

**Priority:** 🟡 Medium (eliminates console error, removes a wasted ~988ms network request on every page load)  
**No functionality change:** The Navbar already has complete local time-based open/closed logic that runs independently of the API. The API result only controls the `isManuallyOverridden` flag. If the endpoint is returning 403, that flag is never set anyway — so the fallback is already in effect. This fix just stops the app from retrying a dead endpoint every 5 minutes and logging a console error on every visit.

**Diagnostic:** Run `bun run dev`, open the browser console, and confirm the 403 error from `debbarmaatanu-dev-dramlan-sentclini.vercel.app` no longer appears after the fix. The navbar open/closed status should still display correctly based on local time.

**Problem:** The Navbar fetches clinic status from `debbarmaatanu-dev-dramlan-sentclini.vercel.app/appointment/clinic-status` on every page load. This endpoint returns **403 Forbidden** — it's a dead/broken endpoint. This wastes ~988ms of network time on mobile (per Lighthouse network dependency tree).

**Fix options:**

1. **If the endpoint is intentionally disabled:** Remove the fetch entirely and fall back to the local time-based open/closed logic (which already exists in `Navbar.tsx` as the `isOpen` calculation). The Navbar already has full fallback logic — it only uses `clinicStatus.isManuallyOverridden` from the API. If the API is dead, `clinicStatusLoaded` never becomes true and the fetch retries every 5 minutes.

2. **If the endpoint should be working:** Fix the Vercel deployment / CORS configuration for that endpoint.

3. **Minimum fix (suppress the error and stop retrying on 403):** In `clinicSlice.ts`, catch 403 responses and set `clinicStatusLoaded = true` with a null status so the interval stops retrying:

```ts
// In fetchClinicStatus:
if (response.status === 403) {
  // Endpoint unavailable — use local time-based logic only
  set({clinicStatusLoaded: true, clinicStatus: null});
  return;
}
```

---

### TASK 7 — Fix Content Security Policy (CSP)

**Files to touch:**

- `index.html` — add one `<meta http-equiv="Content-Security-Policy">` tag inside `<head>`. No script changes, no component changes.

**Priority:** 🟠 Low-Medium (security improvement only — does not affect Lighthouse performance score, but Google Search Console flags it as a trust/safety issue)  
**No functionality change:** The CSP meta tag is a browser security directive. It does not change how the app renders or behaves. The policy is written to explicitly allow all origins the app already uses — Firebase, Cloudinary, AdSense, cdnjs — so nothing breaks.

**Diagnostic:** Run `bun run build` then `bun run preview`. Open the browser console and confirm there are no CSP violation errors. Test: click the appointment button, confirm Google login works, confirm the navbar renders icons, confirm AdSense does not throw errors.

**Problem:** Google flags:

- `unsafe-inline` in `script-src` — allows inline script execution
- No `require-trusted-types-for` directive
- Host allowlists can be bypassed

**Compromise:** This is a **Vite React SPA**. Vite's dev server injects inline scripts for HMR. The production build uses `<script type="module">` which is safer, but React itself and many libraries use dynamic evaluation patterns. A strict CSP **will break** Firebase Auth (which uses `unsafe-eval` internally for its iframe), Google AdSense, and potentially Tailwind's runtime if any dynamic styles are used.

**Practical fix for production** — add a meta CSP tag that covers the main risks without breaking functionality:

```html
<!-- index.html <head> — add after existing meta tags -->
<meta
  http-equiv="Content-Security-Policy"
  content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://apis.google.com https://www.gstatic.com;
  style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
  font-src 'self' https://cdnjs.cloudflare.com;
  img-src 'self' data: https://res.cloudinary.com https://maps.googleapis.com https://maps.gstatic.com https://lh3.googleusercontent.com;
  connect-src 'self' https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.googleapis.com https://debbarmaatanu-dev-dramlan-sentclini.vercel.app https://pagead2.googlesyndication.com;
  frame-src https://dr-amlan-s-ent-clinic.firebaseapp.com https://www.google.com https://googleads.g.doubleclick.net;
  object-src 'none';
  base-uri 'self';
" />
```

> **Important compromise note:** `unsafe-inline` in `script-src` is kept because:
>
> 1. Firebase Auth requires it for its cross-origin iframe
> 2. Google AdSense requires it
> 3. Removing it without nonces/hashes would break the app
>
> Google's suggestion to use nonces/hashes is correct in principle but requires server-side rendering or a build-time nonce injection system — neither of which this Vite SPA has. **This is an accepted limitation of the current architecture.**
>
> `require-trusted-types-for` is also skipped — it would require auditing every DOM manipulation in Firebase, AdSense, and the app itself. Not feasible without significant refactoring.

---

### TASK 8 — Fix image delivery: Add Cloudinary transformations

**Files to touch:**

- `src/constants/images.ts` — update the URL strings for all images to include Cloudinary transformation parameters. No imports change, no component changes, no logic changes.
- `index.html` — update the `href` in the `<link rel="preload">` added in Task 2 to match the new `DOCTOR_PHOTO` URL (since the URL changes when transformations are added).

**Priority:** 🟡 Medium (estimated savings: 447 KiB per Lighthouse)  
**No functionality change:** The images are the same photos served from the same Cloudinary account. The transformation parameters (`w_448,q_auto,f_auto` etc.) are processed server-side by Cloudinary — the browser receives a smaller, optimised version of the same image. Visual quality is perceptually identical. `f_auto` means Cloudinary picks the best format the browser supports (AVIF > WebP > JPEG) — all browsers that support WebP already support AVIF or will fall back gracefully.

**Diagnostic:** Run `bun run dev` and open the Network tab. Click on the doctor photo request and confirm the response is smaller than the original. Visually confirm all images still display correctly across the home page, navbar, and login page.

**Problem:** Images are loaded at their original upload size. Cloudinary supports URL-based transformations — we can request optimized sizes without re-uploading.

**Fix:** Update Cloudinary URLs to include size and quality transformations:

```ts
// src/constants/images.ts
// Cloudinary URL format: /upload/{transformations}/{public_id}
// w_ = width, q_ = quality, f_ = format, c_ = crop mode

export const IMAGES = {
  // Logo: 64x64 display size in navbar → request 128x128 (2x for retina)
  LOGO_TOP:
    'https://res.cloudinary.com/mobeet/image/upload/w_128,h_128,c_fill,q_auto,f_auto/WEBP/DrAmlanLogoTop_oxkvbz.webp',

  // Doctor photo: max-w-md (448px) display → request 448px wide, auto quality
  DOCTOR_PHOTO:
    'https://res.cloudinary.com/mobeet/image/upload/w_448,c_limit,q_auto,f_auto/WEBP/DOCTOR_PHOTO_zgnaz1.webp',

  // Service icons: 64x64 display size
  VERTIGO_ICON:
    'https://res.cloudinary.com/mobeet/image/upload/w_128,h_128,c_fill,q_auto,f_auto/WEBP/VERTIGO_ICON_kvxn6z.webp',
  ENT_ICON:
    'https://res.cloudinary.com/mobeet/image/upload/w_128,h_128,c_fill,q_auto,f_auto/WEBP/ENT_ICON_vfq7bw.webp',
  SLEEP_APNEA_ICON:
    'https://res.cloudinary.com/mobeet/image/upload/w_128,h_128,c_fill,q_auto,f_auto/WEBP/sleep-apnea-icon_binaek.webp',

  // Clinic logo (OG image only — keep original for social sharing)
  CLINIC_LOGO:
    'https://res.cloudinary.com/mobeet/image/upload/WEBP/DrAmlanLogo_2_spt68s.webp',

  // Google icon (small, login page only)
  GOOGLE_ICON:
    'https://res.cloudinary.com/mobeet/image/upload/w_64,h_64,c_fill,q_auto,f_auto/WEBP/GOOGLE_ICON_sygvob.webp',
} as const;
```

> **Note:** `f_auto` lets Cloudinary serve AVIF to browsers that support it (even better than WebP). `q_auto` uses Cloudinary's perceptual quality algorithm. `c_limit` on the doctor photo prevents upscaling.
>
> **Update the preload URL in `index.html` (Task 2) to match the new DOCTOR_PHOTO URL** after applying this task.

---

### TASK 9 — Fix ARIA roles and touch targets

**Files to touch:**

- `src/components/homeComponents/FAQSection.tsx` — audit and fix any ARIA role mismatches on card elements.
- `src/components/homeComponents/FeaturesSection.tsx` — same audit, plus add `min-h-[44px]` to any interactive elements smaller than 44px.
- `src/appComponents/nav/topNavbar/Navbar.tsx` — if any nav buttons are below 44px touch target size, add `min-h-[44px]`.

**Priority:** 🟢 Low (Accessibility score 93 → target 100)  
**No functionality change:** ARIA attribute corrections and minimum touch target sizing are purely accessibility improvements. They do not change visual appearance, routing, or any interactive behaviour. The Lighthouse flagged elements are the FAQ text cards and feature cards — the fix is removing or correcting any `role` attribute that conflicts with the semantic HTML element used.

**Diagnostic:** Run `bun run lint` to catch any JSX accessibility rule violations. Run `bun run dev` and use the browser's accessibility inspector to confirm no ARIA role errors. Run `bun run build` to confirm no errors.

**Problem:** Lighthouse flags:

1. Elements with ARIA roles that don't match their HTML element
2. Touch targets too small (< 44x44px)

**Specific fixes:**

**a) FAQ cards in `FAQSection.tsx`** — The text content is flagged for ARIA role mismatch. Check that `<article>` or `<div>` elements don't have conflicting roles.

**b) Feature cards in `FeaturesSection.tsx`** — Same issue.

**c) Touch targets** — The "Make an Appointment" button and nav links need minimum 44x44px touch area. Add `min-h-[44px] min-w-[44px]` to small interactive elements.

**d) The `<i>` icon elements** — Already have `aria-hidden="true"` which is correct. The ones used as standalone icons with `role="img"` need an `aria-label` — this is already done in `ServicesSection.tsx` for the FA icons.

---

### TASK 10 — Fix `AuthWrapper.tsx`: Add `setAuthInitialized` call

**Files to touch:**

- `src/AuthWrapper.tsx` — add one line `setAuthInitialized(true)` inside the `onIdTokenChanged` callback. The import already exists in the file — it is just never called.

**Priority:** 🟢 Low (correctness fix — not a performance issue)  
**No functionality change:** `setAuthInitialized` is already imported and wired up in the store. This just ensures it gets called when Firebase resolves the auth state, which is what it was always intended to do. The admin nav link visibility logic in `NavLinks.tsx` depends on this flag — without it, the admin link may not appear reliably on first load for logged-in admin users.

**Diagnostic:** Run `bun run tsc` to confirm no type errors. Run `bun run dev`, log in as admin, and confirm the admin nav link appears without a page refresh.

**Problem:** `setAuthInitialized` is imported from the store but **never called** in `AuthWrapper.tsx`. The `authInitialized` state in the store is used by `NavLinks` to conditionally show the admin link. Without calling `setAuthInitialized(true)`, the admin link may never appear or may flicker.

**Fix:**

```tsx
// In the onIdTokenChanged callback, after setting user:
const unsubscribe = onIdTokenChanged(auth, async (user: User | null) => {
  if (user) {
    // ... existing logic ...
    setUser(user or null);
  } else {
    setUser(null);
  }
  setAuthInitialized(true); // ← ADD THIS
});
```

---

### TASK 11 — Fix Footer Google Maps iframe: IntersectionObserver lazy mount

**Files to touch:**

- `src/appComponents/nav/footer/Footer.tsx` — wrap the `<iframe>` in a small `useRef` + `IntersectionObserver` pattern so the iframe is only inserted into the DOM when the footer section scrolls into the viewport.
- `index.html` — confirm `<link rel="dns-prefetch" href="https://maps.googleapis.com" />` and `<link rel="dns-prefetch" href="https://maps.gstatic.com" />` are present (one already exists, add the second).

**Priority:** 🔴 Critical — the Maps iframe is in `Footer.tsx` which renders on **every route** including `/`. It is outside the `<Suspense>` boundary in `Routing.tsx`, meaning it is part of the initial render tree on every page load. The iframe has `loading="lazy"` but that only defers the network request until the element is near the viewport — the element itself is still in the DOM immediately. On mobile with a short page or fast scroll, the Maps JS API (~350 KiB across multiple scripts from `maps.googleapis.com`) loads during the LCP window.

**Why `loading="lazy"` alone is not enough here:** `loading="lazy"` on an iframe defers the resource fetch, but the iframe element is still rendered and the browser still allocates layout space for it immediately. More importantly, on some mobile browsers and Lighthouse's simulated environment, "near viewport" threshold is generous enough that a footer iframe on a short page triggers loading during the initial paint.

**Fix:** Replace the always-rendered `<iframe>` with a component that only mounts the iframe after the container enters the viewport using the native `IntersectionObserver` API. No external library needed — it is built into all modern browsers.

```tsx
// In Footer.tsx — replace the iframe section with this pattern:

import React, {useRef, useState, useEffect} from 'react';

// Inside the Footer component, in the Right Column - Location Map section:
const mapRef = useRef<HTMLDivElement>(null);
const [mapVisible, setMapVisible] = useState(false);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setMapVisible(true);
        observer.disconnect(); // load once, never unload
      }
    },
    {rootMargin: '200px'}, // start loading 200px before it enters viewport
  );
  if (mapRef.current) observer.observe(mapRef.current);
  return () => observer.disconnect();
}, []);

// Then in JSX, replace the existing <div> + <iframe> block with:
<div
  ref={mapRef}
  className="flex h-64 w-full items-center justify-center border-gray-600 bg-gray-700">
  {mapVisible ? (
    <iframe
      src="https://www.google.com/maps/embed?pb=..."
      width="100%"
      height="256"
      style={{border: '0.5px solid #6a7282', borderRadius: '8px'}}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="Dr. (Major) Amlan's ENT & Allergy Clinic location on Google Maps"
      aria-label="Interactive map showing clinic location at Capital Pathlab, Bijoykumar Chowmuhani, Agartala"
    />
  ) : (
    // Placeholder shown before the map loads — preserves layout, no CLS
    <div
      className="flex h-full w-full items-center justify-center rounded-lg bg-gray-600"
      aria-label="Map loading placeholder">
      <span className="text-sm text-gray-300">Map loading...</span>
    </div>
  )}
</div>;
```

**Why this fixes the problem:** The `<iframe>` element is not inserted into the DOM at all until the user scrolls near the footer. The Maps JS API scripts are never requested during the initial page load. The `rootMargin: '200px'` gives a 200px head start so the map is ready by the time the user actually sees the footer.

**No functionality change:** The map still loads and displays identically. Users who scroll to the footer see the map exactly as before. The only difference is it loads on demand rather than on page load. The placeholder `<div>` preserves the `h-64` height so there is no layout shift when the iframe mounts.

**Diagnostic:** Run `bun run dev`, open `/`, open DevTools Network tab, filter by `maps.googleapis.com` — confirm zero Maps requests on initial load. Scroll to the footer and confirm the map loads and displays correctly. Run `bun run build` to confirm no TypeScript or build errors.

---

### TASK 12 — Fix Navbar forced reflow: Replace `document.querySelector` with `useRef`

**Files to touch:**

- `src/appComponents/nav/topNavbar/Navbar.tsx` — replace the `document.querySelector` calls in the clock `useEffect` with `useRef` refs attached directly to the clock hand elements.

**Priority:** 🟡 Medium (Lighthouse explicitly flagged "Forced reflow" — affects TBT and main thread work on every page load)  
**No functionality change:** The clock animation works identically. The hands still rotate to the correct hour and minute positions. The only difference is how the DOM elements are accessed — `ref.current` instead of `document.querySelector`. This eliminates the forced layout recalculation.

**Current code (causes forced reflow):**

```ts
// Navbar.tsx — current
useEffect(() => {
  const hourHand = document.querySelector(`.${styles.hourHand}`) as HTMLElement;
  const minuteHand = document.querySelector(
    `.${styles.minuteHand}`,
  ) as HTMLElement;

  const setClock = () => {
    hourHand.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
    minuteHand.style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
  };
  setClock();
  const interval = setInterval(setClock, 60000);
  return () => clearInterval(interval);
}, []);
```

**Fix:**

```tsx
// Navbar.tsx — add refs at the top of the component
const hourHandRef = useRef<HTMLElement>(null);
const minuteHandRef = useRef<HTMLElement>(null);

// Attach refs to the clock hand divs in JSX:
<div className={`${styles.hand} ${styles.hourHand}`} ref={hourHandRef as React.RefObject<HTMLDivElement>}></div>
<div className={`${styles.hand} ${styles.minuteHand}`} ref={minuteHandRef as React.RefObject<HTMLDivElement>}></div>

// Updated useEffect — no querySelector, no forced reflow:
useEffect(() => {
  const setClock = () => {
    if (!hourHandRef.current || !minuteHandRef.current) return;
    const d = new Date();
    const hours = d.getHours() % 12;
    const minutes = d.getMinutes();
    const hourDeg = hours * 30 + minutes * 0.5;
    const minuteDeg = minutes * 6;
    hourHandRef.current.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
    minuteHandRef.current.style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
  };
  setClock();
  const interval = setInterval(setClock, 60000);
  return () => clearInterval(interval);
}, []);
```

**Diagnostic:** Run `bun run tsc` to confirm no type errors. Run `bun run dev` and confirm the clock hands display the correct time and animate correctly. Run `bun run build`.

---

## Implementation Order

Complete tasks 1–4, 8, and 11 together as a first pass — they are all low-effort and cover the critical LCP, CLS, and Maps loading issues. Run `bun run build` + `bun run preview` after this group before moving on.

| #   | Task                                                 | Files                                                                        | Impact             | Effort |
| --- | ---------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------ | ------ |
| 1   | Fix CLS in Landing.tsx (opacity swap + aspect-ratio) | `src/components/homeComponents/Landing.tsx`                                  | 🔴 CLS             | Low    |
| 2   | Preload hero image + logo in index.html              | `index.html`                                                                 | 🔴 LCP             | Low    |
| 3   | Remove FA `@import` from icons.ts + preload fonts    | `src/utils/icons.ts`, `index.html`                                           | 🔴 Font rendering  | Low    |
| 11  | Footer Maps iframe — IntersectionObserver lazy mount | `src/appComponents/nav/footer/Footer.tsx`, `index.html`                      | 🔴 Maps JS on load | Low    |
| 4   | Replace SVG `<image>` logo with `<img>` tag          | `src/appComponents/nav/topNavbar/LogoSection.tsx`, `src/assets/Logo_SVG.tsx` | 🟡 LCP + reflow    | Low    |
| 8   | Add Cloudinary size/quality transforms               | `src/constants/images.ts`, `index.html` (update preload URL)                 | 🟡 Image size      | Low    |
| 5   | Vite manual chunk splitting                          | `vite.config.ts`                                                             | 🟡 JS bundle size  | Medium |
| 6   | Fix 403 clinic-status API                            | `src/appStore/clinicSlice.ts`                                                | 🟡 Network         | Low    |
| 7   | Add CSP meta tag                                     | `index.html`                                                                 | 🟠 Security        | Medium |
| 9   | ARIA + touch target fixes                            | `FAQSection.tsx`, `FeaturesSection.tsx`, `Navbar.tsx`, `NavLinks.tsx`        | 🟢 Accessibility   | Low    |
| 10  | AuthWrapper setAuthInitialized fix                   | `src/AuthWrapper.tsx`                                                        | 🟢 Correctness     | Low    |
| 12  | Navbar forced reflow — replace querySelector w/ refs | `src/appComponents/nav/topNavbar/Navbar.tsx`                                 | 🟡 Main thread     | Low    |

---

## Verification Checklist (run after all tasks)

```bash
bun run tsc        # Must pass with zero errors
bun run lint       # Must pass with zero new errors
bun run build      # Must complete successfully
bun run preview    # Open in browser and manually verify:
```

Manual checks after `bun run preview`:

- [ ] Home page (`/`) loads — hero image appears without layout jump
- [ ] Navbar logo renders correctly
- [ ] All Font Awesome icons visible (phone, calendar, WhatsApp, up-arrow, etc.)
- [ ] "Make an Appointment" button navigates to `/appointment`
- [ ] Services section images load (ENT, Vertigo, Sleep Apnea icons)
- [ ] FAQ section renders correctly
- [ ] Dark/light theme toggle works
- [ ] Mobile menu opens and closes
- [ ] Scroll to footer — confirm Google Maps iframe loads and displays correctly when footer enters viewport
- [ ] DevTools Network tab on `/` — confirm zero `maps.googleapis.com` requests before scrolling to footer
- [ ] Admin login flow works (if testable locally)
- [ ] No console errors (especially no CSP violations after Task 7)
- [ ] Services section images load (ENT, Vertigo, Sleep Apnea icons)
- [ ] FAQ section renders correctly
- [ ] Dark/light theme toggle works
- [ ] Mobile menu opens and closes
- [ ] Admin login flow works (if testable locally)
- [ ] No console errors (especially no CSP violations after Task 7)

---

## What We're NOT Fixing (Accepted Compromises)

| Issue                                  | Why We Accept It                                                                                                                                                                                                                                                                                             |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Firebase Auth iframe (90 KiB)          | Required for auth functionality. Cannot be removed. Mitigated by preconnect.                                                                                                                                                                                                                                 |
| Google Maps JS API (350 KiB)           | The Maps iframe is in `Footer.tsx` and renders on every route. It already has `loading="lazy"`. Task 11 adds `IntersectionObserver` lazy mounting to prevent it loading during the LCP window. We cannot control what Google loads inside the iframe itself once it mounts — that is an accepted limitation. |
| `unsafe-inline` in CSP                 | Required by Firebase Auth + Google AdSense. Removing it breaks the app without a full server-side nonce system.                                                                                                                                                                                              |
| `require-trusted-types-for` CSP        | Would require auditing all DOM manipulation in Firebase, AdSense, and app code. Not feasible.                                                                                                                                                                                                                |
| Font Awesome CDN (vs npm package)      | Switching to `@fortawesome/react-fontawesome` requires refactoring every `<i>` tag in the app. The current custom subset approach is a reasonable compromise.                                                                                                                                                |
| Firestore `dns-prefetch` in index.html | Firestore is not actually used (only Auth is). Remove the `dns-prefetch` for `firestore.googleapis.com` as cleanup.                                                                                                                                                                                          |
| AdSense script blocking                | `async` attribute is already set. AdSense is a third-party requirement — cannot be deferred further without violating AdSense policies.                                                                                                                                                                      |
| Vercel clinic-status 403               | Fix the endpoint or add graceful fallback (Task 6). The local time-based logic already works as fallback.                                                                                                                                                                                                    |

---

## Expected Results After All Fixes

These are estimates — actual numbers depend on network conditions and Lighthouse test environment. The fixes are universal; both environments benefit from the same code changes.

| Metric      | Desktop Before | Desktop After | Mobile Before | Mobile After |
| ----------- | -------------- | ------------- | ------------- | ------------ |
| LCP         | 1.6s           | ~0.8–1.2s     | 8.6s          | ~2.5–3.5s    |
| CLS         | 0.015          | ~0.0          | 0.386         | < 0.05       |
| FCP         | 0.7s           | ~0.5–0.7s     | 3.6s          | ~2.0–2.5s    |
| Performance | ~90+           | ~95+          | 64            | 75–85        |
