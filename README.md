# ryan-portfolio

Ryan Lussing's personal portfolio site. Plain static HTML, CSS and JS.

## Folder layout

| Folder      | What it holds |
|-------------|---------------|
| `design/`   | `reference.html`, the approved design. It's the source of truth for layout and styling. |
| `assets/`   | Source assets: `images/`, `fonts/` and `logo/`. Files are copied into `site/` as needed. |
| `site/`     | The deployable website. **This is the folder GitHub Pages publishes.** It must work on its own, so it uses relative paths only. |

Inside `site/`:

- `index.html`: the page markup
- `css/styles.css`: all styles, with design tokens as CSS variables at the top
- `js/main.js`: interactions (project grid, video embeds)
- `data/projects.json`: portfolio entries. Add a project here without touching the layout.
- `images/`: images used by the site
- `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`: placeholder icons

## Adding or editing a project

Each entry in `site/data/projects.json` becomes one card, in the order listed:

| Field | Required | Notes |
|-------|----------|-------|
| `title` | yes | Card heading |
| `role` | yes | Small uppercase label above the title |
| `description` | yes | Wrap a title in `*asterisks*` to italicise it |
| `thumbnail` | one of these two | Image path, e.g. `images/my-project.webp` (put the file in `site/images/`) |
| `textThumbnail` | | `{ "brand": "...", "headline": "..." }` for a text-only thumbnail when there's no artwork |
| `thumbnailAlt` | with `thumbnail` | Describes the image for screen readers |
| `thumbnailPosition` | no | Which part of the image the 16:10 card shows, as a CSS `object-position` (default `center`). Tall posters usually want `center 10%` or so to keep faces in frame. |
| `tags` | no | Chips shown on the thumbnail |
| `videos` | no | One button per video: `[{ "url": "...", "label": "Watch teaser", "title": "Damaged — Teaser" }]`. `label` is the button text (default "Play video"); `title` is the pop-up heading (defaults to the project `title`). |
| `links` | no | `[{ "label": "Visit site", "url": "https://..." }]`, opened in a new tab |

## Videos

Videos are YouTube or Vimeo embeds. The player only loads when someone clicks a video button, and it opens in a pop-up. Paste a normal share link as the video `url` (`youtube.com/watch?v=…`, `youtu.be/…`, `vimeo.com/…`, including unlisted Vimeo links). Don't commit video files; `.gitignore` blocks them.

## Publishing

The site is hosted on GitHub Pages at https://ryanlussing.com. Every push to `main` that changes `site/` runs `.github/workflows/pages.yml`, which publishes the `site/` folder. Progress shows on the repo's **Actions** tab, usually live within a minute or two.

DNS is at GoDaddy. The website records are:

| Type | Name | Value |
|------|------|-------|
| A | `@` | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (four records) |
| AAAA | `@` | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` (four records) |
| CNAME | `www` | `gitryguy.github.io` |
| TXT | `_github-pages-challenge-GiTRyGuy` | Domain verification value from GitHub |

The MX records (GoDaddy email) are separate and must stay as they are.

## Local preview

```bash
python3 -m http.server 8080 --directory site
```

Then open http://localhost:8080.
