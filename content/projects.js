/**
 * PROJECTS — a curated showcase, not a full archive.
 *
 * `type` must be one of:
 *   "client"       → Real client work
 *   "personal"     → Personal project
 *   "demo"         → Demonstration project (illustrative, NOT client work)
 *   "experimental" → Experiment
 *
 * The four entries below are DEMONSTRATION projects written to show how the
 * case studies look. Replace them with your real work (or change their type
 * honestly). Demo projects are always labelled as such on the site.
 *
 * `art` chooses the built-in illustrated preview (atelier, answers, automation,
 * figma). To use a real screenshot instead, set `image: "/assets/img/projects/your-file.jpg"`
 * plus `imageWidth` and `imageHeight`, and put the file in src/img/projects/.
 *
 * `featured: true` shows the project on the homepage (keep it to 3–4).
 */
module.exports = [
  {
    slug: "atelier-block-theme",
    title: "Atelier",
    subtitle: "A custom block theme for a design studio",
    type: "demo",
    categories: ["WordPress Development", "Website Design"],
    featured: true,
    summary:
      "A lightweight WordPress block theme for a fictional interior design studio, with editorial layouts, a portfolio post type and an editing experience built around the Site Editor.",
    objective:
      "Show how a studio can have a distinctive, image-led website without a heavy multipurpose theme: fast pages, full control of the design, and templates the studio can edit on its own.",
    role: "Design direction, theme development and editor experience.",
    tech: ["WordPress", "Block theme (theme.json)", "HTML", "CSS", "JavaScript"],
    approach: [
      "Defined colours, type scale and spacing once in theme.json so every block inherits the design system.",
      "Built custom block patterns for project pages, so new case studies keep a consistent layout.",
      "Registered a Projects post type with its own archive and single templates.",
      "Kept JavaScript to a minimum: a small script for the image gallery and nothing else on most pages.",
    ],
    outcome:
      "A complete theme structure that demonstrates the approach: a design system the editor can't accidentally break, and pages that load without unnecessary plugins.",
    url: "",
    art: "atelier",
    year: "",
  },
  {
    slug: "answer-ready-help-centre",
    title: "Answer-Ready Help Centre",
    subtitle: "A knowledge base structured for search and answer engines",
    type: "demo",
    categories: ["SEO Projects", "WordPress Development"],
    featured: true,
    summary:
      "A help-centre structure for a fictional software company, organised around real customer questions and marked up so search engines and answer engines can understand each article.",
    objective:
      "Show how SEO, AEO and GEO can turn a support section into content that's easy to browse, easy to quote and easy for search engines and AI tools to understand.",
    role: "Information architecture, content structure, schema design and on-page SEO.",
    tech: ["WordPress", "Structured data (JSON-LD)", "HTML", "CSS"],
    approach: [
      "Grouped articles into topic clusters with a pillar page for each product area.",
      "Wrote headings as the questions customers ask, each followed by a direct answer in the first paragraph.",
      "Added Article, BreadcrumbList and FAQPage markup only where the content actually matched the type.",
      "Planned internal links between related answers so every article sits in context.",
    ],
    outcome:
      "A reusable content and template model for help centres. As a demonstration, it shows the structure and makes no claim about rankings or traffic.",
    url: "",
    art: "answers",
    year: "",
  },
  {
    slug: "enquiry-triage-automation",
    title: "Enquiry Triage",
    subtitle: "An AI-assisted workflow for sorting incoming enquiries",
    type: "demo",
    categories: ["AI Solutions", "Automation"],
    featured: true,
    summary:
      "A workflow concept that reads incoming contact-form enquiries, suggests a category and priority with a language model, and routes each one to the right person, with a human always confirming.",
    objective:
      "Show how a small business could stop sorting its inbox by hand while still having the final say on every suggestion.",
    role: "Process mapping, workflow design and integration architecture.",
    tech: ["WordPress forms", "Webhooks", "Language model API (server-side)", "Spreadsheet / CRM"],
    approach: [
      "Mapped the manual process first: where enquiries arrive, who handles which type, and what gets missed.",
      "Sent each form entry to a server-side function so the API key never reaches the browser.",
      "Asked the model for a category and a short summary only, never to reply to customers on its own.",
      "Logged every suggestion next to the original message so a person can review and correct it.",
    ],
    outcome:
      "A documented, buildable workflow design. It is a demonstration: it illustrates the architecture and safeguards rather than reporting results from a live business.",
    url: "",
    art: "automation",
    year: "",
  },
  {
    slug: "figma-to-wordpress-launch-page",
    title: "Launch Page",
    subtitle: "From Figma file to editable WordPress landing page",
    type: "demo",
    categories: ["WordPress Development", "Website Design"],
    featured: false,
    summary:
      "A product launch page for a fictional tea brand, taken from a Figma design to a responsive WordPress build where every section remains editable.",
    objective:
      "Demonstrate a faithful Figma-to-WordPress workflow: matching spacing, type and colour exactly while giving the client blocks they can change without breaking the layout.",
    role: "Front-end development and WordPress implementation.",
    tech: ["Figma", "WordPress", "HTML", "CSS", "JavaScript"],
    approach: [
      "Extracted colours, type styles and spacing from the Figma file into design tokens.",
      "Rebuilt each design section as a reusable block pattern.",
      "Adapted the desktop design for tablet and mobile rather than letting columns simply stack.",
      "Compared the build against the design at each breakpoint before handover.",
    ],
    outcome:
      "A demonstration of the process and the level of fidelity. It is not a published client site.",
    url: "",
    art: "figma",
    year: "",
  },
];
