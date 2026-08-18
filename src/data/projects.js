import { getCollection } from 'astro:content';

/**
 * Loads every project as the flat shape the cards and detail pages expect.
 *
 * The filename is the slug (so the CMS naming a file names the URL), and
 * `order` drives sequence — a folder collection has no inherent order, and
 * alphabetical would put Phoenix ahead of the flagship deployment.
 */
export async function getProjects() {
  const entries = await getCollection('projects');
  return entries
    .map((entry) => ({ slug: entry.id.replace(/\.json$/, ''), ...entry.data }))
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}
