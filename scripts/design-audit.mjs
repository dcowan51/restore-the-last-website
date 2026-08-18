// Design audit — contrast, tap targets, heading order, and left-edge alignment.
//
// Runs against the built site in dist/ using jsdom + a tiny hand-rolled colour
// model. It deliberately does NOT need a browser: the checks it makes (colour
// pairs, heading order, tap-target padding maths) are all derivable from the
// markup plus the Tailwind theme, so this stays fast enough to run on every commit.
//
//   node scripts/design-audit.mjs
//
// Alignment is the one thing it can't do headlessly — container widths depend on
// real layout — so that check lives in the browser pass instead. See PROJECTS.md.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;

// ---------------------------------------------------------------- colour utils

const HEX = {
  primary: '#712BBE', deep: '#3A1470', medium: '#9040D0', light: '#EDE0FF',
  gold: '#E07A5F', 'gold-deep': '#A84018', dark: '#1C1C2E', body: '#3D3D4F',
  offwhite: '#FAFAF7', white: '#FFFFFF',
};

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const lum = (c) => {
  const [r, g, b] = c.map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)];
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};
const over = (fg, bg, alpha) => fg.map((v, i) => v * alpha + bg[i] * (1 - alpha));

// ------------------------------------------------------------------- the pairs
// Every foreground/background combination the site actually renders, with the
// smallest font size it appears at. Large text (>=24px, or >=18.66px bold) only
// needs 3:1 under WCAG AA; everything else needs 4.5:1.

const PAIRS = [
  // token           on            alpha  px    bold   where
  ['gold-deep',     'white',        1,    12,  true,  '.label.text-gold-deep'],
  ['gold-deep',     'offwhite',     1,    12,  true,  '.label on bg-offwhite'],
  ['gold-deep',     'light',        1,    12,  true,  '.label on bg-light'],
  ['white',         'gold-deep',    1,    14,  true,  '.btn-gold fill'],
  ['gold',          'deep',         1,    12,  true,  'text-gold in footer'],
  ['white',         'deep',         0.7,  12,  false, 'text-white/70 on deep'],
  ['white',         'deep',         0.6,  16,  false, 'placeholder white/60'],
  ['white',         'deep',         0.4,  12,  false, 'separator white/40 (decorative)'],
  ['body',          'white',        0.8,  16,  false, 'placeholder body/80'],
  ['body',          'white',        1,    16,  false, 'body copy'],
  ['primary',       'white',        1,    12,  true,  '.label.text-primary'],
  ['white',         'primary',      1,    14,  true,  '.btn-primary fill'],
  ['dark',          'white',        1,    16,  false, 'headings'],
];

const contrastFindings = [];
for (const [fgTok, bgTok, alpha, px, bold, where] of PAIRS) {
  const bg = rgb(HEX[bgTok]);
  const fg = alpha === 1 ? rgb(HEX[fgTok]) : over(rgb(HEX[fgTok]), bg, alpha);
  const large = px >= 24 || (px >= 18.66 && bold);
  const need = large ? 3.0 : 4.5;
  const ratio = contrast(fg, bg);
  contrastFindings.push({
    where, ratio: +ratio.toFixed(2), need, px,
    pass: ratio >= need,
    decorative: where.includes('decorative'),
  });
}

// ---------------------------------------------------------------- html walkers

// The admin editor is a third-party app shell -- it renders itself at runtime,
// so its built HTML is an empty <body> with a script tag. Auditing it reports a
// missing h1 that no amount of editing on our side could fix.
const SKIP_DIRS = new Set(['admin']);

const pages = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (!SKIP_DIRS.has(name)) walk(p);
    } else if (name.endsWith('.html')) pages.push(p);
  }
})(DIST);

const headingFindings = [];
const tapFindings = [];
const usageFindings = [];

// Checking the palette isn't enough — a token can be defined correctly and still
// applied to the wrong background. These patterns are the combinations that were
// actually failing before Phase A, so they double as regression guards.
const BANNED = [
  [/class="[^"]*\btext-gold\b(?!-deep)/, 'text-gold on a light background (use text-gold-deep)'],
  [/class="[^"]*text-body\/(40|50|60|70)\b/, 'text-body below /80 (fails AA on white and bg-light)'],
  [/class="[^"]*text-white\/(20|30)\b/, 'text-white below /40 on deep'],
  // The Phase B regression: a width override on the container itself shrinks the
  // rail AND re-centres it, so the left edge moves section to section. Width
  // belongs on a nested, left-aligned child instead.
  [/class="container-narrow[^"]*\bmax-w-/, 'width override on .container-narrow (nest it instead — it breaks the rail)'],
];

for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const page = '/' + relative(DIST, file).replace(/index\.html$/, '').replace(/\.html$/, '');

  // Strip everything sitting on `deep` before the banned-token scan — the footer
  // and any bg-deep section. There the lighter gold is the correct choice and
  // passes at 4.7:1; only light backgrounds need gold-deep.
  const body = html
    .replace(/<footer[\s\S]*?<\/footer>/g, '')
    .replace(/<section[^>]*class="[^"]*bg-deep[^"]*"[\s\S]*?<\/section>/g, '');
  for (const [re, why] of BANNED) {
    if (re.test(body)) usageFindings.push({ page, why });
  }

  // A capped block whose content is centred needs `mx-auto`, or it sits at the
  // left of the rail with its text centred inside it — which reads as the whole
  // block being off-centre. Two ways that happens: `text-center` on the block
  // itself, or on an ancestor section.
  const uncentred = (cls) => /\bmax-w-/.test(cls) && !/\bmx-auto\b/.test(cls);
  for (const [, cls] of html.matchAll(/<div class="([^"]*\btext-center\b[^"]*)"/g)) {
    if (uncentred(cls)) usageFindings.push({ page, why: `centred block missing mx-auto: "${cls.slice(0, 44)}"` });
  }
  for (const [, secCls, inner] of html.matchAll(/<section[^>]*class="([^"]*)"[^>]*>([\s\S]*?)<\/section>/g)) {
    if (!/\btext-center\b/.test(secCls)) continue;
    for (const [, cls] of inner.matchAll(/<div class="([^"]*)"/g)) {
      if (uncentred(cls)) usageFindings.push({ page, why: `capped block in a text-center section missing mx-auto: "${cls.slice(0, 40)}"` });
    }
  }

  // heading order
  const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => +m[1]);
  const h1s = levels.filter((l) => l === 1).length;
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] - levels[i - 1] > 1) {
      headingFindings.push({ page, issue: `h${levels[i - 1]} -> h${levels[i]}` });
    }
  }
  if (h1s !== 1) headingFindings.push({ page, issue: `${h1s} h1 tags (want exactly 1)` });

  // Tap targets. Checking only that *some* padding exists passed `py-2`, which
  // at text-sm renders 36px -- under the 44px touch guidance, and it shipped
  // that way across the nav and footer. So estimate the real height instead:
  // line-height for the text size, plus vertical padding, and require 44.
  //
  // Only controls that already declare padding are measured. A link with none
  // is almost always inline inside a sentence, which the guidance exempts and
  // which would break line spacing if forced to 44px.
  const LINE_H = { 'text-xs': 16, 'text-sm': 20, 'text-base': 24, 'text-lg': 28, 'text-xl': 28 };
  const controls = [...html.matchAll(/<(a|button)\s[^>]*class="([^"]*)"[^>]*>/g)];
  for (const [, tag, cls] of controls) {
    if (/\bhidden\b|sr-only/.test(cls)) continue;
    if (/\bbtn-/.test(cls)) continue;                        // btn-* ship px-8 py-3
    if (/\bh-\d|\bmin-h-|\baspect-/.test(cls)) continue;      // height set explicitly

    const py = cls.match(/(?:^|\s)(?:py|p)-(\d+(?:\.\d+)?)/);
    if (!py) continue;                                       // inline prose link -- exempt

    const sizeKey = Object.keys(LINE_H).find((k) => new RegExp(`(^|\\s)${k}(\\s|$)`).test(cls));
    const line = LINE_H[sizeKey] ?? 24;
    const height = line + parseFloat(py[1]) * 4 * 2;
    if (height < 44) {
      tapFindings.push({ page, tag, cls: `${Math.round(height)}px — ${cls.slice(0, 44)}` });
    }
  }
}

// ------------------------------------------------------------------- reporting

const fail = (xs) => xs.filter((x) => !x.pass && !x.decorative);
const line = (s) => console.log(s);

line('\n\x1b[1mCONTRAST\x1b[0m  (WCAG AA: 4.5:1 normal, 3:1 large)');
for (const f of contrastFindings) {
  const mark = f.pass ? '\x1b[32mPASS\x1b[0m' : (f.decorative ? '\x1b[33mDECO\x1b[0m' : '\x1b[31mFAIL\x1b[0m');
  line(`  ${mark}  ${String(f.ratio).padStart(5)}:1  need ${f.need}  ${f.where}`);
}

line('\n\x1b[1mHEADING ORDER\x1b[0m');
if (!headingFindings.length) line('  \x1b[32mPASS\x1b[0m  no skipped levels, exactly one h1 per page');
else for (const f of headingFindings) line(`  \x1b[31mFAIL\x1b[0m  ${f.page}  ${f.issue}`);

line('\n\x1b[1mTAP TARGETS\x1b[0m  (padded controls must reach 44px)');
if (!tapFindings.length) line('  \x1b[32mPASS\x1b[0m  all padded controls reach 44px');
else for (const f of tapFindings.slice(0, 12)) line(`  \x1b[31mFAIL\x1b[0m  ${f.page}  <${f.tag}> ${f.cls}`);

line('\n\x1b[1mTOKEN USAGE\x1b[0m  (right colour, wrong background)');
if (!usageFindings.length) line('  \x1b[32mPASS\x1b[0m  no failing token/background combinations');
else for (const f of usageFindings) line(`  \x1b[31mFAIL\x1b[0m  ${f.page}  ${f.why}`);

const failures = fail(contrastFindings).length + headingFindings.length
  + tapFindings.length + usageFindings.length;
line(`\n${failures ? '\x1b[31m' : '\x1b[32m'}${failures} failing check(s)\x1b[0m across ${pages.length} pages\n`);
process.exit(failures ? 1 : 0);
