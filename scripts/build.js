#!/usr/bin/env node
/**
 * Static site generator for the Iqra Batool portfolio.
 *
 *   node scripts/build.js      → writes the complete site to /public
 *
 * The site is one landing page plus a case study page per project.
 * Content lives in /content (plain JavaScript data files). Templates are the
 * functions in this file. Assets in /src are copied to /public/assets.
 * No dependencies: Node.js 18+ is all that's required.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "public");
const SRC = path.join(ROOT, "src");

const site = require("../content/site");
const about = require("../content/about");
const services = require("../content/services");
const projects = require("../content/projects");
const { renderArt, ART_SIZE } = require("./art");

// Content hash per asset so browsers fetch new CSS/JS after every change.
const assetVersion = (rel) => crypto.createHash("md5").update(fs.readFileSync(path.join(SRC, rel))).digest("hex").slice(0, 10);
const CSS_V = assetVersion("css/main.css");
const JS_V = assetVersion("js/main.js");
const ICON_V = assetVersion("img/favicon.svg");

const BASE = site.siteUrl.replace(/\/+$/, "");
const BUILD_YEAR = new Date().getFullYear();
const THEME_COLOR = "#0B0B0B";
const warnings = [];
if (/example\.com/.test(BASE)) warnings.push("content/site.js → siteUrl is still https://example.com. Set your real domain before deploying.");

/* ---------------------------------------------------------------- helpers */
const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const abs = (p) => BASE + p;
const json = (obj) => JSON.stringify(obj).replace(/</g, "\\u003c");

function write(rel, content) {
  const file = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}
// Design references kept in src/img stay out of the build
const SKIP_COPY = /[.](jfif|psd|ai)$/i;
function copyDir(from, to) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const s = path.join(from, entry.name);
    const d = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else if (!SKIP_COPY.test(entry.name)) fs.copyFileSync(s, d);
  }
}

/* Projects: computed fields */
const TYPE_LABEL = { client: "Client work", personal: "Personal project", demo: "Demonstration project", experimental: "Experiment" };
const projectList = projects.map((p) => ({
  ...p,
  url: `/projects/${p.slug}/`,
  typeLabel: TYPE_LABEL[p.type] || "Project",
  img: p.image || `/assets/img/projects/${p.slug}.svg`,
  imgW: p.image ? p.imageWidth || 1600 : ART_SIZE.width,
  imgH: p.image ? p.imageHeight || 1067 : ART_SIZE.height,
}));

const socials = (site.social || []).filter((s) => s.url);
const email = (site.contact && site.contact.email) || "";
const phone = (site.contact && site.contact.phone) || "";
const location = (site.contact && site.contact.location) || "";

/* ------------------------------------------------------------------ icons */
const ICON_PATHS = {
  arrow: '<path d="M4 12h16M14 6l6 6-6 6"/>',
  code: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5"/>',
  spark: '<path d="M12 3c.7 5.2 3.8 8.3 9 9-5.2.7-8.3 3.8-9 9-.7-5.2-3.8-8.3-9-9 5.2-.7 8.3-3.8 9-9z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.01"/>',
  alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16.5v.01"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.5 2.5L16 9.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 7l9 6 9-6"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"/>',
  linkedin:
    '<rect x="3.5" y="9" width="3.5" height="11" fill="currentColor" stroke="none"/><circle cx="5.25" cy="5.25" r="2" fill="currentColor" stroke="none"/><path d="M10 9h3.4v1.6c.6-1 1.8-1.9 3.6-1.9 2.9 0 3.5 1.9 3.5 4.4V20H17v-6c0-1.4-.3-2.5-1.7-2.5-1.5 0-2 1.1-2 2.5v6H10z" fill="currentColor" stroke="none"/>',
  github: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16"/>',
  x: '<path d="M4 4l16 16M20 4L4 20"/>',
};
const icon = (name, cls = "") =>
  `<svg${cls ? ` class="${cls}"` : ""} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICON_PATHS[name] || ICON_PATHS.link}</svg>`;
const SOCIAL_LABEL = {
  linkedin: "LinkedIn", github: "GitHub", x: "X", instagram: "Instagram", behance: "Behance",
  dribbble: "Dribbble", facebook: "Facebook", youtube: "YouTube", upwork: "Upwork", fiverr: "Fiverr",
};

// The IB mark: a burgundy I that is also the stem of the B.
const monogram = (cls = "") => `<svg${cls ? ` class="${cls}"` : ""} viewBox="0 0 40 64" aria-hidden="true" focusable="false">
<rect width="13" height="64" fill="#8C2A35"/><path fill-rule="evenodd" fill="currentColor" d="M17 0H24Q36 0 36 12V20Q36 28 30 31Q40 34 40 44V52Q40 64 28 64H17ZM17 12H21Q24 12 24 15V22Q24 25 21 25H17ZM17 37H23Q27 37 27 40V49Q27 52 23 52H17Z"/></svg>`;

/* ---------------------------------------------------------- structured data */
const PERSON_ID = abs("/#person");
const WEBSITE_ID = abs("/#website");
function personSchema() {
  const p = {
    "@type": "Person",
    "@id": PERSON_ID,
    name: site.name,
    url: abs("/"),
    jobTitle: site.roles,
    description: site.description,
    image: abs("/assets/img/og-image.png"),
    knowsAbout: [
      "WordPress", "WordPress web development", "Custom WordPress development", "HTML", "CSS", "JavaScript", "WordPress theme development", "WordPress plugin development", "Bricks Builder",
      "Website development with AI", "AI-powered web development", "AI chatbots", "AI integration", "Workflow automation", "Figma to WordPress", "Website speed optimization", "Search engine optimization", "Technical SEO",
      "Answer Engine Optimization", "Generative Engine Optimization", "Structured data",
    ],
    hasCredential: about.education.map((e) => ({
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "degree",
      name: e.degree,
      ...(e.institution ? { recognizedBy: { "@type": "CollegeOrUniversity", name: e.institution } } : {}),
    })),
  };
  const alumni = about.education.filter((e) => e.institution).map((e) => ({ "@type": "CollegeOrUniversity", name: e.institution }));
  if (alumni.length) p.alumniOf = alumni;
  if (socials.length) p.sameAs = socials.map((s) => s.url);
  if (email) p.email = "mailto:" + email;
  if (location) p.homeLocation = { "@type": "Place", name: location };
  return p;
}
const websiteSchema = () => ({
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: abs("/"),
  name: site.name,
  description: site.description,
  inLanguage: site.locale,
  publisher: { "@id": PERSON_ID },
});
const breadcrumbSchema = (items) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
});

/* ------------------------------------------------------------------ layout */
// The site is one landing page plus a case study per project. Navigation is
// made of anchors: "#about" on the landing page, "/#about" everywhere else.
const NAV = [
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "process", label: "Process" },
  { id: "work", label: "Work" },
  { id: "faq", label: "FAQ" },
];
const anchor = (home, id) => (home ? `#${id}` : `/#${id}`);

function header(current) {
  const home = current === "/";
  const items = NAV.map((n) => `<li><a class="nav__link" href="${anchor(home, n.id)}" data-spy="${n.id}">${n.label}</a></li>`).join("");
  return `<header class="site-header">
  <div class="container">
    <a class="brand" href="/"${home ? ' aria-current="page"' : ""}>${monogram()}<span class="brand__name">${esc(site.name)}</span><span class="visually-hidden"> — home</span></a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav"><span class="nav-toggle__label">Menu</span><span class="nav-toggle__bars" aria-hidden="true"></span></button>
    <nav id="site-nav" class="nav" aria-label="Main">
      <ul class="nav__list">${items}</ul>
      <a class="btn-talk" href="${anchor(home, "contact")}"><span>Let's Talk</span><span class="btn-talk__icon" aria-hidden="true">${icon("arrow")}</span></a>
    </nav>
  </div>
</header>`;
}

function socialList() {
  if (!socials.length) return "";
  return `<ul class="social">${socials
    .map((s) => {
      const label = SOCIAL_LABEL[s.network] || s.network;
      return `<li><a href="${esc(s.url)}" rel="me noopener" target="_blank" aria-label="${esc(label)} (opens in a new tab)">${icon(ICON_PATHS[s.network] ? s.network : "link")}</a></li>`;
    })
    .join("")}</ul>`;
}

function footer(current) {
  const home = current === "/";
  return `<footer class="site-footer on-black">
  <div class="container">
    <div class="footer__top">
      <p class="footer__line">${esc(site.roles.join(", ").replace(/, ([^,]*)$/, " and $1"))}.</p>
      <ul class="footer__nav">
        ${NAV.map((n) => `<li><a href="${anchor(home, n.id)}">${n.label}</a></li>`).join("")}
        <li><a href="${anchor(home, "contact")}">Contact</a></li>
      </ul>
      <div class="footer__contact">
        ${email ? `<a href="mailto:${esc(email)}">${esc(email)}</a>` : ""}
        ${phone ? `<a href="tel:${esc(phone.replace(/[^+\d]/g, ""))}">${esc(phone)}</a>` : ""}
        ${location ? `<span>${esc(location)}</span>` : ""}
        ${socialList()}
      </div>
    </div>
    <p class="footer__mark" aria-hidden="true">${esc(site.name)}</p>
    <div class="footer__bottom">
      <p>© <span data-year>${BUILD_YEAR}</span> ${esc(site.name)}. All rights reserved.</p>
      <button class="to-top" type="button"><span>Back to top</span>${icon("up")}</button>
    </div>
  </div>
</footer>`;
}

function layout({ title, description, path: pagePath, body, schema = [], ogType = "website", noindex = false }) {
  const canonical = abs(pagePath);
  const ogImage = abs("/assets/img/og-image.png");
  const graph = schema.length ? `<script type="application/ld+json">${json({ "@context": "https://schema.org", "@graph": schema })}</script>` : "";
  return `<!doctype html>
<html lang="${site.locale}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex, follow">' : `<link rel="canonical" href="${canonical}">`}
<meta name="author" content="${esc(site.name)}">
<meta name="theme-color" content="${THEME_COLOR}">
<meta name="color-scheme" content="dark">
<link rel="icon" href="/assets/img/favicon.svg?v=${ICON_V}" type="image/svg+xml">
<link rel="icon" href="/assets/img/favicon-32.png?v=${ICON_V}" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png?v=${ICON_V}">
<link rel="manifest" href="/site.webmanifest">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(site.name)} — ${esc(site.roles.join(", "))}">
<meta property="og:locale" content="en_GB">
<meta name="twitter:card" content="summary_large_image">
${site.twitterHandle ? `<meta name="twitter:site" content="${esc(site.twitterHandle)}">\n<meta name="twitter:creator" content="${esc(site.twitterHandle)}">` : ""}
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${ogImage}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;800;900&family=Hanken+Grotesk:wght@400;500;600&display=swap">
<link rel="stylesheet" href="/assets/css/main.css?v=${CSS_V}">
<script>document.documentElement.classList.add("js")</script>
${graph}
</head>
<body class="on-black">
<a class="skip-link" href="#main">Skip to content</a>
${header(pagePath)}
<main id="main" tabindex="-1">
${body}
</main>
${footer(pagePath)}
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js" defer></script>
<script src="/assets/js/main.js?v=${JS_V}" defer></script>
</body>
</html>
`;
}

/* --------------------------------------------------------------- partials */
const breadcrumb = (items) =>
  `<nav class="breadcrumb" aria-label="Breadcrumb"><ol>${items
    .map((it, i) => (i === items.length - 1 ? `<li><span aria-current="page">${esc(it.name)}</span></li>` : `<li><a href="${it.path}">${esc(it.name)}</a></li>`))
    .join("")}</ol></nav>`;

function projectMedia(p, { eager = false } = {}) {
  return `<img src="${p.img}" alt="${esc(p.imageAlt || `Illustrated preview of ${p.title}: ${p.subtitle}`)}" width="${p.imgW}" height="${p.imgH}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}
// Demo projects carry no type badge
const badge = (p) => (p.type === "demo" ? "" : `<span class="badge">${esc(p.typeLabel)}</span>`);

/** An accordion row. Panels are open in the HTML; the script collapses them. */
function accRow({ id, head, panel, level = "h3" }) {
  return `<li class="acc__item">
  <${level} class="acc__heading"><button class="acc__head" type="button" aria-expanded="true" aria-controls="${id}">${head}<span class="acc__sign" aria-hidden="true"></span></button></${level}>
  <div class="acc__panel" id="${id}"><div class="acc__inner">${panel}</div></div>
</li>`;
}

/* ------------------------------------------------------------------- pages */
function homePage() {
  const statText = (s) => s.value.toFixed(s.decimals) + s.suffix;
  const seo = services.find((c) => c.id === "seo") || { faqs: [] };
  const faqs = seo.faqs || [];
  const SERVICE_ICON = { wordpress: "code", ai: "spark", seo: "search" };
  const word = (t, cls = "") => `<span class="w${cls ? " " + cls : ""}"><span>${t}</span></span>`;
  const MARQUEE = ["WordPress", "Bricks Builder", "AI automation", "SEO", "AEO", "GEO", "Figma to WordPress", "Speed"];
  const marquee = `<div class="marquee__group">${MARQUEE.map((t) => `<span>${esc(t)}</span>${icon("spark")}`).join("")}</div>`;
  const tile = (kind, name) => `<span class="tile tile--${kind}" aria-hidden="true">${icon(name)}</span>`;

  const body = `
<section class="hero on-black" aria-labelledby="hero-title">
  <div class="hero__glow" aria-hidden="true"></div>
  <div class="container hero__inner">
    <div class="hero__stage">
    <h1 id="hero-title" class="hero__title">
      <span class="hero__line">${word("Websites")} ${tile("cream", "code")} ${word("that")}</span>
      <span class="hero__line">${word("work.")} ${tile("wine", "spark")} ${word("And get")}</span>
      <span class="hero__line">${word("you")} ${tile("ring", "search")} ${word(`<em class="swap"><span class="swap__list"><span class="is-on">found.</span><span aria-hidden="true">seen.</span><span aria-hidden="true">chosen.</span></span></em>`)}</span>
    </h1>
    </div>
    <div class="hero__foot">
      <p class="lede">Hi, I'm ${esc(site.name)}. I build fast WordPress and Bricks Builder websites with AI, set up automations, and handle SEO so the right people can find you.</p>
      <div class="hero__actions">
        <a class="btn" href="#work"><span>See my work</span>${icon("arrow")}</a>
        <a class="link-arrow" href="#contact"><span>Let's work together</span>${icon("arrow")}</a>
      </div>
    </div>
  </div>
  <div class="marquee" aria-hidden="true"><div class="marquee__track">${marquee}${marquee}</div></div>
</section>

<div class="stack">
<section id="about" class="sheet on-black about" aria-labelledby="about-title">
  <div class="container about__grid">
    <h2 id="about-title" class="display" data-split>WordPress web development, <em>powered by AI</em> and built for SEO.</h2>
    <div class="about__text" data-rise>
      <p class="lede">${esc(about.intro)}</p>
      <p>Most businesses don't want to hire three different people for one website. They want someone who knows how it's built, where automation can save time, and how customers will find it on Google or through AI tools.</p>
      <p>That's what I do. I build clean WordPress and Bricks Builder sites that are easy to edit, use AI in website development only where it's useful, and set everything up so Google and AI tools understand it.</p>
    </div>
  </div>
  <div class="container">
    <dl class="facts" data-rise-group>
      ${site.stats.map((s) => `<div><dt>${esc(s.label)}</dt><dd><span data-count="${s.value}" data-decimals="${s.decimals}" data-suffix="${esc(s.suffix)}">${statText(s)}</span></dd></div>`).join("")}
      ${about.education.map((e) => `<div><dt>Education</dt><dd class="facts__text">${esc(e.degree)}</dd></div>`).join("")}
    </dl>
  </div>
</section>

<section id="services" class="sheet on-cream" aria-labelledby="services-title">
  <div class="container">
    <div class="sheet__head">
      <h2 id="services-title" class="display" data-split>Three services, <em>one person.</em></h2>
      <p data-rise>WordPress and Bricks Builder development, AI solutions and SEO. Use one on its own, or combine them for a website that's well built, smart and easy to find.</p>
    </div>
    <ul class="acc acc--services" data-acc data-acc-open="0" data-rise-group>
      ${services
        .map((c) =>
          accRow({
            id: `svc-${c.id}`,
            head: `<span class="acc__icon" aria-hidden="true">${icon(SERVICE_ICON[c.id] || "plus")}</span><span class="acc__title">${esc(c.title)}</span><span class="acc__summary">${esc(c.summary)}</span>`,
            panel: `<ul class="svc-list">${c.services
              .map((s) => `<li><h4>${esc(s.name)}</h4><p>${esc(s.desc)}</p><ul class="tags" aria-label="Includes">${s.tags.map((t) => `<li class="tag">${esc(t)}</li>`).join("")}</ul></li>`)
              .join("")}</ul>`,
          })
        )
        .join("")}
    </ul>
  </div>
</section>

<section id="process" class="sheet on-wine process" aria-labelledby="process-title">
  <div class="container">
    <div class="sheet__head">
      <h2 id="process-title" class="display" data-split>From first call <em>to launch.</em></h2>
      <p data-rise>Every project follows the same six steps, so you always know what happens next and what I need from you.</p>
    </div>
    <div class="flow">
      <div class="flow__wave" aria-hidden="true">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" focusable="false"><path d="M0 90C100 90 100 30 200 30S300 90 400 90 500 30 600 30 700 90 800 90 900 30 1000 30 1100 60 1200 60" fill="none" stroke="currentColor" stroke-width="1.5" vector-effect="non-scaling-stroke"/></svg>
      </div>
      <ol class="flow__steps">
        ${about.process.map((s, i) => `<li class="flow__step"><span class="flow__dot" aria-hidden="true"></span><span class="flow__num">${String(i + 1).padStart(2, "0")}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join("")}
      </ol>
    </div>
  </div>
</section>

<section id="work" class="sheet on-black work" aria-labelledby="work-title">
  <div class="container">
    <div class="sheet__head">
      <h2 id="work-title" class="display" data-split>Selected <em>work.</em></h2>
      <p data-rise>Four projects that show how I plan, build and optimise. Each one has a full case study.</p>
    </div>
    <ul class="plates">
      ${projectList
        .map(
          (p) => `<li class="plate">
        <a class="plate__media" href="${p.url}" tabindex="-1" aria-hidden="true">${projectMedia(p)}<span class="plate__view">${icon("arrow")}</span></a>
        <div class="plate__body">
          <p class="plate__cats">${badge(p)}${esc(p.categories.join(" · "))}</p>
          <h3 class="plate__title"><a href="${p.url}">${esc(p.title)}</a></h3>
          <p class="plate__sub">${esc(p.subtitle)}</p>
          <a class="link-arrow" href="${p.url}"><span>Read the case study<span class="visually-hidden">: ${esc(p.title)}</span></span>${icon("arrow")}</a>
        </div>
      </li>`
        )
        .join("")}
    </ul>
  </div>
</section>

${
  faqs.length
    ? `<section id="faq" class="sheet on-cream" aria-labelledby="faq-title">
  <div class="container faq__grid">
    <div class="faq__head">
      <h2 id="faq-title" class="display" data-split>Questions, <em>answered.</em></h2>
      <p data-rise>The things people ask most before starting an SEO project. Anything else, <a href="#contact">just ask</a>.</p>
    </div>
    <ul class="acc acc--faq" data-acc data-rise-group>
      ${faqs.map((f, i) => accRow({ id: `faq-${i + 1}`, head: `<span class="acc__title">${esc(f.q)}</span>`, panel: `<p>${esc(f.a)}</p>` })).join("")}
    </ul>
  </div>
</section>`
    : ""
}

<section id="contact" class="sheet on-wine contact" aria-labelledby="contact-title">
  <div class="container">
    <h2 id="contact-title" class="display display--xl" data-split>Got an idea? <em>Let's build it.</em></h2>
    <div class="contact__row">
      <div class="contact__side">
        <p class="lede" data-rise>Tell me about the website, workflow or SEO problem you're dealing with. I'll tell you honestly how I can help, or point you to someone who can.</p>
        ${email ? `<a class="contact__mail" href="mailto:${esc(email)}" data-rise>${esc(email)}</a>` : ""}
        ${socials.length ? socialList() : ""}
      </div>
      ${email ? `<a class="btn-cta" href="mailto:${esc(email)}?subject=${encodeURIComponent("Project enquiry")}" data-rise><span>Start a project</span><span class="btn-cta__icon" aria-hidden="true">${icon("arrow")}</span></a>` : ""}
    </div>
  </div>
</section>
</div>`;

  return layout({
    title: `WordPress Web Developer & AI Website Development | ${site.name}`,
    description: `${site.name} is a WordPress web developer and Bricks Builder developer. Custom WordPress websites, website development with AI, automation and SEO services.`,
    path: "/",
    body,
    schema: [
      personSchema(),
      websiteSchema(),
      { "@type": "WebPage", "@id": abs("/#webpage"), url: abs("/"), name: `${site.name} — Portfolio`, isPartOf: { "@id": WEBSITE_ID }, about: { "@id": PERSON_ID }, inLanguage: site.locale },
      ...services.map((c) => ({
        "@type": "Service",
        "@id": abs(`/#service-${c.id}`),
        name: c.title,
        description: c.summary,
        provider: { "@id": PERSON_ID },
        hasOfferCatalog: { "@type": "OfferCatalog", name: c.title, itemListElement: c.services.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.name, description: s.desc } })) },
      })),
      ...(faqs.length ? [{ "@type": "FAQPage", "@id": abs("/#faq"), mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }] : []),
    ],
  });
}

function projectDetail(p, i) {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Work", path: "/#work" }, { name: p.title, path: p.url }];
  const prev = projectList[(i - 1 + projectList.length) % projectList.length];
  const next = projectList[(i + 1) % projectList.length];
  const meta = [
    p.type === "demo" ? null : ["Project type", p.typeLabel],
    ["Role", p.role],
    ["Categories", p.categories.join(", ")],
    ["Technologies", p.tech.join(", ")],
    p.year ? ["Year", p.year] : null,
  ].filter(Boolean);
  const demoNote =
    p.type === "experimental"
      ? `<div class="note case-note">${icon("info")}<p><strong>This is an experiment:</strong> exploratory work, not a delivered client project.</p></div>`
      : "";

  const body = `
<section class="case-top on-black">
  <div class="hero__glow" aria-hidden="true"></div>
  <div class="container">
    <div class="case-hero">
      ${breadcrumb(crumbs)}
      <h1 class="display display--xl" data-split>${esc(p.title)}</h1>
      <p class="case-hero__sub" data-rise>${esc(p.subtitle)}</p>
      <p class="plate__cats" data-rise>${badge(p)}${esc(p.categories.join(" · "))}</p>
      ${demoNote}
    </div>
    <figure class="case-figure">${projectMedia(p, { eager: true })}</figure>
  </div>
</section>
<div class="stack">
<section class="sheet on-cream" aria-label="Case study">
  <div class="container case-layout">
    <dl class="case-meta">
      ${meta.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}
      ${p.liveUrl && /^https?:/.test(p.liveUrl) ? `<div><dt>Live site</dt><dd><a href="${esc(p.liveUrl)}" rel="noopener" target="_blank">Visit the site<span class="visually-hidden"> (opens in a new tab)</span></a></dd></div>` : ""}
    </dl>
    <div class="case-body">
      <section><h2>Overview</h2><p>${esc(p.summary)}</p></section>
      <section><h2>Objective</h2><p>${esc(p.objective)}</p></section>
      <section><h2>Approach</h2><ol class="steps">${p.approach.map((a) => `<li>${esc(a)}</li>`).join("")}</ol></section>
      <section><h2>Outcome</h2><p>${esc(p.outcome)}</p></section>
      <section><h2>Technologies</h2><ul class="tags">${p.tech.map((t) => `<li class="tag">${esc(t)}</li>`).join("")}</ul></section>
    </div>
  </div>
  <div class="container">
    <nav class="pager" aria-label="More projects">
      <a href="${prev.url}"><span>Previous project</span><span>${esc(prev.title)}</span></a>
      <a class="pager__next" href="${next.url}"><span>Next project</span><span>${esc(next.title)}</span></a>
    </nav>
  </div>
</section>
<section class="sheet on-wine cta" aria-labelledby="cta-title">
  <div class="container cta__inner">
    <h2 id="cta-title" class="display display--xl" data-split>Want something <em>like this?</em></h2>
    <div class="cta__side" data-rise>
      <p class="lede">Tell me about your project and what you'd like it to achieve.</p>
      <a class="btn" href="/#contact"><span>Start a conversation</span>${icon("arrow")}</a>
    </div>
  </div>
</section>
</div>`;

  return layout({
    title: `${p.title} — ${p.subtitle} | ${site.name}`,
    description: p.summary.slice(0, 158),
    path: p.url,
    body,
    schema: [
      personSchema(),
      {
        "@type": "CreativeWork",
        "@id": abs(p.url + "#work"),
        name: p.title,
        alternativeHeadline: p.subtitle,
        description: p.summary,
        creator: { "@id": PERSON_ID },
        keywords: p.categories.concat(p.tech).join(", "),
        ...(p.type === "demo" ? {} : { genre: p.typeLabel }),
        image: abs(p.img),
        url: abs(p.url),
      },
      breadcrumbSchema([{ name: "Home", path: "/" }, { name: p.title, path: p.url }]),
    ],
  });
}

function notFoundPage() {
  const body = `<section class="nf on-black">
  <div class="hero__glow" aria-hidden="true"></div>
  <div class="container nf__grid">
    <p class="nf__code" aria-hidden="true">404</p>
    <div class="nf__text">
      <h1 class="display">This page was <em>never indexed.</em></h1>
      <p class="lede">The address may be mistyped, or the page may have moved. Here are the places most people are looking for.</p>
      <ul class="nf__links">
        <li><a class="link-arrow" href="/"><span>Home</span>${icon("arrow")}</a></li>
        <li><a class="link-arrow" href="/#services"><span>Services</span>${icon("arrow")}</a></li>
        <li><a class="link-arrow" href="/#work"><span>Work</span>${icon("arrow")}</a></li>
        <li><a class="link-arrow" href="/#contact"><span>Contact</span>${icon("arrow")}</a></li>
      </ul>
    </div>
  </div>
</section>`;
  return layout({ title: `Page not found | ${site.name}`, description: "The page you were looking for could not be found.", path: "/404.html", body, noindex: true });
}

/* ------------------------------------------------------- site-level files */
function sitemap(urls) {
  const today = new Date().toISOString().slice(0, 10);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${abs(u.path)}</loc><lastmod>${u.lastmod || today}</lastmod></url>`).join("\n")}
</urlset>
`;
}

/* -------------------------------------------------------------------- run */
function build() {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  copyDir(path.join(SRC, "css"), path.join(OUT, "assets/css"));
  copyDir(path.join(SRC, "js"), path.join(OUT, "assets/js"));
  copyDir(path.join(SRC, "img"), path.join(OUT, "assets/img"));
  for (const p of projectList) if (!p.image) write(`assets/img/projects/${p.slug}.svg`, renderArt(p.art));

  const pages = [{ path: "/", html: homePage() }, ...projectList.map((p, i) => ({ path: p.url, html: projectDetail(p, i) }))];
  for (const pg of pages) write(path.join(pg.path, "index.html"), pg.html);
  write("404.html", notFoundPage());

  write("sitemap.xml", sitemap(pages));
  write("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${abs("/sitemap.xml")}\n`);
  write(
    "site.webmanifest",
    JSON.stringify(
      {
        name: site.name,
        short_name: site.shortName,
        start_url: "/",
        display: "standalone",
        background_color: THEME_COLOR,
        theme_color: THEME_COLOR,
        icons: [
          { src: "/assets/img/favicon.svg", type: "image/svg+xml", sizes: "any" },
          { src: "/assets/img/apple-touch-icon.png", type: "image/png", sizes: "180x180" },
        ],
      },
      null,
      2
    )
  );

  /* Link check: every internal href must resolve to a built file, and every
     anchor (same-page "#id" or home-page "/#id") must match an id. */
  const broken = [];
  const home = pages[0].html;
  const exists = (href) => {
    const clean = href.split("#")[0].split("?")[0];
    if (!clean) return true;
    const file = path.join(OUT, clean.endsWith("/") ? clean + "index.html" : clean);
    return fs.existsSync(file);
  };
  for (const pg of pages.concat([{ path: "/404.html", html: fs.readFileSync(path.join(OUT, "404.html"), "utf8") }])) {
    for (const m of pg.html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) if (!exists(m[1])) broken.push(`${pg.path} → ${m[1]}`);
    for (const m of pg.html.matchAll(/href="#([^"]+)"/g)) if (m[1] && !pg.html.includes(`id="${m[1]}"`)) broken.push(`${pg.path} → #${m[1]}`);
    for (const m of pg.html.matchAll(/href="\/#([^"]+)"/g)) if (!home.includes(`id="${m[1]}"`)) broken.push(`${pg.path} → /#${m[1]}`);
  }

  console.log(`Built ${pages.length + 1} pages into ${path.relative(ROOT, OUT)}/`);
  if (broken.length) {
    console.log(`\n✗ ${broken.length} broken internal link(s):\n  ` + [...new Set(broken)].join("\n  "));
    process.exitCode = 1;
  } else console.log("✓ All internal links and anchors resolve.");
  for (const w of warnings) console.log("! " + w);
  for (const f of ["og-image.png", "apple-touch-icon.png", "favicon-32.png"])
    if (!fs.existsSync(path.join(SRC, "img", f))) console.log(`! src/img/${f} is missing (run: npm run icons).`);
}

build();
