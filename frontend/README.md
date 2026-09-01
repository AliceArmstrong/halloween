# Vote Page: Vercel + Supabase Setup

This app now stores votes in Supabase so results persist between users.

## Component architecture and UI variants

- Voting data flow is separated into reusable modules:
   - `src/hooks/useVotes.js` manages loading, submission, and status state.
   - `src/services/votesService.js` handles Supabase reads/writes.
   - `src/config/voteOptions.js` keeps stable option keys and display labels.
- UI layouts are pluggable:
   - `src/layouts/ClassicLayout.jsx`
   - `src/layouts/SpotlightLayout.jsx`
- The active layout is selected in `src/App.jsx` and can be switched from the UI style dropdown.
- Selected UI style is saved in local storage under `vote-ui-variant`.

## 1) Create a Supabase project

1. Go to Supabase and create a new project.
2. Open the SQL editor.
3. Run the SQL in `supabase/schema.sql`.

This creates a `votes` table and enables read + insert policies for the anon key.

## 2) Configure environment variables locally

1. Copy `.env.example` to `.env`.
2. Fill in:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`

Then run:

```bash
npm install
npm run dev
```

## 3) Deploy to Vercel for free

1. Push this repo to GitHub.
2. In Vercel, click New Project and import the repo.
3. Framework preset: `Vite` (auto-detected in most cases).
4. Add environment variables in Vercel Project Settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
5. Deploy.

Vercel gives you a public `*.vercel.app` URL on first deploy.

## 4) Notes and limits

- This is intentionally lightweight: frontend + Supabase only.
- Public insert policies are simple to launch but can be abused by bots.
- For stricter anti-abuse, move vote writes to a serverless function with rate limiting.
