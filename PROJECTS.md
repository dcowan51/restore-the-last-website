# How to Add and Manage Projects

## The easy way: use the editor

Go to **`/admin`**, sign in, and fill in a form. No JSON, no code, drag-and-drop photos. See **[ADMIN-SETUP.md](ADMIN-SETUP.md)** for the one-time login setup.

Everything below describes the files the editor writes — useful if you'd rather edit directly, or need to understand what a field does.

---

## The files

Each project is **one JSON file** in `src/content/projects/`, and **the filename is the URL** — `hope-found-documentary.json` becomes `/projects/hope-found-documentary`.

Every field is validated at build time against `src/content/config.ts`. A bad value fails the deploy with a message naming the file and field, rather than quietly publishing something broken.

**Where projects show up**

| Place | What it shows |
|---|---|
| Homepage | Only projects with `"featured": true`, as a carousel |
| `/give` | All projects, as a carousel with type filters |
| `/projects` | All projects, as a filterable grid |
| `/projects/<slug>` | One full detail page per project, generated automatically |

---

## Template — a deployment

```json
{
  "type": "deployment",
  "status": "open",
  "featured": true,
  "order": 40,
  "title": "Project Title Here",
  "location": "City, Country",
  "populations": ["foster-youth"],
  "purpose": "One sentence on what this project is for.",
  "partner": {
    "name": "Partner Organization Name",
    "url": "https://www.example.org"
  },
  "population": "Who is being served, in plain words",
  "goal": 10000,
  "coverImage": "/uploads/your-photo.jpg",
  "summary": "2–3 sentences. What facility, what location, why now. Shows on the card and at the top of the detail page.",
  "whatWeFund": "What the money specifically covers — calm boxes, training, support.",
  "whyThisPopulation": "1–2 paragraphs on why this population needs this. Separate paragraphs with a blank line (\\n\\n)."
}
```

## Template — a documentary or film

```json
{
  "type": "documentary",
  "status": "in-production",
  "featured": true,
  "order": 40,
  "title": "Film Title",
  "subtitle": "One evocative line. Shows on the card instead of the summary.",
  "location": "Where it's filmed",
  "populations": ["foster-youth", "residential-care"],
  "purpose": "One sentence on why this film exists.",
  "partner": { "name": "Production Company", "url": "" },
  "goal": 10000,
  "coverImage": "/uploads/your-still.jpg",
  "summary": "2–3 sentences about the film.",
  "whatWeFund": "Production, post, scoring, subtitling, distribution.",
  "whyThisMatters": "1–2 paragraphs on why this story needs telling.",
  "media": {
    "productionPartner": "Production Company",
    "targetRelease": "Spring 2027",
    "runtime": "Feature length",
    "trailerUrl": ""
  }
}
```

---

## Field Reference

| Field | What it is | Rules |
|---|---|---|
| *(filename)* | The URL for the project page | Lowercase, hyphens only, no spaces. `my-project.json` → `/projects/my-project` |
| `order` | Sort position | Number. Lower shows first. Use gaps (10, 20, 30) so you can reorder without renumbering |
| `type` | What kind of project this is | `"deployment"`, `"documentary"`, `"training"`, or `"research"` |
| `status` | The badge on the card | `"open"`, `"active"`, `"in-production"`, or `"funded"` |
| `featured` | Whether it shows on the homepage carousel | `true` or `false` |
| `title` | Project name | Plain text |
| `subtitle` | Tagline — **documentaries only** | Optional. Replaces the summary on the card |
| `location` | Where the work happens | Plain text |
| `populations` | Who it serves — **drives the "Serving" filter** | Array. See the list below. Use the exact codes |
| `purpose` | One sentence on why this project exists | Shows as "The Purpose" on the detail page |
| `partner` | The partner org | `{ "name": "...", "url": "..." }`. Leave either as `""` to hide it |
| `population` | Plain-words description of who's served | Optional. Shown on deployment cards |
| `goal` | Funding goal in dollars | Number only — no `$` or commas. **Omit entirely** for ongoing work with no fixed goal |
| `coverImage` | Card and detail-page photo | Upload via `/admin`, or drop into `public/uploads/` and reference as `/uploads/filename.jpg` |
| `summary` | Project overview | 2–3 sentences |
| `whatWeFund` | What the money covers | One sentence or a short list |
| `whyThisPopulation` | Why this group needs this — **deployments** | 1–2 paragraphs. Blank line between paragraphs |
| `whyThisMatters` | Why this story matters — **documentaries** | Same, but for films |
| `media` | Film details — **documentaries only** | `productionPartner`, `targetRelease`, `runtime`, `trailerUrl` |

### Population codes

Use these exact values in `populations`. They control the "Serving" dropdown filter.

| Code | Shows as |
|---|---|
| `trafficking-survivors` | Trafficking Survivors |
| `foster-youth` | Foster Youth |
| `residential-care` | Children in Residential Care |
| `caregivers` | Caregivers & Staff |
| `veterans` | Veterans |

To add a new population, add it to `POPULATIONS` in `src/data/projectMeta.js`. Filters only show options that at least one project actually uses, so unused codes stay hidden.

---

## Common changes

**Mark a project fully funded** — change `"status"` to `"funded"`. The badge updates, the donate button is replaced with a link to other open projects, and the closing CTA disappears.

**Take a project off the homepage** — change `"featured"` to `false`. It stays on `/give` and `/projects`.

**Make a project ongoing with no dollar goal** — delete the `goal` line entirely. The card shows "Ongoing" and the detail page switches to ongoing-initiative language instead of a cost.

**Reorder the carousels** — change `order`. Lower shows first. The gaps (10, 20, 30) exist so you can slot something in at 15 without touching anything else.

---

## Adding a photo

Upload from `/admin` and it's handled for you. By hand:

1. Drop the image into `website/public/uploads/`
2. Reference it as `/uploads/filename.jpg`
3. Landscape works best. **Cap it around 1600px wide** — everything displays at 1600px or less, so bigger is just load time.
4. **Convert HEIC to JPEG first.** No browser renders HEIC; the image will silently not appear.

---

## Before you commit

```bash
npm run audit
```

This builds the site and checks colour contrast, heading order, and tap-target sizes. It should report `0 failing check(s)`.
