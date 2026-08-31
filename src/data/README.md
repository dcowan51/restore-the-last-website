# src/data

`el-salvador.json` is **generated, not written**. It is the output of the pilot
analysis that lives outside this repo, in the El Salvador Pilot Project folder:

    python3 analysis/analyze.py     # -> analysis/out/numbers.json -> src/data/el-salvador.json

The primary source is Tiffany Lewis's tracking workbook
(`LCDMP Neurofeedback Oct 2022 anonymous.xlsx`, sheet "Summary (2)"), in which every
session carries an explicit `x` attendance marker. The computed session sums reproduce
that sheet's own totals exactly (425 / 222 / 185 / 146 / 180 / 70 / 14).

**Do not hand-edit this file, and do not retype its figures into page copy.** Both
`/impact/el-salvador` and the homepage proof band read from it, which is what keeps them
from drifting apart. If a number looks wrong, fix the analysis and regenerate.

One trap worth recording: an earlier Airtable pivot export (`ParticipantsGrid view2.csv`)
padded absent sessions with `0`, which made participants who stopped attending look like
participants whose symptoms had resolved. Figures derived from it overstated both the
improvement rate and the endpoint. Never use it for session-level or endpoint numbers.
