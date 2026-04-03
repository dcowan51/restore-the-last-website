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
```

## Pages

| Route            | Page           |
| :--------------- | :------------- |
| `/`              | Homepage       |
| `/about`         | About/Mission  |
| `/how-it-works`  | How It Works   |
| `/impact`        | Impact         |
| `/give`          | Give/Donate    |
| `/partners`      | Partners       |

## Deployment

Deployed to Netlify. Config in `netlify.toml`.

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 20

## Environment Variables

Copy `.env.example` to `.env` for any future API keys or form endpoints.
