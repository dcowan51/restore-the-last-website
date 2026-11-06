#!/usr/bin/env python3
"""Build the Restore the Last story pages from data.json (story-site skill, explainer shape).

  python3 build.py            -> index.html, why.html, moments.html, gift.html, field.html, join.html
  python3 build.py --site "" --out ../website/public/story
                            -> the production copy: root-relative links to the main site, canonical tags

All copy lives in data.json. Pictures are drawn in HTML/SVG (class prefix "rs-"/"st-"), so they stay
sharp, show no children's faces, and never collide with the main site's classes.
"""
import html
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
D = json.loads((HERE / "data.json").read_text())
M, FR, CH = D["meta"], D["front"], D["chain"]
SITE = M["site"]
if "--site" in sys.argv:
    SITE = sys.argv[sys.argv.index("--site") + 1]
OUT = Path(sys.argv[sys.argv.index("--out") + 1]).resolve() if "--out" in sys.argv else HERE
OUT.mkdir(parents=True, exist_ok=True)
CSS = (HERE / "rtl.css").read_text()
JS = (HERE / "reveal.js").read_text() + """
(() => {
  const b = document.querySelector('[data-theme-toggle]');
  if (!b) return;
  b.addEventListener('click', () => {
    const r = document.documentElement;
    const dark = r.dataset.theme === 'dark';
    r.dataset.theme = dark ? 'light' : 'dark';
    try { localStorage.setItem('rtl-theme', r.dataset.theme); } catch (e) {}
  });
})();
"""
MONTHS = "January February March April May June July August September October November December".split()


def e(s):
    return html.escape(str(s or ""), quote=True)


def em(t):
    return re.sub(r"\*(.+?)\*", r"<em>\1</em>", e(t))


def site(path):
    return f"{SITE}{path}"


def date(iso):
    y, m, d = iso.split("-")
    return f"{MONTHS[int(m) - 1]} {int(d)}, {y}"


# ── pictures (decorative: aria-hidden; each beat's text carries the meaning) ──
def house_svg(n_dots=0, w=110):
    dots = ""
    if n_dots:
        pts = [(38, 70), (55, 70), (72, 70), (38, 86), (55, 86), (72, 86), (46, 54), (64, 54)][:n_dots]
        dots = "".join(f'<circle class="st-dot" style="--i:{i}" cx="{x}" cy="{y}" r="5.5"/>' for i, (x, y) in enumerate(pts))
    return (f'<svg viewBox="0 0 110 104" width="{w}" aria-hidden="true"><path class="st-soft" d="M55 6 104 46v54H6V46Z"/>'
            f'<path class="st-line" d="M55 6 104 46v54H6V46Z" style="stroke-width:3"/>{dots}</svg>')


def night(s):
    rest = s.get("rest")
    stars = "".join(f'<circle class="st-win" cx="{x}" cy="{y}" r="1.6"/>' for x, y in [(40, 30), (70, 52), (118, 24), (150, 60), (210, 30), (238, 64), (98, 74)])
    sky = '<rect class="st-sky" x="10" y="10" width="260" height="120" rx="14"/>'
    moon = '<circle class="st-moon" cx="214" cy="48" r="18"/><circle class="st-sky" cx="222" cy="42" r="15"/>'
    if rest:  # dawn: soft light, the figure lying down
        sky = '<rect class="st-soft" x="10" y="10" width="260" height="120" rx="14"/>'
        moon = '<circle class="st-moon" cx="214" cy="120" r="34" opacity=".9"/>'
        stars = ""
    # a bed seen from the side: frame, pillow, and a blanket over someone curled up
    person = ('<rect class="st-ink" x="40" y="172" width="200" height="12" rx="5"/><rect class="st-ink" x="40" y="146" width="10" height="38" rx="3"/>'
              '<rect class="st-ink" x="230" y="158" width="10" height="26" rx="3"/><rect class="st-win" x="56" y="150" width="38" height="16" rx="7"/>'
              '<path class="st-dot" d="M84 172c4-22 22-30 50-30h70c14 0 24 8 26 30Z"/>')
    clock = f'<text class="st-txt" x="140" y="214" text-anchor="middle">{e(s["time"])}</text>'
    return f'<div class="rs-art"><svg class="rs-svg" viewBox="0 0 280 224" aria-hidden="true"><rect class="st-win" x="4" y="4" width="272" height="132" rx="18"/>{sky}{stars}{moon}{person}{clock}</svg></div>'


def feel():
    # the boy's anger rating: 0 (numb) at first, 8 by session four, then calm
    pts = [(30, 150), (110, 150), (190, 40), (290, 128), (370, 140)]
    path = " ".join(f'{"M" if i == 0 else "L"}{x},{y}' for i, (x, y) in enumerate(pts))
    lab = [(30, "First"), (190, "Session 4"), (370, "Later")]
    ann = [(70, 140, "0 · numb"), (190, 28, "8 of 10 · feeling"), (370, 126, "calm")]
    return ('<div class="rs-art"><svg class="rs-svg" viewBox="0 0 400 200" aria-hidden="true">'
            '<line x1="20" x2="390" y1="170" y2="170" stroke="currentColor" opacity=".25"/>'
            f'<path class="st-line" d="{path}"/>'
            + "".join(f'<circle class="st-dot" cx="{x}" cy="{y}" r="7"/>' for x, y in pts[::2] + [pts[2]])
            + "".join(f'<text class="st-sub" x="{x}" y="190" text-anchor="middle">{t}</text>' for x, t in lab)
            + "".join(f'<text class="st-txt" x="{x}" y="{y}" text-anchor="middle">{t}</text>' for x, y, t in ann)
            + "</svg></div>")


def scene(s):
    t = s["type"]
    if t == "big":
        return f'<p class="rs-big{" serif" if s.get("serif") else ""}">{e(s["n"])}</p><p class="rs-lbl">{e(s["l"])}</p>'
    if t == "quote":
        return f'<blockquote class="rs-q">{e(s["q"])}</blockquote><p class="rs-by">{e(s["by"])}</p>'
    if t == "verse":
        return '<div class="rs-verse">' + "".join(f'<p>{e(x["q"])}<span>{e(x["ref"])}</span></p>' for x in s["lines"]) + "</div>"
    if t == "chips":
        rot = [-3, 2, -2, 3, -1, 2]
        return f'<ul class="rs-chips{" calm" if s.get("calm") else ""}">' + "".join(f'<li style="--r:{rot[i % 6]}deg">{e(x)}</li>' for i, x in enumerate(s["items"])) + "</ul>"
    if t == "checks":
        li = "".join(f'<li class="{"" if ok else "no"}"><i>{"✓" if ok else "?"}</i>{e(x)}</li>' for x, ok in s["items"])
        return f'<ul class="rs-checks">{li}</ul>' + (f'<p class="rs-foot">{e(s["foot"])}</p>' if s.get("foot") else "")
    if t == "steps":
        on = s.get("on", -1)
        return '<ol class="rs-steps">' + "".join(f'<li class="{"on" if i == on else ""}"><b>{e(a)}</b><span>{e(b)}</span></li>' for i, (a, b) in enumerate(s["items"])) + "</ol>"
    if t == "card":
        price = f'<p class="rs-price">{e(s["price"])}</p>' if s.get("price") else ""
        return f'<div class="rs-card"><span class="rs-tag">{e(s["tag"])}</span><b>{e(s["title"])}</b><ul>' + "".join(f"<li>{e(r)}</li>" for r in s["rows"]) + f"</ul>{price}</div>"
    if t == "pair":
        return '<div class="rs-pair">' + "".join(f'<div><b>{e(x["n"])}</b><span>{e(x["l"])}</span></div>' for x in s["items"]) + f'</div><p class="rs-foot">{e(s.get("foot", ""))}</p>'
    if t == "names":
        return '<ul class="rs-names">' + "".join(f"<li>{e(x)}</li>" for x in s["items"]) + f'</ul><p class="rs-by">{e(s["foot"])}</p>'
    if t == "homes":
        return '<ul class="rs-homes">' + "".join(f"<li>{house_svg(0)}{e(x)}</li>" for x in s["items"]) + "</ul>"
    if t == "home":
        return f'<div class="rs-art rs-home">{house_svg(8, 200)}</div><p class="rs-big" style="font-size:clamp(36px,6vw,60px)">{e(s["n"])}</p><p class="rs-lbl">{e(s["l"])}</p>'
    if t == "dots":
        n, lit = s["total"], s["lit"]
        return '<div class="rs-dots">' + "".join(f'<i style="--i:{i}" class="{"" if i < lit else "off"}"></i>' for i in range(n)) + f'</div><p class="rs-lbl">{e(s["l"])}</p>'
    if t == "map":
        return '<ul class="rs-map">' + "".join(f"<li><i></i>{e(x)}</li>" for x in s["items"]) + f'<li class="next"><i></i>{e(s["next"])}</li></ul>'
    if t == "night":
        return night(s)
    if t == "feel":
        return feel()
    raise ValueError(t)


# ── page parts ────────────────────────────────────────────────────────────────
def reveal(p):
    beats = p["beats"]
    bs = "".join(
        f'<li class="rb{" on" if i == 0 else ""}" data-scene="{b["scene"]}"><div class="rbx">'
        f'<p class="num">{i + 1} / {len(beats)}</p><h2>{e(b["h"])}</h2><p class="rbt">{em(b["t"])}</p></div></li>'
        for i, b in enumerate(beats))
    used = list(dict.fromkeys(b["scene"] for b in beats))
    sc = "".join(f'<div class="rv-scene{" on" if i == 0 else ""}" data-scene-id="{s}">{scene(p["scenes"][s])}</div>' for i, s in enumerate(used))
    return f'<div class="rv" data-reveal><div class="rv-stage" aria-hidden="true" data-at="0" data-scene="{beats[0]["scene"]}"><div class="rv-vis">{sc}</div></div><ol class="rv-beats">{bs}</ol></div>'


def folds(p):
    if not p.get("folds"):
        return ""
    out = []
    for f in p["folds"]:
        body = "".join(f"<p>{em(x)}</p>" for x in f["a"])
        if f.get("link"):
            body += f'<p><a href="{site(f["link"]["href"])}">{e(f["link"]["t"])} →</a></p>'
        if f.get("mail"):
            body += f'<p><a href="mailto:{M["email"]}?subject={e(f["mail"]).replace(" ", "%20")}">Email {e(M["email"])}</a></p>'
        out.append(f'<details class="rt-fold" id="{f["id"]}"><summary>{e(f["q"])}<span class="x" aria-hidden="true">+</span></summary><div class="b">{body}</div></details>')
    return f'<section class="rt-folds" aria-labelledby="h-deeper"><h2 id="h-deeper">Optional · go deeper</h2>{"".join(out)}</section>'


def handoff(prev, nxt):
    nx = (f'<a class="rt-next" href="{nxt["href"]}"><span class="k">Next · {nxt["n"]} of {len(CH)}</span><b>{e(nxt["t"])}</b>'
          f'<span class="d">{e(nxt["q"])}</span><span class="go" aria-hidden="true">→</span></a>') if nxt else ""
    pv = f'<a class="rt-prev" href="{prev["href"]}"><span aria-hidden="true">←</span> Back: {e(prev["t"])}</a>' if prev else '<a class="rt-prev" href="index.html"><span aria-hidden="true">←</span> Back to the start</a>'
    return f'<nav class="rt-handoff" aria-label="The other pages">{nx}{pv}</nav>'


def hero(p):
    return f"""<section class="rt-hero" id="top" aria-labelledby="h-top">
  <p class="rt-kick">{e(p['label'])}</p>
  <div class="rt-line" aria-hidden="true"></div>
  <h1 id="h-top">{e(p['h1'])}</h1>
  <p class="rt-frame">{e(M['frame'])}</p>
  <a class="rt-cue" href="#story">Scroll down · {len(p['beats'])} steps · 2 min <span aria-hidden="true">↓</span></a>
</section>"""


def story_page(key, extra=""):
    p = D[key]
    i = [c["href"] for c in CH].index(f"{key}.html")
    prev = CH[i - 1] if i else None
    nxt = CH[i + 1] if i + 1 < len(CH) else None
    return (hero(p) + f'<section class="story" id="story" aria-label="{e(p["h1"])} One step at a time.">{reveal(p)}</section>'
            + f'<div class="rt-after">{extra}{folds(p)}</div>' + handoff(prev, nxt))


def canon(fname):
    # only on the real site (built with --site ""): the Netlify subdomain mirrors it
    if SITE:
        return ""
    path = "/story/" + ("" if fname == "index.html" else fname[:-5])
    return f'<link rel="canonical" href="https://restorethelast.org{path}"><meta property="og:url" content="https://restorethelast.org{path}">\n'


def frame(fname, title, desc, main):
    nav = "".join(f'<a href="{c["href"]}"{" aria-current=\"page\"" if c["href"] == fname else ""}><span class="num">{c["n"]}</span><span class="cl">{e(c["t"])}</span></a>' for c in CH)
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<meta property="og:type" content="website"><meta property="og:site_name" content="Restore the Last"><meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(desc)}"><meta name="twitter:card" content="summary">
{canon(fname)}<link rel="icon" type="image/png" href="rtl-logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,700;1,400&family=Lato:wght@400;700&display=swap">
<script>try{{var t=localStorage.getItem('rtl-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}}catch(e){{}}</script>
<style>{CSS}</style>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="rt-top"><div class="rt-bar">
  <a class="rt-brand" href="index.html"><img src="rtl-logo.png" alt="" width="36" height="36"><span>Restore the Last</span></a>
  <nav class="rt-nav" aria-label="The story, page by page">{nav}</nav>
  <button class="rt-theme" type="button" data-theme-toggle aria-label="Switch between dark and light"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16Z" class="fill"/></svg></button>
</div></header>
<main id="main" class="wrap">
{main}
</main>
<footer class="wrap rt-foot">
  <p>Restore the Last is a 501(c)(3) nonprofit (EIN {M['ein']}). Gifts are tax-deductible to the extent allowed by law. We are legally separate from CalmWaves, which makes the technology. Stories shared with permission; names of homes withheld where needed to protect children. As of {date(M['asOf'])} · <a href="{site('/')}">restorethelast.org</a></p>
</footer>
<script>{JS}</script>
</body>
</html>
"""


# ── front page ────────────────────────────────────────────────────────────────
moments = "".join(f'<li class="{"now" if x.get("now") else ""}"><span class="w">{e(x["when"])}</span><span class="x">{em(x["what"])}</span>'
                  + (f'<span class="tag">{e(x["tag"])}</span>' if x.get("tag") else "") + "</li>" for x in FR["moments"])
stakes = "".join(f'<li><div class="rt-c"><p class="k">{e(x["k"])}</p><p class="t">{e(x["t"])}</p></div></li>' for x in FR["stakes"])
paths = "".join(f'<li><a class="rt-c{" go" if x.get("go") else ""}" href="{x["href"]}"><span class="k">{e(x["who"])}</span><b>{e(x["t"])}</b>'
                f'<span class="s">{e(x["s"])} · {e(x["time"])}</span><span class="ar" aria-hidden="true">→</span></a></li>' for x in FR["paths"])
front = f"""<section class="rt-front" id="top" aria-labelledby="h-top">
  <p class="rt-by">Restore the Last · How it works</p>
  <div class="rt-line" aria-hidden="true"></div>
  <h1 id="h-top">{e(FR['h1'])} <span class="b">{e(FR['h1b'])}</span></h1>
  <ol class="rt-tl" aria-label="Where this story stands">{moments}</ol>
  <a class="rt-btn" href="why.html">{e(FR['cta'])} <span aria-hidden="true">→</span></a>
</section>
<section class="rt-short" aria-labelledby="h-sa"><h2 id="h-sa">The short answer</h2>{''.join(f'<p>{em(x)}</p>' for x in FR['short'])}</section>
<section class="rt-sec" aria-labelledby="h-stakes"><h2 id="h-stakes">{e(FR['stakesHead'])}</h2><ul class="rt-g3">{stakes}</ul></section>
<section class="rt-sec" aria-labelledby="h-paths"><h2 id="h-paths">{e(FR['pathsHead'])}</h2><ul class="rt-g2">{paths}</ul>
  <p class="rt-small">Ready now? <a href="{site('/give')}">Give</a> · Run a home or program? <a href="{site('/apply')}">Apply for funding</a> · Considering the board? <a href="join.html#board">Read this</a></p>
</section>"""

J = D["join"]
close = f"""<section class="rt-close" aria-labelledby="h-close"><h2 id="h-close">{e(J['closeHead'])}</h2><p>{e(J['closeSub'])}</p>
  <div class="row"><a class="rt-btn" href="{site('/give')}">Give now <span aria-hidden="true">→</span></a><a class="rt-btn ghost" href="{site('/apply')}">Apply for your home</a><a class="rt-btn ghost" href="{site('/projects')}">See the projects</a></div></section>"""

PAGES = {
    "index.html": ("How it works · Restore the Last", " ".join(re.sub(r"\*", "", x) for x in FR["short"]), front),
    "why.html": ("The story · Restore the Last", "Rescued is not the same as restored. Why a father and son started Restore the Last.", story_page("why")),
    "moments.html": ("Restoration · Restore the Last", "A first night of sleep, a teenager who starts to talk, a caregiver with patience left. What restoration looks like.", story_page("moments")),
    "gift.html": ("Your gift · Restore the Last", "How a gift becomes a calm night: a named home, a published cost, trained staff, and reports from the field.", story_page("gift")),
    "field.html": ("The proof · Restore the Last", "La Casa de mi Padre in El Salvador, Thrive and Rite Path in Arizona: where it's already happening.", story_page("field")),
    "join.html": ("Your place · Restore the Last", "Give, equip your home, pray, or follow the work. There's a place for you in this.", story_page("join", close)),
}
for fn, (title, desc, main) in PAGES.items():
    (OUT / fn).write_text(frame(fn, title, desc, main))
    print(fn)
if OUT != HERE:
    import shutil
    shutil.copy2(HERE / "rtl-logo.png", OUT / "rtl-logo.png")
