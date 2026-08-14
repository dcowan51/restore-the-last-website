# Restore the Last — Website

Static website for [Restore the Last](https://restorethelast.org), a nonprofit funding nervous system restoration for survivors of trafficking, foster care, and violence.

## Tech Stack

- **Astro** — static site generator
- **Tailwind CSS** — utility-first styling
- **Vanilla JS** — mobile menu toggle only
- **Google Fonts** — Lora (serif) + Lato (sans-serif)
- **Netlify** — hosting and form handling

## Setup

```bash
npm install
npm run dev        # Start dev server at localhost:4321
npm run build      # Build to ./dist/
npm run preview    # Preview production build
npm run audit      # Build, then check the design rules below
```

## Pages

| Route                | Page                    |
| :------------------- | :---------------------- |
| `/`                  | Homepage                |
| `/about`             | About/Mission           |
| `/how-it-works`      | How It Works            |
| `/impact`            | Impact                  |
| `/give`              | Give/Donate             |
| `/partners`          | Partners                |
| `/projects`          | Current Projects        |
| `/projects/[slug]`   | Project detail          |
| `/privacy`           | Privacy policy          |
| `/404`               | Not found               |

## Design rules

`npm run audit` enforces these. It exits non-zero on a violation, so it works as
a pre-push check.

**Two golds.** No single value clears WCAG AA on both light and dark grounds —
light backgrounds need luminance ≤0.135, the deep violet needs ≥0.290. Use
`gold` on `bg-deep` and for decorative rules; use `gold-deep` for text on
white/offwhite/light and for `btn-gold`'s fill.

**One left rail.** Never put a width override on `.container-narrow` — it
supplies `mx-auto`, so the override shrinks the block *and* re-centres it, and
the left edge drifts section to section. Nest instead, and leave the child
left-aligned:

```html
<div class="container-narrow">
  <div class="max-w-3xl">…</div>
</div>
```

**Reading measure.** `global.css` caps `p` and `li` inside `.container-narrow`
at `56ch`. `ch` rather than pixels because it scales with each element's own
font size, so 18px body copy and 14px captions both land near 68–70 characters.
A max-width only binds what's already wider, so card and column text is
untouched. The rule lives in `@layer base`, so an explicit `max-w-*` utility on
an element still wins if a block genuinely needs to be wider.

**Minimum contrast.** `text-body` at `/80` or darker, `text-white` at `/40` or
lighter (and `/40` only for decorative marks). Anything fainter fails AA.

**Heading tags follow the outline, not the size.** Never skip a level to get a
smaller heading — apply `text-h4` and keep the correct tag.

## Known gaps

- `#FFFFFF` vs `#FAFAF7` section alternation is ~1.02:1 — effectively invisible.
  Only `bg-light` and `bg-deep` create a real seam.
- Form inputs use `focus:outline-none` and signal focus with a 1px border colour
  change only. Contrast is adequate (7.5:1 light, 4.7:1 dark) but it's subtle;
  a proper ring would be better.

## Deployment

Deployed to Netlify. Config in `netlify.toml`.

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 20

## Environment Variables

Copy `.env.example` to `.env` for any future API keys or form endpoints.
