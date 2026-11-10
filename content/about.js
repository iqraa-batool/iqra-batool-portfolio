/**
 * ABOUT CONTENT — biography, education, experience, certifications, skills.
 * Empty fields are hidden automatically. Do not add anything that isn't true.
 */
module.exports = {
  intro:
    "I'm a WordPress web developer with an MPhil in Computer Science. I build custom WordPress and Bricks Builder websites, use AI in website development to save businesses time, and do SEO so people can find them on Google and in AI tools like ChatGPT.",

  story: [
    "Studying computer science taught me a habit I still use every day: understand the problem first, test instead of guessing, and explain things in plain words.",
    "WordPress is where I put that into practice. I like building it properly: clean themes, plugins that fit how a business works, and an editor clients can use without calling a developer.",
    "In 1.5+ years and 20+ projects, my work has grown in two directions. One is AI: automations and integrations that cut out repetitive tasks, without overpromising what AI can do. The other is SEO: technical fixes, clear content and, more and more, AEO and GEO, so AI tools can understand and recommend a site.",
    "My favourite projects use all three. A site that's well built, smart and easy to find does a lot more for a business.",
  ],

  // EDUCATION — add institution and year when you want them shown.
  education: [
    {
      degree: "MPhil in Computer Science",
      status: "Completed",
      institution: "",
      year: "",
      note: "",
    },
  ],

  // EXPERIENCE TIMELINE — add real roles here; the timeline appears automatically.
  // { role: "WordPress Developer", organization: "Company name", start: "2024", end: "Present", summary: "What you did." }
  experience: [],

  // CERTIFICATIONS — the section stays hidden until at least one entry exists.
  // { name: "", issuer: "", date: "", url: "", credentialId: "" }
  certifications: [],

  skills: [
    {
      group: "Web development",
      items: [
        "WordPress",
        "HTML",
        "CSS",
        "JavaScript",
        "Bricks Builder",
        "WordPress theme development / customization",
        "WordPress plugin development / customization",
      ],
    },
    {
      group: "AI and automation",
      items: [
        "AI integrations",
        "AI-powered website concepts",
        "Workflow automation",
        "AI solution development",
      ],
    },
    {
      group: "SEO",
      items: [
        "Technical SEO",
        "On-page SEO",
        "Off-page SEO",
        "Local SEO",
        "Content SEO",
        "Answer Engine Optimization (AEO)",
        "Generative Engine Optimization (GEO)",
      ],
    },
  ],

  // Shown on the homepage under "Why work with me".
  strengths: [
    {
      title: "I know the tech",
      text: "With a computer science background, I understand what's going on under the page builder, not just on top of it.",
    },
    {
      title: "Clean fixes, not hacks",
      text: "When a theme or plugin can't do what you need, I find the cleanest way to make it work.",
    },
    {
      title: "Code that lasts",
      text: "Tidy HTML and CSS, changes that survive updates, and code another developer can pick up easily.",
    },
    {
      title: "Easy to use",
      text: "I test every layout on real screens and keep the person editing the site in mind.",
    },
    {
      title: "Fast by default",
      text: "I think about page speed from day one, not as a fix at the end.",
    },
    {
      title: "Always learning",
      text: "SEO and AI change fast. I keep up, test new ideas on my own projects, and only use what works.",
    },
    {
      title: "Smarter workflows",
      text: "I look for spots where automation or AI can take work off your plate.",
    },
  ],

  process: [
    { title: "Discover", text: "We talk about your goals, your audience and what a good result looks like." },
    { title: "Plan", text: "We agree on the site structure, content, approach and a realistic timeline." },
    { title: "Design", text: "I share layouts and the visual direction, and we review them together before I build." },
    { title: "Develop", text: "I build a clean, responsive site with an editor you can actually use." },
    { title: "Test", text: "I check devices, browsers, forms, speed, accessibility and SEO basics." },
    { title: "Launch", text: "We go live, I set up redirects and Search Console, and I walk you through everything." },
  ],

  // Confirmed technologies. Add others to `additional` only once you use them in real work.
  tools: [
    { name: "WordPress", use: "Themes, plugins, the block editor and the Site Editor." },
    { name: "Bricks Builder", use: "Visual site building with global classes, components and dynamic data." },
    { name: "HTML5", use: "Semantic, accessible markup that search engines can parse." },
    { name: "CSS3", use: "Responsive layouts, design systems and careful details." },
    { name: "JavaScript", use: "Interactions, integrations and small tools, only where they help." },
  ],
  additionalTools: [],
};
