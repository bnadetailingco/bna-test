# AGENTS.md — BNA Detailing Co. Website

## What this repo is
Static HTML/CSS/JS website for BNA Detailing Co., a mobile car detailing business in Guelph, Ontario.
No build system. No package manager. Files deploy directly to Netlify via GitHub.

## File structure
index.html          — Home page (hero, about, reviews)
services.html       — Pricing + FAQ (dynamic pricing by vehicle type)
gallery.html        — Before/after photo grid with lightbox
contact-us.html     — Quote form + contact info + map
style.css           — Master stylesheet (single file, all pages)
chatbot-widget.js   — Drop-in chat widget (calls bna-bot.onrender.com)
images/             — All site photos (do not overwrite originals)
videos/             — cover.mp4 hero background video

## Color palette (CSS variables in style.css)
--main:     #86c5da   (primary blue — CTAs, accents, icons)
--dark:     #283b41   (nav, footers, card headers)
--mid:      #5a8694   (secondary text, hover states)
--accent:   #6797a7
--light-bg: #f4f9fb   (section alternating background)
--white:    #ffffff

## Typography
Font: Poppins (Google Fonts), weights 300/400/500/600/700

## Shared patterns (all pages use these)
- Fixed top-bar (.top-bar) — promotional announcement bar, z-index 1100
- Fixed nav (.site-nav) — positioned below top-bar at top: 38px
- .hero / .hero-mini — full-page or compact hero section
- .section + .section-light / .section-white — alternating section backgrounds
- .fade-up — scroll-reveal animation class (add .visible via IntersectionObserver)
- #backToTop — floating back-to-top button
- Chatbot widget injected via <script src="chatbot-widget.js"> before </body>
- Mobile menu via .mobile-overlay + openMobileMenu() / closeMobileMenu()

## What agents should NOT do
- Do not remove or alter SEO meta tags, canonical links, or LD+JSON structured data
- Do not overwrite original images — create optimized copies in images/optimized/ if needed
- Do not rewrite marketing copy without user approval
- Do not add build tooling, npm packages, or frameworks
- Do not modify chatbot-widget.js without explicit instruction — it connects to a live backend

## Safe defaults
- Propose copy/content changes before applying
- CSS changes: use existing CSS variables, do not introduce new hex values without discussion
- New sections: follow the existing .section / .container / .fade-up pattern
- Images: always use loading="lazy" and descriptive alt text with location (e.g. "Guelph, Ontario")

## Deployment
- Source: GitHub repository
- Host: Netlify (auto-deploys on push to main)
- Preview locally: python -m http.server 8000 or npx serve .
- No build step required — what you see in the repo is what Netlify serves

## Booking URL (do not change without instruction)
https://book.squareup.com/appointments/ii0uvft0j96s75/location/LG6PJW85D509R/services

## Chatbot backend
Hosted on Render (third-party). Base URL: https://bna-bot.onrender.com
Configured in chatbot-widget.js — do not hardcode this URL elsewhere.
