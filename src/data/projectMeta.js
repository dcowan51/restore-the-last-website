// Single source of truth for how project taxonomy renders. Cards, filters, and
// detail pages all read from here.
//
// The taxonomy VALUES are content, not code: types, statuses, and serving
// categories live in the JSON files next to this one and are edited from
// /admin under Site Settings. Adding an entry there makes it appear in the
// project editor's pickers and the /projects filters on the next deploy —
// no code change needed.
//
// Only the STYLING stays code-side. Colour pairs are chosen against the light
// card backgrounds only (white, offwhite, light). The `gold`/`gold-deep` split
// in tailwind.config.mjs exists because no single gold clears WCAG AA on both
// light and `deep` — badges live on light, so they always take `gold-deep`.
// An entry added from the CMS gets NEUTRAL_BADGE until we assign it a colour
// here; layout special-casing (the documentary film layout, `funded` closing a
// project) also keys off the built-in values, so a new type renders like a
// deployment and a new status behaves like an open project.
import typesFile from './projectTypes.json';
import statusesFile from './projectStatuses.json';
import populationsFile from './populations.json';

const NEUTRAL_BADGE = 'text-deep bg-deep/10 border-deep/20';

const TYPE_BADGES = {
  deployment: 'text-gold-deep bg-gold-deep/10 border-gold-deep/20',
  documentary: 'text-primary bg-primary/10 border-primary/20',
  training: 'text-deep bg-deep/10 border-deep/20',
  research: 'text-deep bg-deep/10 border-deep/20',
};

const STATUS_BADGES = {
  active: 'text-green-800 bg-green-50 border-green-200',
  open: 'text-gold-deep bg-gold-deep/10 border-gold-deep/20',
  'in-production': 'text-primary bg-primary/10 border-primary/20',
  funded: 'text-green-800 bg-green-50 border-green-200',
};

export const TYPES = Object.fromEntries(
  (typesFile.types || []).map(({ value, label, plural }) => [
    value,
    { label, plural: plural || label, badge: TYPE_BADGES[value] || NEUTRAL_BADGE },
  ])
);

export const STATUSES = Object.fromEntries(
  (statusesFile.statuses || []).map(({ value, label }) => [
    value,
    { label, badge: STATUS_BADGES[value] || NEUTRAL_BADGE },
  ])
);

export const POPULATIONS = Object.fromEntries(
  (populationsFile.categories || []).map(({ value, label }) => [value, { label }])
);

// A value deleted from settings while a project still references it should
// soften to a readable label, not break the page — the CMS pickers already
// prevent typos at entry time, so a miss here is always a deliberate edit.
const prettify = (value) =>
  String(value)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

export const populationLabel = (value) => POPULATIONS[value]?.label ?? prettify(value);

// Filters only offer values something actually uses, so the UI stays honest as
// the project list grows instead of showing empty categories on day one.
export function activeFacets(projects) {
  const used = (key, source) =>
    Object.entries(source)
      .filter(([value]) =>
        projects.some((p) =>
          key === 'populations'
            ? (p.populations || []).includes(value)
            : p[key] === value
        )
      )
      .map(([value, meta]) => ({ value, ...meta }));

  return {
    types: used('type', TYPES),
    statuses: used('status', STATUSES),
    populations: used('populations', POPULATIONS),
  };
}

export const typeMeta = (p) =>
  TYPES[p.type] || { label: prettify(p.type), plural: prettify(p.type), badge: NEUTRAL_BADGE };
export const statusMeta = (p) =>
  STATUSES[p.status] || { label: prettify(p.status), badge: NEUTRAL_BADGE };
