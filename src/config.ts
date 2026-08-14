// Where donations are processed. Crowded is both the giving platform and the
// bank account behind it — swap this one value if the collection link changes.
export const DONATE_URL = 'https://collect.crowded.me/collection/441fe615-80d6-49c2-a091-a2d1a9e9e4a1';

export const CONTACT_EMAIL = 'dallas@restorethelast.org';

// Physical mailing address. Required in the footer of every marketing email under
// CAN-SPAM, and shown on the privacy page so people have a postal route for data
// requests. Fill this in from the 501(c)(3) filing — while it's empty, the privacy
// page simply omits the postal line rather than showing a placeholder.
export const MAILING_ADDRESS = '';

// Last substantive revision to the privacy policy. Update whenever the policy changes.
export const PRIVACY_UPDATED = 'August 12, 2026';

// Kit (formerly ConvertKit) form ID for the Field Notes newsletter. Find it in Kit
// under Grow → Landing Pages & Forms → your form → Embed → HTML: the number in
// `action="https://app.kit.com/forms/1234567/subscriptions"`.
//
// Use the Restore the Last Kit account (dallas@restorethelast.org), NOT the CalmWaves
// one — Kit keeps a single subscriber list per account, so sharing would commingle
// donor data with a for-profit list and let a CalmWaves unsubscribe silently kill
// someone's donor updates.
//
// While this is empty, the signup forms fall back to Netlify Forms, so signups are
// still captured (Netlify dashboard → Forms → "newsletter") — they just won't get a
// welcome email until Kit is connected.
export const NEWSLETTER_FORM_ID = '9802535';
