/**
 * BLOG POSTS
 *
 * To publish a post, add an object to this array and run `npm run build`.
 * - slug:     URL segment → /blog/<slug>/
 * - date:     ISO date (YYYY-MM-DD) — the publication date shown on the site
 * - updated:  optional ISO date for "last updated"
 * - category: one of the categories listed in `categories` below
 * - featured: true to feature on the blog index and homepage
 * - body:     HTML. Use <h2> for main sections (they build the table of contents),
 *             <h3>, <p>, <ul>, <ol>, <blockquote>, <pre><code>, <a>.
 * Reading time is calculated automatically from the body text.
 *
 * NOTE: these articles were drafted for Iqra to review, edit and approve
 * before publishing. Check every statement and adjust dates as needed.
 */

const categories = [
  "WordPress Development",
  "Web Design",
  "Artificial Intelligence",
  "AI Automation",
  "SEO",
  "Technical SEO",
  "AEO",
  "GEO",
  "Digital Technology",
  "Tutorials",
];

const posts = [
  {
    slug: "what-is-answer-engine-optimization",
    title: "What Is Answer Engine Optimization (AEO)?",
    category: "AEO",
    date: "2026-11-10",
    featured: true,
    excerpt:
      "Answer engines don't show ten blue links. They show one answer. Here's what AEO is, how it's different from SEO, and how to write content that gets picked.",
    body: `
<p><strong>Answer Engine Optimization (AEO) is the practice of structuring content so that search features and assistants can pull a clear, direct answer from it.</strong> Where traditional SEO aims for a good position in a list of results, AEO aims to be <em>the</em> answer: the featured snippet, the spoken reply from a voice assistant, or the expanded result under a "People also ask" question.</p>

<h2>Why answer engines changed the goal</h2>
<p>For years, success in search meant a click. Increasingly, people get what they need without one: a definition, a set of steps, a quick comparison. That doesn't make websites less important (the answer still has to come from somewhere), but it changes what a page needs to do well. A page that buries its answer under five paragraphs of introduction is harder for any system to use.</p>

<h2>How AEO differs from SEO</h2>
<p>AEO is not a replacement for SEO; it is built on top of it. A page that can't be crawled, loads slowly or lacks authority won't be chosen as an answer either. The difference is emphasis:</p>
<ul>
  <li><strong>SEO</strong> focuses on relevance, authority and technical health so a page ranks.</li>
  <li><strong>AEO</strong> focuses on clarity and structure so a specific passage can be extracted and trusted as an answer.</li>
</ul>

<h2>Five habits of answer-ready content</h2>
<h3>1. Lead with the answer</h3>
<p>Put a one- or two-sentence answer directly after the question heading. Detail, nuance and examples come next. This "inverted pyramid" style helps readers who skim as much as it helps machines.</p>
<h3>2. Use the questions people actually ask</h3>
<p>Look at search suggestions, "People also ask" boxes, support tickets and sales calls. Use those questions, in plain words, as your headings.</p>
<h3>3. Choose the right format for the question</h3>
<p>"What is…" questions want a definition. "How do I…" questions want numbered steps. "Which is better…" questions want a comparison, often a table. Matching the format to the intent makes the answer easier to lift.</p>
<h3>4. Make each section stand on its own</h3>
<p>An answer engine may quote a single paragraph. If that paragraph only makes sense after reading the three before it, it's a weak candidate. Name the subject again instead of relying on "it" or "this".</p>
<h3>5. Add structured data only where it fits</h3>
<p>Schema markup such as <code>Article</code>, <code>HowTo</code> or <code>FAQPage</code> describes your content to search engines. Only use a type when the page really is that thing. Note that Google has narrowed when some types produce visual rich results. FAQ rich results, for example, are now shown mainly for well-known government and health sites, but accurate markup still helps describe the page.</p>

<h2>A quick AEO checklist</h2>
<ol>
  <li>Does each important question have its own heading?</li>
  <li>Is there a direct answer in the first sentence or two beneath it?</li>
  <li>Is the format (definition, steps, list or table) right for the question?</li>
  <li>Would the key paragraph make sense if quoted alone?</li>
  <li>Is the author or organisation behind the content clear?</li>
  <li>Is any structured data accurate and valid?</li>
</ol>

<h2>What AEO can't promise</h2>
<p>No one controls which answer a search engine or assistant selects. AEO improves your chances by making content clear, accurate and easy to interpret; it can't guarantee placement. The good news is that the same work makes pages better for human readers, which is never wasted effort.</p>
`,
  },
  {
    slug: "what-is-generative-engine-optimization",
    title: "What Is Generative Engine Optimization (GEO)?",
    category: "GEO",
    date: "2026-11-10",
    featured: true,
    excerpt:
      "AI search writes its own summaries and cites a few sources. GEO is about being one of them. Here's how it works.",
    body: `
<p><strong>Generative Engine Optimization (GEO) is the practice of making content easy for AI-powered search systems to understand, trust and cite when they generate an answer.</strong> Tools such as Google's AI Overviews, ChatGPT search, Perplexity and Microsoft Copilot don't just list pages. They write a summary and reference the sources they drew from. GEO is about being one of those sources.</p>

<h2>Where the term comes from</h2>
<p>The term was popularised by a 2023 research paper, <a href="https://arxiv.org/abs/2311.09735" rel="noopener">"GEO: Generative Engine Optimization"</a>, which studied how changes to content affected its visibility in generative search responses. Among the approaches the researchers tested, adding citations, quotations from relevant sources and concrete statistics tended to help. The field is young and the systems change quickly, so treat any single study as a starting point rather than a rulebook.</p>

<h2>How generative search is different</h2>
<p>A traditional results page ranks whole pages. A generative system reads many pages, extracts passages, and combines them into a new answer. That means:</p>
<ul>
  <li>Individual <strong>passages</strong> matter, not just the page as a whole.</li>
  <li><strong>Clear entities.</strong> Being clear about who you are, what you offer and what your terms mean makes you harder to misunderstand.</li>
  <li><strong>Credibility signals</strong> help a system decide which sources are worth repeating.</li>
</ul>

<h2>Practical GEO principles</h2>
<h3>Be unambiguous about who you are</h3>
<p>Use consistent names, roles and descriptions across your website and profiles. An about page with real information, visible authorship on articles, and <code>Person</code> or <code>Organization</code> structured data all help systems connect your content to you.</p>
<h3>Write passages that survive being quoted</h3>
<p>Each section should make one clear point that is understandable on its own. A summary sentence at the start of a section is often the part that gets used.</p>
<h3>Show your evidence</h3>
<p>Link to primary sources, explain where figures come from, and use specific examples. Unsupported claims are weaker material for a system that is trying to give a reliable answer, and for readers too.</p>
<h3>Cover the topic, not just the keyword</h3>
<p>People ask generative tools follow-up questions. Content that anticipates those (definitions, comparisons, edge cases, next steps) gives the system more useful material.</p>
<h3>Keep it current</h3>
<p>Outdated information is a reason not to cite a page. Show when content was last updated and revisit important pages regularly.</p>

<h2>GEO and SEO are not rivals</h2>
<p>Most generative search systems still depend on being able to find and crawl your pages, and many draw on traditional search indexes. A technically healthy, well-linked site remains the foundation. GEO adds a sharper focus on clarity, structure and credibility on top.</p>

<h2>An honest note on guarantees</h2>
<p>Nobody can promise that an AI system will cite a particular page; the providers decide how their systems choose sources, and those methods change. What you can control is whether your content is accurate, clearly structured and useful: the qualities every one of these systems is trying to find.</p>
`,
  },
  {
    slug: "seo-vs-aeo-vs-geo",
    title: "SEO vs AEO vs GEO: What's the Difference?",
    category: "SEO",
    date: "2026-11-10",
    featured: true,
    excerpt:
      "Three acronyms, one foundation. A simple comparison of SEO, AEO and GEO, and where to start.",
    body: `
<p><strong>SEO helps pages rank in search results, AEO helps content become a direct answer, and GEO helps content get understood and cited by AI-generated summaries.</strong> They target different surfaces, but they rest on the same foundation: a crawlable, fast, trustworthy site with clear and accurate content.</p>

<h2>Side by side</h2>
<table>
  <thead><tr><th scope="col"></th><th scope="col">SEO</th><th scope="col">AEO</th><th scope="col">GEO</th></tr></thead>
  <tbody>
    <tr><th scope="row">Goal</th><td>Rank in search results</td><td>Be selected as the answer</td><td>Be cited in AI-generated answers</td></tr>
    <tr><th scope="row">Where it shows</th><td>Search result listings</td><td>Featured snippets, voice answers, question boxes</td><td>AI Overviews, ChatGPT search, Perplexity, Copilot</td></tr>
    <tr><th scope="row">Unit that matters</th><td>The page</td><td>The answer passage</td><td>Passages and entity information</td></tr>
    <tr><th scope="row">Key levers</th><td>Technical health, relevance, links</td><td>Question headings, direct answers, structure</td><td>Clarity, credibility, sources, topic coverage</td></tr>
  </tbody>
</table>

<h2>What they share</h2>
<ul>
  <li><strong>Crawlability.</strong> If a page can't be found and read, none of the three can work.</li>
  <li><strong>Usefulness.</strong> Thin or generic content performs poorly everywhere.</li>
  <li><strong>Structure.</strong> Clear headings and logical organisation help every kind of system, and every reader.</li>
  <li><strong>Trust.</strong> Real authorship, accurate information and a credible site.</li>
</ul>

<h2>Where to start</h2>
<p>If you are deciding where to put effort first, work from the foundation up:</p>
<ol>
  <li><strong>Fix technical SEO.</strong> Indexing, speed, mobile usability and broken links.</li>
  <li><strong>Clarify your entity.</strong> A strong about page, consistent business details, and accurate structured data.</li>
  <li><strong>Restructure key pages.</strong> Question-led headings with direct answers (AEO).</li>
  <li><strong>Deepen and evidence your content.</strong> Sources, examples and complete topic coverage (GEO).</li>
</ol>

<h2>Do you need three separate strategies?</h2>
<p>Usually not. For most small and medium sites, one well-run content and technical strategy that keeps all three surfaces in mind is more effective than three parallel efforts. The acronyms are useful for thinking about <em>where</em> content appears; the work itself overlaps heavily.</p>
`,
  },
  {
    slug: "how-to-conduct-a-website-seo-audit",
    title: "How to Conduct a Website SEO Audit",
    category: "Technical SEO",
    date: "2026-11-10",
    featured: false,
    excerpt:
      "A step-by-step SEO audit, from crawling and indexing to content and links, plus a simple way to decide what to fix first.",
    body: `
<p><strong>An SEO audit is a structured review of how well a website can be found, understood and trusted by search engines, followed by a prioritised list of fixes.</strong> The value isn't in the length of the issue list; it's in knowing which few changes will matter most.</p>

<h2>Before you begin</h2>
<p>Gather access to Google Search Console (and Bing Webmaster Tools if available), your analytics, and the CMS. Note the site's goals: which pages and actions actually matter to the business. An audit without goals produces a list; an audit with goals produces a plan.</p>

<h2>Step 1: Crawl the site</h2>
<p>Use a crawler to collect every URL, status code, title, heading, canonical tag and internal link. Look for:</p>
<ul>
  <li>Broken internal links and 4xx/5xx errors</li>
  <li>Redirect chains and loops</li>
  <li>Duplicate or missing titles and descriptions</li>
  <li>Pages that are accidentally blocked or set to <code>noindex</code></li>
</ul>

<h2>Step 2: Check indexing</h2>
<p>Search Console's page indexing report shows which pages are indexed and why others aren't. Compare it with your crawl: important pages should be indexed; thin, duplicate or utility pages often shouldn't be. Confirm that your XML sitemap lists only canonical, indexable URLs and that <code>robots.txt</code> isn't blocking anything important.</p>

<h2>Step 3: Review performance and mobile experience</h2>
<p>Check Core Web Vitals in Search Console and test key templates in <a href="https://pagespeed.web.dev/" rel="noopener">PageSpeed Insights</a>. Field data from real users matters more than a single lab score. Test the main pages on an actual phone, too.</p>

<h2>Step 4: Assess on-page elements</h2>
<p>For each important page, check that the title and main heading describe the page accurately, that the content matches the search intent behind its target queries, and that images have meaningful alt text.</p>

<h2>Step 5: Evaluate content</h2>
<p>Identify pages that overlap and compete with each other, pages that are thin or outdated, and important topics you don't cover at all. Decide for each: improve, merge, redirect or remove.</p>

<h2>Step 6: Look at internal links and architecture</h2>
<p>Important pages should be reachable within a few clicks and linked from relevant content with descriptive anchor text. Orphan pages, with no internal links pointing to them, are a common finding.</p>

<h2>Step 7: Review structured data and entity information</h2>
<p>Validate any schema with the <a href="https://search.google.com/test/rich-results" rel="noopener">Rich Results Test</a> or the <a href="https://validator.schema.org/" rel="noopener">Schema Markup Validator</a>. Check that business or author details are consistent across the site.</p>

<h2>Step 8: Check the backlink profile</h2>
<p>Understand which sites link to you and which pages attract links. Look for broken pages that still get links. Redirecting those is often a quick win.</p>

<h2>Prioritising what you found</h2>
<p>Score each issue by <strong>impact</strong> (how much it affects important pages) and <strong>effort</strong> (how hard it is to fix). Start with high-impact, low-effort fixes; schedule high-impact, high-effort work; and question whether low-impact items are worth doing at all. A short, ordered action list is the real deliverable of any audit.</p>
`,
  },
  {
    slug: "how-to-improve-wordpress-website-performance",
    title: "How to Improve WordPress Website Performance",
    category: "WordPress Development",
    date: "2026-11-10",
    featured: false,
    excerpt:
      "A slow WordPress site usually comes down to a few causes. Here's how to measure speed properly and fix what matters most.",
    body: `
<p><strong>Most slow WordPress sites suffer from the same few problems: oversized images, too many plugins loading assets on every page, heavy themes, missing caching and underpowered hosting.</strong> Fixing them in the right order usually brings bigger gains than any single "speed plugin".</p>

<h2>Measure first</h2>
<p>Test a few representative pages (the homepage, a typical post, a key landing page) in <a href="https://pagespeed.web.dev/" rel="noopener">PageSpeed Insights</a>. Pay attention to the field data (real visitors) when it's available, and to the three Core Web Vitals:</p>
<ul>
  <li><strong>Largest Contentful Paint (LCP):</strong> how quickly the main content appears. Good is 2.5 seconds or less.</li>
  <li><strong>Interaction to Next Paint (INP):</strong> how quickly the page responds to input. Good is 200 milliseconds or less.</li>
  <li><strong>Cumulative Layout Shift (CLS):</strong> how much content jumps around. Good is 0.1 or less.</li>
</ul>

<h2>1. Optimise images</h2>
<p>Images are often the largest files on a page. Resize them to the size they're actually displayed at, serve modern formats such as WebP or AVIF, and let WordPress output responsive <code>srcset</code> sizes. Keep lazy loading for images below the fold, but not for the main hero image, which should load immediately.</p>

<h2>2. Audit your plugins</h2>
<p>The number of plugins matters less than what each one loads. A plugin that adds scripts and styles to every page for a feature used on one page is a common culprit. Remove what you don't need, replace heavy plugins with lighter alternatives, and check whether assets can be loaded only where they're used.</p>

<h2>3. Choose a lean theme</h2>
<p>Multipurpose themes often ship features you'll never use. A lightweight or custom block theme typically produces less code and fewer requests. If switching isn't practical, disable unused theme modules.</p>

<h2>4. Add caching</h2>
<p>Page caching serves pre-built HTML instead of running PHP and database queries for every visit. Many hosts provide it at the server level; otherwise a reputable caching plugin will. Add browser caching headers for static files, and consider object caching for dynamic or logged-in heavy sites.</p>

<h2>5. Handle fonts and scripts carefully</h2>
<ul>
  <li>Limit font families and weights, and use <code>font-display: swap</code>.</li>
  <li>Defer non-critical JavaScript.</li>
  <li>Be cautious with third-party scripts. Chat widgets, trackers and embeds can cost more than everything else combined.</li>
</ul>

<h2>6. Prevent layout shift</h2>
<p>Give images and embeds explicit width and height, reserve space for ads or banners, and avoid inserting content above what the visitor is already reading.</p>

<h2>7. Review hosting</h2>
<p>If the server's response time is slow before anything else loads, no front-end optimisation will fully compensate. A current PHP version, adequate resources and a host with server-level caching make a measurable difference.</p>

<h2>Re-test and keep testing</h2>
<p>Measure again after each change so you know what helped. Performance isn't a one-time fix: every new plugin, embed or image is a chance to slow down again, so a quick check after each significant change keeps the site fast.</p>
`,
  },
  {
    slug: "figma-to-wordpress-practical-guide",
    title: "Figma to WordPress: A Practical Guide",
    category: "Tutorials",
    date: "2026-11-10",
    featured: false,
    excerpt:
      "How to turn a Figma design into a WordPress site that matches the design and stays editable, from design tokens to block patterns.",
    body: `
<p><strong>A good Figma-to-WordPress build does two things at once: it matches the design closely, and it leaves the client with a site they can edit without breaking it.</strong> The process below balances both.</p>

<h2>1. Review the design before building</h2>
<p>Before writing code, walk through the Figma file and check that it is complete. Are there mobile and tablet versions? Are hover, focus and error states designed? Are the same components used consistently, or does every section have slightly different spacing? Raising gaps now is far cheaper than discovering them mid-build.</p>

<h2>2. Extract the design system</h2>
<p>Collect the colours, type styles, spacing scale and corner radii into a single source of truth. In a modern block theme, that's <code>theme.json</code>: define the palette, font sizes and spacing presets there, and every block can use them. Editors then choose from your brand colours instead of a colour wheel.</p>

<h2>3. Decide what should be editable</h2>
<p>Not everything in a design should be equally flexible. Text and images usually should; the structure of a carefully composed section often shouldn't. Plan which parts become:</p>
<ul>
  <li><strong>Templates:</strong> fixed page structures, such as a single blog post.</li>
  <li><strong>Block patterns:</strong> pre-designed sections editors can insert and fill.</li>
  <li><strong>Custom blocks:</strong> for components the core blocks can't express.</li>
</ul>

<h2>4. Build mobile layouts deliberately</h2>
<p>If the design only shows desktop, don't let columns simply stack in whatever order they fall. Decide what should come first on a small screen, which images can be cropped differently, and how navigation should work with a thumb.</p>

<h2>5. Match the details</h2>
<p>Fidelity lives in the details: line heights, letter spacing, the exact spacing between a heading and its paragraph. Compare the build to the design at the same viewport width, section by section. Browser extensions that overlay a design image on the page help with this.</p>

<h2>6. Optimise assets</h2>
<p>Export images at the sizes they're displayed, in modern formats. Use SVG for icons and logos. Load only the font weights the design actually uses.</p>

<h2>7. Test with real content</h2>
<p>Designs often use perfect placeholder text. Real headlines are longer, real photos have different proportions. Test each pattern with realistic content to make sure it holds up.</p>

<h2>8. Hand over properly</h2>
<p>A short guide (how to add a page, which patterns exist, what not to change) saves the client time and prevents accidental damage to the design. A site that's easy to edit is part of the deliverable, not an extra.</p>
`,
  },
  {
    slug: "practical-ai-integrations-for-websites",
    title: "Practical AI Integrations for Websites",
    category: "Artificial Intelligence",
    date: "2026-11-10",
    featured: false,
    excerpt:
      "Useful ways to add AI to a website, and the security, cost and accuracy questions to ask before you do.",
    body: `
<p><strong>The most useful AI integrations on websites solve a specific problem visitors or staff already have: finding information, sorting requests, or drafting routine text, rather than adding AI for its own sake.</strong> Here are practical options, and the questions to answer before building any of them.</p>

<h2>Integrations worth considering</h2>
<h3>Smarter site search</h3>
<p>Keyword search fails when visitors use different words from your content. AI-assisted search can match meaning rather than exact terms, helping people find the right page on content-heavy sites.</p>
<h3>Answer assistants grounded in your content</h3>
<p>An assistant that answers questions using only your own pages and documents can handle routine queries at any hour. The important word is <em>grounded</em>: it should draw on your content and say when it doesn't know, rather than inventing an answer.</p>
<h3>Enquiry sorting</h3>
<p>Contact-form messages can be categorised and summarised automatically, then routed to the right person. A person still reads and replies. The AI just does the sorting.</p>
<h3>Content assistance for editors</h3>
<p>Inside the CMS, AI can suggest summaries, alt text drafts or meta descriptions for an editor to review. This speeds up publishing without handing over editorial judgement.</p>

<h2>Questions to answer before you build</h2>
<h3>Where will the API key live?</h3>
<p>Never place an AI provider's secret key in front-end JavaScript. Anyone can read it in the browser and run up charges on your account. Requests should go through a server or serverless function that holds the key securely.</p>
<h3>What will it cost?</h3>
<p>Most AI APIs charge by usage. Estimate typical volume, set spending limits with the provider, and add rate limiting so a single visitor (or a bot) can't generate unlimited requests.</p>
<h3>What happens when it's wrong?</h3>
<p>Language models can produce confident but incorrect answers. Decide how errors are caught: human review, restricting answers to your own content, clear disclaimers, and an easy route to a real person.</p>
<h3>What data is being sent?</h3>
<p>Check what information leaves your site, the provider's data-handling terms, and your privacy obligations. Tell visitors when they're interacting with an AI system.</p>
<h3>What if the service is down?</h3>
<p>Design a fallback. Search can revert to standard keyword results; an assistant can show contact details. The site should keep working without the AI.</p>

<h2>Start small</h2>
<p>Pick one well-defined task, build it with safeguards, and watch how it's actually used. A modest integration that reliably saves time is worth more than an ambitious one nobody trusts.</p>
`,
  },
  {
    slug: "structured-data-and-schema-markup",
    title: "Structured Data and Schema Markup Explained",
    category: "Technical SEO",
    date: "2026-11-10",
    featured: false,
    excerpt:
      "What structured data is, why JSON-LD is the usual choice, which types matter for most sites, and the mistakes to avoid.",
    body: `
<p><strong>Structured data is code that describes the content of a page in a standard vocabulary, so search engines can understand exactly what it is: an article, a product, a person, an event.</strong> The vocabulary most commonly used is <a href="https://schema.org/" rel="noopener">Schema.org</a>, and the recommended format is usually JSON-LD.</p>

<h2>What JSON-LD looks like</h2>
<p>JSON-LD sits in a script tag and doesn't affect what visitors see. A minimal example describing a person:</p>
<pre><code>&lt;script type="application/ld+json"&gt;
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Iqra Batool",
  "jobTitle": "WordPress Developer"
}
&lt;/script&gt;</code></pre>
<p>Google's documentation recommends JSON-LD because it's kept separate from the visible HTML, which makes it easier to add and maintain.</p>

<h2>Why it matters</h2>
<ul>
  <li><strong>Understanding.</strong> It removes ambiguity about what a page is and who is behind it.</li>
  <li><strong>Eligibility for rich results.</strong> Some types can make a page eligible for enhanced search displays, such as breadcrumbs or product details. Eligibility is not a guarantee.</li>
  <li><strong>Entity clarity.</strong> Consistent <code>Person</code> or <code>Organization</code> data helps connect your content to you, which helps with SEO and AI tools.</li>
</ul>

<h2>Types most sites should consider</h2>
<ul>
  <li><code>Organization</code> or <code>Person</code>: who runs the site.</li>
  <li><code>WebSite</code>: the site itself.</li>
  <li><code>BreadcrumbList</code>: where a page sits in the site structure.</li>
  <li><code>Article</code> or <code>BlogPosting</code>: for editorial content.</li>
  <li><code>LocalBusiness</code>: for businesses serving a physical area.</li>
  <li><code>Product</code>: for ecommerce product pages.</li>
</ul>

<h2>Common mistakes</h2>
<h3>Marking up content that isn't on the page</h3>
<p>Structured data should describe what visitors can actually see. Adding reviews, ratings or FAQs that aren't visible on the page goes against Google's guidelines.</p>
<h3>Inventing details</h3>
<p>Fake ratings, made-up addresses or inflated credentials can lead to manual actions, and they damage trust. Only include accurate information.</p>
<h3>Using the wrong type</h3>
<p>A service page isn't a product; a blog post isn't a news article. Pick the type that actually fits.</p>
<h3>Never validating</h3>
<p>Test markup with the <a href="https://search.google.com/test/rich-results" rel="noopener">Rich Results Test</a> or the <a href="https://validator.schema.org/" rel="noopener">Schema Markup Validator</a>, and check Search Console's enhancement reports after publishing.</p>

<h2>Keep it maintained</h2>
<p>Structured data goes stale like any content. When prices, dates, names or roles change, update the markup with them. Generating it from the same data that builds the page, as this website does, is the easiest way to keep the two in sync.</p>
`,
  },
];

module.exports = { categories, posts };
