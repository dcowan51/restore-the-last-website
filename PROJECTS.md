# How to Add and Manage Projects

Projects live in one file: `src/data/projects.json`

Add a project by copying a template below into the array. Everything else is automatic — the card, the detail page, the filters, the homepage carousel, and the give-page carousel all read from this one file. No code changes needed.

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
  "slug": "your-project-url-name",
  "type": "deployment",
  "status": "open",
  "featured": true,
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
  "coverImage": "/your-photo-filename.jpg",
  "summary": "2–3 sentences. What facility, what location, why now. Shows on the card and at the top of the detail page.",
  "whatWeFund": "What the money specifically covers — calm boxes, training, support.",
  "whyThisPopulation": "1–2 paragraphs on why this population needs this. Separate paragraphs with a blank line (\\n\\n)."
}
```

## Template — a documentary or film

```json
{
  "slug": "your-film-url-name",
  "type": "documentary",
  "status": "in-production",
  "featured": true,
  "title": "Film Title",
  "subtitle": "One evocative line. Shows on the card instead of the summary.",
  "location": "Where it's filmed",
  "populations": ["foster-youth", "residential-care"],
  "purpose": "One sentence on why this film exists.",
  "partner": { "name": "Production Company", "url": "" },
  "goal": 10000,
  "coverImage": "/your-still.jpg",
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
| `slug` | The URL for the project page | Lowercase, hyphens only, no spaces |
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
| `coverImage` | Card and detail-page photo | Drop the file in `public/`, then reference as `/filename.jpg` |
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

**Reorder the carousels** — projects appear in the order they're listed in the file. Move an entry up to move it up.

---

## Adding a photo

1. Drop the image into `website/public/`
2. Reference it as `/filename.jpg` (or `.png`, `.jpeg`)
3. At least 1200px wide, landscape works best

---

## Before you commit

```bash
npm run audit
```

This builds the site and checks colour contrast, heading order, and tap-target sizes. It should report `0 failing check(s)`.
