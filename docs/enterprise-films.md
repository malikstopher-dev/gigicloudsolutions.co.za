# Enterprise hero films

| Public route | Film key |
| --- | --- |
| `/` | `home` |
| `/about` | `about` |
| `/services` | `services` |
| `/services/security-access` | `enterprise-security` |
| `/services/it-connectivity` | `it-connectivity` |
| `/services/electrical-solar` | `solar-energy` |
| `/services/web-graphic-design` | `web-graphic-design` |
| `/services/cloud-solutions` | `data-backup` |
| `/contact` | `contact` |

Each route uses `/enterprise/videos/hero-{key}-{desktop|mobile}.mp4`. Portrait playback is selected below 768 CSS pixels. The measured source resolutions are 1280×720 and 720×1280. With the supplied `assets/` folder and FFmpeg installed, run `node scripts/prepare-hero-videos.mjs` to reproduce the delivery files. They are checked in; production builds do not need FFmpeg. The six other pairs (projects, access control, CCTV, alarms/perimeter, fibre, and electrical installations) do not have dedicated pages.

`src/HeroMedia.tsx` owns playback and poster fallback; `src/main.tsx` defines route composition; `src/cinema.css` styles the navy surfaces, navigation and hero safe zones. On mobile, the portrait shot fills the first viewport, with separate short headline copy, a single action and a compact pause control. The capability strip starts after the hero.

## Localized routes and verification

All nine routes in the table are available in EN, FR, SW, LN and PT-AO. English retains the original URLs; the other locales use `/fr`, `/sw`, `/ln` or `/pt` before the same route. The published HTML includes localized metadata and alternate URLs; the sitemap includes the 45 page variants. The original English Mission and Vision remains in `src/data.ts`.

`src/language.tsx` handles route selection and terminology overrides. `src/locale-copy.json` stores translations for the page body, service capabilities, Mission and Vision, metadata, contact flow and footer. `scripts/locale-source.mjs` inventories English copy and connects JSX to the catalog without replacing route IDs or quote values. `npm run check:locales` verifies message parity and runs during the production build. Translation drafts are checked into the repository; builds do not call a translation service. Native editorial review is recommended, especially for Lingala, Swahili and Angolan Portuguese.

- Before/after hero captures are available locally under `test-results/review-before/` and `test-results/review-after/` for nine viewport sizes, including 400×554 and 428×520.
- `tests/localization.spec.ts` checks all 45 localized page variants at mobile and desktop sizes, and form validation and WhatsApp handoff in each language.
- `tests/mobile-review.spec.ts` checks the compact action and pause control in a short forced-colors viewport. Set `GIGI_VISUAL_REVIEW=after` to include the screenshot run.
