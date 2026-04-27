# claude.md — Claude Web Developer Guide for BNA Detailing Co.

## Role
You are the ongoing web developer for this site. Read this file at the start of every session
to get context fast. Never build the full site at once — work section by section as requested.

## Business context
- Name: BNA Detailing Co. (Bryan 'N' Allen Detailing Co.)
- Location: Guelph, Ontario, Canada
- Service: Mobile car detailing — we go to the customer's driveway
- Target customers: Local homeowners, busy professionals
- USPs: 5-star rated, fully insured, open 7 days/week, mobile convenience
- Price range: $29.99 (exterior wash, sedan) → $299.99 (full detail, minivan)
- Add-ons: Pet hair removal (+$25), Ozone generator (+$50)
- Phone: (226) 455-0942
- Email: bnadetailingco@gmail.com
- Socials: Instagram + TikTok @bnadetailingco

## Conversion goals (in priority order)
1. Drive clicks to the Square booking link (primary CTA everywhere)
2. Drive phone calls — tel: link on every page
3. Form submissions on contact-us.html (quote requests → FormSubmit.co → email)

## Design system
Palette: --main #86c5da / --dark #283b41 / --mid #5a8694
Font: Poppins (Google Fonts)
Style: Clean, modern, premium — dark headers, light section alternation
CTA buttons: .btn-primary (blue bg, dark text) / .btn-outline (transparent, white border)
Section pattern: <section class="section section-light/white"> → <div class="container">

## Pages and current status
| Page            | Status   | Notes                                      |
|-----------------|----------|--------------------------------------------|
| index.html      | Done     | Hero video, about, reviews (Elfsight)      |
| services.html   | Done     | Dynamic pricing by vehicle type, FAQ       |
| gallery.html    | Done     | 12-image grid, lightbox                    |
| contact-us.html | Done     | Quote form, map, contact info              |

## Chatbot
Drop-in widget via chatbot-widget.js. Backend on Render (third party, not in this repo).
Handles greeting, quote flow (vehicle → service → condition → addons), and general questions.
Do not modify the widget unless the user explicitly asks.

## Active TODO (discuss with user before starting each item)

### 1. Discount popup — index.html
- Trigger: 8-second time delay after page load (setTimeout, 8000ms)
- Offer: tie to the existing "20% OFF pre-book" announcement bar copy
- Behaviour: shown once per session (sessionStorage flag so it doesn't re-fire on back-navigate)
- Dismiss: X button + clicking the backdrop closes it
- CTA inside popup: links to Square booking URL
- Do NOT implement until user gives the go-ahead

### 2. Testimonials section revamp — index.html
- Keep the Elfsight embed (.elfsight-app-aa875586-dc0c-428e-a4f8-a16383933ef7) — do not remove it
- Redesign the section wrapper, heading, and layout around the embed
- Goal: make the section feel more premium and intentional, not just a raw widget drop-in
- Do NOT implement until user gives the go-ahead

## Known constraints
- No build system — pure HTML/CSS/JS only
- All changes deploy via GitHub → Netlify (auto-deploy on push to main)
- Images in images/ are originals — create optimized versions in images/optimized/ only
- SEO/OG/LD+JSON metadata on every page — preserve it unless updating intentionally

## Developer guidelines for Claude
- Work one section at a time — never rewrite a full page unless asked
- Always explain structure and intent before giving code
- Propose copy/marketing changes before writing them
- Match existing code style (indentation, class naming, comment format)
- Use CSS variables from style.css — do not introduce raw hex values
- Mobile-first: test logic at 375px, 768px, and 1200px breakpoints
- Keep JS vanilla — no libraries unless already on the page (Font Awesome, Elfsight)
- When adding a new section, follow the .fade-up + IntersectionObserver pattern already in place
