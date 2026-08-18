// Single source of truth for how project taxonomy renders. Cards, filters, and
// detail pages all read from here, so adding a new type or population means
// editing one object rather than hunting through three templates.
//
// Colour pairs are chosen against the light card backgrounds only (white,
// offwhite, light). The `gold`/`gold-deep` split in tailwind.config.mjs exists
// because no single gold clears WCAG AA on both light and `deep` — badges live
// on light, so they always take `gold-deep`.

export const TYPES = {
  deployment: {
    label: 'Deployment',
    plural: 'Deployments',
    badge: 'text-gold-deep bg-gold-deep/10 border-gold-deep/20',
  },
  documentary: {
    label: 'Documentary',
    plural: 'Documentary',
    badge: 'text-primary bg-primary/10 border-primary/20',
  },
  training: {
    label: 'Training',
    plural: 'Training',
    badge: 'text-deep bg-deep/10 border-deep/20',
  },
  research: {
    label: 'Research',
    plural: 'Research',
    badge: 'text-deep bg-deep/10 border-deep/20',
  },
};

export const STATUSES = {
  active: {
    label: 'Active',
    badge: 'text-green-800 bg-green-50 border-green-200',
  },
  open: {
    label: 'Open',
    badge: 'text-gold-deep bg-gold-deep/10 border-gold-deep/20',
  },
  'in-production': {
    label: 'In Production',
    badge: 'text-primary bg-primary/10 border-primary/20',
  },
  funded: {
    label: 'Fully Funded',
    badge: 'text-green-800 bg-green-50 border-green-200',
  },
};

export const POPULATIONS = {
  'trafficking-survivors': { label: 'Trafficking Survivors' },
  'foster-youth': { label: 'Foster Youth' },
  'residential-care': { label: 'Children in Residential Care' },
  caregivers: { label: 'Caregivers & Staff' },
  veterans: { label: 'Veterans' },
};

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

export const typeMeta = (p) => TYPES[p.type] || TYPES.deployment;
export const statusMeta = (p) => STATUSES[p.status] || STATUSES.open;
