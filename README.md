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

## Videos

Videos are YouTube or Vimeo embeds that load only on click. Don't commit video files; `.gitignore` blocks them.

## Local preview

```bash
python3 -m http.server 8080 --directory site
```

Then open http://localhost:8080.
