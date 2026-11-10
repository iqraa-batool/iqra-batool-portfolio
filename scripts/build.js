#!/usr/bin/env node
/**
 * Static site generator for the Iqra Batool portfolio.
 *
 *   node scripts/build.js      → writes the complete site to /public
 *
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
const { categories: postCategories, posts: rawPosts } = require("../content/posts");
const { renderArt, ART_SIZE } = require("./art");

// Content hash per asset so browsers fetch new CSS/JS after every change.
const assetVersion = (rel) => crypto.createHash("md5").update(fs.readFileSync(path.join(SRC, rel))).digest("hex").slice(0, 10);
const CSS_V = assetVersion("css/main.css");
const JS_V = assetVersion("js/main.js");

const BASE = site.siteUrl.replace(/\/+$/, "");
const BUILD_YEAR = new Date().getFullYear();
const warnings = [];
if (/example\.com/.test(BASE)) warnings.push("content/site.js → siteUrl is still https://example.com. Set your real domain before deploying.");

/* ---------------------------------------------------------------- helpers */
const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const abs = (p) => BASE + p;
const slugify = (s) => String(s).toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const stripTags = (html) => html.replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, " ");
const wordCount = (html) => stripTags(html).split(/\s+/).filter(Boolean).length;
const readingTime = (html) => Math.max(1, Math.ceil(wordCount(html) / 220));
const formatDate = (iso) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const json = (obj) => JSON.stringify(obj).replace(/</g, "\\u003c");

function write(rel, content) {
  const file = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}
function copyDir(from, to) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const s = path.join(from, entry.name);
    const d = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

/* Posts: computed fields */
const posts = rawPosts
  .map((p, i) => {
    let n = 0;
    const toc = [];
    const body = p.body
      .replace(/<h2>([\s\S]*?)<\/h2>/g, (m, inner) => {
        const text = stripTags(inner).trim();
        let id = slugify(text) || "section-" + ++n;
        while (toc.some((t) => t.id === id)) id += "-" + ++n;
        toc.push({ id, text });
        return `<h2 id="${id}">${inner}</h2>`;
      })
      .replace(/<table>/g, '<div class="table-wrap"><table>')
      .replace(/<\/table>/g, "</table></div>");
    return { ...p, body, toc, minutes: readingTime(p.body), words: wordCount(p.body), order: i, url: `/blog/${p.slug}/` };
  })
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.order - b.order));

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

const monogram = (cls = "") => `<svg${cls ? ` class="${cls}"` : ""} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
<path d="M8 12h15.2v3.2H18v33.6h5.2V52H8v-3.2h5.2V15.2H8z" fill="currentColor"/><path d="M28 12h5v40h-5z" fill="currentColor"/>
<path d="M30.5 13.8H42a8.6 8.6 0 0 1 0 17.2H30.5M30.5 31H44a9.6 9.6 0 0 1 0 19.2H30.5" fill="none" stroke="currentColor" stroke-width="3.6"/>
<circle cx="30.5" cy="31" r="2.6" fill="#D4AF37"/></svg>`;

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
const NAV = [
  { href: "/about/", label: "About" },
  { href: "/services/", label: "Services" },
  { href: "/projects/", label: "Projects" },
  { href: "/blog/", label: "Blog" },
];

function header(current) {
  const items = NAV.map((n) => {
    const active = current.startsWith(n.href);
    return `<li><a class="nav__link" href="${n.href}"${active ? ' aria-current="page"' : ""}>${n.label}</a></li>`;
  }).join("");
  const talkActive = current.startsWith("/contact/");
  return `<header class="site-header">
  <div class="container">
    <a class="brand" href="/"${current === "/" ? ' aria-current="page"' : ""}>${monogram()}<span class="brand__name">${esc(site.name)}</span><span class="visually-hidden"> — home</span></a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav"><span class="nav-toggle__label">Menu</span><span class="nav-toggle__bars" aria-hidden="true"></span></button>
    <nav id="site-nav" class="nav" aria-label="Main">
      <ul class="nav__list">${items}</ul>
      <a class="btn-talk" href="/contact/"${talkActive ? ' aria-current="page"' : ""}>Let's Talk</a>
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

function footer() {
  const recent = posts.slice(0, 3);
  const contactItems = [
    `<li><a href="/contact/">Contact form</a></li>`,
    email ? `<li><a href="mailto:${esc(email)}">${esc(email)}</a></li>` : "",
    phone ? `<li><a href="tel:${esc(phone.replace(/[^+\d]/g, ""))}">${esc(phone)}</a></li>` : "",
    location ? `<li>${esc(location)}</li>` : "",
  ].join("");
  return `<footer class="site-footer">
  <div class="container">
    <div class="footer__grid">
      <div class="footer__brand">
        <a class="brand" href="/">${monogram()}<span class="brand__name">${esc(site.name)}</span></a>
        <p>${esc(site.roles.join(", ").replace(/, ([^,]*)$/, " and $1"))}. Building better websites, smarter workflows and stronger digital visibility.</p>
        ${socialList()}
      </div>
      <div class="footer__col">
        <h2>Pages</h2>
        <ul><li><a href="/">Home</a></li><li><a href="/about/">About</a></li><li><a href="/services/">Services</a></li><li><a href="/projects/">Projects</a></li><li><a href="/blog/">Blog</a></li><li><a href="/contact/">Contact</a></li></ul>
      </div>
      <div class="footer__col">
        <h2>Services</h2>
        <ul>${services.map((c) => `<li><a href="/services/#${c.id}">${esc(c.title)}</a></li>`).join("")}</ul>
        <h2 style="margin-top:2rem">Get in touch</h2>
        <ul>${contactItems}</ul>
      </div>
      <div class="footer__col">
        <h2>Recent writing</h2>
        <ul>${recent.map((p) => `<li><a href="${p.url}">${esc(p.title)}</a></li>`).join("")}</ul>
      </div>
    </div>
    <div class="footer__bottom">
      <p>© <span data-year>${BUILD_YEAR}</span> ${esc(site.name)}. All rights reserved.</p>
      <p>Hand-built with HTML, CSS and JavaScript.</p>
    </div>
  </div>
</footer>
<button class="to-top" type="button" aria-label="Back to top">${icon("up")}</button>`;
}

function layout({ title, description, path: pagePath, body, schema = [], ogType = "website", noindex = false, article = null }) {
  const canonical = abs(pagePath);
  // Every inner-page hero gets the same gradient and blurred glow as the home hero.
  const glow = `<div class="hero__glow" aria-hidden="true"><span></span><span></span><span></span></div>`;
  body = body.replace(/<section class="page-hero section surface-dark">/g, (m) => m + glow).replace(/<section class="nf surface-dark">/g, (m) => m + glow);
  const ogImage = abs("/assets/img/og-image.png");
  const graph = schema.length ? `<script type="application/ld+json">${json({ "@context": "https://schema.org", "@graph": schema })}</script>` : "";
  const articleMeta = article
    ? `<meta property="article:published_time" content="${article.date}">
<meta property="article:modified_time" content="${article.updated || article.date}">
<meta property="article:author" content="${esc(site.name)}">
<meta property="article:section" content="${esc(article.category)}">`
    : "";
  return `<!doctype html>
<html lang="${site.locale}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex, follow">' : `<link rel="canonical" href="${canonical}">`}
<meta name="author" content="${esc(site.name)}">
<meta name="theme-color" content="#292333">
<meta name="color-scheme" content="dark light">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/assets/img/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
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
${articleMeta}
<meta name="twitter:card" content="summary_large_image">
${site.twitterHandle ? `<meta name="twitter:site" content="${esc(site.twitterHandle)}">\n<meta name="twitter:creator" content="${esc(site.twitterHandle)}">` : ""}
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${ogImage}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@600;700;800;900&family=Inter:wght@400;500;600&family=Poppins:wght@400;500;600&display=swap">
<link rel="stylesheet" href="/assets/css/main.css?v=${CSS_V}">
<link rel="alternate" type="application/rss+xml" title="${esc(site.name)} — Blog" href="/feed.xml">
<script>document.documentElement.classList.add("js")</script>
${graph}
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
${header(pagePath)}
<main id="main" tabindex="-1">
${body}
</main>
${footer()}
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

function pageHero({ crumbs, title, lede, extra = "" }) {
  return `<section class="page-hero section surface-dark">
  <div class="container">
    <div class="page-hero__inner">
      ${crumbs ? breadcrumb(crumbs) : ""}
      <h1>${title}</h1>
      ${lede ? `<p class="lede">${lede}</p>` : ""}
      ${extra}
    </div>
  </div>
</section>`;
}

function cta({ title = "Got an idea? <em>Let's build it.</em>", text = "Tell me about the website, workflow or SEO problem you're dealing with. I'll tell you honestly how I can help, or point you to someone who can.", button = "Start a Conversation" } = {}) {
  return `<section class="section cta surface-royal" aria-labelledby="cta-title">
  <div class="container cta__inner reveal">
    <h2 id="cta-title">${title}</h2>
    <div class="cta__side">
      <p>${text}</p>
      <a class="btn" href="/contact/"><span>${button}</span>${icon("arrow")}</a>
    </div>
  </div>
</section>`;
}

function projectMedia(p, { eager = false } = {}) {
  return `<img src="${p.img}" alt="${esc(p.imageAlt || `Illustrated preview of ${p.title}: ${p.subtitle}`)}" width="${p.imgW}" height="${p.imgH}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}
const badge = (p) => `<span class="badge${p.type === "demo" ? " badge--demo" : ""}">${esc(p.typeLabel)}</span>`;

function workItem(p, headingLevel = "h3") {
  return `<article class="work reveal">
  <a class="work__media" href="${p.url}" tabindex="-1" aria-hidden="true">${projectMedia(p)}</a>
  <div class="work__body">
    <div class="meta">${badge(p)}<span>${esc(p.categories.join(" · "))}</span></div>
    <${headingLevel} class="work__title"><a href="${p.url}">${esc(p.title)}</a></${headingLevel}>
    <p class="work__subtitle">${esc(p.subtitle)}</p>
    <p>${esc(p.summary)}</p>
    <ul class="tags" aria-label="Technologies">${p.tech.map((t) => `<li class="tag">${esc(t)}</li>`).join("")}</ul>
    <a class="link-arrow" href="${p.url}"><span>Read the case study<span class="visually-hidden">: ${esc(p.title)}</span></span>${icon("arrow")}</a>
  </div>
</article>`;
}

function postItem(p, headingLevel = "h3") {
  return `<article class="post-item">
  <div class="meta"><span>${esc(p.category)}</span><time datetime="${p.date}">${formatDate(p.date)}</time><span>${p.minutes} min read</span></div>
  <${headingLevel}><a href="${p.url}">${esc(p.title)}</a></${headingLevel}>
  <p>${esc(p.excerpt)}</p>
</article>`;
}

/* ------------------------------------------------------------------- pages */
function homePage() {
  const featured = projectList.filter((p) => p.featured).slice(0, 4);
  const statText = (s) => s.value.toFixed(s.decimals) + s.suffix;

  const body = `
<section class="hero section surface-dark" aria-labelledby="hero-title">
  <div class="hero__glow" aria-hidden="true"><span></span><span></span><span></span></div>
  <div class="hero__spot" aria-hidden="true"></div>
  <div class="container hero__inner">
    ${site.availability ? `<p class="hero__availability hero__fade">${esc(site.availability)}</p>` : ""}
    <div class="hero__stack">
    <p class="hero__eyebrow hero__fade">WordPress Web Developer · Bricks Builder · Website Development with AI</p>
    <h1 id="hero-title"><span class="line"><span>Websites that work.</span></span> <span class="line"><span><em>And get you found.</em></span></span></h1>
    <div class="hero__foot hero__fade">
      <p class="lede">Hi, I'm ${esc(site.name)}, a WordPress web developer and Bricks Builder specialist. I build fast WordPress websites with AI, set up automations, and handle SEO so the right people can find you.</p>
      <div class="hero__actions">
        <a class="btn" href="/projects/"><span>See my work</span>${icon("arrow")}</a>
        <a class="link-arrow" href="/contact/"><span>Let's work together</span>${icon("arrow")}</a>
      </div>
    </div>
    </div>
  </div>
</section>

<section class="section surface-cream" aria-labelledby="intro-title">
  <div class="container intro__grid">
    <div class="stats reveal">
      ${site.stats
        .map((s) => `<div class="stat"><span class="stat__value" data-count="${s.value}" data-decimals="${s.decimals}" data-suffix="${esc(s.suffix)}">${statText(s)}</span><span class="stat__label">${esc(s.label)}</span></div>`)
        .join("")}
      <p class="intro__edu">MPhil in Computer Science</p>
    </div>
    <div class="intro__text reveal">
      <h2 id="intro-title">WordPress web development, <em>powered by AI</em> and built for SEO.</h2>
      <p>Most businesses don't want to hire three different people for one website. They want someone who knows how it's built, where automation can save time, and how customers will find it on Google or through AI tools.</p>
      <p>That's what I do. I build clean WordPress and Bricks Builder sites that are easy to edit, use AI in website development only where it's useful, and set everything up so Google and AI tools understand it.</p>
      <a class="link-arrow" href="/about/"><span>More about me</span>${icon("arrow")}</a>
    </div>
  </div>
</section>

<section class="section surface-dark" aria-labelledby="services-title">
  <div class="container">
    <div class="section-head section-head--split reveal">
      <h2 id="services-title">Three services, <em>one person.</em></h2>
      <p>WordPress and Bricks Builder development, AI solutions and SEO services. Use one on its own, or combine them for a website that's well built, smart and easy to find.</p>
    </div>
    <ul class="service-index">
      ${services
        .map((c) => {
          const count = c.services.length;
          return `<li class="service-index__item reveal"><a class="service-index__link" href="/services/#${c.id}">
        <span><span class="service-index__title">${esc(c.title)}</span><span class="service-index__count">${count} services</span></span>
        <span class="service-index__summary">${esc(c.summary)}</span>
        <span class="service-index__arrow">${icon("arrow")}</span>
      </a></li>`;
        })
        .join("")}
    </ul>
  </div>
</section>

<section class="section surface-dark" aria-labelledby="work-title">
  <div class="container">
    <div class="section-head section-head--split reveal">
      <h2 id="work-title">Selected work</h2>
      <p>A few projects that show how I work. Each one is labelled, so you know what kind of project it is.</p>
    </div>
    <div class="work-list">${featured.map((p) => workItem(p)).join("")}</div>
    <p style="margin-top:4rem"><a class="btn btn--ghost" href="/projects/"><span>View all projects</span>${icon("arrow")}</a></p>
  </div>
</section>

<section class="section section--tight surface-dark" aria-labelledby="tools-title">
  <div class="container">
    <div class="section-head reveal">
      <h2 id="tools-title">The tools I build with</h2>
    </div>
    <ul class="tools reveal">
      ${about.tools.map((t) => `<li><span class="tools__name">${esc(t.name)}</span><p>${esc(t.use)}</p></li>`).join("")}
    </ul>
    ${about.additionalTools.length ? `<ul class="tags tools-more">${about.additionalTools.map((t) => `<li class="tag">${esc(t)}</li>`).join("")}</ul>` : ""}
  </div>
</section>

${cta()}`;

  return layout({
    title: `WordPress Web Developer & AI Website Development | ${site.name}`,
    description: `${site.name} is a WordPress web developer and Bricks Builder developer. Custom WordPress websites, website development with AI, automation and SEO services.`,
    path: "/",
    body,
    schema: [
      personSchema(),
      websiteSchema(),
      { "@type": "WebPage", "@id": abs("/#webpage"), url: abs("/"), name: `${site.name} — Portfolio`, isPartOf: { "@id": WEBSITE_ID }, about: { "@id": PERSON_ID }, inLanguage: site.locale },
    ],
  });
}

function aboutPage() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "About", path: "/about/" }];
  const s = site.stats;
  const facts = [
    ["Experience", `${s[0].value.toFixed(s[0].decimals)}${s[0].suffix} years`],
    ["Projects", `${s[1].value.toFixed(s[1].decimals)}${s[1].suffix} completed`],
    ["Education", "MPhil, Computer Science"],
    ["Focus", "WordPress, AI and SEO"],
    location ? ["Based in", location] : null,
  ].filter(Boolean);

  const education = about.education
    .map(
      (e) => `<li class="entry">
  <h3>${esc(e.degree)}</h3>
  <p class="entry__detail">${[e.institution, e.note].filter(Boolean).map(esc).join(" — ") || esc(e.status)}</p>
  <span class="entry__when">${esc(e.year || (e.institution || e.note ? e.status : ""))}</span>
</li>`
    )
    .join("");

  const experienceList = about.experience.length
    ? `<ul class="entries" style="margin-top:2.5rem">${about.experience
        .map(
          (x) => `<li class="entry"><h3>${esc(x.role)}</h3><p class="entry__detail">${[x.organization, x.summary].filter(Boolean).map(esc).join(" — ")}</p><span class="entry__when">${esc([x.start, x.end].filter(Boolean).join(" – "))}</span></li>`
        )
        .join("")}</ul>`
    : "";

  const certs = about.certifications.length
    ? `<section class="section surface-dark" aria-labelledby="certs-title">
  <div class="container">
    <div class="section-head reveal"><h2 id="certs-title">Certifications</h2></div>
    <ul class="entries">${about.certifications
      .map(
        (c) => `<li class="entry"><h3>${c.url ? `<a href="${esc(c.url)}" rel="noopener">${esc(c.name)}</a>` : esc(c.name)}</h3><p class="entry__detail">${esc([c.issuer, c.credentialId ? "Credential " + c.credentialId : ""].filter(Boolean).join(" — "))}</p><span class="entry__when">${esc(c.date || "")}</span></li>`
      )
      .join("")}</ul>
  </div>
</section>`
    : "";

  const body = `
${pageHero({
  crumbs,
  title: `A computer scientist <em>who builds for the web.</em>`,
  lede: esc(about.intro),
})}

<section class="section surface-cream" aria-labelledby="story-title">
  <div class="container about-story">
    <aside class="about-story__aside reveal">
      <h2 id="story-title">My story</h2>
      <dl class="fact-list">${facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
    </aside>
    <div class="about-story__body reveal">${about.story.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
  </div>
</section>

<section class="section surface-dark" aria-labelledby="edu-title">
  <div class="container">
    <div class="section-head reveal"><h2 id="edu-title">Education</h2></div>
    <ul class="entries reveal">${education}</ul>
  </div>
</section>

<section class="section surface-deep" aria-labelledby="exp-title">
  <div class="container">
    <div class="section-head section-head--split reveal">
      <h2 id="exp-title">Experience</h2>
      <p>In ${esc(s[0].value.toFixed(s[0].decimals) + s[0].suffix)} years I've finished ${esc(s[1].value.toFixed(s[1].decimals) + s[1].suffix)} projects across WordPress, AI and SEO, from building themes and plugins to setting up automations and helping sites rank better.</p>
    </div>
    ${experienceList}
    <p><a class="link-arrow" href="/projects/"><span>See selected projects</span>${icon("arrow")}</a></p>
  </div>
</section>

${certs}

<section class="section surface-dark" aria-labelledby="skills-title">
  <div class="container">
    <div class="section-head reveal"><h2 id="skills-title">Skills</h2></div>
    <div class="skills reveal">
      ${about.skills.map((g) => `<div><h3>${esc(g.group)}</h3><ul>${g.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></div>`).join("")}
    </div>
  </div>
</section>

${cta({ title: "Let's build <em>something useful.</em>", text: "Planning a website, an automation or an SEO project? I'd love to hear about it." })}`;

  return layout({
    title: `About ${site.name} — WordPress & Bricks Builder Developer`,
    description: `About ${site.name}: WordPress web developer, MPhil in Computer Science, 20+ projects in WordPress, Bricks Builder, AI website development and SEO.`,
    path: "/about/",
    body,
    schema: [
      personSchema(),
      websiteSchema(),
      { "@type": "ProfilePage", "@id": abs("/about/#webpage"), url: abs("/about/"), name: `About ${site.name}`, mainEntity: { "@id": PERSON_ID }, isPartOf: { "@id": WEBSITE_ID }, inLanguage: site.locale },
      breadcrumbSchema(crumbs),
    ],
  });
}

function servicesPage() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Services", path: "/services/" }];
  const surfaces = { wordpress: "surface-dark", ai: "surface-deep", seo: "surface-dark" };

  const svcRow = (svc, i) => `<li class="svc-row reveal">
  <span class="svc-row__n" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
  <div class="svc-row__body">
    <h3>${esc(svc.name)}</h3>
    <p>${esc(svc.desc)}</p>
    <ul class="tags" aria-label="Includes">${svc.tags.map((t) => `<li class="tag">${esc(t)}</li>`).join("")}</ul>
  </div>
</li>`;

  const category = (c) => `<section id="${c.id}" class="section ${surfaces[c.id]}" aria-labelledby="${c.id}-title">
  <div class="container">
    <div class="svc-category__head reveal">
      <h2 id="${c.id}-title">${esc(c.title)}</h2>
      <p>${esc(c.summary)}</p>
    </div>
    ${c.note ? `<div class="note">${icon("info")}<p>${esc(c.note)}</p></div>` : ""}
    <ul class="svc-list">${c.services.map(svcRow).join("")}</ul>
    ${c.disclaimer ? `<div class="disclaimer reveal">${icon("shield")}<p>${esc(c.disclaimer)}</p></div>` : ""}
  </div>
</section>`;

  const seo = services.find((c) => c.id === "seo");
  const faq = `<section class="section surface-cream" aria-labelledby="faq-title">
  <div class="container">
    <div class="section-head reveal"><h2 id="faq-title">Questions about SEO</h2></div>
    <div class="accordion faq">${seo.faqs
      .map((f) => `<details><summary><span>${esc(f.q)}</span><span class="accordion__icon">${icon("plus")}</span></summary><div class="accordion__panel"><p>${esc(f.a)}</p></div></details>`)
      .join("")}</div>
  </div>
</section>`;

  const body = `
${pageHero({
  crumbs,
  title: `Services for websites that <em>work harder.</em>`,
  lede: "Websites, AI and SEO. Pick one, or combine them. They work well together.",
  extra: `<nav class="svc-nav" aria-label="Service categories">${services.map((c) => `<a href="#${c.id}">${esc(c.title)}</a>`).join("")}</nav>`,
})}
${services.map(category).join("\n")}
${faq}
${cta({ title: "Not sure what <em>you need?</em>", text: "Just tell me what the problem is. I'll suggest the simplest way to fix it.", button: "Start a Conversation" })}`;

  const serviceSchemas = services.map((c) => {
    const names = c.services.map((s) => s.name);
    return {
      "@type": "Service",
      "@id": abs(`/services/#${c.id}`),
      name: c.title,
      description: c.summary,
      serviceType: c.title,
      provider: { "@id": PERSON_ID },
      url: abs(`/services/#${c.id}`),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: c.title,
        itemListElement: names.map((n) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: n } })),
      },
    };
  });

  return layout({
    title: `WordPress, Bricks Builder, AI & SEO Services | ${site.name}`,
    description: "Custom WordPress development, Bricks Builder websites, themes and plugins; website development with AI, chatbots and automation; SEO, AEO and GEO services.",
    path: "/services/",
    body,
    schema: [
      personSchema(),
      websiteSchema(),
      ...serviceSchemas,
      {
        "@type": "FAQPage",
        "@id": abs("/services/#faq"),
        mainEntity: seo.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
      breadcrumbSchema(crumbs),
    ],
  });
}

function projectsPage() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Projects", path: "/projects/" }];
  const cats = [...new Set(projectList.flatMap((p) => p.categories))];
  const allDemo = projectList.every((p) => p.type === "demo");
  const body = `
${pageHero({
  crumbs,
  title: `Selected projects, <em>honestly labelled.</em>`,
  lede: "A few projects I've picked to show my work. Each one is labelled as client work, a personal project, a demo or an experiment.",
})}
<section class="section surface-dark" aria-labelledby="projects-title" style="padding-top:0">
  <div class="container">
    <h2 id="projects-title" class="visually-hidden">Projects</h2>
    ${allDemo ? `<div class="note">${icon("info")}<p>The projects shown here are demonstration projects: they illustrate my approach and process, and the businesses described are fictional. They are not presented as client work.</p></div>` : ""}
    <div class="filters" data-project-filters role="group" aria-label="Filter projects by category" hidden>
      <button class="filter" type="button" data-filter="all" aria-pressed="true">All</button>
      ${cats.map((c) => `<button class="filter" type="button" data-filter="${esc(c)}" aria-pressed="false">${esc(c)}</button>`).join("")}
    </div>
    <p class="filter-status" data-project-status aria-live="polite">Showing ${projectList.length} projects</p>
    <ul class="project-grid">
      ${projectList
        .map(
          (p) => `<li data-project data-categories="${esc(p.categories.join("|"))}">
        <article class="project-card reveal">
          <a class="work__media" href="${p.url}" tabindex="-1" aria-hidden="true">${projectMedia(p)}</a>
          <div class="meta">${badge(p)}<span>${esc(p.categories.join(" · "))}</span></div>
          <h3><a href="${p.url}">${esc(p.title)}</a></h3>
          <p class="work__subtitle">${esc(p.subtitle)}</p>
          <p>${esc(p.summary)}</p>
          <a class="link-arrow" href="${p.url}" style="justify-self:start"><span>Read the case study<span class="visually-hidden">: ${esc(p.title)}</span></span>${icon("arrow")}</a>
        </article>
      </li>`
        )
        .join("")}
    </ul>
    <p class="empty-state" data-project-empty hidden>No projects in this category yet.</p>
  </div>
</section>
${cta({ title: "Have a project <em>in mind?</em>", text: "A new WordPress site, an automation or an SEO audit? Tell me what you're trying to do." })}`;

  return layout({
    title: `WordPress & Bricks Builder Projects | ${site.name}`,
    description: `Selected projects by WordPress web developer ${site.name}: custom WordPress and Bricks Builder websites, AI solutions, automation and SEO.`,
    path: "/projects/",
    body,
    schema: [
      personSchema(),
      {
        "@type": "CollectionPage",
        "@id": abs("/projects/#webpage"),
        url: abs("/projects/"),
        name: "Projects",
        isPartOf: { "@id": WEBSITE_ID },
        mainEntity: { "@type": "ItemList", itemListElement: projectList.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: abs(p.url), name: p.title })) },
      },
      breadcrumbSchema(crumbs),
    ],
  });
}

function projectDetail(p, i) {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Projects", path: "/projects/" }, { name: p.title, path: p.url }];
  const prev = projectList[(i - 1 + projectList.length) % projectList.length];
  const next = projectList[(i + 1) % projectList.length];
  const meta = [
    ["Project type", p.typeLabel],
    ["Role", p.role],
    ["Categories", p.categories.join(", ")],
    ["Technologies", p.tech.join(", ")],
    p.year ? ["Year", p.year] : null,
  ].filter(Boolean);
  const demoNote =
    p.type === "demo"
      ? `<div class="note case-note">${icon("info")}<p><strong>This is a demonstration project.</strong> It was created to show my approach and process. It is not client work, and the business described is fictional.</p></div>`
      : p.type === "experimental"
      ? `<div class="note case-note">${icon("info")}<p><strong>This is an experiment:</strong> exploratory work, not a delivered client project.</p></div>`
      : "";

  const body = `
<section class="page-hero section surface-dark">
  <div class="container">
    <div class="case-hero">
      ${breadcrumb(crumbs)}
      <div class="meta">${badge(p)}<span>${esc(p.categories.join(" · "))}</span></div>
      <h1>${esc(p.title)}</h1>
      <p class="case-hero__sub">${esc(p.subtitle)}</p>
      ${demoNote}
    </div>
    <figure class="case-figure">${projectMedia(p, { eager: true })}</figure>
  </div>
</section>
<section class="section surface-cream" aria-label="Case study">
  <div class="container case-layout">
    <dl class="case-meta">
      ${meta.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}
      ${p.url && /^https?:/.test(p.url) ? `<div><dt>Live site</dt><dd><a href="${esc(p.url)}" rel="noopener" target="_blank">Visit the site<span class="visually-hidden"> (opens in a new tab)</span></a></dd></div>` : ""}
    </dl>
    <div class="case-body">
      <section><h2>Overview</h2><p>${esc(p.summary)}</p></section>
      <section><h2>Objective</h2><p>${esc(p.objective)}</p></section>
      <section><h2>Approach</h2><ol class="steps">${p.approach.map((a) => `<li>${esc(a)}</li>`).join("")}</ol></section>
      <section><h2>Outcome</h2><p>${esc(p.outcome)}</p></section>
      <section><h2>Technologies</h2><ul class="tags">${p.tech.map((t) => `<li class="tag">${esc(t)}</li>`).join("")}</ul></section>
      <nav class="pager" aria-label="More projects">
        <a href="${prev.url}"><span>Previous project</span><span>${esc(prev.title)}</span></a>
        <a class="pager__next" href="${next.url}"><span>Next project</span><span>${esc(next.title)}</span></a>
      </nav>
    </div>
  </div>
</section>
${cta({ title: "Want something <em>like this?</em>", text: "Tell me about your project and what you'd like it to achieve." })}`;

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
        genre: p.typeLabel,
        image: abs(p.img),
        url: abs(p.url),
      },
      breadcrumbSchema(crumbs),
    ],
  });
}

function blogPage() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Blog", path: "/blog/" }];
  const featured = posts.filter((p) => p.featured);
  const lead = featured[0] || posts[0];
  const others = featured.filter((p) => p !== lead).slice(0, 2);
  const usedCats = postCategories.filter((c) => posts.some((p) => p.category === c));

  const body = `
${pageHero({
  crumbs,
  title: `Notes on WordPress, <em>AI and SEO.</em>`,
  lede: "Simple, practical articles on building websites, using AI sensibly, and getting found on Google and in AI answers.",
})}
<section class="section surface-cream" aria-labelledby="featured-title">
  <div class="container">
    <h2 id="featured-title" class="visually-hidden">Featured articles</h2>
    <article class="featured-post reveal">
      <div>
        <div class="meta" style="margin-bottom:1rem"><span>Featured</span><span>${esc(lead.category)}</span><time datetime="${lead.date}">${formatDate(lead.date)}</time><span>${lead.minutes} min read</span></div>
        <h2><a href="${lead.url}">${esc(lead.title)}</a></h2>
      </div>
      <div class="featured-post__side">
        <p class="lede">${esc(lead.excerpt)}</p>
        <a class="link-arrow" href="${lead.url}"><span>Read the article<span class="visually-hidden">: ${esc(lead.title)}</span></span>${icon("arrow")}</a>
      </div>
    </article>
    ${others.length ? `<ul class="featured-more reveal">${others.map((p) => `<li>${postItem(p)}</li>`).join("")}</ul>` : ""}
  </div>
</section>
<section class="section surface-cream" aria-labelledby="all-title" style="padding-top:0" data-blog data-page-size="6">
  <div class="container">
    <div class="section-head"><h2 id="all-title">All articles</h2></div>
    <div class="blog-tools">
      <div class="filters" data-blog-filters role="group" aria-label="Filter articles by category" hidden>
        <button class="filter" type="button" data-filter="all" aria-pressed="true">All</button>
        ${usedCats.map((c) => `<button class="filter" type="button" data-filter="${esc(c)}" aria-pressed="false">${esc(c)}</button>`).join("")}
      </div>
      <div class="search" hidden>
        <label class="visually-hidden" for="blog-search">Search articles</label>
        ${icon("search")}
        <input id="blog-search" type="search" placeholder="Search articles" autocomplete="off" data-blog-search>
      </div>
    </div>
    <p class="filter-status" data-blog-status aria-live="polite">Showing ${posts.length} articles</p>
    <ol class="post-list" reversed>
      ${posts
        .map(
          (p) => `<li class="post-row" data-post data-category="${esc(p.category)}" data-search="${esc((p.title + " " + p.excerpt + " " + p.category + " " + (p.tags || []).join(" ")).toLowerCase())}">
        <time class="post-row__date" datetime="${p.date}">${formatDate(p.date)}</time>
        <div><h3><a href="${p.url}">${esc(p.title)}</a></h3><p>${esc(p.excerpt)}</p></div>
        <span class="post-row__cat">${esc(p.category)} · ${p.minutes} min</span>
      </li>`
        )
        .join("")}
    </ol>
    <p class="empty-state" data-blog-empty hidden>No articles match your search. Try a different word or choose “All”.</p>
    <p><button class="btn btn--ghost load-more" type="button" hidden data-load-more><span>Load more articles</span></button></p>
  </div>
</section>
${cta({ title: "Have a question <em>I could write about?</em>", text: "Is there a topic you'd like explained, or a problem you're stuck on? Let me know." })}`;

  return layout({
    title: `Blog — WordPress, AI, SEO, AEO & GEO Articles | ${site.name}`,
    description: "Articles on WordPress development, website performance, AI integrations, technical SEO, Answer Engine Optimization and Generative Engine Optimization.",
    path: "/blog/",
    body,
    schema: [
      personSchema(),
      {
        "@type": "Blog",
        "@id": abs("/blog/#blog"),
        url: abs("/blog/"),
        name: `${site.name} — Blog`,
        author: { "@id": PERSON_ID },
        publisher: { "@id": PERSON_ID },
        blogPost: posts.map((p) => ({ "@type": "BlogPosting", headline: p.title, url: abs(p.url), datePublished: p.date })),
      },
      breadcrumbSchema(crumbs),
    ],
  });
}

function articlePage(p) {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Blog", path: "/blog/" }, { name: p.title, path: p.url }];
  const related = [...posts.filter((x) => x !== p && x.category === p.category), ...posts.filter((x) => x !== p && x.category !== p.category)].slice(0, 3);
  const catHref = `/blog/?category=${encodeURIComponent(p.category)}#all-title`;
  const body = `
<section class="page-hero section surface-dark">
  <div class="container">
    <div class="article-hero">
      ${breadcrumb(crumbs)}
      <div class="meta"><a href="${catHref}">${esc(p.category)}</a><span>By ${esc(site.name)}</span><time datetime="${p.date}">${formatDate(p.date)}</time><span>${p.minutes} min read</span></div>
      <h1>${esc(p.title)}</h1>
      <p class="lede">${esc(p.excerpt)}</p>
      ${p.updated ? `<p class="meta">Last updated <time datetime="${p.updated}">${formatDate(p.updated)}</time></p>` : ""}
    </div>
  </div>
</section>
<section class="section surface-cream">
  <div class="container article-layout">
    ${p.toc.length > 2 ? `<nav class="toc" aria-labelledby="toc-title"><h2 id="toc-title">On this page</h2><ol>${p.toc.map((t) => `<li><a href="#${t.id}">${esc(t.text)}</a></li>`).join("")}</ol></nav>` : "<div></div>"}
    <div>
      <article class="prose">${p.body}</article>
      <aside class="author-box" aria-labelledby="author-title">
        <div class="author-box__mark" style="color:var(--cream)">${monogram()}</div>
        <div>
          <h2 id="author-title">Written by ${esc(site.name)}</h2>
          <p>${esc(site.roles.join(", ").replace(/, ([^,]*)$/, " and $1"))}. Computer Science graduate with a completed MPhil in Computer Science.</p>
          <p><a href="/about/">More about Iqra</a></p>
        </div>
      </aside>
    </div>
  </div>
</section>
<section class="section surface-cream" aria-labelledby="related-title" style="padding-top:0">
  <div class="container">
    <div class="section-head"><h2 id="related-title">Related articles</h2></div>
    <ul class="posts">${related.map((r) => `<li>${postItem(r)}</li>`).join("")}</ul>
  </div>
</section>
${cta({ title: "Want help putting this <em>into practice?</em>", text: "I can review your site and suggest the changes that will make the biggest difference." })}`;

  return layout({
    title: `${p.title} | ${site.name}`,
    description: p.excerpt,
    path: p.url,
    ogType: "article",
    article: p,
    body,
    schema: [
      personSchema(),
      {
        "@type": "BlogPosting",
        "@id": abs(p.url + "#article"),
        headline: p.title,
        description: p.excerpt,
        datePublished: p.date,
        dateModified: p.updated || p.date,
        author: { "@id": PERSON_ID },
        publisher: { "@id": PERSON_ID },
        mainEntityOfPage: abs(p.url),
        image: abs("/assets/img/og-image.png"),
        articleSection: p.category,
        wordCount: p.words,
        inLanguage: site.locale,
        isPartOf: { "@id": abs("/blog/#blog") },
      },
      breadcrumbSchema(crumbs),
    ],
  });
}

function contactPage() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Contact", path: "/contact/" }];
  const options = ["WordPress Development", "Website Redesign", "WordPress Plugin Development", "AI Solutions", "AI Automation", "SEO", "AEO", "GEO", "Other"];
  const endpoint = (site.form && site.form.endpoint) || "";
  const field = (name, label, control, hint = "") => `<div class="field">
  <label for="${name}">${label} <span aria-hidden="true">*</span></label>
  ${hint ? `<span class="hint" id="${name}-hint">${hint}</span>` : ""}
  ${control}
  <p class="field__error" id="${name}-error" aria-live="polite"></p>
</div>`;
  const describedBy = (name, hint) => `aria-describedby="${hint ? name + "-hint " : ""}${name}-error"`;

  const direct = [
    email ? `<a href="mailto:${esc(email)}">${esc(email)}</a>` : "",
    phone ? `<a href="tel:${esc(phone.replace(/[^+\d]/g, ""))}">${esc(phone)}</a>` : "",
    location ? `<p>${esc(location)}</p>` : "",
  ].filter(Boolean);

  const body = `
${pageHero({
  crumbs,
  title: `Let's talk about <em>your project.</em>`,
  lede: "Tell me what you're working on: a new website, a redesign, an automation or an SEO problem. The more detail you share, the better I can help.",
})}
<section class="section surface-cream" aria-labelledby="form-title">
  <div class="container contact-layout">
    <div>
      <h2 id="form-title" class="visually-hidden">Contact form</h2>
      <form class="form" data-contact-form ${endpoint ? `action="${esc(endpoint)}" method="POST"` : 'method="POST"'} ${email ? `data-fallback-email="${esc(email)}"` : ""} data-icon-error="${esc(icon("alert"))}" data-icon-success="${esc(icon("check"))}">
        <p class="form__privacy">Fields marked <span aria-hidden="true">*</span><span class="visually-hidden">with an asterisk</span> are required.</p>
        <div class="form__row">
          ${field("name", "Name", `<input id="name" name="name" type="text" autocomplete="name" required minlength="2" ${describedBy("name")}>`)}
          ${field("email", "Email", `<input id="email" name="email" type="email" autocomplete="email" required ${describedBy("email")}>`)}
        </div>
        ${field(
          "service",
          "Service",
          `<select id="service" name="service" required ${describedBy("service")}><option value="">Choose a service</option>${options.map((o) => `<option>${esc(o)}</option>`).join("")}</select>`
        )}
        ${field("subject", "Subject", `<input id="subject" name="subject" type="text" required minlength="3" ${describedBy("subject")}>`)}
        ${field(
          "message",
          "Message",
          `<textarea id="message" name="message" required minlength="20" ${describedBy("message", true)}></textarea>`,
          "Goals, timeline, budget range and any links that help explain the project."
        )}
        <div class="form__hp" aria-hidden="true"><label for="gotcha">Leave this field empty</label><input id="gotcha" type="text" name="_gotcha" tabindex="-1" autocomplete="off"></div>
        <div class="form-status" data-form-status role="status" tabindex="-1"></div>
        <div class="form__footer">
          <button class="btn" type="submit"><span>Send message</span>${icon("arrow")}</button>
          <p class="form__privacy">Your details are used only to reply to your message.</p>
        </div>
        <noscript><p class="form__privacy">This form needs JavaScript to check your details before sending.${email ? ` You can also email <a href="mailto:${esc(email)}">${esc(email)}</a>.` : ""}</p></noscript>
      </form>
    </div>
    <aside class="contact-aside">
      ${direct.length ? `<div><h2>Direct contact</h2><div class="contact-direct">${direct.join("")}</div></div>` : ""}
      ${socials.length ? `<div><h2>Elsewhere</h2>${socialList()}</div>` : ""}
      <div>
        <h2>Services I can help with</h2>
        <p>WordPress development and redesigns, plugin development, AI solutions and automation, and SEO, AEO and GEO. <a href="/services/">See all services</a>.</p>
      </div>
    </aside>
  </div>
</section>`;

  return layout({
    title: `Hire a WordPress Web Developer — Contact ${site.name}`,
    description: `Hire ${site.name} for WordPress web development, Bricks Builder websites, website redesign, plugin development, website development with AI, automation or SEO.`,
    path: "/contact/",
    body,
    schema: [
      personSchema(),
      { "@type": "ContactPage", "@id": abs("/contact/#webpage"), url: abs("/contact/"), name: `Contact ${site.name}`, about: { "@id": PERSON_ID }, isPartOf: { "@id": WEBSITE_ID } },
      breadcrumbSchema(crumbs),
    ],
  });
}

function notFoundPage() {
  const body = `<section class="nf surface-dark">
  <div class="container nf__grid">
    <div class="nf__text">
      <h1>This page was <em>never indexed.</em></h1>
      <p class="lede">The address may be mistyped, or the page may have moved. Here are the places most people are looking for.</p>
      <ul class="nf__links">
        <li><a class="link-arrow" href="/"><span>Home</span>${icon("arrow")}</a></li>
        <li><a class="link-arrow" href="/services/"><span>Services</span>${icon("arrow")}</a></li>
        <li><a class="link-arrow" href="/projects/"><span>Projects</span>${icon("arrow")}</a></li>
        <li><a class="link-arrow" href="/blog/"><span>Blog</span>${icon("arrow")}</a></li>
        <li><a class="link-arrow" href="/contact/"><span>Contact</span>${icon("arrow")}</a></li>
      </ul>
    </div>
    <p class="nf__code" aria-hidden="true">404</p>
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
function rss() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${esc(site.name)} — Blog</title>
  <link>${abs("/blog/")}</link>
  <atom:link href="${abs("/feed.xml")}" rel="self" type="application/rss+xml"/>
  <description>Articles on WordPress, AI and SEO.</description>
  <language>${site.locale}</language>
${posts
  .map(
    (p) => `  <item>
    <title>${esc(p.title)}</title>
    <link>${abs(p.url)}</link>
    <guid>${abs(p.url)}</guid>
    <pubDate>${new Date(p.date + "T09:00:00Z").toUTCString()}</pubDate>
    <category>${esc(p.category)}</category>
    <description>${esc(p.excerpt)}</description>
  </item>`
  )
  .join("\n")}
</channel>
</rss>
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

  const pages = [
    { path: "/", html: homePage() },
    { path: "/about/", html: aboutPage() },
    { path: "/services/", html: servicesPage() },
    { path: "/projects/", html: projectsPage() },
    ...projectList.map((p, i) => ({ path: p.url, html: projectDetail(p, i) })),
    { path: "/blog/", html: blogPage() },
    ...posts.map((p) => ({ path: p.url, html: articlePage(p), lastmod: p.updated || p.date })),
    { path: "/contact/", html: contactPage() },
  ];
  for (const pg of pages) write(path.join(pg.path, "index.html"), pg.html);
  write("404.html", notFoundPage());

  write("sitemap.xml", sitemap(pages));
  write("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${abs("/sitemap.xml")}\n`);
  write("feed.xml", rss());
  write(
    "site.webmanifest",
    JSON.stringify(
      {
        name: site.name,
        short_name: site.shortName,
        start_url: "/",
        display: "standalone",
        background_color: "#292333",
        theme_color: "#292333",
        icons: [
          { src: "/assets/img/favicon.svg", type: "image/svg+xml", sizes: "any" },
          { src: "/assets/img/apple-touch-icon.png", type: "image/png", sizes: "180x180" },
        ],
      },
      null,
      2
    )
  );

  /* Link check: every internal href must resolve to a built file. */
  const broken = [];
  const exists = (href) => {
    const clean = href.split("#")[0].split("?")[0];
    if (!clean) return true;
    const file = path.join(OUT, clean.endsWith("/") ? clean + "index.html" : clean);
    return fs.existsSync(file);
  };
  for (const pg of pages.concat([{ path: "/404.html", html: fs.readFileSync(path.join(OUT, "404.html"), "utf8") }])) {
    for (const m of pg.html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) if (!exists(m[1])) broken.push(`${pg.path} → ${m[1]}`);
    for (const m of pg.html.matchAll(/href="#([^"]+)"/g)) if (m[1] && !pg.html.includes(`id="${m[1]}"`)) broken.push(`${pg.path} → #${m[1]}`);
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
