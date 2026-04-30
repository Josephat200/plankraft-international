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
