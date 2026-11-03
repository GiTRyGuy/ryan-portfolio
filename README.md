# ryan-portfolio

Ryan Lussing's personal portfolio site. Plain static HTML, CSS and JS.

## Folder layout

| Folder      | What it holds |
|-------------|---------------|
| `design/`   | `reference.html`, the approved design. It's the source of truth for layout and styling. |
| `assets/`   | Source assets: `images/`, `fonts/` and `logo/`. Files are copied into `site/` as needed. |
| `site/`     | The deployable website. **This is the folder the host publishes.** It must work on its own, so it uses relative paths only. |

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
| `tags` | no | Chips shown on the thumbnail |
| `videoUrl` | no | YouTube or Vimeo link. Leave it empty to hide the video button. |
| `videoLabel` | no | Button text (default "Play video") |
| `videoTitle` | no | Heading in the video pop-up (defaults to `title`) |
| `links` | no | `[{ "label": "Visit site", "url": "https://..." }]`, opened in a new tab |

## Videos

Videos are YouTube or Vimeo embeds. The player only loads when someone clicks the video button, and it opens in a pop-up. Paste a normal share link into `videoUrl` (`youtube.com/watch?v=…`, `youtu.be/…`, `vimeo.com/…`, including unlisted Vimeo links). Don't commit video files; `.gitignore` blocks them.

## Local preview

```bash
python3 -m http.server 8080 --directory site
```

Then open http://localhost:8080.
