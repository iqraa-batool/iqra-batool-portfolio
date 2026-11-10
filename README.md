# Iqra Batool — Portfolio

The personal portfolio of Iqra Batool, WordPress Developer, AI Solutions Builder and SEO Specialist. It is a plain HTML, CSS and JavaScript website: no framework, no CMS and no npm dependencies. A small Node script turns the content files into static pages.

## Structure

```
content/          ← edit these: all text and data lives here
  site.js         name, domain, contact details, social links, form endpoint, stats
  about.js        biography, education, experience, certifications, skills
  services.js     the three service categories, sub-services, process, FAQ
  projects.js     case studies (type: client | personal | demo | experimental)
  posts.js        blog articles and categories
src/
  css/main.css    the whole design system (tokens at the top)
  js/main.js      menu, filters, search, load-more, form, reveal effects
  img/            logo, monogram, favicon, Open Graph image
scripts/
  build.js        static site generator → public/
  art.js          illustrated SVG previews for the projects
  serve.js        local preview server
  icons.js        renders the PNG icons from the SVGs
public/           ← generated output; deploy this folder (don't edit it by hand)
DESIGN.md         design direction, tokens and the design-review record
```

The build creates these pages:

- Home, About, Services, Projects, Blog and Contact;
- one page per project and one per article;
- a 404 page;
- `sitemap.xml`, `robots.txt`, `feed.xml` (RSS) and `site.webmanifest`.

## Run it locally

You need [Node.js](https://nodejs.org) 18 or newer. There is nothing to install.

```bash
npm start
```

That builds the site and serves it at http://localhost:4321. The individual commands are:

```bash
npm run build
```

```bash
npm run serve
```

```bash
npm run icons
```

`npm run icons` regenerates `og-image.png`, `apple-touch-icon.png` and `favicon-32.png` from the SVG sources after you change the logo. It uses your installed Chrome or Edge. If the browser isn't found, set `CHROME_PATH`.

Every build checks that all internal links and `#anchors` resolve. It also warns you while `siteUrl` is still the placeholder.

## Editing content

After any change, run `npm run build` and refresh the page.

- **Text and identity:** `content/site.js`.
  - Any field left as `""` is hidden on the site, so nothing appears empty or made up.
- **About page:** `content/about.js`.
  - Each section (education, experience, certifications) appears only once it has entries.
- **Services:** `content/services.js`.
  - Each category has sub-services, deliverables and an FAQ.
  - The FAQ also feeds the FAQPage structured data.

### Projects

Each project is one object in `content/projects.js`.

- `type` is shown as a badge on the project. Use `"client"` only for real client work.
- The four current projects are **demonstration projects**, labelled "Demo project". Replace them with real work, or keep them clearly marked as demos.
- `featured: true` puts a project on the homepage. Keep it to three or four.
- To use a real screenshot instead of the built-in illustration:
  1. Put the file in `src/img/projects/`.
  2. Set `image: "/assets/img/projects/name.jpg"`, `imageWidth` and `imageHeight`.
- Use `url` for a live link, and only for a site you're allowed to show.
- The site has room for 20+ projects, but showing a curated few reads better than a full archive.

### Blog

Add an object to `content/posts.js` with `slug`, `title`, `category`, `date`, `excerpt` and `body` (HTML).

- `<h2>` headings build each article's table of contents automatically.
- Reading time is calculated automatically.
- Each post gets an RSS entry and BlogPosting structured data.
- The eight current articles are **drafts written for review**, all dated 2026-11-10. Read them, check every statement, and change the dates to when you actually publish.

## Social links

In `content/site.js`, fill the `url` for each network you use. Networks without a URL are not shown. You can add any of these: linkedin, github, x, instagram, behance, dribbble, facebook, youtube, upwork, fiverr.

Set `twitterHandle` (for example `"@yourhandle"`) if you want X/Twitter card attribution.

## Configure the contact form

The form validates in the browser. It sends to whatever endpoint you set, and no secret key is ever placed in the front-end code.

1. Create a free form at [Formspree](https://formspree.io), or any service that accepts a `POST` of form data and returns JSON.
2. Paste its endpoint into `content/site.js` → `form.endpoint`, for example `"https://formspree.io/f/abcdwxyz"`.
3. Rebuild, then send a test message to make sure it arrives.

Until an endpoint is set, submitting the form shows a clear message that the form isn't connected yet. If `contact.email` is filled in, it is shown as an alternative way to get in touch.

## Domain and SEO

1. Set `siteUrl` in `content/site.js` to your real domain, with no trailing slash. It is used for:
   - canonical URLs;
   - `sitemap.xml` and `robots.txt`;
   - Open Graph and Twitter image URLs;
   - JSON-LD structured data.
2. Rebuild. The placeholder warning should disappear.
3. Submit `https://yourdomain/sitemap.xml` in Google Search Console and Bing Webmaster Tools.

Page titles and meta descriptions are set in `scripts/build.js`, one per page. Articles and projects use their own title and excerpt.

The structured data covers:

- Person and WebSite;
- ProfilePage (About);
- Service and FAQPage (Services);
- CollectionPage (Projects) and CreativeWork (each project);
- Blog and BlogPosting;
- ContactPage;
- BreadcrumbList on every inner page.

## Deployment

Deploy the `public/` folder to any static host.

- **Netlify:**
  - build command `npm run build`
  - publish directory `public`
- **Vercel:**
  - framework "Other"
  - build command `npm run build`
  - output directory `public`
- **Cloudflare Pages:** same settings as Netlify.
- **GitHub Pages:** run the build and publish `public/`, for example with a GitHub Action.
- **Any shared host or cPanel:** run `npm run build` locally and upload the contents of `public/`.

Configure the host to serve `404.html` for missing pages; most do this automatically. Point your domain at the host, enable HTTPS, then set `siteUrl` (see above).

## Information still needed

Nothing personal was invented, so these are blank or placeholders until you provide them:

- [x] **Domain**: `siteUrl` is set to https://iqrabatool.vercel.app (change it if you add a custom domain)
- [ ] **Phone and location**: `contact` (optional; your email is already set)
- [ ] **Social profile URLs** and the X/Twitter handle
- [ ] **Form endpoint**: `form.endpoint`
- [ ] **Real projects**, with screenshots and, where permitted, live URLs. The four current projects are demos.
- [ ] **Education details**: institutions and years for the MPhil and the Computer Science degree
- [ ] **Work experience**: roles, organisations and dates
- [ ] **Certifications**, if any
- [ ] **Availability line**, if you want one in the hero
- [ ] **Blog review**: read, edit and re-date the eight draft articles
- [ ] **Tech tags**: check the technologies listed on each project match what you'd actually use
- [ ] **Portrait photo**, optional (the site doesn't use one yet; adding one needs a small template change in `aboutPage` in `scripts/build.js`)

## 25 blog topic ideas

These don't repeat the eight existing drafts.

1. How to Choose Between a Block Theme and a Classic Theme in WordPress
2. A Beginner's Guide to theme.json
3. How to Build a Custom Gutenberg Block Without a Framework
4. WordPress Security Basics Every Site Owner Should Know
5. How to Safely Update WordPress, Themes and Plugins
6. When You Need a Custom Plugin, and When You Don't
7. How to Migrate a Website to WordPress Without Losing Rankings
8. Writing Content That AI Assistants Can Quote Accurately
9. How to Write FAQ Sections That Actually Help Readers
10. Topic Clusters: Planning Content Around Real Questions
11. Core Web Vitals in Plain Language
12. Image Optimisation for WordPress: Formats, Sizes and Lazy Loading
13. Internal Linking Strategies for Small Websites
14. How to Read Google Search Console Reports
15. Local SEO Basics for Small Businesses
16. What E-E-A-T Means for Your Website
17. How to Add an AI Chat Assistant to a Website Responsibly
18. Automating Contact Form Workflows with Make, Zapier or n8n
19. Keeping AI API Keys Safe: Server-Side Patterns for Websites
20. Using AI to Draft Content, and Where Human Editing Matters
21. Accessibility Checklist for WordPress Websites
22. Designing a Website Redesign Brief
23. How to Measure Whether a Website Redesign Worked
24. Static Sites vs WordPress: Choosing the Right Tool
25. How AI Overviews Are Changing Search Traffic, and What to Do About It
