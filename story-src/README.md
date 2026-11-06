# Story section source (`/story/`)

The "How it works" story pages at restorethelast.org/story/ are plain HTML built from here.
This folder is outside `public/`, so none of it is served.

- Change wording in `data.json` only. Styles: `rtl.css`. Scroll stories: `reveal.js`.
- Rebuild from the repo root: `python3 story-src/build.py --site "" --out public/story`
- Preview copy (links point at restorethelast.org): `python3 story-src/build.py` writes into this folder; don't commit those.
