# Cloudflare Pages setup and release

The Pages project has not been created. GitHub publication is authorized; production deployment and domain changes are on hold. Work is on `redesign/portfolio`; `main` remains unchanged until a separately approved release.

## 1. Review the GitHub branch

Review https://github.com/LidlDev/lidldev-portfolio/tree/redesign/portfolio and its GitHub Actions checks. Local strict typecheck/build and all 14 Edge browser checks passed on 14 October 2026. Hosted CI, real-device checks and a Cloudflare preview still need verification.

The portable tooling lives in the parent workspace, outside the repository. Cloudflare uses its own Node runtime and does not need those Windows tools.

## 2. Prepare a new Pages project

In Cloudflare, open **Workers & Pages > Create application > Pages > Connect to Git**. Authorize GitHub for `LidlDev/lidldev-portfolio`, select that repository and continue to build setup.

| Setting | Value |
| --- | --- |
| Project name | `lidldev-portfolio` (or another available name) |
| Production branch | `main` |
| Framework preset | Vite, or None with the explicit settings below |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | Leave blank: repository root |
| Environment variable | `NODE_VERSION=24`, production and preview |

No Supabase, Gmail, OAuth or EmailJS secrets are required. The build prepares the licensed local fonts itself.

**Stop before Save and Deploy while the release is on hold.** That button starts a deployment and publishes the project's `pages.dev` address. `main` currently contains the old site; do not deploy it expecting the redesign. Connecting a repository does not merge the redesign branch.

## 3. Deploy for review when publication is approved

After design approval and passing GitHub checks, merge `redesign/portfolio` into `main`. Return to setup, confirm the settings above, then select Save and Deploy. Review the resulting `pages.dev` site before adding either custom domain. This initial deployment is considered production by Pages, even though lidldev.com has not been connected.

Once created, open **Settings > Builds & deployments**. Keep `main` as the production branch. You can turn off automatic production branch deployments to require a deliberate release. Configure preview branches to include `redesign/portfolio` or all non-production branches as preferred. Subsequent pushes to an enabled preview branch generate preview deployments.

If you want a hosted preview before merging, use a separate staging Pages project, with the redesign branch selected and no custom domain. Its initial Save and Deploy also publishes a public pages.dev site; do this only when preview publication is approved.

## 4. Connect lidldev.com only at launch

When the hosted site has been approved, open the Pages project's **Custom domains > Set up a domain** and add `lidldev.com`. For an apex domain, the domain must be a zone in the same Cloudflare account; follow the dashboard's DNS instructions. Add `www.lidldev.com` through the same Pages flow if you want www supported. Use the Pages custom-domain flow before manually changing DNS.

The tracked `_redirects` file redirects www to the apex. Verify HTTPS and the redirect after both domains become active. Keep existing DNS and hosting in place until the cutover is authorized and record the prior DNS values for rollback.

## Acceptance and rollback

- Test all five project routes, retained Spike policies, `/support`, `/privacy`, `/terms`, `/agent`, unknown routes, mobile navigation, light/dark/system mode and reduced motion.
- Verify project images, canonical metadata, security/cache headers and real-domain redirects remotely.
- No top-level `404.html` is shipped: Pages supplies its SPA fallback and React renders unknown routes. Unknown URLs return HTTP 200; true HTTP 404 semantics remain a follow-up.
- Test an old service-worker client after domain cutover. The replacement `/sw.js` clears only LidlDev caches, reloads its clients once and unregisters. The new frontend also removes legacy registrations and matching caches. Local tests do not prove migration on an actual old production client.
- Preserve the previous hosting/DNS configuration for the first cutover. After Pages has a successful production deployment, retain it for later deployment rollbacks.

## Official references

- [Git integration and project creation](https://developers.cloudflare.com/pages/get-started/git-integration/)
- [Branch deployment controls](https://developers.cloudflare.com/pages/configuration/branch-build-controls/)
- [Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [SPA serving behavior](https://developers.cloudflare.com/pages/configuration/serving-pages/)
- [Headers](https://developers.cloudflare.com/pages/configuration/headers/) and [redirects](https://developers.cloudflare.com/pages/configuration/redirects/)

No Cloudflare project, deployment, merge or DNS change has been performed by this workspace.
