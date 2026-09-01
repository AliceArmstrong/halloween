# Vote Page (React + D3 + Supabase)

This scaffold gives you:

- Frontend SPA: React + D3 (Vite)
- Shared data persistence: Supabase (Postgres)
- Hosting model: frontend on GitHub Pages

## Architecture

- `frontend/`: UI with a vote form and D3 chart, talking directly to Supabase (see `frontend/src/services/votesService.js`)
- `frontend/supabase/schema.sql`: Supabase table and RLS policies for the `votes` table

See `frontend/README.md` for full setup and deploy instructions.

## Automated deploys with GitHub Actions

This repo includes `.github/workflows/deploy-frontend.yml`, which builds and deploys `frontend/dist` to GitHub Pages on pushes to `main` affecting `frontend/**`.

### Required GitHub repo settings (environment: `github-pages`)

Add these environment secrets:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Add this environment variable (only if deploying to a project site, e.g. `/vote-page/`; leave unset for a `<user>.github.io` root repo or custom domain):

- `VITE_BASE_PATH`

These Supabase values are baked into the static build at build time (Vite embeds `VITE_*` vars into the bundle), so they must be set before the workflow runs.
