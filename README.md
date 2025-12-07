# Eoin&apos;s Presents

A tiny Vite + React + TypeScript site for sharing “experience” gifts. Each recipient has a personalised URL that first shows a playful climbing reveal, then fades into a clean voucher-style page.

## Getting started

```bash
npm install
npm run dev
```

The dev server will print the local URL (typically `http://localhost:5173`). Routes:

- `/` — simple landing page
- `/:slug` — personalised gift (e.g. `/brother`)

## Adding a new gift

1. Add an entry to `src/data/gifts.ts` with a unique `slug` and the gift content.
2. Drop a hero image into `public/` or `src/assets/` and reference it via `heroImage` (e.g. `/your-image.svg`).
3. Start the dev server and open `/:slug` to test the reveal.

## Deploying

This app is static and requires no backend or environment variables. Pushing to `main` deploys to Vercel. Use `npm run build` to produce a production bundle locally.
