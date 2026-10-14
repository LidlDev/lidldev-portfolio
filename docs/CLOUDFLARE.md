# Cloudflare hosting setup and release

## Current setup: Cloudflare Workers

The supplied 14 October 2026 log shows Workers Builds deploying a Worker named portfolio with npx wrangler deploy. The website build succeeded; deployment was rejected because hostname-based source URLs in _redirects are unsupported by Workers Static Assets. Those two rules have been removed. The retained /api/* to /agent redirect uses relative paths.

The tracked wrangler.jsonc explicitly serves ./dist with single-page-application fallback. This avoids Wrangler's automatic project conversion, dependency additions and second build. The Vite project and Pages compatibility remain intact.

For the existing Worker, use:

| Setting | Value |
| --- | --- |
| Repository / production branch | LidlDev/lidldev-portfolio / main |
| Worker name | portfolio |
| Root directory | Repository root |
| Build command | npm run build |
| Deploy command | npx wrangler@4.150.0 deploy |
| Node version | NODE_VERSION=24 |

Retry the build from the latest main commit. Review the resulting workers.dev address and deep links. For production, open the portfolio Worker's Settings > Domains & Routes and add a Custom Domain for portfolio.lidldev.com. The Worker configuration intentionally contains no domain routes, so publishing the configuration does not itself attach the custom domain. Do not apply the Pages CNAME instructions below to a Worker.

If old apex/www hosts need to redirect later, configure host-based Redirect Rules on those hosts separately. _redirects now contains only the local API retirement rule. The subdomain remains the canonical origin in metadata and sitemap.

Wrangler dry run and local Worker HTTP checks passed (homepage, project SPA fallback, security header and API redirect). These checks do not establish successful Cloudflare API publication; verify the next remote build and live domain after retrying.

References: https://developers.cloudflare.com/workers/static-assets/redirects/ and https://developers.cloudflare.com/workers/wrangler/configuration/ .

## Alternative: Cloudflare Pages

The following instructions apply only if you choose a Pages project instead of the existing Worker.

The originally planned Pages project had not been created. GitHub publication is authorized; production deployment and domain changes are on hold. The redesign was merged into `main` and pushed to GitHub on 14 October 2026. Cloudflare publication remains a separate step for the user.

## 1. Review the GitHub branch

Review https://github.com/LidlDev/lidldev-portfolio/tree/main and its GitHub Actions checks. Local strict typecheck/build and all 14 Edge browser checks passed on 14 October 2026. Hosted CI, real-device checks and a Cloudflare preview still need verification.

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

**Stop before Save and Deploy while the release is on hold.** That button starts a deployment and publishes the project's `pages.dev` address. `main` now contains the tested redesign. Connecting the repository does not itself authorize deployment.

## 3. Deploy for review when publication is approved

The merge into `main` is complete. When you are ready to publish, return to setup, confirm the settings above, then select Save and Deploy. Review the resulting `pages.dev` site before adding the custom domain. This initial deployment is considered production by Pages, even though portfolio.lidldev.com has not been connected.

Once created, open **Settings > Builds & deployments**. Keep `main` as the production branch. You can turn off automatic production branch deployments to require a deliberate release. Configure preview branches to include `redesign/portfolio` or all non-production branches as preferred. Subsequent pushes to an enabled preview branch generate preview deployments.

If you want a hosted preview before merging, use a separate staging Pages project, with the redesign branch selected and no custom domain. Its initial Save and Deploy also publishes a public pages.dev site; do this only when preview publication is approved.

## 4. Connect portfolio.lidldev.com only at launch

Production origin: **https://portfolio.lidldev.com**. This is a hostname; the application stays at the root path, with project URLs such as /project/cadence-mobile. No /portfolio path prefix is needed.

When the hosted site has been approved, open the Pages project's **Custom domains > Set up a domain** and add portfolio.lidldev.com. Complete the Pages association before changing DNS. In the lidldev.com DNS zone, confirm a CNAME named portfolio pointing to the actual `<project-name>.pages.dev` hostname. Cloudflare can create it automatically for a zone it manages; otherwise add it at your DNS provider. Wait for the custom domain and HTTPS certificate to become active.

Canonical URLs, social-image URLs, structured data, robots and sitemap use the portfolio subdomain. The legacy CNAME file also matches it; Cloudflare custom-domain binding is still configured in its dashboard. Apex/www hostname redirects are not shipped in _redirects; configure host-based Cloudflare Redirect Rules separately if required. Only the portfolio subdomain is required for this launch.

Verify HTTPS, deep links and metadata on the new domain. Service workers and caches are scoped by origin: the new subdomain cannot unregister workers on lidldev.com or www.lidldev.com. Retiring an old installation requires serving the retirement worker on that old origin separately.

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

The GitHub merge is complete. The user initiated the Worker build shown above; this workspace has not deployed to Cloudflare or changed DNS.
