import { defineCollection, z } from 'astro:content';

/**
 * One project = one JSON file in src/content/projects/, and the filename is the
 * URL slug. This schema is the contract the admin UI at /admin fills in, and it
 * runs at build time: a bad status, a missing summary, or a typo'd population
 * fails the build naming the file and field, instead of silently rendering a
 * fallback the way the old plain-JSON file did.
 */

// Sveltia writes what the editor holds: a blank URL field as "", a collapsed
// empty object as null, an untouched multi-select as null. Normalize those to
// "absent" before validating, so leaving an optional field empty in /admin can
// never fail the build. (This exact case broke deploys on 2026-08-20: a new
// project saved with giveUrl "" and media null was rejected by the schema.)
const blankAsUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === '' || v === null ? undefined : v), schema);

const projects = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    // Not enums: types and statuses are CMS-managed (src/data/projectTypes.json
    // and projectStatuses.json, edited under Site Settings in /admin). The
    // relation pickers there prevent typos at entry time, and a value deleted
    // from settings must soften to a fallback label (see projectMeta.js)
    // rather than stop the site building.
    type: z.string(),
    status: z.string(),

    // Draft = saved but invisible: getProjects() drops it, so it appears on no
    // page and gets no URL. The commit still lands and deploys like any save.
    draft: z.boolean().default(false),

    // Controls the homepage carousel and the order everywhere else. Folder
    // collections have no inherent order, so it has to be explicit.
    featured: z.boolean().default(false),
    order: z.number().default(100),

    location: z.string(),
    // Not an enum: the category list is CMS-managed (src/data/populations.json,
    // edited under Site Settings in /admin). The relation picker there prevents
    // typos at entry time, and a category deleted from settings must soften to
    // a fallback label (see projectMeta.js) rather than stop the site building.
    populations: blankAsUndefined(z.array(z.string()).default([])),
    purpose: z.string().optional(),
    partner: blankAsUndefined(
      z
        .object({ name: z.string().default(''), url: z.string().default('') })
        .default({ name: '', url: '' })
    ),

    coverImage: z.string(),
    summary: z.string(),
    whatWeFund: z.string(),

    // Omit `goal` entirely for ongoing work with no finish line — the card
    // shows "Ongoing" and the detail page drops the cost figure.
    goal: blankAsUndefined(z.number().positive().optional()),

    // Dollars raised toward the goal, updated by hand from /admin. The site
    // derives the percentage (so a changed goal never leaves a stale percent)
    // and shows a progress bar wherever the goal appears. Absent = no bar.
    raised: blankAsUndefined(z.number().min(0).optional()),

    // Optional per-project giving link (its own Crowded collection). When set,
    // the detail page's Give buttons send donors there as a designated gift
    // instead of the shared general-fund link in src/config.ts.
    giveUrl: blankAsUndefined(z.string().url().optional()),

    // Deployment-shaped fields
    population: z.string().optional(),
    whyThisPopulation: z.string().optional(),

    // Film-shaped fields
    subtitle: z.string().optional(),
    whyThisMatters: z.string().optional(),
    media: blankAsUndefined(
      z
        .object({
          productionPartner: z.string().default(''),
          targetRelease: z.string().default(''),
          runtime: z.string().default(''),
          trailerUrl: z.string().default(''),
        })
        .optional()
    ),
  }),
});

export const collections = { projects };
