# RigMate AU

RigMate AU is an Australia-focused PC builder and price-comparison platform with compatibility checks, trust-aware marketplace scoring, and premium shareable build pages.

## Deployment targets

- Primary target: Cloudflare Workers via OpenNext
- Secondary target: GitHub Pages static export fallback

The codebase now supports deployment mode switching with:

- NEXT_PUBLIC_DEPLOY_TARGET=github-pages
- NEXT_PUBLIC_DEPLOY_TARGET=cloudflare

## Source policy and exclusions

RigMate AU explicitly excludes OzBargain and Whirlpool from provider logic and product data pipelines.

- No scraping
- No importing content
- No linking as data providers
- No pricing ingestion

These sites may inform general product direction, but are never part of the app data source system.

## Static mode behavior (GitHub Pages)

In github-pages mode:

- Next.js output export is used
- static seed/catalog data is used client-side
- compatibility checks run client-side
- pricing and trust scoring run client-side on mock providers
- print-to-PDF is browser-based
- server-only runtime features are avoided

Static mode limitations:

- no API routes at runtime
- no server DB access
- no live scraping
- no live background jobs

## Cloudflare mode behavior

In cloudflare mode:

- API routes and dynamic build persistence remain available
- architecture remains ready for D1, R2, KV, and OpenNext runtime
- provider interfaces are preserved for future official integrations

## Supported provider direction

Mock/seed architecture is prepared for:

- Scorptec
- Mwave
- PC Case Gear
- Umart
- Centre Com
- Computer Alliance
- PLE Computers
- MSY
- JW Computers
- Amazon AU
- eBay AU
- AliExpress

Live scraping is intentionally not implemented yet.

## Data sourcing and legal notes

- Respect retailer terms of service and robots.txt
- Prefer official APIs, affiliate feeds, and approved partnerships
- Do not scrape Google Images for product media
- Use local assets, approved manufacturer media, or mock image paths

## Scripts

- npm run dev: local dev server
- npm run build: default build
- npm run build:github-pages: static build path used by GitHub Pages workflow
- npm run deploy:github-pages: alias for static build
- npm run lint: ESLint
- npm run pages:build: OpenNext Cloudflare build
- npm run pages:preview: local Cloudflare preview
- npm run pages:deploy: Cloudflare deploy
- npm run cf:build: Cloudflare build alias

## Cloudflare deployment

Primary workflow file:

- .github/workflows/deploy-cloudflare.yml

Expected GitHub secrets:

- CLOUDFLARE_API_TOKEN
- CLOUDFLARE_ACCOUNT_ID

It:

- installs dependencies
- generates Prisma client output
- runs lint
- builds the OpenNext bundle
- deploys with Wrangler when Cloudflare secrets are configured

## GitHub Pages deployment

The workflow file is:

- .github/workflows/deploy-pages.yml

It:

- is left as a manual fallback path
- builds in github-pages mode when triggered manually
- publishes out directory to GitHub Pages

Required static hosting support files:

- public/.nojekyll

## Local development

Install and run:

- npm install
- npm run dev

Optional DB tasks for dynamic/cloudflare mode:

- npm run db:migrate
- npm run db:seed
- npm run db:studio

## Feature highlights

- compatibility checks: socket, RAM type, form factor, clearances, PSU fit, wattage
- marketplace trust signals: landed cost, seller trust, warranty risk, import caution
- premium build showcase with print-to-PDF support
- static-mode share links that work on GitHub Pages

## Future integration notes

Provider interfaces include clear extension points for:

- official retailer feeds
- official eBay API integration
- approved AliExpress partner data

When adding future integrations, preserve source-policy exclusions and legal sourcing constraints in this README.
