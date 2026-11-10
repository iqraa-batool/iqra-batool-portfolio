/**
 * SITE SETTINGS — the single place for identity, contact details and links.
 *
 * Anything left as an empty string ("") is simply not shown on the site.
 * Nothing here is invented: fill in your real details before publishing.
 */
module.exports = {
  name: "Iqra Batool",
  shortName: "IB",

  // REQUIRED BEFORE DEPLOYING: your real domain, no trailing slash.
  // Used for canonical URLs, the sitemap, Open Graph images and structured data.
  siteUrl: "https://iqra-batool-portfolio.vercel.app",

  locale: "en",
  roles: ["WordPress Developer", "AI Solutions Builder", "SEO Specialist"],

  // Default meta description (pages override it).
  description:
    "Iqra Batool is a WordPress developer, AI solutions builder and SEO specialist helping businesses build better websites, smarter workflows and stronger digital visibility.",

  // The two headline statistics. Keep these consistent everywhere.
  stats: [
    { value: 1.5, decimals: 1, suffix: "+", label: "Years of experience" },
    { value: 20, decimals: 0, suffix: "+", label: "Projects completed" },
  ],

  // Optional availability line in the hero. Leave "" to hide it.
  // Example: "Taking on new projects from January"
  availability: "",

  contact: {
    email: "iqraabatool255@gmail.com",
    phone: "", // e.g. "+92 300 0000000"
    location: "", // e.g. "Lahore, Pakistan" or "Remote"
  },

  // Social profiles. Only entries with a URL are shown.
  // Supported networks: linkedin, github, x, instagram, behance, dribbble, facebook, youtube, upwork, fiverr
  social: [
    { network: "linkedin", url: "" },
    { network: "github", url: "" },
    { network: "x", url: "" },
    { network: "upwork", url: "" },
  ],

  // X/Twitter handle for card metadata, e.g. "@iqrabatool". Leave "" to omit.
  twitterHandle: "",

  // Contact form backend. See README → "Configure the contact form".
  // For Formspree, paste your form endpoint, e.g. "https://formspree.io/f/abcdwxyz".
  form: {
    endpoint: "",
  },
};
