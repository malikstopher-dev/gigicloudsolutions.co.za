# GIGI Cloud Solutions

A complete React + TypeScript website with eight routes, a lazy-loaded Three.js hero, responsive layouts and WhatsApp enquiry handoff.

## Run locally

Requires Node.js 22.12+; `.node-version` selects Node.js 22.22.0 for Cloudflare Pages.

```sh
npm install
npm run dev
```

On Windows with restricted PowerShell scripts, use `npm.cmd` instead of `npm`.

## Production

```sh
npm run build
npm run preview
```

Deploy the **contents of `dist/`** to a static host. The build generates HTML entry points with page-specific metadata for all eight routes, a sitemap, robots.txt, a favicon cropped from the approved emblem, and a social sharing image. Route content is rendered by React in the browser. Cloudflare Pages serves the generated directory index files directly; `404.html` handles unknown paths. Do not add a catch-all rewrite to `/index.html`, because that would hide the route-specific metadata.

## Cloudflare Pages deployment

Repository: https://github.com/malikstopher-dev/gigicloudsolutions.co.za

1. In Cloudflare, create a **Pages** project and connect the GitHub repository.
2. Select the `main` production branch and configure:

   | Setting | Value |
   | --- | --- |
   | Framework preset | Vite |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | `/` (repository root) |
   | Deploy command | Leave empty |

3. Save and deploy. Cloudflare installs the dependencies using `package.json` and the committed lockfile before running the build.
4. Add `gigicloudsolutions.co.za` and `www.gigicloudsolutions.co.za` under the Pages project's custom domains, then follow Cloudflare's DNS instructions. The website's canonical URL uses `https://www.gigicloudsolutions.co.za`.

This is a static Pages deployment. It does not require a Cloudflare Worker, `wrangler.toml`, server-only APIs, backend credentials or a separate deploy command. `sharp` is used only during the build to generate the favicon; it is not shipped as a server dependency.

## Content and assets

- `src/data.ts`: company details, contact links and services.
- `src/main.tsx`: shared components and page content.
- `src/styles.css`: responsive visual system.
- `src/scene.tsx`: procedural Three.js environment, with off-screen pause and static SVG fallback.
- `assets/boards.mjs`: editable custom SVG scene masters.
- `src/VisualBoard.tsx` and `src/visuals.css`: interactive service boards, responsive compositions and motion rules.
- `src/HeroEnvironment.tsx`: accessible service selection for the GIGI-centred hero.
- `scripts/assets.mjs`: generates five standalone SVG illustrations, the accurate shield texture and an optimised lossless WebP wordmark before dev/build.
- `public/visuals/`: lightweight production art and static fallbacks.
- `docs/VISUAL-SYSTEM.md`: asset audit, checklist and visual-system documentation.
- `scripts/pages.mjs`: production metadata and public asset generation. Update its domain/metadata if business details change.
- `01_Logos/`: original supplied brand assets, imported without recolouring or distortion.

Typography: Manrope and DM Sans, loaded from Google Fonts under their open font licences with system fallbacks. All decorative illustrations are original CSS/Three.js artwork; no stock photography or invented project imagery is used.

## Enquiries

No backend or credentials are required. The validated form opens WhatsApp with the user's entered details. It explicitly asks the user to review and send the message in WhatsApp and never claims delivery. An explicit fallback link is provided after preparing the message.

The business address follows the original website brief: 339 Highland Road, Kensington, Johannesburg, 2094. The older asset-pack registered-office address is not used as the contact address.

## Verification

```sh
npx playwright install chromium
npm test
```

Browser checks cover all routes at 360, 390, 768, 1024 and 1440 pixels, overflow, navigation, quote prefilling, WhatsApp transfer, validation, mobile menu and reduced-motion fallback. Visual-system checks cover keyboard/touch scene selection, backup mode, access confirmation, day/night lighting, design mode, valid SVG fallbacks and offscreen animation pausing. The test runner starts its own production preview; run `npm run build` first. Screenshots are written to `test-results/`.

Before launch point the domain to your static host and enable HTTPS. The public domain and contact destinations are already configured from the brief.
