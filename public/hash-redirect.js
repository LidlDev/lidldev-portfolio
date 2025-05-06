// This script handles the transition from hash routing to browser routing
(function() {
  // Check if the URL contains a hash route (e.g., /#/agent)
  if (window.location.hash && window.location.hash.startsWith('#/')) {
    // Extract the path from the hash
    const path = window.location.hash.substring(2); // Remove the '#/'
    
    // Redirect to the clean URL
    window.location.replace(window.location.origin + '/' + path);
  }
})();
