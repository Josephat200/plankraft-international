# Plankraft International Website

A static one-page website for Plankraft International, a Nairobi-based architecture & design practice. Built as a single HTML file with embedded CSS/JS and two team photos.

## Project Structure

```
.
├── public/                          # Web root served at port 5000
│   ├── index.html                   # The site (was "Test plankraft_international_website.html")
│   ├── KISIA PIC.jpg.jpeg           # Team photo
│   ├── MWITA PIC.png                # Team photo
│   └── gallery/                     # 12 architectural inspiration photos shown on "What We Do"
│       ├── 01-sydney-opera-house.jpg
│       ├── 02-fallingwater.jpg
│       ├── 03-burj-khalifa.jpg
│       ├── 04-guggenheim-bilbao.jpg
│       ├── 05-the-shard.jpg
│       ├── 06-heydar-aliyev.jpg
│       ├── 07-marina-bay-sands.jpg
│       ├── 08-villa-savoye.jpg
│       ├── 09-lotus-temple.jpg
│       ├── 10-habitat-67.jpg
│       ├── 11-sagrada-familia.jpg
│       └── 12-birds-nest.jpg
├── server.py                        # Tiny Python static file server
├── Test plankraft_international_website.html  # Original source HTML (kept for reference)
├── KISIA PIC.jpg.jpeg               # Original asset (kept for reference)
└── MWITA PIC.png                    # Original asset (kept for reference)
```

## How It Runs

A small Python `http.server` (`server.py`) serves the `public/` directory on `0.0.0.0:5000` with cache-disabling headers so the Replit preview iframe always shows fresh content.

The single workflow `Start application` runs `python3 server.py` on port 5000.

## Local Editing

Edit `public/index.html` directly. The server has no build step; just refresh the preview to see changes.

## Site Features

- **Four sections** (Home, What We Do, Who We Are, Contact Us) shown via JS `showSection()` switching, with hash-based deep links (`#home`, `#what-we-do`, `#who-we-are`, `#contact-us`).
- **Inspirations gallery** on the "What We Do" page: 12 cards of celebrated buildings from around the world (architect, year, location, short note), clearly framed as inspirations &mdash; not Plankraft projects. Images are stored locally in `public/gallery/` so the page never depends on third-party hosts staying up.
- **Navigation:** sticky frosted nav bar with scroll shadow, a prominent gold-gradient "Get In Touch" CTA, an animated gradient underline indicator for the active page, and a hamburger drawer on screens ≤ 900px (slide-in from the right with backdrop, ESC/backdrop close, body scroll lock).
- **Scroll affordances:** thin gold-gradient scroll progress bar at the very top of the page, and a circular "Top" floating button that fades in after the user scrolls ~420px.
- **Color system:** CSS custom properties on `:root` define the palette and gradients (`--warm`, `--warm-deep`, `--stone`, `--sage`, `--clay`, `--cream`, `--cream-warm`, `--paper`, plus `--gradient-warm`, `--gradient-text`, `--gradient-stone-rich`, `--gradient-hero`, and warm/glow shadow tokens). Service cards use the warm gradient on hover, the "Green Buildings" card uses a sage tint, social links light up in their brand colors (TikTok, Instagram, X, WhatsApp).
- **Accessibility:** `prefers-reduced-motion` short-circuits animations and smooth scroll; the hamburger has proper `aria-expanded` / `aria-controls` and ESC key support.
