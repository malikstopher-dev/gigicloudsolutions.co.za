// Editable procedural SVG masters. Coordinates use a shared 640 × 440 stage.
// Artwork is original demonstration imagery, not a client installation.
const rect = (x, y, w, h, fill, rx = 6, extra = "") =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;
const line = (d, extra = "") =>
  `<path d="${d}" fill="none" ${extra.includes("stroke=") ? "" : 'stroke="#16c6a5"'} ${extra.includes("stroke-width=") ? "" : 'stroke-width="3"'} stroke-linecap="round" ${extra}/>`;
const text = (x, y, value, size = 12, color = "#57708e") =>
  `<text x="${x}" y="${y}" font-family="Arial,sans-serif" font-size="${size}" fill="${color}">${value}</text>`;
const group = (name, content) => `<g class="part part-${name}">${content}</g>`;
function cabinet(x, y) {
  return `<g transform="translate(${x} ${y})"><path d="M0 0 30 -18 115 -18 85 0Z" fill="#6197ee"/><path d="M85 0 115 -18 115 145 85 165Z" fill="#083785"/>${rect(0, 0, 85, 165, "#0755ed", 7)}${[15, 49, 83, 117].map((v) => `${rect(10, v, 65, 25, "#092954", 4)}${rect(18, v + 8, 30, 3, "#809bbc", 1)}<circle cx="64" cy="${v + 12}" r="3" fill="#38e0bd"/>`).join("")}</g>`;
}
function laptop(x, y) {
  return `<g transform="translate(${x} ${y})"><path d="M0 0 90 -6 93 57 3 64Z" fill="#123b70" stroke="#82a0bf" stroke-width="3"/><path d="M8 8 81 3 83 48 10 53Z" fill="#d9f0f4"/><path d="M3 64 -18 82 84 83 93 57Z" fill="#afc3d8"/><path d="M10 65 77 61 70 72 0 75Z" fill="#eaf2fa"/>${rect(22, 21, 43, 4, "#0755ed", 1)}${rect(22, 31, 31, 3, "#79a5ba", 1)}</g>`;
}
function panel(x, y, scale = 1) {
  return `<g transform="translate(${x} ${y}) scale(${scale})"><path d="M0 0 132 -31 177 30 44 65Z" fill="#8cabc6"/><path d="M0 -5 132 -36 177 25 44 60Z" fill="#e4f0f9"/>${Array.from(
    { length: 12 },
    (_, i) => {
      const a = i % 4,
        b = Math.floor(i / 4),
        px = 9 + a * 31 + b * 13,
        py = -5 - a * 7 + b * 18;
      return `<path d="M${px} ${py} l27 -6 11 15 -27 7Z" fill="#12498e" stroke="#7da6d2" stroke-width=".7"/>`;
    },
  ).join("")}</g>`;
}
function desktop(x, y) {
  return `<g transform="translate(${x} ${y})">${rect(0, 0, 260, 170, "#092954", 13)}${rect(9, 9, 242, 146, "#fff", 7)}${rect(109, 170, 40, 28, "#9ab1ca", 3)}${rect(77, 195, 107, 9, "#c2d3e3", 4)}${rect(20, 22, 37, 7, "#0755ed", 2)}${rect(185, 22, 52, 5, "#b3c5d8", 2)}${rect(20, 48, 108, 91, "#eaf4f3", 4)}${text(30, 68, "Room to", 14, "#061b43")}${text(30, 86, "grow.", 20, "#061b43")}${rect(30, 102, 53, 14, "#0755ed", 3)}<circle cx="186" cy="95" r="34" fill="#16c6a5"/><path d="M157 122 185 59 216 122Z" fill="#0755ed" opacity=".8"/></g>`;
}
function it() {
  const networkPath = 'M190 214 260 259 361 282 459 213';
  const backupPath = 'M459 213 361 282 409 346 505 310';
  const connections = line(networkPath, 'class="fibre-route" stroke="#bdd5e8" stroke-width="9"')
    + line('M97 320 196 353 315 281', 'stroke="#bdd5e8" stroke-width="5"')
    + line(networkPath, 'class="connection-pulse"')
    + line(backupPath, 'class="backup-route" stroke="#bdd5e8" stroke-width="8"')
    + line(backupPath, 'class="backup-pulse"');
  const server = group('it', cabinet(130,119) + text(126,310,'SERVER CABINET',10));
  const network = group('network', `<g transform="translate(282 241)"><path d="M0 0 32 -18 137 -18 104 0Z" fill="#d9e6f2"/><path d="M104 0 137 -18 137 12 104 30Z" fill="#718eaa"/>${rect(0,0,105,30,'#f9fcff',4)}${Array.from({length:6},(_,i)=>rect(8+i*15,8,10,10,'#092954',1)).join('')}</g>${text(285,305,'NETWORK SWITCH',10)}`);
  const devices = group('fibre', laptop(443,139)+`<g transform="translate(78 298)">${rect(0,0,37,62,'#174878',7)}${rect(5,7,27,44,'#e0f8f3',3)}<circle cx="19" cy="56" r="2" fill="#16c6a5"/></g>`);
  const backup = group('backup', `<g transform="translate(474 284)">${rect(0,0,69,57,'#b5cadd',9)}${rect(0,-8,69,52,'#f8fbff',9)}<ellipse cx="34" cy="7" rx="22" ry="7" fill="#d9e9f1"/>${line('M12 20 Q34 33 56 20')}${line('M12 29 Q34 42 56 29')}<circle class="backup-done" cx="60" cy="-4" r="10" fill="#16c6a5"/><path class="backup-done" d="m55 -4 4 4 7 -8" fill="none" stroke="white" stroke-width="2"/></g>${text(462,368,'BACKUP STORAGE',10)}`);
  return connections + server + network + devices + backup;
}
function security() {
  return `<path d="M80 290 322 400 567 281 325 176Z" fill="#dae8f1"/>${group("perimeter", `<g stroke="#88a7bc" fill="none" stroke-width="3"><path d="M80 290V224L322 334 567 215V281M80 245 322 355 567 236"/>${Array.from({ length: 8 }, (_, i) => `<path d="M${80 + i * 34.6} ${290 + i * 15.7}v-66M${322 + i * 35} ${400 - i * 17}v-66"/>`).join("")}</g>`)}<path d="M197 165 326 103 460 164 332 228Z" fill="#fafcff"/><path d="M197 165 332 228V339L197 275Z" fill="#c3d8e8"/><path d="M332 228 460 164V275L332 339Z" fill="#e9f2f8"/>${group("access", `<path d="M358 223 414 196V291L358 318Z" fill="#173b61" stroke="#8baec7" stroke-width="3"/><path class="door-light" d="M365 227 408 207V286L365 307Z" fill="#0e5267"/><path d="M398 248v18" stroke="#d5f9f0" stroke-width="3"/>${rect(426, 220, 15, 29, "#061b43", 3)}<circle class="reader-light" cx="433.5" cy="228" r="3" fill="#16c6a5"/><path class="access-check" d="m375 254 8 7 15 -25" fill="none" stroke="#5fffd3" stroke-width="5"/>`)}${group("cctv", `<path class="scan-arc" d="M212 178 93 320Q170 365 264 316Z" fill="#16c6a5" opacity=".12"/><g transform="translate(161 135)"><path d="M45 41v24l24 9" fill="none" stroke="#7a9ab7" stroke-width="9"/><path d="M0 0 31 -14 87 7 58 23Z" fill="#fff"/><path d="M0 0 58 23 58 55 0 31Z" fill="#cadce9"/><path d="M58 23 87 7V39L58 55Z" fill="#8baac1"/><ellipse cx="12" cy="20" rx="9" ry="11" fill="#061b43"/><ellipse cx="12" cy="20" rx="4" ry="5" fill="#16c6a5"/></g>`)}${group("alarm", `<g transform="translate(286 216)">${rect(0, 0, 23, 36, "#f9fcff", 5)}${rect(5, 7, 13, 9, "#0755ed", 2)}<path d="M6 24h11M6 28h11" stroke="#8aa9be" stroke-width="2"/></g>`)}${text(67, 112, "SEE YOUR SPACE", 10)}${text(397, 365, "MANAGE ACCESS", 10)}`;
}
function solar() {
  return `<g class="day-sky"><circle cx="510" cy="84" r="28" fill="#16c6a5" opacity=".8"/><circle cx="510" cy="84" r="44" fill="none" stroke="#16c6a5" opacity=".2"/><path class="sun-rays" d="M470 112 374 178M485 124 410 186M459 99 336 165" stroke="#16c6a5" stroke-width="2" opacity=".5"/></g><g class="night-sky" opacity="0"><path d="M521 57a28 28 0 1 0 20 42 27 27 0 0 1-20-42" fill="#c5dafa"/>${[445, 477, 560, 407].map((x, i) => `<circle cx="${x}" cy="${53 + i * 22}" r="2" fill="#d5ecff"/>`).join("")}</g><path d="M94 290 312 395 553 280 332 184Z" fill="#cddfeb"/><path d="M168 218 307 283V357L168 292Z" fill="#c2d9e8"/><path d="M307 283 469 203V278L307 357Z" fill="#ecf3f8"/><path d="M147 216 302 116 485 201 307 289Z" fill="#718da8"/><path d="M147 216 302 116 302 204 307 289Z" fill="#a6bfd3"/>${group("panels", panel(287, 174, 0.95))}<path class="house-window" d="M193 246 235 265V299L193 279Z" fill="#0755ed"/><path d="M356 279 396 259V313L356 333Z" fill="#466985"/>${group("inverter", `<g transform="translate(429 255)">${rect(0, 0, 30, 46, "#f8fbff", 4)}${rect(6, 8, 18, 13, "#163d65", 2)}${rect(10, 12, 10, 4, "#16c6a5", 1)}<path d="M7 30h16M7 35h16" stroke="#c0d5e5" stroke-width="2"/></g>`)}${group("battery", `<g transform="translate(483 276)"><path d="M0 0 15 -8 46 -8 31 0Z" fill="#8bacbf"/><path d="M31 0 46 -8V55L31 63Z" fill="#173c62"/>${rect(0, 0, 31, 63, "#0755ed", 4)}${rect(8, 12, 15, 35, "#193d65", 2)}${rect(11, 21, 9, 22, "#16c6a5", 1)}</g>`)}${line("M365 218 445 248 445 307 497 335", 'class="energy-route" stroke="#90afc4"')}${line("M365 218 445 248 445 307 497 335", 'class="energy-pulse"')}${line("M497 335 435 366 320 375 242 335", 'class="stored-pulse"')}${group("electrical", `<g transform="translate(226 320)">${rect(0, 0, 29, 39, "#fff", 5)}<path d="M9 11v8m11-8v8m-13 3h15q0 10-7 10t-8-10" stroke="#0755ed" stroke-width="2" fill="none"/></g>`)}${text(77, 99, "ENERGY, CONNECTED", 10)}`;
}
function design() {
  return `<g class="website-concept">${desktop(147, 105)}<g transform="translate(409 189) rotate(6)">${rect(0, 0, 64, 126, "#174577", 10)}${rect(5, 7, 54, 110, "#fff", 6)}${rect(23, 11, 20, 3, "#174577", 2)}${rect(11, 24, 41, 9, "#e5f3ef", 2)}${text(12, 49, "Room to", 8, "#061b43")}${text(12, 63, "grow.", 12, "#061b43")}<circle cx="32" cy="87" r="17" fill="#16c6a5"/><path d="M20 101 33 69 46 101Z" fill="#0755ed"/></g>${rect(90, 270, 96, 56, "#f8fbff", 7)}${text(103, 293, "Aa", 22, "#061b43")}${text(102, 311, "TYPE STUDY", 7)}<g transform="translate(220 339)">${["#061b43", "#0755ed", "#16c6a5", "#eef4f8"].map((c, i) => rect(i * 37, 0, 31, 31, c, 6)).join("")}</g></g><g class="branding-concept" opacity="0"><g transform="translate(144 103) rotate(-8 100 100)">${rect(5, 8, 198, 227, "#a7bfce", 11)}${rect(0, 0, 198, 227, "#f9fcff", 11)}${text(23, 40, "FIELD / FORM", 12, "#061b43")}<path d="M44 139 99 60 153 139Z" fill="#0755ed"/><circle cx="100" cy="117" r="26" fill="#16c6a5"/>${text(24, 181, "Space for possibility.", 12, "#061b43")}${text(24, 201, "ORIGINAL BRAND CONCEPT", 7)}</g><g transform="translate(352 134) rotate(9)">${rect(0, 0, 150, 90, "#061b43", 8)}${text(17, 31, "FIELD / FORM", 12, "#fff")}${text(17, 66, "Make room for more.", 9, "#8de7d6")}</g><g transform="translate(357 251)">${["#0755ed", "#16c6a5", "#061b43"].map((c, i) => rect(i * 38, 0, 32, 55, c, 5)).join("")}${text(0, 84, "Aa Bb Cc", 25, "#061b43")}</g></g>${text(84, 76, "A CONSIDERED DIGITAL IDENTITY", 10)}`;
}
export const boardNames = [
  "it-connectivity",
  "security-access",
  "electrical-solar",
  "web-graphic-design",
];
export function boardSvg(index, prefix = "gigi", shield = "") {
  const id = prefix.replace(/[^a-zA-Z0-9_-]/g, "");
  const defs = `<defs><linearGradient id="${id}-ground" x2=".8" y2="1"><stop stop-color="#f9fcff"/><stop offset="1" stop-color="#d8e6f0"/></linearGradient><filter id="${id}-shadow" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="15" stdDeviation="13" flood-color="#16395f" flood-opacity=".15"/></filter></defs>`;
  let content;
  if (index === 4) {
    content = `<path d="M155 142 320 217 488 133M145 315 320 217 489 318" stroke="#8cbdcf" stroke-width="2" fill="none"/>${group("it", `<g transform="translate(72 53) scale(.6)">${cabinet(70, 40)}</g>`)}${group("security", `<g transform="translate(452 75)">${rect(0, 0, 64, 93, "#9bb9cf", 8)}${rect(8, 8, 48, 77, "#174777", 4)}<circle cx="46" cy="51" r="3" fill="#16c6a5"/><path d="M-24 -8 15 -22 44 -8 5 8Z" fill="#fff"/><path d="M-24 -8 5 8V30L-24 14Z" fill="#bfdaeb"/><circle cx="-13" cy="7" r="6" fill="#0755ed"/></g>`)}${group("solar", panel(78, 309, 0.75))}${group("design", `<g transform="translate(420 283) scale(.47)">${desktop(0, 0)}</g>`)}<g filter="url(#${id}-shadow)">${rect(250, 143, 140, 154, "#d2e4f0", 24)}${rect(245, 133, 140, 154, "#fff", 24)}<image href="${shield}" x="277" y="155" width="76" height="101" preserveAspectRatio="xMidYMid meet"/></g>${text(258, 318, "ONE CONNECTED GIGI", 10)}`;
  } else content = [it, security, solar, design][index]();
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 440" fill="none">${defs}<ellipse cx="320" cy="374" rx="242" ry="35" fill="#adc5d5" opacity=".12"/><path d="M55 277 318 147 585 276 320 409Z" fill="url(#${id}-ground)" stroke="#d4e3ed"/><g class="scene-objects">${content}</g></svg>`;
}
