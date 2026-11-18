import { mkdir, copyFile, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const pack = path.resolve(
  "GIGI_CLOUD_SOLUTIONS_FULL_ASSETS_DESKTOP_MOBILE_2026 (1)",
  "GIGI_Enterprise_Full_Assets_2026",
);
const out = path.resolve("public/enterprise");
const brandOut = path.resolve("public/brand");
const docsLogos = path.resolve("docs/01_Logos");

const heroKeys = [
  "home",
  "about",
  "services",
  "access-control",
  "cctv-surveillance",
  "fibre-networking",
  "it-connectivity",
  "data-backup",
  "alarm-electric-fence",
  "electrical-installations",
  "solar-energy",
  "web-graphic-design",
  "contact",
  "enterprise-security",
];

const serviceCards = [
  "access-control",
  "alarm-systems",
  "cctv-surveillance",
  "data-backup",
  "electric-fencing",
  "electrical-installations",
  "enterprise-security",
  "fibre-networking",
  "it-connectivity",
  "solar-energy",
  "web-graphic-design",
];

await mkdir(path.join(out, "heroes"), { recursive: true });
await mkdir(path.join(out, "services"), { recursive: true });
await mkdir(path.join(out, "icons"), { recursive: true });
await mkdir(brandOut, { recursive: true });
await mkdir(docsLogos, { recursive: true });

for (const key of heroKeys) {
  const desktop = path.join(
    pack,
    "02_Website_Heroes/Desktop_16x9",
    `hero-${key}-desktop-1920x1080.webp`,
  );
  const mobile = path.join(
    pack,
    "02_Website_Heroes/Mobile_9x16",
    `hero-${key}-mobile-1080x1920.webp`,
  );
  for (const width of [960, 1440, 1920]) {
    await sharp(desktop)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(path.join(out, "heroes", `hero-${key}-desktop-${width}.webp`));
  }
  await sharp(desktop)
    .resize({ width: 1920, withoutEnlargement: true })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(path.join(out, "heroes", `hero-${key}-desktop.jpg`));
  for (const width of [540, 720, 1080]) {
    await sharp(mobile)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(path.join(out, "heroes", `hero-${key}-mobile-${width}.webp`));
  }
  await sharp(mobile)
    .resize({ width: 1080, withoutEnlargement: true })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(path.join(out, "heroes", `hero-${key}-mobile.jpg`));
}

for (const id of serviceCards) {
  await copyFile(
    path.join(pack, "03_Service_Visuals/Desktop_Cards", `service-${id}-desktop.webp`),
    path.join(out, "services", `${id}-desktop.webp`),
  );
  await copyFile(
    path.join(pack, "03_Service_Visuals/Mobile_Cards", `service-${id}-mobile.webp`),
    path.join(out, "services", `${id}-mobile.webp`),
  );
}

await sharp(path.join(pack, "02_Website_Heroes/Desktop_16x9/hero-web-graphic-design-desktop-1920x1080.webp"))
  .resize(1440, 900, { fit: "cover", position: "centre" })
  .webp({ quality: 82 })
  .toFile(path.join(out, "services", "graphic-design-desktop.webp"));
await sharp(path.join(pack, "02_Website_Heroes/Mobile_9x16/hero-web-graphic-design-mobile-1080x1920.webp"))
  .resize(960, 1200, { fit: "cover", position: "centre" })
  .webp({ quality: 82 })
  .toFile(path.join(out, "services", "graphic-design-mobile.webp"));

for (const icon of await readdir(path.join(pack, "01_Brand_Identity/Icons"))) {
  await copyFile(
    path.join(pack, "01_Brand_Identity/Icons", icon),
    path.join(out, "icons", icon),
  );
}

const logos = [
  ["GIGI_Approved_Logo_On_Navy.png", "gigi-on-navy.png"],
  ["GIGI_Approved_Logo_Transparent.png", "gigi-transparent.png"],
  ["GIGI_Approved_Logo_White_Background.png", "gigi-white.png"],
  ["GIGI_G_Monogram_Transparent.png", "gigi-monogram.png"],
  ["favicon-64.png", "favicon-64.png"],
  ["favicon-512.png", "favicon-512.png"],
];
for (const [source, target] of logos) {
  await copyFile(
    path.join(pack, "01_Brand_Identity/Logos", source),
    path.join(brandOut, target),
  );
  await copyFile(
    path.join(pack, "01_Brand_Identity/Logos", source),
    path.join(docsLogos, source),
  );
}
await copyFile(path.join(brandOut, "favicon-64.png"), path.resolve("public/favicon.png"));
await copyFile(path.join(brandOut, "favicon-512.png"), path.resolve("public/favicon-512.png"));

const overlay = Buffer.from(
  `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#06132e" stop-opacity=".94"/><stop offset=".62" stop-color="#06132e" stop-opacity=".55"/><stop offset="1" stop-color="#06132e" stop-opacity=".12"/></linearGradient></defs><rect width="1200" height="630" fill="url(#g)"/></svg>`,
);
const logo = await sharp(path.join(brandOut, "gigi-on-navy.png"))
  .resize({ width: 360 })
  .png()
  .toBuffer();
await sharp(path.join(out, "heroes", "hero-home-desktop-1920.webp"))
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .composite([
    { input: overlay, top: 0, left: 0 },
    { input: logo, top: 54, left: 64 },
  ])
  .png()
  .toFile(path.resolve("public/social.png"));

console.log(
  `Enterprise assets ready: ${heroKeys.length} heroes, ${serviceCards.length + 1} service visuals, logos, icons, social card and favicon.`,
);
