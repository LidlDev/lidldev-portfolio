# Setting Up GitHub Repository Secrets

This guide will help you set up the necessary GitHub repository secrets for deploying your application with the correct environment variables.

## Why GitHub Secrets?

GitHub secrets allow you to store sensitive information like API keys securely in your GitHub repository. These secrets can then be used in GitHub Actions workflows without exposing them in your code.

## Required Secrets

For the LidlDev Portfolio application, you need to set up the following secrets:

1. `VITE_SUPABASE_URL`: Your Supabase project URL
2. `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Step-by-Step Instructions

1. Go to your GitHub repository (https://github.com/LidlDev/lidldev-portfolio)
2. Click on "Settings" in the top navigation bar
3. In the left sidebar, click on "Secrets and variables" > "Actions"
4. Click on "New repository secret"
5. Add the first secret:
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://mszyijbyiyvjocjtcobh.supabase.co`
   - Click "Add secret"
6. Click on "New repository secret" again
7. Add the second secret:
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: Your Supabase anon key (from your .env file)
   - Click "Add secret"

## Verifying the Secrets

After adding the secrets, they should appear in the list of repository secrets. The values will be hidden for security reasons.

## Using the Secrets in GitHub Actions

The secrets are already configured to be used in the GitHub Actions workflow file (`.github/workflows/deploy.yml`):

```yaml
- name: Build
  run: npm run build
  env:
    VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
    VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
```

This ensures that the environment variables are available during the build process.

## Troubleshooting

If you encounter issues with the secrets:

1. Make sure the secret names match exactly (they are case-sensitive)
2. Make sure the secret values are correct
3. Check the GitHub Actions workflow logs for any errors related to the secrets
4. Try re-running the workflow after updating the secrets

## Security Considerations

- Never commit your actual API keys to the repository
- Regularly rotate your API keys for enhanced security
- Use different API keys for development and production environments
- Consider using more restrictive permissions for your production API keys
