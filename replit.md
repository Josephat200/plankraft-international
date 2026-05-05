# Plankraft International Website

A static one-page website for Plankraft International, a Nairobi-based architecture & design practice. Built as a single HTML file with embedded CSS/JS and supporting assets.

## Project Structure

```
.
├── public/                          # Web root served at port 5000
│   ├── index.html                   # The entire site (HTML + CSS + JS, single file)
│   ├── hero-bg.png                  # AI-generated Nairobi skyline hero background
│   ├── bg-what-we-do.png            # What We Do page-header background
│   ├── bg-who-we-are.png            # Who We Are page-header background
│   ├── bg-contact-us.png            # Contact Us page-header background
│   ├── KISIA PIC.jpg.jpeg           # Team photo — Kisia Kibiyi Julius
│   ├── MWITA PIC.png                # Team photo — Mwita Christopher Mangiti
│   └── gallery/                     # 16 Kenya architecture photos (portfolio)
│       ├── ke-01-kicc.jpg           # Kenyatta International Conference Centre
│       ├── ke-02-nairobi-skyline.jpg# Nairobi Upperhill skyline
│       ├── ke-03-nairobi-museum.jpg # Nairobi National Museum
│       ├── ke-04-fort-jesus.jpg     # Fort Jesus, Mombasa
│       ├── ke-05-lamu.jpg           # Lamu Old Town
│       ├── ke-06-nairobi-modern.jpg # Two Rivers Mall
│       ├── ke-07-kenya-resort.jpg   # Angama Mara eco-lodge, Maasai Mara
│       ├── ke-08-africa-modern.jpg  # Aga Khan Academy, Nairobi
│       ├── ke-09-nairobi-office.jpg # Westlands commercial hub
│       ├── ke-10-africa-villa.jpg   # Karen residential villas
│       ├── ke-11-kenya-interior.jpg # Kenyan contemporary interiors
│       ├── ke-12-kenya-green.jpg    # Nairobi green building standard
│       ├── ke-13-nairobi-road.jpg   # Nairobi Expressway
│       ├── ke-14-africa-archi.jpg   # Bomas of Kenya
│       ├── ke-15-safari-lodge.jpg   # Rift Valley tented lodges
│       └── ke-16-kenya-home.jpg     # Kenya affordable housing programme
├── package.json                     # Minimal Node project metadata and start script
├── server.js                        # Node static file server with gzip + smart caching
└── Test plankraft_international_website.html  # Original source HTML (kept for reference)
```

## How It Runs

`server.js` serves the `public/` directory on `0.0.0.0:5000` with:
- **Gzip compression** for HTML/CSS/JS files
- **Long-term caching** for images/assets (30-day max-age)
- **No-cache** for HTML so the preview always shows fresh content

The single workflow `Start application` runs `npm start` on port 5000.

## Local Editing

Edit `public/index.html` directly. No build step — just refresh the preview.

## Site Features

- **Four sections** (Home, What We Do, Who We Are, Contact Us) shown via JS `showSection()` switching, with hash-based deep links.
- **What We Do — Portfolio showcase:** dropdown category filter (All / Hospitality & Leisure / Civil & Culture / Residential / Offices / Retail / Industrial & Transport / Mixed Use / Health & Education) + 4-column responsive project grid. Clicking any card opens a full-screen lightbox modal with large featured image, thumbnail strip for multi-image projects, project title / location / year / description, Prev/Next navigation, and keyboard support (Escape / Arrow keys).
- **Who We Are:** team cards for Kisia Kibiyi Julius and Mwita Christopher Mangiti with photos, roles, bios, and skill tags. Stats strip with animated counters.
- **Who We Are:** team cards for Kisia Kibiyi Julius and Mwita Christopher Mangiti with photos, roles, bios, and skill tags.
- **Scroll-reveal animations** via IntersectionObserver.
- **Floating ambient orbs** on the hero with CSS keyframe animation and mouse-parallax.
- **Animated stat counters** on the hero.
- **Navigation:** sticky frosted nav bar with scroll shadow, animated gradient underline for active page, hamburger drawer on ≤ 900px.
- **Scroll affordances:** gold-gradient progress bar, floating "Top" button.
- **Color system:** CSS custom properties (`--warm`, `--stone`, `--sage`, `--clay`, `--cream`, `--paper`, gradients and shadow tokens).
- **Accessibility:** `prefers-reduced-motion` disables animations; hamburger has `aria-expanded`/`aria-controls`; ESC key closes mobile nav and lightbox modal.
- **Performance:** gzip compression server-side, images lazy-loaded, 30-day image cache headers.
