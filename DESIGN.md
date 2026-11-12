# Design notes

How the site looks and moves, and why. This replaces the earlier plum-and-pink direction.

## Direction

A black-led page in three colours: Deep Black, Soft Cream and Burgundy Wine. The landing page is built from "sheets": full-width sections with rounded top corners that slide up over the one before, starting with the first sheet sliding over a pinned hero. Black and cream sheets alternate, and burgundy is kept for two full sections (process and contact) and for emphasis.

Headings are Big Shoulders Display at weight 900, uppercase and set tight. Emphasis in a heading is a solid slab behind the words (burgundy on black and cream, cream on burgundy), never italics, a gradient or a colour change alone. Body and interface text use Hanken Grotesk.

The content order follows the reference site, wptechstudio.com: hero, about, services, process, work, FAQ, contact.

What the design avoids:

- gradient text and glass cards;
- small labels sitting above headings;
- invented testimonials, logo walls or pricing;
- any colour outside the three, apart from tints of them.

## Tokens (`src/css/main.css`, `:root`)

| Token | Value | Use |
|---|---|---|
| `--black` | #0B0B0B | Hero, about, work, footer |
| `--black-raised` | #171212 | Panels and image frames on black |
| `--wine` | #5B0F18 | Process and contact sections, slabs, accents |
| `--wine-deep` | #450B12 | Panels on burgundy |
| `--wine-lit` | #8C2A35 | Burgundy that must show on black: glow, borders, footer wordmark |
| `--cream` | #F8F1E7 | Text on dark; services and FAQ sections |
| `--cream-deep` | #ECE1D0 | Panels on cream |

Burgundy on black is too dark to read (1.4:1), so burgundy is never used for text on black. It appears there only as a fill with cream text on top.

Each section carries one surface class: `.on-black`, `.on-cream` or `.on-wine`. The class sets `--bg`, `--ink`, `--ink-soft`, `--ink-mute`, `--line`, the slab colours and the button colours. Components read those and never hard-code a colour, so a section can change surface and stay readable.

**Shape.** Buttons, tags and the header are pills. Sheets have large rounded top corners (`--r-sheet`). Images and form fields use a small radius.

## Motion

GSAP with ScrollTrigger drives the animation and Lenis smooths the scrolling. Everything is visible in the HTML first, so the page reads correctly if the scripts fail, and all of it switches off under `prefers-reduced-motion`.

- **Hero intro:** the three icon tiles land first, then the headline rises out of masks, then the notes and buttons.
- **Pinned hero:** on screens at least 900px wide the hero stays fixed and sinks back as the first sheet slides over it.
- **Headings:** words rise one after another as they scroll into view; a slab moves as one piece.
- **Services and FAQ:** accordions, one panel open at a time.
- **Process:** the wavy line draws with the scroll, and each step lands as the line reaches it. Below 1100px the steps become a simple list.
- **Work:** each image unmasks from the bottom and drifts inside its frame while scrolling.
- **Footer:** the wordmark rises into place as the page ends.

## Checks run on this version

Run in the preview browser at 1440px and 375px wide:

- No horizontal overflow at either width.
- Every text element on the landing page passes WCAG AA contrast (4.5:1, or 3:1 for large text).
- One `h1` per page and no duplicate ids.
- The mobile menu opens and closes; the contact form shows its five validation messages and the "not connected yet" message.

The Impeccable detector flags the footer wordmark for contrast and some sections for "cramped padding". The wordmark is decorative and hidden from screen readers; the padding findings come from `clamp()` values the detector cannot resolve.
