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

`src/HeroMedia.tsx` owns playback and poster fallback; `src/main.tsx` defines route composition; `src/cinema.css` styles the navy surfaces, navigation and hero safe zones. `src/language.tsx` holds EN, FR, SW, LN and PT-AO strings. Coverage includes route hero text, main navigation, service names and core enquiry labels. Long-form editorial content, official Mission and Vision, footer, form feedback and some secondary controls remain in English.
