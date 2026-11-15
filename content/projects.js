/**
 * PROJECTS — a curated showcase, not a full archive.
 *
 * `type` must be one of:
 *   "client"       → Real client work
 *   "personal"     → Personal project
 *   "demo"         → Demonstration project (illustrative, NOT client work)
 *   "experimental" → Experiment
 *
 * The entries below are real, live client websites. If you add a demonstration
 * project later, give it type "demo" so it is labelled honestly on the site.
 *
 * `art` chooses the built-in illustrated preview (atelier, answers, automation,
 * figma). To use a real screenshot instead, set `image: "/assets/img/projects/your-file.jpg"`
 * plus `imageWidth` and `imageHeight`, and put the file in src/img/projects/.
 *
 * Each card links straight to `liveUrl` (opens in a new tab); there are no
 * separate project pages.
 *
 * `featured: true` shows the project on the homepage (keep it to 3–4).
 */
module.exports = [
  {
    slug: "red-river-health-and-wellness",
    metaTitle: "Red River Health — Bricks Builder Website",
    metaDescription:
      "Case study: a fast, responsive healthcare website built in Bricks Builder, with Query Loops and dynamic templates for locations, conditions and blog posts.",
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
    metaTitle: "Transmetron — WordPress Site Built with BEM",
    metaDescription:
      "Case study: a WordPress and Bricks Builder front end built from scratch on a scalable BEM architecture, with fluid typography for a drug testing company.",
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
    metaTitle: "Taylor LP — Mockup to WordPress Website",
    metaDescription:
      "Case study: design mockups turned into a responsive, fully functional WordPress website in Bricks Builder for a lightning protection company.",
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
    metaTitle: "Stitch Print — Figma to WordPress Build",
    metaDescription:
      "Case study: Figma designs converted into maintainable, reusable WordPress components with BEM for a custom apparel and promotional products company.",
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
];
