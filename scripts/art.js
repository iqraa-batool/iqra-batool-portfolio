/**
 * Illustrated project previews.
 *
 * These are authored SVG interface compositions that stand in for screenshots
 * of the demonstration projects. They are generated at build time into
 * public/assets/img/projects/<slug>.svg. Replace with real screenshots by setting
 * `image` on a project in content/projects.js.
 */

const C = {
  plum: "#292333",
  deep: "#1f1a27",
  raised: "#332b40",
  royal: "#482B63",
  mauve: "#A46CA3",
  pink: "#E8B8C6",
  lav: "#DCD0E9",
  cream: "#FAF6F0",
  gold: "#D4AF37",
  white: "#FFFFFF",
};

const W = 1200;
const H = 800;

function wrap(title, inner, bg = C.raised) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${title}">
<rect width="${W}" height="${H}" fill="${bg}"/>
${inner}
</svg>`;
}

/** A browser window frame. Returns markup; content area starts at (x, y+44). */
function browser(x, y, w, h, fill = C.cream, chrome = C.lav) {
  return `<g>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${fill}"/>
  <path d="M${x} ${y + 6}a6 6 0 0 1 6-6h${w - 12}a6 6 0 0 1 6 6v38H${x}z" fill="${chrome}"/>
  <circle cx="${x + 24}" cy="${y + 22}" r="5" fill="${C.mauve}" opacity=".55"/>
  <circle cx="${x + 42}" cy="${y + 22}" r="5" fill="${C.mauve}" opacity=".35"/>
  <circle cx="${x + 60}" cy="${y + 22}" r="5" fill="${C.mauve}" opacity=".2"/>
  <rect x="${x + 96}" y="${y + 13}" width="${Math.min(380, w - 140)}" height="18" rx="3" fill="${C.white}" opacity=".7"/>
</g>`;
}

function lines(x, y, widths, gap = 18, h = 7, fill = C.plum, opacity = 0.18) {
  return widths
    .map((w, i) => `<rect x="${x}" y="${y + i * gap}" width="${w}" height="${h}" rx="2" fill="${fill}" opacity="${opacity}"/>`)
    .join("");
}

/* 1. Atelier — editorial block theme */
function atelier() {
  const bx = 110, by = 90, bw = 980, bh = 660;
  const cx = bx + 56, cy = by + 44;
  return wrap(
    "Illustrated preview of the Atelier block theme",
    `<rect x="0" y="560" width="${W}" height="240" fill="${C.royal}" opacity=".55"/>
${browser(bx, by, bw, bh)}
<g>
  <text x="${cx}" y="${cy + 58}" font-family="Georgia, serif" font-size="22" letter-spacing="6" fill="${C.plum}">ATELIER</text>
  <g fill="${C.plum}" opacity=".45">
    <rect x="${cx + 540}" y="${cy + 46}" width="56" height="6" rx="2"/>
    <rect x="${cx + 620}" y="${cy + 46}" width="56" height="6" rx="2"/>
    <rect x="${cx + 700}" y="${cy + 46}" width="56" height="6" rx="2"/>
    <rect x="${cx + 780}" y="${cy + 46}" width="80" height="22" rx="2" fill="none" stroke="${C.plum}" stroke-width="1.5"/>
  </g>
  <text x="${cx}" y="${cy + 170}" font-family="Georgia, serif" font-size="64" fill="${C.plum}">Rooms that</text>
  <text x="${cx}" y="${cy + 240}" font-family="Georgia, serif" font-size="64" font-style="italic" fill="${C.royal}">hold the light.</text>
  ${lines(cx, cy + 286, [340, 300, 250], 20, 7, C.plum, 0.22)}
  <rect x="${cx}" y="${cy + 362}" width="150" height="40" rx="2" fill="${C.plum}"/>
  <rect x="${cx + 26}" y="${cy + 379}" width="98" height="6" rx="2" fill="${C.cream}"/>
  <rect x="${cx + 470}" y="${cy + 110}" width="398" height="300" rx="2" fill="${C.mauve}" opacity=".35"/>
  <path d="M${cx + 470} ${cy + 410}l120-130 80 70 70-60 128 120z" fill="${C.royal}" opacity=".55"/>
  <circle cx="${cx + 790}" cy="${cy + 170}" r="30" fill="${C.pink}"/>
  <rect x="${cx + 430}" y="${cy + 330}" width="150" height="110" rx="2" fill="${C.lav}"/>
  <path d="M${cx + 430} ${cy + 440}l50-46 36 28 64-52v70z" fill="${C.mauve}" opacity=".6"/>
  <line x1="${cx}" y1="${cy + 470}" x2="${cx + 868}" y2="${cy + 470}" stroke="${C.plum}" stroke-opacity=".12"/>
  <g>
    <rect x="${cx}" y="${cy + 496}" width="270" height="76" fill="${C.lav}" opacity=".7"/>
    <rect x="${cx + 299}" y="${cy + 496}" width="270" height="76" fill="${C.pink}" opacity=".55"/>
    <rect x="${cx + 598}" y="${cy + 496}" width="270" height="76" fill="${C.mauve}" opacity=".35"/>
  </g>
  <rect x="${cx}" y="${cy + 488}" width="40" height="2" fill="${C.gold}"/>
</g>`
  );
}

/* 2. Answer-ready help centre */
function answers() {
  const bx = 90, by = 80, bw = 720, bh = 640;
  const cx = bx + 48, cy = by + 44;
  const qs = [
    ["How do I reset my password?", 1],
    ["Can I change my billing plan?", 0],
    ["Where do I find my invoices?", 0],
  ];
  const rows = qs
    .map(([q, open], i) => {
      const y = cy + 200 + (i === 0 ? 0 : 150 + (i - 1) * 64);
      return `<g>
  <line x1="${cx}" y1="${y}" x2="${cx + 624}" y2="${y}" stroke="${C.plum}" stroke-opacity=".14"/>
  <text x="${cx}" y="${y + 38}" font-family="Georgia, serif" font-size="24" fill="${C.plum}">${q}</text>
  <path d="M${cx + 606} ${y + 26}l8 8 8-8" fill="none" stroke="${C.royal}" stroke-width="2" ${open ? 'transform="rotate(180 ' + (cx + 614) + " " + (y + 30) + ')"' : ""}/>
  ${open ? `<rect x="${cx}" y="${y + 58}" width="3" height="62" fill="${C.gold}"/>${lines(cx + 18, y + 64, [520, 560, 380], 20, 7, C.plum, 0.25)}` : ""}
</g>`;
    })
    .join("");
  return wrap(
    "Illustrated preview of the Answer-Ready Help Centre",
    `${browser(bx, by, bw, bh)}
<g>
  <text x="${cx}" y="${cy + 64}" font-family="Georgia, serif" font-size="40" fill="${C.plum}">How can we help?</text>
  <rect x="${cx}" y="${cy + 92}" width="624" height="54" rx="3" fill="${C.white}" stroke="${C.plum}" stroke-opacity=".2"/>
  <circle cx="${cx + 28}" cy="${cy + 119}" r="9" fill="none" stroke="${C.royal}" stroke-width="2"/>
  <line x1="${cx + 35}" y1="${cy + 126}" x2="${cx + 42}" y2="${cy + 133}" stroke="${C.royal}" stroke-width="2"/>
  <rect x="${cx + 54}" y="${cy + 115}" width="220" height="8" rx="2" fill="${C.plum}" opacity=".2"/>
  ${rows}
</g>
<g>
  <rect x="860" y="150" width="270" height="500" rx="6" fill="${C.deep}"/>
  <text x="888" y="196" font-family="Consolas, monospace" font-size="15" fill="${C.lav}" opacity=".6">application/ld+json</text>
  <g font-family="Consolas, monospace" font-size="17">
    <text x="888" y="246" fill="${C.lav}">{</text>
    <text x="906" y="280" fill="${C.pink}">"@type":</text><text x="996" y="280" fill="${C.cream}">"FAQPage",</text>
    <text x="906" y="314" fill="${C.pink}">"mainEntity":</text><text x="1040" y="314" fill="${C.lav}">[{</text>
    <text x="926" y="348" fill="${C.pink}">"@type":</text><text x="1016" y="348" fill="${C.cream}">"Question",</text>
    <text x="926" y="382" fill="${C.pink}">"name":</text><text x="1004" y="382" fill="${C.cream}">"How do…",</text>
    <text x="926" y="416" fill="${C.pink}">"acceptedAnswer":</text>
    <text x="946" y="450" fill="${C.lav}">{ "@type": "Answer" }</text>
    <text x="906" y="484" fill="${C.lav}">}]</text>
    <text x="888" y="518" fill="${C.lav}">}</text>
  </g>
  <circle cx="1094" cy="600" r="8" fill="${C.gold}"/>
  <rect x="888" y="596" width="150" height="8" rx="2" fill="${C.lav}" opacity=".35"/>
</g>`,
    C.plum
  );
}

/* 3. Enquiry triage automation — a flow diagram */
function automation() {
  const node = (x, y, w, label, sub, fill = C.cream, ink = C.plum) => `<g>
  <rect x="${x}" y="${y}" width="${w}" height="96" rx="6" fill="${fill}"/>
  <text x="${x + 24}" y="${y + 42}" font-family="Georgia, serif" font-size="26" fill="${ink}">${label}</text>
  <text x="${x + 24}" y="${y + 70}" font-family="Arial, sans-serif" font-size="15" fill="${ink}" opacity=".65">${sub}</text>
</g>`;
  const arrow = (d) => `<path d="${d}" fill="none" stroke="${C.lav}" stroke-opacity=".55" stroke-width="2"/>`;
  return wrap(
    "Illustrated preview of the Enquiry Triage workflow",
    `<g>
  ${node(70, 352, 220, "Contact form", "New enquiry")}
  ${arrow("M290 400h70")}
  <path d="M352 392l10 8-10 8" fill="none" stroke="${C.lav}" stroke-opacity=".55" stroke-width="2"/>
  ${node(370, 352, 230, "Server function", "Key stays here", C.royal, C.cream)}
  ${arrow("M600 400h70")}
  <path d="M662 392l10 8-10 8" fill="none" stroke="${C.lav}" stroke-opacity=".55" stroke-width="2"/>
  <g>
    <rect x="680" y="322" width="240" height="156" rx="6" fill="${C.deep}" stroke="${C.mauve}" stroke-opacity=".6"/>
    <text x="704" y="364" font-family="Georgia, serif" font-size="26" fill="${C.cream}">Suggests</text>
    <rect x="704" y="384" width="88" height="26" rx="3" fill="${C.pink}" opacity=".9"/>
    <text x="714" y="402" font-family="Arial, sans-serif" font-size="14" fill="${C.plum}">Quote</text>
    <rect x="800" y="384" width="96" height="26" rx="3" fill="none" stroke="${C.pink}" stroke-opacity=".7"/>
    <text x="812" y="402" font-family="Arial, sans-serif" font-size="14" fill="${C.pink}">Priority</text>
    <rect x="704" y="424" width="190" height="7" rx="2" fill="${C.lav}" opacity=".3"/>
    <rect x="704" y="442" width="150" height="7" rx="2" fill="${C.lav}" opacity=".3"/>
  </g>
  ${arrow("M920 400c40 0 40-170 80-170")}
  ${arrow("M920 400h80")}
  ${arrow("M920 400c40 0 40 170 80 170")}
  ${node(1000, 182, 170, "Sales", "Routed", C.raised, C.lav)}
  ${node(1000, 352, 170, "Support", "Routed", C.raised, C.lav)}
  ${node(1000, 522, 170, "Log", "Every suggestion", C.raised, C.lav)}
  <g>
    <circle cx="800" cy="560" r="26" fill="none" stroke="${C.gold}" stroke-width="2"/>
    <circle cx="800" cy="552" r="7" fill="${C.gold}"/>
    <path d="M786 572a14 10 0 0 1 28 0" fill="${C.gold}"/>
    <line x1="800" y1="478" x2="800" y2="534" stroke="${C.gold}" stroke-dasharray="4 6" stroke-width="2"/>
    <text x="840" y="566" font-family="Arial, sans-serif" font-size="16" fill="${C.gold}">A person confirms</text>
  </g>
  <text x="70" y="140" font-family="Georgia, serif" font-size="46" fill="${C.cream}">Every enquiry,</text>
  <text x="70" y="196" font-family="Georgia, serif" font-size="46" font-style="italic" fill="${C.pink}">sorted before Monday.</text>
</g>`,
    C.plum
  );
}

/* 4. Figma to WordPress */
function figma() {
  return wrap(
    "Illustrated preview of the Figma to WordPress launch page",
    `<g>
  <rect x="60" y="90" width="500" height="620" rx="6" fill="${C.deep}"/>
  <rect x="60" y="90" width="130" height="620" fill="${C.plum}"/>
  <g font-family="Arial, sans-serif" font-size="14" fill="${C.lav}">
    <text x="80" y="130" opacity=".5">Layers</text>
    
    <text x="96" y="200" opacity=".7">Heading</text>
    <text x="96" y="228" opacity=".7">Image</text>
    <text x="80" y="266">Features</text>
    <text x="80" y="300">Footer</text>
  </g>
  <rect x="78" y="154" width="98" height="26" rx="3" fill="${C.royal}" opacity=".7"/>
  <text x="88" y="172" font-family="Arial, sans-serif" font-size="14" fill="${C.cream}">Hero</text>
  <rect x="220" y="150" width="310" height="500" fill="${C.cream}"/>
  <rect x="216" y="146" width="318" height="168" fill="none" stroke="${C.pink}" stroke-width="2"/>
  <text x="240" y="216" font-family="Georgia, serif" font-size="34" fill="${C.plum}">Steeped</text>
  <text x="240" y="256" font-family="Georgia, serif" font-size="34" font-style="italic" fill="${C.royal}">slowly.</text>
  <rect x="240" y="276" width="120" height="7" rx="2" fill="${C.plum}" opacity=".25"/>
  <circle cx="460" cy="230" r="46" fill="${C.mauve}" opacity=".5"/>
  <rect x="240" y="340" width="130" height="120" fill="${C.lav}"/>
  <rect x="380" y="340" width="130" height="120" fill="${C.pink}" opacity=".6"/>
  ${lines(240, 490, [260, 220, 240, 180], 22, 7, C.plum, 0.18)}
  <rect x="534" y="140" width="8" height="8" fill="${C.pink}"/>
  <rect x="208" y="140" width="8" height="8" fill="${C.pink}"/>
  <text x="410" y="138" font-family="Arial, sans-serif" font-size="13" fill="${C.pink}">318 × 168</text>
</g>
<path d="M590 400h50" stroke="${C.gold}" stroke-width="2"/>
<path d="M632 390l12 10-12 10" fill="none" stroke="${C.gold}" stroke-width="2"/>
${browser(670, 90, 470, 620)}
<g>
  <text x="704" y="210" font-family="Georgia, serif" font-size="40" fill="${C.plum}">Steeped</text>
  <text x="704" y="256" font-family="Georgia, serif" font-size="40" font-style="italic" fill="${C.royal}">slowly.</text>
  <rect x="704" y="280" width="150" height="8" rx="2" fill="${C.plum}" opacity=".25"/>
  <rect x="704" y="306" width="120" height="36" rx="2" fill="${C.plum}"/>
  <circle cx="1040" cy="230" r="58" fill="${C.mauve}" opacity=".5"/>
  <rect x="704" y="372" width="196" height="150" fill="${C.lav}"/>
  <rect x="912" y="372" width="196" height="150" fill="${C.pink}" opacity=".6"/>
  ${lines(704, 556, [380, 320, 350, 260], 24, 7, C.plum, 0.18)}
  <rect x="704" y="364" width="40" height="2" fill="${C.gold}"/>
</g>`,
    C.raised
  );
}

const ART = { atelier, answers, automation, figma };

function renderArt(name) {
  const fn = ART[name] || atelier;
  return fn();
}

module.exports = { renderArt, ART_SIZE: { width: W, height: H } };
