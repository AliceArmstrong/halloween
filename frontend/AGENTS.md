# Project Guidelines

## Code Style

- Keep changes small and consistent with the existing Vite + React codebase.
- Use ES modules, functional React components, and hooks.
- Preserve the current formatting style: double quotes, semicolons, and concise helper functions near their usage.
- Prefer simple state and effect logic over adding abstractions for this small app.
- Only make the changes asked, and any additional changes necessary to implement those changes.

## Architecture

- This project is a client-side Vite app with a single React entry point in `src/main.jsx` and the main UI in `src/App.jsx`.
- Vote data is stored in Supabase. The client is initialized in `src/supabaseClient.js` using `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
- The vote chart is rendered with D3 inside the React component tree, so UI changes should preserve the React state flow and the D3 rendering boundary.
- Database schema changes should stay aligned with `supabase/schema.sql`.

## Build And Test

- Install dependencies with `npm install`.
- Start local development with `npm run dev`.
- Validate production output with `npm run build`.
- There is no automated test suite configured in this repository yet. When changing behavior, at minimum run `npm run build`.

## Conventions

- Keep vote options centralized in `src/App.jsx` unless there is a deliberate refactor to move them into shared config.
- If you change how votes are fetched or written, keep the error messages user-facing and preserve the current loading and saving states.
- If you add environment-dependent behavior, document the required variables in `README.md` and keep `.env.example` in sync.
- Prefer updating existing files over introducing new structure unless the change clearly needs it.