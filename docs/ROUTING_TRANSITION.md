# Transitioning from Hash Routing to Browser Routing

This document explains the transition from hash-based routing (`/#/agent`) to browser-based routing (`/agent`) in the LidlDev Portfolio application.

## Background

The application was originally built using React Router's `HashRouter`, which uses URL hashes (`#`) to simulate navigation. This approach was chosen because it works well with GitHub Pages, which doesn't support client-side routing.

However, with the migration to Vercel, we can now use browser-based routing, which provides cleaner URLs and better compatibility with OAuth providers.

## The Problem

OAuth providers redirect users back to the application with authentication tokens in the URL hash. For example:

```
https://www.lidldev.com/agent#access_token=xyz&refresh_token=abc
```

However, with hash-based routing, the URL would look like:

```
https://www.lidldev.com/#/agent#access_token=xyz&refresh_token=abc
```

This creates problems because:
1. The second hash (`#`) is not properly parsed by the browser
2. OAuth providers don't know about the hash-based routing and redirect to the wrong URL

## The Solution

We've implemented a comprehensive solution to transition from hash-based routing to browser-based routing:

1. **Updated Router Configuration**: Changed from `HashRouter` to `BrowserRouter` in the application code
2. **Added Transition Script**: Created a script that detects hash-based routes and redirects to the equivalent browser-based route
3. **Enhanced Auth Redirect Handling**: Updated the authentication redirect utility to handle both hash and browser routing
4. **Configured Vercel for SPA**: Updated the Vercel configuration to properly handle client-side routing

## Implementation Details

### 1. Router Configuration

We've updated the `App.tsx` file to use `BrowserRouter` instead of `HashRouter`:

```tsx
// Old
<HashRouter>
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/agent" element={<Agent />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</HashRouter>

// New
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/agent" element={<Agent />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

### 2. Transition Script

We've added a script to the `index.html` file that detects hash-based routes and redirects to the equivalent browser-based route:

```html
<!-- Handle transition from hash routing to browser routing -->
<script src="/hash-redirect.js"></script>
```

The script (`public/hash-redirect.js`) checks if the URL contains a hash route and redirects to the clean URL:

```js
(function() {
  // Check if the URL contains a hash route (e.g., /#/agent)
  if (window.location.hash && window.location.hash.startsWith('#/')) {
    // Extract the path from the hash
    const path = window.location.hash.substring(2); // Remove the '#/'
    
    // Redirect to the clean URL
    window.location.replace(window.location.origin + '/' + path);
  }
})();
```

### 3. Auth Redirect Handling

We've updated the authentication redirect utility to handle both hash and browser routing:

```ts
export const useAuthRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if we have auth data in the URL
    const authData = extractAuthFromHash();
    
    if (authData.accessToken) {
      // If we're not already on the /agent page, redirect there
      if (!location.pathname.includes('/agent')) {
        navigate('/agent', { replace: true });
      }
      
      // Clean up the URL by removing the auth tokens
      if (window.history && window.history.replaceState) {
        const cleanUrl = `${window.location.protocol}//${window.location.host}${location.pathname}`;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    }
    
    // Handle hash-based routes for backward compatibility
    if (window.location.hash && window.location.hash.startsWith('#/')) {
      const path = window.location.hash.substring(2);
      navigate('/' + path, { replace: true });
    }
  }, [location, navigate]);
};
```

### 4. Vercel Configuration

We've updated the Vercel configuration to properly handle client-side routing:

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "routes": [
    { 
      "src": "/assets/(.*)", 
      "dest": "/assets/$1" 
    },
    { 
      "src": "/(.*)\\.(.+)", 
      "dest": "/$1.$2" 
    },
    { 
      "src": "/(.*)", 
      "dest": "/index.html",
      "status": 200
    }
  ]
}
```

## Testing the Transition

To test the transition:

1. Visit the old hash-based URL: `https://www.lidldev.com/#/agent`
2. Verify that you're redirected to the new browser-based URL: `https://www.lidldev.com/agent`
3. Test the OAuth authentication flow and verify that you're properly redirected back to the agent page

## Backward Compatibility

The transition script and enhanced auth redirect handling ensure backward compatibility with any existing links or bookmarks that use the old hash-based URLs.

## Future Considerations

Once the transition is complete and all users have migrated to the new URLs, we can consider removing the transition script and backward compatibility code.
