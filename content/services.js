/**
 * SERVICES — three categories. Edit text freely; the Services page and the
 * homepage overview are generated from this file.
 *
 * Each service: { name, desc (one or two short sentences), tags (3–5 keywords) }
 */
module.exports = [
  {
    id: "wordpress",
    title: "WordPress & Web Development",
    homeTitle: "WordPress development",
    summary:
      "Custom WordPress development and Bricks Builder websites that look good on every screen, load fast and are easy for you to update yourself.",
    services: [
      {
        name: "WordPress Websites",
        desc: "Complete websites built around your brand and goals, from planning to launch, with an editor you can actually use.",
        tags: ["Business websites", "Custom design", "Responsive layouts", "Landing pages"],
      },
      {
        name: "Themes & Plugins",
        desc: "Custom themes and plugins, or safe changes to the ones you already have, so updates never wipe out your work.",
        tags: ["Custom themes", "Child themes", "Custom plugins", "Hooks & filters"],
      },
      {
        name: "Bricks Builder",
        desc: "Visually built sites with clean classes and reusable components, so they stay fast and easy to edit.",
        tags: ["Templates", "Global classes", "Components", "Dynamic data"],
      },
      {
        name: "Figma to WordPress",
        desc: "Your Figma design turned into a working WordPress site that matches the design and stays editable.",
        tags: ["Pixel-accurate build", "Editable blocks", "Design review"],
      },
      {
        name: "Website Redesign",
        desc: "A fresh design and clearer structure for an existing site, without losing the traffic you already have.",
        tags: ["Content audit", "New design", "Redirect map"],
      },
      {
        name: "Speed & Maintenance",
        desc: "Faster pages, regular updates and backups, and fixes when something breaks.",
        tags: ["Core Web Vitals", "Updates", "Backups", "Monitoring"],
      },
    ],
  },

  {
    id: "ai",
    title: "AI Solutions & Automation",
    homeTitle: "AI solutions and automation",
    summary:
      "AI features and automated workflows that take repetitive work off your plate. I only add AI where it actually helps.",
    services: [
      {
        name: "AI Integration",
        desc: "Connect an AI service to your website or internal tools, set up securely on the server.",
        tags: ["API integrations", "Summaries", "Classification", "WordPress"],
      },
      {
        name: "AI Chatbots",
        desc: "An assistant that answers visitor questions from your own content and hands off to a real person when needed.",
        tags: ["Website chat", "Your content", "Human handoff"],
      },
      {
        name: "AI Website Features",
        desc: "Smarter site search, content suggestions or summaries that help visitors find what they need faster.",
        tags: ["Smart search", "Suggestions", "Fallbacks"],
      },
      {
        name: "Workflow Automation",
        desc: "Automate the copy-and-paste jobs, like routing form entries, sending notifications and updating spreadsheets or a CRM.",
        tags: ["Process automation", "Tool integrations", "Lead workflows", "Webhooks"],
      },
      {
        name: "AI Content Workflows",
        desc: "A faster way to research, draft and publish content with AI, with a person checking everything before it goes live.",
        tags: ["Briefs & drafts", "Review checklist", "Publishing"],
      },
      {
        name: "Custom AI Tools",
        desc: "Small web tools such as calculators, generators or internal helpers, built for one specific job.",
        tags: ["Web tools", "Internal utilities", "Process mapping"],
      },
    ],
  },

  {
    id: "seo",
    title: "SEO, AEO & GEO",
    homeTitle: "SEO, AEO and GEO",
    summary:
      "Help people find you on Google, in direct answers and in AI tools like ChatGPT. It starts with a healthy site and clear, useful content.",
    services: [
      {
        name: "SEO Audit",
        desc: "A full check of your site with a written report: what's wrong, why it matters and how to fix it.",
        tags: ["Technical health", "Content review", "Priorities", "Report"],
      },
      {
        name: "Technical SEO",
        desc: "Make sure search engines can crawl, index and load your site properly.",
        tags: ["Indexing", "Site speed", "Redirects", "Schema markup"],
      },
      {
        name: "On-Page & Content SEO",
        desc: "Titles, headings, internal links and content that match what people are searching for.",
        tags: ["Keyword research", "On-page", "Internal linking", "Content plans"],
      },
      {
        name: "Local SEO",
        desc: "Show up when people nearby search for what you offer.",
        tags: ["Business profile", "Local pages", "Citations"],
      },
      {
        name: "SEO Strategy",
        desc: "A clear plan based on your goals, your competitors and where the real opportunities are.",
        tags: ["Competitor analysis", "Site structure", "Link building", "Migrations"],
      },
      {
        name: "AEO (Answer Engine Optimization)",
        desc: "Shape your content so featured snippets and voice assistants can pick it up as the answer.",
        tags: ["Question-based content", "Clear answers", "FAQs", "Schema"],
      },
      {
        name: "GEO (Generative Engine Optimization)",
        desc: "Make your content clear and trustworthy enough to be cited in AI Overviews, ChatGPT and Perplexity.",
        tags: ["Entity clarity", "Author info", "Quotable sections", "Credibility"],
      },
    ],
    deliverables: [
      "SEO audit report",
      "Keyword research",
      "Competitor analysis",
      "Content plan",
      "On-page and schema changes",
      "AEO and GEO recommendations",
      "Progress reports",
    ],
    faqs: [
      {
        q: "What's the difference between SEO, AEO and GEO?",
        a: "SEO helps your pages rank in Google. AEO helps your content get picked as a direct answer, like a featured snippet. GEO helps AI tools understand and cite your content. All three rely on the same thing: a healthy site with clear, accurate content.",
      },
      {
        q: "How long does SEO take?",
        a: "Technical fixes can show up within a few weeks. Content work usually takes a few months to show its full effect.",
      },
      {
        q: "Can you guarantee I'll appear in AI answers?",
        a: "No, and nobody honestly can. AI tools choose what to cite and change often. I focus on what makes your content a strong, credible option.",
      },
      {
        q: "Do you only work on WordPress sites?",
        a: "No. Most SEO work applies to any platform. On other platforms, some changes may need help from your developer.",
      },
    ],
  },
];
