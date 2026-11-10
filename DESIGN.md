# Design notes

How the site looks and why, plus the record of the Impeccable design review.

## Direction

The site is dark first and reads like a magazine. Midnight Plum is the canvas. The headings use Big Shoulders Display, a tall condensed face, set large and bold, with key words picked out in pink. Cream sections break up the long dark pages. Gold is rare on purpose: it appears only in the monogram's dot, small rules and a few labels. That keeps it feeling like an accent rather than decoration.

What the design deliberately avoids:

- gradient blobs;
- glassmorphism cards;
- stock icons in coloured circles;
- fake logo walls and testimonials;
- "trusted by" strips.

The proof is the work itself: case studies with a clear project type, the problem, the approach and the outcome.

## Tokens (`src/css/main.css`, `:root`)

| Token | Value | Use |
|---|---|---|
| `--plum` | #292333 | Default page background |
| `--plum-deep` | #1f1a27 | `.surface-deep` sections, footer |
| `--plum-raised` | #332b40 | Panels and cards on dark |
| `--royal` | #482B63 | `.surface-royal` (CTA band) |
| `--mauve` | #A46CA3 | Secondary accent, art |
| `--pink` | #E8B8C6 | Links on dark |
| `--lav` | #DCD0E9 | Hairlines, the monogram on dark |
| `--cream` | #FAF6F0 | Body text on dark; `.surface-cream` background |
| `--gold` | #D4AF37 | Sparse accent only |

Semantic tokens (`--bg`, `--ink`, `--ink-soft`, `--ink-mute`, `--line`, `--link`, `--panel`) are redefined for each surface. Components never hard-code colours, so any section can switch between plum, cream and royal and stay readable.

**Type**

- Headings and display: Big Shoulders Display.
- Interface (nav, buttons, labels): Poppins.
- Body text: Inter.
- Sizes are fluid `clamp()` steps, `--t-hero` through `--t-label`.

**Space and shape**

- `--section` provides fluid vertical rhythm.
- The container is 1240px, with a fluid gutter.
- Corners are nearly square (2px and 6px radii).
- Motion uses a single ease-out curve (`--ease`).
- All motion stops under `prefers-reduced-motion`.

**Monogram.** The I and the B are separate letters: a serif I, then a B made of a stem and two outlined bowls. A gold dot sits at the B's waist. The source files are in `src/img/` (`logo.svg`, `monogram*.svg`, `favicon.svg`). The PNG fallbacks are generated with `npm run icons`.

## Impeccable review

[Impeccable](https://github.com/pbakaus/impeccable) was installed as a project skill. Its `detect` analyser was run over the built `public/` folder and reported 316 findings. Each category was judged as follows:

| Finding | Count | Verdict |
|---|---|---|
| low-contrast | 113 | **Mostly false positives.** Almost all came from the `@media print` rule (black text on a white background), which the static analyser reads as normal page styles. Checked separately with a real in-browser audit (below). |
| cramped-padding | 162 | **False positives.** These are hairline-divided lists (no padding by design) and `clamp()` padding that the analyser can't resolve. Checked visually at 375px and at desktop width. |
| overused-font | 19 | **Kept.** The fonts were specified in the brief. |
| italic-serif-display | 12 | **Resolved.** The headings now use Big Shoulders Display, and heading emphasis is shown with colour instead of italics. |
| tight-leading | 4 | **Kept.** These are large display headings, where tight leading reads better. Body text uses 1.65. |
| em-dash-overuse | 6 | **Fixed.** Prose was rewritten with commas, colons, full stops and parentheses. Dashes remain in three places: the brief's verbatim hero line, the `<title>` separators, and the "**Term** — definition" glossary lists in the articles. |

**In-browser contrast audit.** Run in the preview browser on `/`, `/about/`, `/services/`, `/projects/`, `/blog/`, `/contact/` and `/404.html`:

- For every visible text node, it computed the foreground colour against the effective blended background.
- It applied WCAG AA thresholds: 4.5:1 for normal text and 3:1 for large text.
- **Result:** one flag, the oversized "404" on the error page (1.13:1). That element is a decorative watermark marked `aria-hidden="true"`, and the readable message sits beside it, so it was left as designed. Everything else passes.

**Other checks run in the browser:**

- One `h1` per page and no skipped heading levels. The Services accordion summaries were changed to `h3` to fix one skip.
- No duplicate ids, no images without `alt`, and no inputs without labels.
- No horizontal overflow at 375px. This needed two fixes: the article grid now uses `minmax(0, 1fr)`, and tables scroll inside their own box.
- The mobile menu toggles `aria-expanded`, locks page scrolling, closes on Esc and returns focus to the menu button.
