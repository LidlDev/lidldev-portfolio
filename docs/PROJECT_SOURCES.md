# Project content provenance

Reviewed on 14 October 2026. Source inspection establishes project structure and implemented code, not public-release status or independent verification of those applications.

| Portfolio project | Local source reference | GitHub baseline | Evidence used |
| --- | --- | --- | --- |
| Cadence | ../projects/cadence-mobile | 87b9c58 | package.json, app.json, dashboard/runs/strength/nutrition tabs, lib/vdot.ts, lib/healthkit.ts, original orange logo |
| PyrOS (Local Brain) | ../projects/local-brain | ddea4ac | README.md, docs/WORK_PLAN.md, package.json: Markdown folder workflow, File System Access API, derived search/graph/templates/task boards |
| Spike! | Original portfolio source | 01a7efd | Existing local interface images and project description; no invented outcomes |
| Pyreus | Original portfolio source | 01a7efd | Existing product screenshots; presented as earlier work, distinct from PyrOS |
| Uncharted | Original portfolio source | 01a7efd | Existing hero/logo and project direction; placeholder live link removed |

Cadence and Local Brain remain independent Git clones with their original origin remotes. Their dependencies were not installed and their apps were not modified or independently tested as part of the portfolio redesign. Cadence references a sibling shared/ package not included in its standalone repository; running it requires its wider project context.

Cadence uses its original orange mark. PyrOS uses an exact copy of public/pyros.svg, its app favicon; the in-app BrandMark uses the same flame paths. Existing interface screenshots are retained/optimized for the other projects. Agent and the unverified Chess placeholder are omitted from the rebuilt project list.


Public link check: Cadence and Local Brain cloned successfully; pyros.lidldev.com returned HTTP 200. SpikeIOS, Pyreus and Uncharted repository API lookups returned HTTP 404 on 14 October 2026, so their public repository buttons are omitted. This may reflect private or unavailable repositories; no assumption is made about their ownership/status.

Content expansion on 14 October 2026: Cadence infrastructure reviewed in lib/supabase.ts, lib/cache.ts, dashboard weekly summaries and supabase/functions; PyrOS technology reviewed in package.json, docs/architecture.md and its current local work plan. The source clones may contain the user’s ongoing work and were left untouched. Earlier Spike, Pyreus and Uncharted architecture comes from src/data/projects.ts at original portfolio commit 01a7efd; public copy identifies this as documented earlier work rather than a new verification of those apps. Skills represent technologies used or documented across these projects and this portfolio, without expertise ratings.
