# Mikey Studio landing page

A responsive premium developer portfolio and digital-product marketplace landing page.

## Project structure

```
Mikey/
├── index.html            # Homepage
├── pages/                # Subpages
│   ├── about.html
│   ├── portfolio.html
│   ├── services.html
│   └── work.html
├── css/                  # Stylesheets
│   ├── styles.css
│   └── subpage.css
├── js/                   # Scripts
│   ├── app.js
│   └── shop.js
└── assets/               # Static media
    └── images/
        └── homepage.jpg
```

## Preview locally

Open `index.html` directly, or serve this directory with a static server:

```powershell
python -m http.server 4173
```

Then visit `http://localhost:4173`.

## Included interactions

- Product category filters and instant search
- Theme toggle
- Accessible FAQ disclosure controls
- Testimonial carousel
- Scroll-triggered content reveals and reduced-motion support
