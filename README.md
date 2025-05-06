# LidlDev Portfolio

*Repository renamed from funky-flow-folio to lidldev-portfolio*

## Project info

**URL**: https://www.lidldev.com

## Features

- Portfolio website showcasing projects and skills
- Agent dashboard with:
  - Task management
  - Financial goal tracking
  - Spending tracker
  - Upcoming payments management
  - User authentication (email/password, Google, GitHub)
  - Database persistence with Supabase

## Environment Setup

This project uses environment variables for configuration. Before running the application, you need to set up your environment:

1. Copy the `.env.example` file to a new file named `.env`:
   ```sh
   cp .env.example .env
   ```

2. Edit the `.env` file with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. For detailed environment setup instructions, see [docs/ENV_SETUP.md](docs/ENV_SETUP.md)

4. For OAuth setup (Google and GitHub authentication), follow the instructions in [docs/OAUTH_SETUP.md](docs/OAUTH_SETUP.md)

## How can I edit this code?

There are several ways of editing this portfolio application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone https://github.com/LidlDev/lidldev-portfolio.git

# Step 2: Navigate to the project directory.
cd lidldev-portfolio

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Set up environment variables (see Environment Setup section)
cp .env.example .env
# Edit .env with your credentials

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (authentication and database)
- React Router
- React Hook Form with Zod validation

## Database and Authentication

The Agent dashboard uses Supabase for:

- User authentication (email/password, Google, GitHub)
- Database storage for tasks, financial goals, expenses, and payments
- Row Level Security (RLS) to ensure data privacy

For database setup instructions, see [supabase/README.md](supabase/README.md).

## How is this project deployed?

This project is deployed using GitHub Pages with a custom domain (www.lidldev.com).

When changes are pushed to the main branch, a GitHub Actions workflow automatically builds and deploys the site.

**Important Note**: When deploying to production, make sure to:
1. Set up the proper environment variables in your CI/CD pipeline
2. Configure OAuth providers with the production domain
3. Update the Supabase project settings for production use

## Custom Domain

This project uses a custom domain (www.lidldev.com) configured in the GitHub Pages settings.

## Security Considerations

- Never commit your `.env` file or any files containing API keys to version control
- Always use environment variables for sensitive information
- Follow the security best practices outlined in the OAuth setup guide
