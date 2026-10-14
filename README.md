# LidlDev portfolio

A personal projects portfolio for Harry / LidlDev, rebuilt around orange branding, fluid typography, light/dark themes and a lazy-loaded Three.js sculpture.

[Running plan and work log](docs/REDESIGN.md) · [Project sources](docs/PROJECT_SOURCES.md) · [Cloudflare Pages rollout](docs/CLOUDFLARE.md)

## Local development

Portable Git and Node live in the parent workspace's .tools folder. The launchers require no administrator elevation, global installation or PowerShell policy change.

From this checkout:

```powershell
.\scripts\run.cmd ci
.\scripts\run.cmd run dev
.\scripts\run.cmd run build
.\scripts\run.cmd run preview
.\scripts\run.cmd run test:browser
```

Development: http://127.0.0.1:5173. Production preview: http://127.0.0.1:4173. Browser checks use installed Microsoft Edge; start the production preview first. Ordinary npm commands also work when Node is on PATH.

The frontend builds to dist/. Cloudflare Pages build command: npm run build; output: dist; Node: 24. No environment secrets, Supabase, OAuth or email service are required. Contact opens the visitor's email application.

Project source clones live alongside the portfolio in ../projects/cadence-mobile and ../projects/local-brain. They are independent repositories and are not embedded in this site.

The Agent app and scanning endpoints are removed. /agent explains the retirement; Spike's product policies remain at their existing URLs. sw.js is a retirement worker for old cache-first clients, not a new offline application.
