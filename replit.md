# Plankraft International Website

A static one-page website for Plankraft International, a Nairobi-based architecture & design practice. Built as a single HTML file with embedded CSS/JS and two team photos.

## Project Structure

```
.
├── public/                          # Web root served at port 5000
│   ├── index.html                   # The entire site (HTML + CSS + JS, single file)
│   ├── KISIA PIC.jpg.jpeg           # Team photo — Kisia Kibiyi Julius
│   ├── MWITA PIC.png                # Team photo — Mwita Christopher Mangiti
│   └── gallery/                     # 16 Kenya architecture photos on "What We Do"
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
├── server.py                        # Python static file server with gzip + smart caching
└── Test plankraft_international_website.html  # Original source HTML (kept for reference)
```

## How It Runs

`server.py` serves the `public/` directory on `0.0.0.0:5000` with:
- **Gzip compression** for HTML/CSS/JS files (significant speed improvement)
- **Long-term caching** for images/assets (30-day max-age)
- **No-cache** for HTML so the preview always shows fresh content
- Server request logs suppressed for cleaner output

The single workflow `Start application` runs `python3 server.py` on port 5000.

## Local Editing

Edit `public/index.html` directly. No build step — just refresh the preview.

## Site Features

- **Four sections** (Home, What We Do, Who We Are, Contact Us) shown via JS `showSection()` switching, with hash-based deep links.
- **Kenya architecture gallery** on the "What We Do" page: 16 cards of celebrated Kenyan buildings — from KICC and Fort Jesus to Lamu Old Town, safari eco-lodges, and Nairobi's green buildings. All content, images, and descriptions are Kenya-specific.
- **Scroll-reveal animations** via IntersectionObserver: gallery cards fade+slide in as user scrolls, staggered by column position.
- **Floating ambient orbs** on the hero: three blurred radial-gradient circles that drift with CSS keyframe animation and follow mouse movement with parallax.
- **Animated stat counters** on the hero: numbers count up from zero when they scroll into view.
- **Service items animation** on "What We Do": cards animate in with staggered CSS keyframes when the section is activated.
- **Navigation:** sticky frosted nav bar with scroll shadow + gold glow, animated gradient underline for active page, hamburger drawer on ≤ 900px.
- **Scroll affordances:** gold-gradient progress bar, floating "Top" button, smooth section transitions.
- **Color system:** CSS custom properties (`--warm`, `--stone`, `--sage`, `--clay`, `--cream`, `--paper`, gradients and shadow tokens). Service cards use warm gradient on hover, "Green Buildings" card uses sage tint.
- **Accessibility:** `prefers-reduced-motion` disables animations; hamburger has `aria-expanded`/`aria-controls`; ESC key closes mobile nav.
- **Performance:** gzip compression server-side, images lazy-loaded, image caching headers, GPU-composited transforms for animations.
