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
- The active layout is selected in `src/App.jsx`, defaults to `DEFAULT_UI_VARIANT` in `src/config/uiVariants.js`, and can be switched from the UI style dropdown for the current session.

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

## 3) Deploy to GitHub Pages

The repo's `.github/workflows/deploy-frontend.yml` builds and publishes `frontend/dist` on pushes to `main`. Set these in the repository before it runs:

- Secrets: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`
- Variable (only for a project site, e.g. `https://<user>.github.io/vote-page/`): `VITE_BASE_PATH` set to `/vote-page/`

Vite embeds `VITE_*` values into the static bundle at build time, so they must be configured as repo secrets/variables ahead of the workflow run.

## 4) Deploy to Vercel for free (alternative)

1. Push this repo to GitHub.
2. In Vercel, click New Project and import the repo.
3. Framework preset: `Vite` (auto-detected in most cases).
4. Add environment variables in Vercel Project Settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
5. Deploy.

Vercel gives you a public `*.vercel.app` URL on first deploy.

## 5) Notes and limits

- This is intentionally lightweight: frontend + Supabase only.
- Public insert policies are simple to launch but can be abused by bots.
- For stricter anti-abuse, move vote writes to a serverless function with rate limiting.
