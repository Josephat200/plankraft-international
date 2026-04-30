# Plankraft International Website

A static one-page website for Plankraft International, a Nairobi-based architecture & design practice. Built as a single HTML file with embedded CSS/JS and two team photos.

## Project Structure

```
.
├── public/                          # Web root served at port 5000
│   ├── index.html                   # The site (was "Test plankraft_international_website.html")
│   ├── KISIA PIC.jpg.jpeg           # Team photo
│   └── MWITA PIC.png                # Team photo
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
- **Navigation:** sticky frosted nav bar with scroll shadow, a prominent gold-gradient "Get In Touch" CTA, an animated gradient underline indicator for the active page, and a hamburger drawer on screens ≤ 900px (slide-in from the right with backdrop, ESC/backdrop close, body scroll lock).
- **Scroll affordances:** thin gold-gradient scroll progress bar at the very top of the page, and a circular "Top" floating button that fades in after the user scrolls ~420px.
- **Color system:** CSS custom properties on `:root` define the palette and gradients (`--warm`, `--warm-deep`, `--stone`, `--sage`, `--clay`, `--cream`, `--cream-warm`, `--paper`, plus `--gradient-warm`, `--gradient-text`, `--gradient-stone-rich`, `--gradient-hero`, and warm/glow shadow tokens). Service cards use the warm gradient on hover, the "Green Buildings" card uses a sage tint, social links light up in their brand colors (TikTok, Instagram, X, WhatsApp).
- **Accessibility:** `prefers-reduced-motion` short-circuits animations and smooth scroll; the hamburger has proper `aria-expanded` / `aria-controls` and ESC key support.
