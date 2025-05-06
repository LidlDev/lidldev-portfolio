# Supabase Setup for Agent Dashboard

This directory contains the database schema and setup instructions for the Agent Dashboard's Supabase backend.

## Database Schema

The `schema.sql` file contains all the necessary SQL to set up:
- Database tables for tasks, financial goals, expenses, and payments
- Row Level Security (RLS) policies to ensure data privacy
- Triggers for user profile creation

## Setup Instructions

### 1. Create a Supabase Project

If you haven't already, create a new Supabase project at [https://app.supabase.io](https://app.supabase.io).

### 2. Run the Schema SQL

1. Navigate to the SQL Editor in your Supabase dashboard
2. Copy the contents of `schema.sql` 
3. Paste into the SQL Editor and run the query

### 3. Configure Authentication

1. Go to Authentication → Settings
2. Enable Email/Password sign-ups
3. Configure OAuth providers (Google, GitHub) if desired:
   - For Google: Create OAuth credentials in the [Google Cloud Console](https://console.cloud.google.com/)
   - For GitHub: Create an OAuth App in [GitHub Developer Settings](https://github.com/settings/developers)
   - Add the redirect URLs from Supabase to your OAuth providers

### 4. Set Environment Variables

Make sure your application has the correct environment variables:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Row Level Security (RLS)

The schema includes RLS policies that ensure:
- Users can only access their own data
- Data is properly secured even with the public anon key
- Each table has appropriate policies for SELECT, INSERT, UPDATE, and DELETE operations

## Data Models

### Profiles
- Stores user profile information
- Created automatically when a user signs up

### Tasks
- Stores todo items
- Links to user via `user_id`

### Financial Goals
- Tracks savings goals
- Includes target amount, current progress, and target date

### Expenses
- Records spending by category
- Used for spending analysis

### Payments
- Tracks upcoming bills and payments
- Includes recurring payment support

## Testing

After setting up the database, you can test the RLS policies by:

1. Creating a test user
2. Adding some data
3. Trying to access another user's data (should be denied)
4. Verifying that the user can only see their own data

## Troubleshooting

If you encounter issues:

1. Check that RLS is enabled on all tables
2. Verify that the policies are correctly implemented
3. Ensure your application is using the correct Supabase credentials
4. Check the Supabase logs for any errors
