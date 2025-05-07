# Setting Up Gmail API for Email Scanning

This guide provides detailed instructions for setting up the Gmail API to enable the email scanning feature in your application.

## Overview

The email scanning feature uses the Gmail API to access the user's emails, analyze them for bill-related content, and extract relevant information such as amounts, due dates, and categories. This guide will walk you through the process of setting up the Gmail API in your Google Cloud project.

## Prerequisites

1. A Google Cloud Platform account
2. A project set up in the Google Cloud Console
3. OAuth consent screen configured

## Step 1: Enable the Gmail API

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to "APIs & Services" > "Library"
4. Search for "Gmail API"
5. Click on the Gmail API result
6. Click "Enable"

## Step 2: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Select "External" user type (unless you have a Google Workspace organization)
3. Fill in the required fields:
   - App name: Your application name
   - User support email: Your email address
   - Developer contact information: Your email address
4. Click "Save and Continue"
5. Add the following scopes:
   - `https://www.googleapis.com/auth/gmail.readonly`
6. Click "Save and Continue"
7. Add test users (your email and any other testers)
8. Click "Save and Continue"
9. Review your settings and click "Back to Dashboard"

## Step 3: Create OAuth Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application" as the application type
4. Enter a name for your OAuth client
5. Add the following authorized redirect URIs:
   - `https://www.lidldev.com/api/email-auth-callback` (for production)
   - `http://localhost:3000/api/email-auth-callback` (for local development)
6. Click "Create"
7. Note down the Client ID and Client Secret

## Step 4: Set Environment Variables

1. Add the following environment variables to your Vercel project:
   - `GOOGLE_CLIENT_ID`: Your OAuth client ID
   - `GOOGLE_CLIENT_SECRET`: Your OAuth client secret

## Step 5: Understanding the Email Scanning Process

The email scanning feature works as follows:

1. When a user clicks "Scan Emails", the application checks if they have granted permission to access their Gmail account.
2. If not, they are prompted to connect their Gmail account through OAuth.
3. Once connected, the application uses the Gmail API to:
   - Search for emails from the last 30 days that contain bill-related keywords
   - Analyze each email to extract bill information
   - Detect amounts, due dates, and categories
   - Store the detected bills in the database
4. The user is then presented with the detected bills and can approve or reject them.

## Step 6: Bill Detection Algorithm

The email scanning feature uses the following techniques to detect bills:

1. **Keyword Matching**: Searches for bill-related keywords like "invoice", "bill", "payment", "due", etc.
2. **Amount Extraction**: Uses regular expressions to find dollar amounts in the email content.
3. **Due Date Extraction**: Uses regular expressions to find dates that appear near words like "due" or "payment".
4. **Category Detection**: Analyzes the email content for category-specific keywords to determine the bill category.
5. **Confidence Scoring**: Assigns a confidence score to each detected bill based on the quality of the matches.

## Step 7: Testing the Feature

1. Log in to your application
2. Navigate to the Agent page
3. Click on the "Payments" tab
4. Click on the "Scan Emails" button
5. Follow the OAuth flow to connect your Gmail account
6. The application will scan your emails and display any detected bills
7. Approve or reject the detected bills

## Troubleshooting

### "Failed to scan emails"

This error can occur for several reasons:

1. **OAuth Token Issues**: The OAuth token may have expired or been revoked. Try reconnecting your Gmail account.
2. **Gmail API Quota**: The Gmail API has usage quotas. If you exceed these quotas, the API will return errors.
3. **Email Format**: Some emails may have complex formats that are difficult to parse. The application tries to handle different formats, but may not be able to parse all emails correctly.

### "No bills detected"

If the application doesn't detect any bills, it could be because:

1. **No Matching Emails**: There may not be any emails in the last 30 days that match the bill-related keywords.
2. **Email Format**: The bills may be in a format that the application can't parse (e.g., PDF attachments).
3. **Confidence Threshold**: The detected bills may have a low confidence score and are filtered out.

## Security Considerations

1. **OAuth Tokens**: The application stores OAuth tokens securely in the database. These tokens are encrypted and can only be accessed by the server.
2. **Email Content**: The application does not store the full content of emails, only the extracted bill information.
3. **Scope Limitation**: The application only requests read-only access to Gmail, so it cannot modify or delete emails.
4. **User Consent**: Users must explicitly grant permission for the application to access their Gmail account.

## Future Improvements

1. **Attachment Parsing**: Add support for parsing PDF and image attachments for bill information.
2. **Machine Learning**: Implement machine learning models to improve bill detection accuracy.
3. **More Email Providers**: Add support for other email providers beyond Gmail.
4. **Recurring Bill Detection**: Improve detection of recurring bills by analyzing patterns across multiple emails.
5. **Custom Categories**: Allow users to define custom categories for their bills.
