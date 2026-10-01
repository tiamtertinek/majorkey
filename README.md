# MajorKey — website redesign

Static build of three redesigned pages, structured for a native Webflow rebuild (Povio Webflow design rules v1.3.0).

| Page | File | Design |
|---|---|---|
| Homepage | `index.html` | `Homepage-Redesign.png` |
| Products | `products.html` | `Products-Redesign.png` |
| Capabilities | `capabilities.html` | `Capabilities-Redesign.png`, `Capabilities - Collapsed-Redesign.png` |

- `style.css` — single site stylesheet (section order)
- `script.js` — behaviour + GSAP motion (ScrollTrigger, SplitText) + Swiper
- `povio-template.css` — **preview-only** stand-in for the Webflow template variables and `u-*` utilities; do not migrate
- `HANDOFF.md` — notes for the Webflow developer (variables, components, CMS fields, exceptions)

## Run locally

```bash
python3 -m http.server 5173
```

Then open http://localhost:5173.
