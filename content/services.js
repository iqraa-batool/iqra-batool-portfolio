/**
 * SERVICES — three categories, shown as the accordion in the homepage
 * Services section. Edit text freely.
 *
 * Each service: { name, desc } — keep `desc` to one short line (about 10 words).
 */
module.exports = [
  {
    id: "wordpress",
    title: "WordPress & Web Development",
    homeTitle: "WordPress development",
    summary: "Fast, responsive WordPress and Bricks Builder sites you can easily update yourself.",
    services: [
      { name: "WordPress Websites", desc: "Complete, custom sites from planning to launch." },
      { name: "Themes & Plugins", desc: "Custom builds or safe changes that survive updates." },
      { name: "Bricks Builder", desc: "Clean, reusable components that stay fast and editable." },
      { name: "Figma to WordPress", desc: "Your design, built accurately and kept editable." },
      { name: "Website Redesign", desc: "A fresh look without losing your search traffic." },
      { name: "Speed & Maintenance", desc: "Faster pages, updates, backups and quick fixes." },
    ],
  },

  {
    id: "ai",
    title: "AI Solutions & Automation",
    homeTitle: "AI solutions and automation",
    summary: "AI features and automations that take repetitive work off your plate, only where they help.",
    services: [
      { name: "AI Integration", desc: "AI connected securely to your site or tools." },
      { name: "AI Chatbots", desc: "Answers from your content, with a human handoff." },
      { name: "AI Website Features", desc: "Smarter search, suggestions and summaries." },
      { name: "Workflow Automation", desc: "Forms, notifications and CRM updates on autopilot." },
      { name: "AI Content Workflows", desc: "Faster drafting, with a person reviewing everything." },
      { name: "Custom AI Tools", desc: "Small web tools built for one specific job." },
    ],
  },

  {
    id: "seo",
    title: "SEO, AEO & GEO",
    homeTitle: "SEO, AEO and GEO",
    summary: "Get found on Google, in direct answers and in AI tools like ChatGPT.",
    services: [
      { name: "SEO Audit & Strategy", desc: "What's holding you back, and a clear plan to fix it." },
      { name: "Technical SEO", desc: "Crawling, indexing, speed and schema done right." },
      { name: "On-Page & Content SEO", desc: "Content and structure that match real searches." },
      { name: "Local SEO", desc: "Show up when people nearby search for you." },
      { name: "AEO (Answer Engine Optimization)", desc: "Content shaped to win snippets and voice answers." },
      { name: "GEO (Generative Engine Optimization)", desc: "Get cited in AI Overviews, ChatGPT and Perplexity." },
    ],
  },
];
