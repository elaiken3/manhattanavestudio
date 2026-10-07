# Manhattan Ave Studio site: Selected Work update and site audit
 
Handoff for Claude Code. October 7, 2026.
 
**To start:** put this file in the root of the manhattanavestudio.com repo, open Claude Code there, and say: `Read HANDOFF-selected-work-and-audit.md and follow it.`
 
## The job
 
Two pieces of work on manhattanavestudio.com, in this order:
 
1. **Selected Work update.** Add three projects and remove one. Ships first, as its own pull request.
2. **Site audit.** Review aesthetics, UX/UI, accessibility, and performance. Fix what's safe, propose anything that changes the look, and report copy issues. Ships second, as its own pull request.
## Ground rules
 
- **Stay local.** First thing, add this file's name and `audit/` to `.git/info/exclude` so both stay on this machine.
- **Stack.** Vanilla HTML, CSS, and JavaScript with no build step, deployed by Vercel from the repo. Keep it that way. Dev tools (Lighthouse, Playwright, image conversion) run through `npx` or from inside `audit/`, so the repo's dependencies stay as they are.
- **Branches.** This doc calls the production branch `main`; if the repo uses `master`, read it that way. Use one branch per job and open each PR with `gh pr create`. The Vercel bot posts a preview URL on the PR. Eugene reviews there and merges himself.
- **No em dashes anywhere:** copy, alt text, code comments, commit messages, PR descriptions, and the report. Use commas, colons, or periods.
- **Copy belongs to Eugene.** He writes public copy in his own voice. Use the card copy below as written, keep each card's text easy to find and edit, and send every other copy issue to the report.
- **Public files.** Vercel serves the repo root as the site, so any committed Markdown file is publicly readable. If `CLAUDE.md` or a README is committed, confirm `.vercelignore` excludes `*.md`.
- **GitHub auth.** If a push fails with "Repository not found," run `gh auth switch --user elaiken3`, then `gh auth setup-git`, and retry.
## Job 1: Selected Work
 
### Remove Miles for Uncle Edwy
 
- Delete its card from the Selected Work section.
- Delete `public/project-miles.webp` once nothing references it. Git history keeps a copy.
- Search the repo for `edwy`, `milesforuncleedwy`, `project-miles`, and `miles` as a whole word (HTML, CSS, JS, JSON-LD, meta and OG tags, sitemap) and clear every reference. If any metadata lists the projects, update it to the new six.
- Check for CSS or JS built around four cards: `nth-child` rules, counts, fixed grid rows.
### Add three cards
 
Copy an existing card's markup and match it exactly: image, link label, category line, title, description, tags, and link attributes. Keep the cards as static HTML like the others. Images go in `public/`.
 
**Dr. Amanda L. Aiken**
 
- Link: `https://www.amandalaiken.com` (live)
- Link label: `View Project →`
- Category: `Personal Brand · Leadership`
- Image: `public/project-amandalaiken.webp`
- Alt: Dr. Amanda L. Aiken: personal website for an executive coach and leadership strategist, bringing together her story, her speaking, and the three organizations she leads.
- Description: Personal site for an executive coach, leadership strategist, and 2026 Tory Burch Fellow. It brings her story, her speaking, and the three organizations she leads into one place, with a green palette designed as a close cousin to her firm sites.
- Tags: Multi-page, Custom Design, Contact Form, Vercel
**Village Lions RFC**
 
- Link: `https://villagelions-site.vercel.app/` (preview; villagelions.org still serves the club's Squarespace site)
- Link label: `View Preview →`
- Category: `Sports · Nonprofit`
- Image: `public/project-villagelions.webp`
- Alt: Village Lions RFC: website for a New York City rugby club, with team pages, a match schedule, training locations, and donations.
- Description: Full rebuild for a New York City rugby club playing since 1989. A black and white design with red accents for the Red Lion, the Greenwich Village bar the club is named for. Team pages, a match schedule, training details with maps, and a donation path for the general fund.
- Tags: Multi-page, Custom Design, Match Schedule, Vercel
**Nichole Gabrielle & Co.**
 
- Link: `https://nicholegabrielle-site.vercel.app/` (preview; nicholegabrielle.com still serves her previous site)
- Link label: `View Preview →`
- Category: `Coaching · Speaking`
- Image: `public/project-nicholegabrielle.webp`
- Alt: Nichole Gabrielle & Co.: website for a speaker and coach, with her services, speaking, a free guide, and her Substack essays.
- Description: Website for a speaker, neuroscience-informed coach, and health-justice advocate who supports women through illness, caregiving, and identity shifts. Light editorial sections alternate with dark, bold ones, and the homepage carries her Substack essays, a free guide, and paths into coaching and speaking.
- Tags: Multi-page, Editorial Design, Substack, Vercel
Open each site before committing. Keep the tags that describe something working today, and flag for Eugene any description line the site doesn't bear out.
 
### Card order
 
Newest work first, then the existing three in their current order:
 
1. Dr. Amanda L. Aiken
2. Village Lions RFC
3. Nichole Gabrielle & Co.
4. Roots & Proofs 26
5. Tend: Recovery Care
6. The Brooklyn Alphas
### Screenshots
 
The new images join the existing three as one set.
 
1. Open the existing `project-*.webp` files and note pixel size, aspect ratio, file size, and framing (viewport width, crop, any device frame or other treatment).
2. Capture the top of each new site to match, with Playwright run from `audit/`, once the page and its fonts finish loading (`networkidle`, then `document.fonts.ready`).
3. amandalaiken.com opens with a Tory Burch Fellow announcement over the page. Click "Continue to site" before capturing.
4. Export WebP at a quality that lands near the existing files' size.
5. If a browser won't run here, pause and ask Eugene for the three screenshots, named as above.
### Done when
 
- Six cards render in order at 375px, 768px, and 1440px, aligned, with tags wrapping cleanly.
- The repo search for the Miles terms comes back clean.
- All three links open the right site in a logged-out private window.
- PR 1 is open and Eugene has its preview URL.
## Job 2: Site audit
 
Branch from the Job 1 branch so the audit covers the six-card layout, and open PR 2 against it. Once PR 1 merges, rebase onto `main` and retarget PR 2. Scope: the homepage, plus `privacy.html` and `terms.html` for the shared header, footer, and font loading.
 
### 1. Baseline
 
- Serve the site locally with `npx serve`: the Job 1 branch as the baseline, then your branch after the fixes. Local runs keep the comparison fair (Vercel previews can sit behind a login). Run production once as a reference.
- Run Lighthouse three times per state, mobile (default) and desktop (`--preset=desktop`). Record the median scores, LCP, CLS, TBT, and FCP, and note the LCP element.
- Take full-page screenshots of each state at 375px and 1440px.
- Save it all under `audit/`.
### 2. What to check
 
**Performance**
 
- Fonts: check how the type loads (the site launched with Playfair Display and DM Sans). If it comes from Google Fonts, self-host the woff2 files (Latin subset, only the weights in use), preload the one or two used above the fold, and use `font-display: swap` with a metric-matched fallback so the swap holds layout steady.
- Images: every `<img>` carries `width` and `height` (or a CSS `aspect-ratio`) so layout holds; images below the fold use `loading="lazy"` and `decoding="async"`; file sizes fit their display size, with `srcset` for 1x and 2x. `manhattan-ave.jpg` is the one JPEG on the page: size it and convert it to WebP.
- Scripts and styles: defer anything render-blocking that can wait, confirm GA4 loads async, and flag unused CSS worth removing.
- Caching: if `vercel.json` sets long cache lifetimes, confirm an image replaced under the same filename reaches browsers promptly.
- Ticker: confirm it animates with CSS transforms and runs smoothly on a mid-range phone.
**Accessibility and UX**
 
- View links: each "View Project →" and "View Preview →" link gets a unique accessible name (a visually hidden project name), with the arrow hidden from screen readers.
- Ticker: the duplicated loop content is `aria-hidden`, and the animation stops under `prefers-reduced-motion: reduce`.
- Mobile menu: `aria-expanded` updates, Escape closes it, focus moves into the menu and returns to the toggle, and the page behind it holds still. An earlier `backdrop-filter` bug gave the overlay zero height; confirm the fix holds.
- Sticky header: each nav anchor (`#work`, `#services`, `#care`, `#about`, `#faq`, `#contact`) lands with its heading in full view, now that Work is taller.
- Contrast: small text, tags, labels, and buttons meet WCAG AA, with special attention to gold or caramel on cream.
- Focus: visible focus styles on every link, button, and field, and a working skip link.
- Contact form: labels tied to inputs; required fields announced; sending, error, and success states announced through `aria-live`; double submits blocked; inputs at 16px or larger so iOS keeps its zoom level; the "Website (leave blank)" honeypot kept out of the tab order and hidden from screen readers.
- Touch targets near 44px on mobile. External links behave consistently, with `rel="noopener"` wherever they open a new tab.
- Headings run h1, h2, h3 in order.
**Visual polish**
 
- The six screenshots read as one set: same framing, crop, and treatment. If the existing three differ from each other, propose re-shooting all six the same way.
- Spacing rhythm and type scale hold steady across sections and breakpoints, and the hero holds up at 320px.
- Hover and focus states feel consistent across cards, buttons, and nav.
- Six full cards make Selected Work long on a phone. Check the scroll length and propose a tighter mobile card if it drags.
- Then view the page as a first-time visitor, on a phone and on a laptop, and propose the few visual changes that would raise its quality most, ranked.
**Search, sharing, and analytics**
 
- JSON-LD validates; OG and Twitter images exist and look current; favicon and Apple touch icon are present; `sitemap.xml` `lastmod` is updated.
- The contact form sends a GA4 event on a successful submit (for example `generate_lead`), and the report reminds Eugene to mark it as a key event in GA4. The site promises this tracking to clients.
### 3. Fix, propose, or report
 
- **Fix directly:** changes that keep the design and wording as they are, such as image attributes, font loading, ARIA, reduced motion, caching, analytics events, and form states. Small commits, one concern each.
- **Propose first:** anything that changes how the site looks. List it in the report with screenshots, and commit it after Eugene's go-ahead.
- **Report only:** copy. List each line with its location and the issue.
Copy items for the report:
 
- Every em dash in visible copy, alt text, and meta tags, with a suggested comma, colon, or period. The live page has more than twenty, starting with the Selected Work intro line.
- Lines built on contrast or negation, such as "Not templates. Not guesswork.", "a website isn't a deliverable, it's an ongoing relationship", and "We're not an agency." Eugene prefers positive declarations.
- "Your site goes live on our reliable infrastructure" in Launch & Beyond, beside the FAQ's "You own the code, the design files, the domain, and the hosting account." The two should agree.
### 4. Report
 
Write `audit/report.md`:
 
- Lighthouse before and after, mobile and desktop.
- Findings grouped as Performance, Accessibility and UX, Visual, Search and analytics, and Copy. For each: what, where (file and line), why it matters, the fix, effort (S, M, L), and status (fixed, proposed, report only).
- Before and after screenshots at 375px and 1440px.
PR 2's description carries the short version, readable from a phone: the Lighthouse table, the fixes, and the proposals and copy items waiting on Eugene.
 
### Done when
 
- Every Lighthouse category holds or improves on its baseline.
- Every fix-directly item is committed.
- Proposals and copy items are listed and waiting on Eugene.
- PR 2 is open with its preview URL and the short version in its description.
## Wrap-up
 
- In PR 2, update `CLAUDE.md`, or create one following the studio's handoff convention: stack, deploy flow, how to add a project card, the six current projects, open audit items, and a launch reminder. When villagelions.org and nicholegabrielle.com go live, switch both card links to the real domains and both labels to `View Project →`.
- Report back with both PR preview URLs, the Lighthouse before and after, and the proposals waiting on Eugene.
## For Eugene
 
- Edit the three card descriptions above in your voice before handing this off, or afterward on the PR 1 preview.
- Check that the Village Lions board and Nichole are comfortable with their previews linked publicly, since search engines can reach them through these links.
- Give both previews a visitor's pass before PR 1 merges. One catch so far: the Nichole Gabrielle footer's social links still point to `#`.
- The site says "no templates" in several places (hero, Selected Work intro, the 100% stat, the Design step, the meta description). The Nichole Gabrielle design draws on two Tonic Site Shop templates, rebuilt by hand, so give those lines a look beside its card.
- The "10+ years in software & data engineering" stat: counting from General Assembly in 2017 gives nine. Adjust it, or keep it if earlier work counts.
 
