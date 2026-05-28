# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the site

This is a static site with no build step. Open `index.html` directly in a browser or serve it with:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`. Use VS Code's Live Server extension for hot-reload during development.

## Architecture

Single-page portfolio for Jimmy Cabalceta Alpizar. Everything lives in one HTML file with no framework, no bundler, and no dependencies to install.

**Styling approach — two layers:**
- Tailwind CSS (loaded via CDN, both v3 and the browser v4 bundle) handles layout and spacing utilities.
- `css/style.css` defines the design system via CSS custom properties (`--primary`, `--secondary`, `--accent`) and reusable component classes (`.project-card`, `.certificate-card`, `.skill-item`, `.btn-primary`, `.section-title`, `.progress-bar`). Custom classes take precedence over Tailwind when both apply.

**Color palette** (defined in `:root` in `style.css`):
- Background: `#1a1a1a` (`--primary`), cards: `#252525` (`--secondary`)
- Accent/indigo: `#4F46E5` (`--accent`) — matches Tailwind's `indigo-500`/`indigo-600`

**JS** (`js/script.js`) is minimal: mobile nav toggle and two mailto redirect handlers. No state management.

**Commented-out content in `index.html`**: the contact form section, a second education entry, and two additional certification cards are commented out — they are placeholders, not dead code.

## Adding content

- **New project card**: copy an existing `<!-- Project N -->` block inside the `#projects` grid and update the video/image source, title, description, tech tags, and links.
- **New certification**: copy a `certificate-card` block inside the `#certifications` grid.
- **Skills progress bars**: the `style` attribute `width: X%` on `.progress` elements controls the visual fill; update both the displayed `<span>` percentage and the inline width together.
- **Media assets** go in `assets/`; profile photo goes in `img/`.
