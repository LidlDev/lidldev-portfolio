# GitHub Pages SPA Routing Solution

This document explains how we've implemented client-side routing for our Single Page Application (SPA) on GitHub Pages.

## The Problem

GitHub Pages is designed to serve static websites, but it doesn't natively support client-side routing used by modern JavaScript frameworks like React with React Router. When a user directly accesses a URL like `https://www.lidldev.com/agent` or is redirected there (e.g., after OAuth authentication), GitHub Pages looks for an actual `/agent` directory with an index.html file, which doesn't exist in our SPA.

This results in a 404 error page, breaking the application flow, especially problematic for OAuth redirects which contain authentication tokens in the URL hash.

## The Solution

We've implemented a solution based on the [spa-github-pages](https://github.com/rafgraph/spa-github-pages) approach, which involves:

1. A custom `404.html` page that captures the URL, extracts its components, and redirects to the root with these components as query parameters
2. A script in `index.html` that reads these query parameters and reconstructs the original URL using the History API

This approach allows us to:
- Handle direct access to any route in our SPA
- Preserve hash fragments (crucial for OAuth redirects with tokens)
- Maintain a clean URL structure after the redirect

## How It Works

### 1. The 404.html Page

When a user tries to access a non-existent path (like `/agent`), GitHub Pages serves our custom `404.html` page. This page:

1. Captures the current URL path, query string, and hash fragment
2. Redirects to the root URL (`/`) with these components encoded as query parameters:
   - `p`: The path
   - `q`: The query string
   - `h`: The hash fragment

For example, a request to `/agent#access_token=xyz` would redirect to `/?p=agent&h=access_token=xyz`.

### 2. The Script in index.html

Our `index.html` contains a script that:

1. Detects if the URL contains the special query parameters (`p`, `q`, `h`)
2. Reconstructs the original URL using the History API
3. Replaces the current URL with the reconstructed one without causing a page reload

This happens before the React application loads, so React Router sees the correct URL.

## Implementation Details

### Files Modified

1. `public/404.html` - Created to handle 404 redirects
2. `index.html` - Added script to handle URL reconstruction
3. `vite.config.ts` - Added plugin to ensure 404.html is included in the build

### Handling OAuth Redirects

OAuth redirects are a special case because they contain authentication tokens in the URL hash. Our solution:

1. Preserves the hash fragment during the redirect
2. Reconstructs it correctly in the final URL
3. Ensures the authentication flow continues seamlessly

## Testing

To test this solution:

1. Deploy the application to GitHub Pages
2. Try accessing a direct route like `https://www.lidldev.com/agent`
3. Test the OAuth authentication flow with Google and GitHub

## Limitations

- There's a brief flash of the 404 page before the redirect happens
- The URL briefly shows the query parameters before being replaced with the clean URL
- This approach requires JavaScript to be enabled in the browser

## References

- [SPA GitHub Pages](https://github.com/rafgraph/spa-github-pages) - The original solution this implementation is based on
- [React Router Documentation](https://reactrouter.com/en/main/guides/faq#what-about-github-pages) - React Router's recommendations for GitHub Pages
- [GitHub Pages Documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site) - Creating a custom 404 page
