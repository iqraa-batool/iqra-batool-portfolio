/**
 * PROJECTS — a curated showcase, not a full archive.
 *
 * `type` must be one of:
 *   "client"       → Real client work
 *   "personal"     → Personal project
 *   "demo"         → Demonstration project (illustrative, NOT client work)
 *   "experimental" → Experiment
 *
 * The client entries are real, live websites. The demo entries after them are
 * DEMONSTRATION projects that show how the case studies look (keep their type
 * honest). Demo projects are always labelled as such on the site.
 *
 * `art` chooses the built-in illustrated preview (atelier, answers, automation,
 * figma). To use a real screenshot instead, set `image: "/assets/img/projects/your-file.jpg"`
 * plus `imageWidth` and `imageHeight`, and put the file in src/img/projects/.
 *
 * `featured: true` shows the project on the homepage (keep it to 3–4).
 */
module.exports = [
  {
    slug: "red-river-health-and-wellness",
    title: "Red River Health and Wellness Center",
    subtitle: "A responsive healthcare website built in Bricks Builder",
    type: "client",
    categories: ["WordPress Development", "Website Design"],
    featured: true,
    summary:
      "A high-performance, responsive website for a healthcare clinic with several locations, built in Bricks Builder with dynamic content for locations, blog posts, condition pages and patient resources.",
    objective:
      "Give the clinic a fast site that patients can use on any device, and a structure the team can grow, adding new conditions, locations and articles without rebuilding pages by hand.",
    role: "WordPress development in Bricks Builder, front-end build and dynamic content setup.",
    tech: ["WordPress", "Bricks Builder", "Query Loops", "Dynamic data", "CSS Grid", "Flexbox"],
    approach: [
      "Built the layouts in Bricks Builder with CSS Grid and Flexbox so every section adapts cleanly from desktop to mobile.",
      "Displayed clinic locations and blog posts dynamically with Bricks Query Loops, so new entries appear without editing pages.",
      "Used Bricks dynamic data and reusable templates to scale condition pages, such as Hashimoto's and Low Thyroid, and patient resources.",
    ],
    outcome:
      "A live, responsive healthcare website whose condition pages, locations and articles all come from shared templates, so the site stays consistent as it grows.",
    image: "/assets/img/projects/red-river-health-and-wellness.png",
    imageWidth: 1200,
    imageHeight: 800,
    imageAlt: "Homepage of the Red River Health and Wellness Center website",
    liveUrl: "https://www.redriverhealthandwellness.com/",
    year: "",
  },
  {
    slug: "transmetron",
    title: "Transmetron",
    subtitle: "A scalable front end built from scratch on a BEM architecture",
    type: "client",
    categories: ["WordPress Development", "Website Design"],
    featured: true,
    summary:
      "The front end of a drug testing, training and supplies company in Salt Lake City, built from scratch in WordPress and Bricks Builder on a scalable BEM class architecture.",
    objective:
      "Build a front end that stays consistent and easy to extend as the business adds services, courses and products.",
    role: "Front-end development and WordPress implementation in Bricks Builder.",
    tech: ["WordPress", "Bricks Builder", "BEM", "Fluid typography", "HTML", "CSS"],
    approach: [
      "Structured every component with the BEM (Block Element Modifier) methodology so styles stay predictable and reusable.",
      "Used fluid spacing and typography so the layout scales smoothly between screen sizes instead of jumping at breakpoints.",
      "Built the pages from scratch rather than on a pre-made theme, keeping the markup lean.",
    ],
    outcome:
      "A live site with a consistent, responsive layout and a class system that new pages can reuse.",
    image: "/assets/img/projects/transmetron.png",
    imageWidth: 1200,
    imageHeight: 800,
    imageAlt: "Homepage of the Transmetron website",
    liveUrl: "https://transmetron.com/",
    year: "",
  },
  {
    slug: "taylor-lp",
    title: "Taylor LP",
    subtitle: "Design mockups turned into a working lightning protection website",
    type: "client",
    categories: ["WordPress Development", "Website Design"],
    featured: true,
    summary:
      "A website for a lightning protection company, taken from design mockups to a fully functional WordPress build in Bricks Builder.",
    objective:
      "Turn the approved mockups into a working site with clear navigation, so visitors can quickly find the company's systems, principles and projects.",
    role: "WordPress development and front-end implementation.",
    tech: ["WordPress", "Bricks Builder", "HTML", "CSS"],
    approach: [
      "Rebuilt each mockup section faithfully in Bricks Builder.",
      "Set up intuitive navigation across the main areas of the site.",
      "Built a flexible layout system so the pages stay responsive on every device size.",
    ],
    outcome:
      "A live, fully functional website that matches the mockups and works across devices.",
    image: "/assets/img/projects/taylor-lp.png",
    imageWidth: 1200,
    imageHeight: 800,
    imageAlt: "Homepage of the Taylor Lightning Protection website",
    liveUrl: "https://taylor-lp.com/",
    year: "",
  },
  {
    slug: "stitch-print",
    title: "Stitch Print",
    subtitle: "Figma designs converted into maintainable WordPress components",
    type: "client",
    categories: ["WordPress Development", "Website Design"],
    featured: true,
    summary:
      "A website for a custom apparel and promotional products company, converted from Figma designs into maintainable, scalable WordPress UI components.",
    objective:
      "Match the Figma designs closely while giving the business components it can reuse across service and portfolio pages.",
    role: "Figma-to-WordPress development and front-end build.",
    tech: ["Figma", "WordPress", "Bricks Builder", "BEM", "HTML", "CSS"],
    approach: [
      "Translated the Figma designs into reusable WordPress components.",
      "Used structured class names and the BEM methodology to keep the styles maintainable.",
      "Checked the build against the designs so spacing, type and colour stayed faithful.",
    ],
    outcome:
      "A live website built from reusable components that keeps the look of the original designs.",
    image: "/assets/img/projects/stitch-print.png",
    imageWidth: 1200,
    imageHeight: 800,
    imageAlt: "Homepage of the Stitch Print website",
    liveUrl: "https://stitchprint.com/",
    year: "",
  },
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
