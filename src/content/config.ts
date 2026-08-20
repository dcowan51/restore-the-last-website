import { defineCollection, z } from 'astro:content';

/**
 * One project = one JSON file in src/content/projects/, and the filename is the
 * URL slug. This schema is the contract the admin UI at /admin fills in, and it
 * runs at build time: a bad status, a missing summary, or a typo'd population
 * fails the build naming the file and field, instead of silently rendering a
 * fallback the way the old plain-JSON file did.
 */

export const PROJECT_TYPES = ['deployment', 'documentary', 'training', 'research'] as const;
export const PROJECT_STATUSES = ['open', 'active', 'in-production', 'funded'] as const;

const projects = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    type: z.enum(PROJECT_TYPES),
    status: z.enum(PROJECT_STATUSES),

    // Controls the homepage carousel and the order everywhere else. Folder
    // collections have no inherent order, so it has to be explicit.
    featured: z.boolean().default(false),
    order: z.number().default(100),

    location: z.string(),
    // Not an enum: the category list is CMS-managed (src/data/populations.json,
    // edited under Site Settings in /admin). The relation picker there prevents
    // typos at entry time, and a category deleted from settings must soften to
    // a fallback label (see projectMeta.js) rather than stop the site building.
    populations: z.array(z.string()).default([]),
    purpose: z.string().optional(),
    partner: z
      .object({ name: z.string().default(''), url: z.string().default('') })
      .default({ name: '', url: '' }),

    coverImage: z.string(),
    summary: z.string(),
    whatWeFund: z.string(),

    // Omit `goal` entirely for ongoing work with no finish line — the card
    // shows "Ongoing" and the detail page drops the cost figure.
    goal: z.number().positive().optional(),

    // Optional per-project giving link (its own Crowded collection). When set,
    // the detail page's Give buttons send donors there as a designated gift
    // instead of the shared general-fund link in src/config.ts.
    giveUrl: z.string().url().optional(),

    // Deployment-shaped fields
    population: z.string().optional(),
    whyThisPopulation: z.string().optional(),

    // Film-shaped fields
    subtitle: z.string().optional(),
    whyThisMatters: z.string().optional(),
    media: z
      .object({
        productionPartner: z.string().default(''),
        targetRelease: z.string().default(''),
        runtime: z.string().default(''),
        trailerUrl: z.string().default(''),
      })
      .optional(),
  }),
});

export const collections = { projects };
