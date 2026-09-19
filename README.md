# Bright Core Technologies — Official Website

> **نبني تجارب رقمية ذكية للمستقبل** — الموقع الرسمي لشركة Bright Core Technologies.
> A premium, bilingual (Arabic RTL / English LTR) company website with a balanced
> real-time 3D hero scene, built to be published on GitHub Pages.

---

## What this is

A static marketing site for **Bright Core Technologies**, a technology company
specialised in building applications and digital solutions. It is designed to be
used as the official website link in a **Google Play Developer Profile**, so the
privacy policy, terms and application pages are first-class pages rather than
afterthoughts.

The centrepiece is a **real-time WebGL scene**: a glowing technological core
surrounded by energy rings, a particle field, a neural-network visual and a
futuristic grid — with a camera that reacts to the pointer, to device orientation
and to scroll.

Nothing on this site is invented. There are no fake clients, statistics, awards,
team members or testimonials. See [`CONTENT-TODO.md`](./CONTENT-TODO.md).

---

## Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | **Astro 5** (`output: 'static'`) | Real HTML per page → full SEO and instant first paint; JavaScript only where it is needed |
| 3D | **React Three Fiber** + **three.js** | Declarative scene management with a single WebGL renderer |
| Language | **TypeScript** | Type safety across a fairly involved scene graph |
| Styling | **Plain CSS** with custom properties + Astro scoped styles | No framework overhead; the design system is small and fully controlled |
| Fonts | **@fontsource** (self-hosted woff2) | No external requests, no FOUT, works offline |
| Icons | Inline SVG (`src/components/Icon.astro`) | Zero icon-font payload, fully themeable |
| Assets | Generated procedurally by `scripts/generate-assets.py` (Pillow) | The whole icon set and OG image stay consistent and reproducible |

No CSS framework is used. The design system lives in `src/styles/global.css`
and every component carries its own scoped styles.

---

## Project structure

```
.
├─ .github/workflows/deploy.yml     GitHub Pages build + deploy
├─ public/
│  ├─ favicon.ico · favicon.svg · favicon-16/32/48
│  ├─ apple-touch-icon.png
│  ├─ icon-192.png · icon-512.png · maskable-icon-512.png
│  ├─ og-image.png                  1200×630 social card
│  ├─ poster-hero.webp              LCP poster / no-WebGL fallback
│  ├─ manifest.webmanifest          PWA manifest
│  ├─ sw.js                         service worker
│  ├─ .nojekyll
│  └─ icons/app-dochub.svg
├─ scripts/generate-assets.py       regenerates every icon + OG image
├─ src/
│  ├─ components/                   Navbar, Footer, Hero, sections, CoreScene
│  ├─ three/                        the WebGL scene, split by concern
│  │  ├─ quality.ts                 device detection + quality tiers
│  │  ├─ textures.ts                procedural glow / dot textures
│  │  ├─ Core.tsx                   nucleus + glass shell + halos
│  │  ├─ Rings.tsx                  orbital energy rings
│  │  ├─ Particles.tsx              GPU particle field (custom shader)
│  │  ├─ DataNetwork.tsx            nodes, edges, travelling packets
│  │  ├─ GridFloor.tsx              perspective grid (custom shader)
│  │  └─ CameraRig.tsx              damped pointer / gyro / scroll camera
│  ├─ content/                      site config, services, apps, values, legal
│  ├─ i18n/                         UI dictionaries + path helpers
│  ├─ layouts/BaseLayout.astro      head, SEO, JSON-LD, navbar, footer
│  ├─ pages/                        Arabic pages (root)
│  │  └─ en/                        English pages
│  └─ styles/                       global.css · fonts.css
├─ astro.config.mjs
├─ tsconfig.json
└─ package.json
```

---

## Getting started

Requires **Node.js 20 or newer**.

```bash
npm install       # install dependencies
npm run dev       # dev server at http://localhost:4321
npm run build     # production build into ./dist
npm run preview   # preview the production build locally
```

### Regenerating the brand assets

Every icon, the Open Graph card and the hero poster are drawn procedurally, so
the mark stays identical at every size:

```bash
python -m venv .venv
.venv/Scripts/pip install Pillow      # Windows
# .venv/bin/pip install Pillow        # macOS / Linux
python scripts/generate-assets.py
```

Edit the palette or geometry at the top of that script and re-run it to refresh
the entire package.

---

## Deployment to GitHub Pages

1. Push the repository to GitHub with `main` as the default branch.
2. Go to **Settings → Pages** and set **Source = GitHub Actions**.
3. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and
   publishes the site automatically.

### How the base path is resolved

GitHub Pages serves *project* sites from a sub-path, which is the single most
common reason a static site deploys with broken CSS and images. The workflow
handles it for you:

| Repository | Served from | `BASE_PATH` |
| --- | --- | --- |
| `<owner>.github.io` | domain root | `/` |
| `bright-core-technologies` | `/<repo>/` | `/bright-core-technologies/` |

### Custom domain

1. Add the domain in **Settings → Pages → Custom domain** (this creates the
   `CNAME` file in the published output — do not commit one manually).
2. Create a repository **variable** `SITE_URL` under
   **Settings → Secrets and variables → Actions → Variables**, set to
   `https://your-domain.com`.
3. Re-run the workflow. The base path switches to `/` and canonical URLs,
   `hreflang` links, Open Graph tags, `robots.txt` and the sitemap all follow
   automatically.
4. Enable **Enforce HTTPS**.

### Local build against a sub-path

```bash
BASE_PATH=/bright-core-technologies/ SITE_URL=https://example.github.io npm run build
```

---

## Linking the site from Google Play

1. **Play Console → Developer Profile → Website** → the deployed site URL.
2. **Per application → Privacy Policy URL** → `…/privacy-policy/`
   (Arabic) or `…/en/privacy-policy/` (English).
3. Add the site URL to each application listing as the developer website.
4. Confirm every link opens correctly on a real phone over HTTPS.

**Optional — Android App Links.** To let links from this site open inside the
Android app, publish a Digital Asset Links file at
`/.well-known/assetlinks.json` containing your app's `package_name` and the
SHA-256 fingerprint of the signing certificate. It is intentionally not included
here because a placeholder fingerprint is worse than none.

---

## Performance & accessibility

The 3D scene is deliberately "balanced premium" rather than maximal:

| Tier | Condition | Scene |
| --- | --- | --- |
| **A** | Desktop, capable GPU | 5,200 particles, real glass transmission, grid, DPR up to 2 |
| **B** | Mobile / modest GPU / coarse pointer | 2,200 particles, cheap glass approximation, DPR up to 1.6 |
| **C** | No WebGL, `prefers-reduced-motion`, save-data, 2G | Poster image only — no canvas at all |

The tier is chosen before the first frame, and the scene self-downgrades from A
to B if it cannot hold ~26 fps over the first three seconds.

Other guarantees:

- **The canvas never blocks first paint.** The hero poster is server-rendered
  and is the LCP element; the WebGL bundle is a separate lazy chunk that fades
  in over it.
- **No text lives inside WebGL.** All copy is real HTML, so SEO and screen
  readers are unaffected by the scene.
- **RTL is native.** Layout uses CSS logical properties only (`margin-inline`,
  `inset-inline`) — there is no mirrored or flipped stylesheet.
- **Accessibility.** Skip link, visible focus rings, keyboard-operable menu,
  `aria-label` on the scene, contrast ≥ 4.5:1, full `prefers-reduced-motion`
  support.
- **Self-hosted fonts** with subsetted woff2 files — no third-party requests.

---

## Verification

Three checks run against the built output. The first needs nothing beyond Node;
the other two drive the locally installed Chrome through `puppeteer-core`.

```bash
npm run build
npm run verify:links       # every internal href/src resolves on disk (no deps)
npm run verify:render      # screenshots + console-error capture (needs puppeteer-core)
npm run verify:behaviour   # reduced-motion, mobile menu, i18n, form, 404 (needs puppeteer-core)
```

For the browser-based ones, point `PUPPETEER_PATH` at a `puppeteer-core` entry
point if it is not installed in the project:

```bash
PUPPETEER_PATH=file:///path/to/puppeteer-core/lib/puppeteer/puppeteer-core.js \
  node scripts/verify-behaviour.mjs
```

Latest run: **no broken links**, **no console errors** across eight viewports,
**28/28 behavioural checks passing**.

---

## `app-ads.txt`

`public/app-ads.txt` is published at the site root. AdMob fetches it from the
developer website listed on the Play Store listing to verify ad inventory, so it
must stay at `/app-ads.txt` on whatever domain you finally serve. Confirm the
publisher ID in that file matches the AdMob account used for the apps.

---

## Content policy

No fabricated clients, statistics, awards, team members or testimonials appear
anywhere on this site. Sections that would normally require that material are
switched off in `src/content/site.ts` via the `FLAGS` object and can be enabled
once real data exists. Everything that still needs a real value is marked
`[PLACEHOLDER: …]` and listed in [`CONTENT-TODO.md`](./CONTENT-TODO.md).

The legal pages are a careful draft, not legal advice — have them reviewed
before you rely on them.

---

## License

© Bright Core Technologies. All rights reserved.
The source code is provided for this company's own website; it is not licensed
for redistribution as a template.
