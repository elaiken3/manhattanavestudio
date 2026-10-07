# Manhattan Ave Studio | manhattanavestudio.com

The studio's own site: one homepage plus privacy, terms, and 404 pages. Eugene Aiken builds and maintains it. Public copy is Eugene's, in his own voice: change wording only when he asks, and send copy issues to him rather than editing them.

## Status

- Live at https://www.manhattanavestudio.com, deployed by Vercel from `main`.
- Selected Work shows six projects (see Current projects below).
- October 2026 audit: the fixes that keep the design and wording as they are are in. Visual proposals and copy items wait on Eugene (see Open audit items).

## Stack

Vanilla HTML, CSS, and JavaScript. No build step, no framework, no bundler. Keep it that way.

- `index.html`: the homepage, including all Selected Work cards, the FAQ, and the JSON-LD.
- `privacy.html`, `terms.html`, `404.html`: share the header, footer, and stylesheet.
- `styles/mas.css`: the whole design system. Tokens live in `:root`.
- `scripts/mas.js`: mobile menu, scroll reveals, GA4 event tracking, contact form. Loaded with `defer`.
- `api/contact.js`: Vercel serverless function. POST `/api/contact` sends the form through Resend. Needs `RESEND_API_KEY`, `CONTACT_TO`, and `CONTACT_FROM` set in Vercel.
- `public/`: images, icons, share image, and `fonts/`.
- Fonts: PP Editorial New (headings) and Satoshi (body), self-hosted woff2 in `public/fonts/`, `font-display: swap`, with metric-matched Georgia and Arial fallbacks in `mas.css`. The homepage and legal pages preload `PPEditorialNew-Bold` and `Satoshi-Variable`.
- Analytics: GA4 `G-BGJ9FZH32H`, loaded async in the head. Events: `cta_click`, `outbound_click`, `scroll_depth`, `form_start`, `form_error`, `form_submit_error`, and `generate_lead` on a successful contact form send. `generate_lead` should be marked as a key event in GA4.

## Deploy

Vercel builds from the repo root (`outputDirectory: "."`), so every committed file is public. `.vercelignore` keeps `*.md` (this file included) and `audit/` out of the deployment. Never commit notes or secrets anywhere else.

- Push a branch and open a PR. The Vercel bot posts a preview URL on the PR.
- Eugene reviews on the preview and merges. Merging to `main` deploys production.
- `cleanUrls` is on: link to `/privacy` and `/terms`, not the `.html` paths.
- Caching (`vercel.json`): `/public/fonts/*` is cached for a year as immutable, so a replaced font needs a new filename. Everything else under `/public` revalidates on each visit, so an image replaced under the same name shows up right away.

## Adding a project card

1. Capture the screenshot. The current set is the top of each site in a desktop browser: a 1440x670 viewport, captured after the page and its fonts load, with any announcement or cookie banner dismissed, no device frame, scaled to 800px wide (about 800x372).
2. Export WebP, lossy quality 90 with smart chroma subsampling (sharp: `webp({ quality: 90, smartSubsample: true })`). That lands around 20 to 55 KB. Save as `public/project-<slug>.webp`.
3. In `index.html`, copy an existing `<article class="project-card">` inside `.work__grid` and keep its structure exactly: image with alt text, overlay link, category, title, description, tags. Each card has a `<!-- Project N: Name -->` comment above it.
4. Set the image's real `width` and `height`, keep `loading="lazy" decoding="async"`.
5. The link keeps `target="_blank" rel="noopener"`, a `data-outbound="project_<slug>"` label, and the visually hidden project name: `View Project<span class="visually-hidden">: Name</span> <span aria-hidden="true">→</span>`. Use `View Preview` for a site that isn't on its real domain yet.
6. Add the image to the homepage entry in `sitemap.xml` and update its `lastmod`.
7. Cards fill a two-column grid on desktop and one column at 768px and below. An even count keeps the last row full.

To remove a project, delete its card, its image, and its sitemap entry, then search the repo for its name and domain.

## Current projects

In card order, newest first:

1. Dr. Amanda L. Aiken: https://www.amandalaiken.com (View Project)
2. Village Lions RFC: https://villagelions-site.vercel.app/ (View Preview)
3. Nichole Gabrielle & Co.: https://nicholegabrielle-site.vercel.app/ (View Preview)
4. Roots & Proofs 26: https://www.rootsandproofs26.com
5. Tend: Recovery Care: https://www.tendrecovery.app
6. The Brooklyn Alphas: https://www.gil1906.org

`public/project-futureforward.webp` is in the repo but no card uses it.

## Launch reminder

When villagelions.org and nicholegabrielle.com go live on the new builds, switch both card links to the real domains (`https://www.villagelions.org`, `https://nicholegabrielle.com`) and both labels to `View Project`, in `index.html`. Search for `vercel.app` to find them.

## Open audit items

From the October 2026 audit (PR 2). These change how the site looks or reads, so they wait on Eugene.

Visual proposals, ranked:
1. Screenshot framing: the 2.15:1 screenshots sit in 4:3 frames centered at the top, so about 38% of each width is cut and headlines lose their first letters. Quick fix: `object-position: left top` on `.project-card__img > img`. Fuller fix: re-shoot all six at 4:3 with 800 and 1600px versions and a `srcset`.
2. Align the hero with the content grid: `.hero__inner` is an 800px box centered in the container, so the hero starts 200px right of every section heading at 1440px.
3. Contrast: `--color-text-muted` #7A6D65 to #746860 and `--color-primary` #9B6A3A to #8E6135 bring small text, tags, labels, the caramel links, and the white-on-caramel buttons to WCAG AA. The About caption would use the muted color.
4. Shorter mobile cards: 16:9 card images and tighter padding at 768px and below, and two columns from 600px. Selected Work drops from 4,273 to 3,727px on a phone and from 5,179 to 2,045px at 768px.
5. Smaller items: show the card overlay link on touch screens wider than 768px, larger tap areas for footer and contact links, a stronger focus state on form fields, a slightly larger hero headline on phones.

Copy items: every em dash in visible copy, alt text, and meta tags; lines built on contrast or negation; "our reliable infrastructure" in Launch & Beyond against the FAQ's "You own ... the hosting account"; the "no templates" lines beside the Nichole Gabrielle card; the "10+ years" stat. PR 2's description lists them; the full audit report with line numbers stayed on Eugene's machine (`audit/report.md`, git-excluded).

## Checks

No test suite. Before a PR:
- Serve locally: `npx serve .` (port 3000).
- Lighthouse, mobile and desktop: `npx lighthouse http://localhost:3000/` and the same with `--preset=desktop`.
- Look at the homepage at 375, 768, and 1440px, and the legal pages at 375px.
- Dev tools run through `npx`. Don't add dependencies to `package.json`.

## Conventions

- No em dashes anywhere: copy, alt text, code comments, commit messages, PR descriptions. Use commas, colons, or periods.
- One concern per commit.
- Changes that alter the look go to Eugene first with screenshots.
