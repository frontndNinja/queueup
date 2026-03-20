//!NEXT: Få login til at virke (opret google cloud project)

/* 1) Create/select a Google Cloud project
Go to the Google Cloud Console: https://console.cloud.google.com/
Use the project picker (top bar) to create a new project or select an existing one.
2) Configure the OAuth consent screen
In the left nav, go to APIs & Services → OAuth consent screen
Choose External (for most apps) or Internal (only if you’re on Google Workspace and want org-only)
Fill the required fields (app name, support email, developer contact email)
Add scopes if prompted (for basic sign-in you typically don’t need anything beyond default OpenID scopes)
3) Create OAuth credentials
Go to APIs & Services → Credentials
Click Create Credentials → OAuth client ID
Application type:
Choose Web application
Add Authorized redirect URIs:
For NextAuth, use:

Local dev:
http://localhost:3000/api/auth/callback/google
If you run on port 3001 (your logs showed 3001/3002 earlier), use that port instead:

http://localhost:3001/api/auth/callback/google
For production, add:

https://YOUR_DOMAIN/api/auth/callback/google
Also add Authorized JavaScript origins (often required):

http://localhost:3000 (and/or http://localhost:3001)
https://YOUR_DOMAIN
4) Copy the values into your env file
After creating the client, Google shows:

Client ID → GOOGLE_CLIENT_ID
Client secret → GOOGLE_CLIENT_SECRET
Put them in your .env.local (or whichever env file you actually load):

GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
5) Verify
Restart your dev server, then hit:

/api/auth/signin and choose Google
You should be redirected to Google and back to /api/auth/callback/google
Concise explanation
You generate them by creating a Google OAuth 2.0 “Web application” client in Google Cloud, then registering the correct redirect URI that matches NextAuth’s callback route (/api/auth/callback/google). */