# How to Add and Manage Projects

Projects live in one file: `src/data/projects.json`

Add a new project by copying the template below into the array. The website automatically generates a new page and card — no code changes needed.

---

## Template

```json
{
  "slug": "your-project-url-name",
  "title": "Project Title Here",
  "location": "City, Country",
  "status": "seeking-funding",
  "population": "Who is being served (e.g. Foster youth, Trafficking survivors)",
  "goal": 10000,
  "raised": 0,
  "coverImage": "/your-photo-filename.jpg",
  "whatWeFund": "e.g. 2 CalmWaves calm boxes, 3-day practitioner training, 12 months of remote support and outcome tracking",
  "summary": "2–3 sentences about the project. What facility, what location, why now. This shows on both the card and the detail page.",
  "whyThisPopulation": "1–2 paragraphs on why this population needs this. What trauma looks like for them, why traditional therapy falls short, why neurofeedback is the right tool."
}
```

---

## Field Reference

| Field | What it is | Rules |
|---|---|---|
| `slug` | The URL for the project page | Lowercase, hyphens only, no spaces. e.g. `philippines-neurofeedback` |
| `title` | Project name shown on cards and detail page | Plain text |
| `location` | City, Country or City, State | Plain text |
| `status` | Funding status badge | Must be exactly: `"seeking-funding"`, `"partially-funded"`, or `"funded"` |
| `population` | Who is being served | Short phrase, shown as a label |
| `goal` | Total funding goal in dollars | Number only — no `$` or commas. e.g. `14000` |
| `raised` | Amount raised so far | Number only. Update this as gifts come in. e.g. `4500` |
| `coverImage` | Photo shown on the card and detail page | Drop the file in the `public/` folder, then reference as `/filename.jpg` |
| `whatWeFund` | What the money specifically covers | One sentence or short list — calm boxes, training, support |
| `summary` | Project overview | 2–3 sentences. Shown on the card (truncated) and top of detail page |
| `whyThisPopulation` | Why this group needs this intervention | 1–2 paragraphs. Only shown on the detail page |

---

## Updating the Progress Bar

When a donor funds part of a project, update the `raised` field in `projects.json`:

```json
"raised": 4500
```

The progress bar and "X% funded" label update automatically on the next deploy.

---

## Marking a Project as Funded

Change the `status` field to `"funded"`:

```json
"status": "funded"
```

The badge on the card will update and the "still needed" line will disappear.

---

## Adding a Photo

1. Drop the image file into the `website/public/` folder
2. Reference it in the project as `/filename.jpg` (or `.png`, `.jpeg`)
3. Recommended size: at least 1200px wide, landscape orientation works best

---

## File Structure Example

```json
[
  {
    "slug": "project-one",
    "title": "First Project",
    ...
  },
  {
    "slug": "project-two",
    "title": "Second Project",
    ...
  }
]
```

- Each project is separated by a comma
- The last project has no trailing comma
- The whole file is wrapped in `[` `]`
