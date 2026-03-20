# Architecture

## Stack decisions

**Astro 5** — Static site generator. Zero client JS by default, fast builds.

**Cloudflare Workers** — `run_worker_first: true`, static assets via `env.ASSETS.fetch()`. Output directory: `dist/`.

**TypeScript strict** — Build-time errors instead of runtime failures.

## Styling

CSS custom properties in `src/styles/global.css`. Terminal aesthetic with dark/light mode via `prefers-color-scheme`. Monospace system font stack throughout.

Design documented in `docs/brand.md`.

## Pages

Single-page site:

- `/` — Crontab clock (interactive terminal UI)
- `/404.html` — Terminal-styled error page

No blog, no CMS, no content collections.

## Output

`static` mode in Astro config. All pages pre-rendered at build time. Deployed as Cloudflare Worker serving static assets.

## Migration

Converted from Eleventy 3 + WebC to Astro 5 on 2026-03-20. The terminal clock design, CSS, and JavaScript were preserved from the original site.
