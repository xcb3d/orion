# My Documentation

Documentation site powered by [cmdocs](https://cmdocs.sh).

## Getting started

### Requirements

- **Node.js 20+** or **Bun 1.0+**

### Install the CLI

The easiest path — `npx` handles it for you, no install needed:

```bash
npx cmdocs dev      # start the dev server
npx cmdocs check    # validate docs before committing
```

If you run cmdocs often, install it globally:

```bash
npm install -g cmdocs
# or: bun install -g cmdocs
# or: pnpm add -g cmdocs
```

### Start the dev server

```bash
npx cmdocs dev
```

Open [http://localhost:3000](http://localhost:3000) to view your docs. The dev server hot-reloads on every save. If port 3000 is busy it picks the next available port automatically.

## Project structure

```
.
├── docs.json                # Site config — theme, navigation, navbar, SEO
├── index.mdx                # Home page
├── quickstart.mdx           # Quickstart guide
├── guides/
│   ├── writing-content.mdx  # MDX authoring guide
│   ├── components.mdx       # UI component reference
│   ├── validate.mdx         # Pre-commit lint workflow
│   └── deploy.mdx           # Deploy to the cmdocs dashboard
└── public/
    ├── favicon.svg
    └── logo/
        ├── light-logo-only.svg  # Navbar icon (light mode, ~24×24)
        ├── dark-logo-only.svg   # Navbar icon (dark mode, ~24×24)
        ├── light.svg            # Wide brand logo (light mode, for logo-only display)
        └── dark.svg             # Wide brand logo (dark mode, for logo-only display)
```

## Key files

- **`docs.json`** — Central configuration: site name, theme colors, navigation, navbar, footer, and SEO.
- **MDX files** — Documentation pages written in [MDX](https://mdxjs.com/) (Markdown + JSX components). All built-in components are auto-imported.
- **`public/`** — Static assets served at the root URL. Drop images, logos, and favicons here and reference them with absolute paths (e.g. `/logo/light.svg`).

## Common tasks

### Add a new page

1. Create a `.mdx` file with frontmatter:

   ```mdx
   ---
   title: My New Page
   description: A short description.
   ---

   # My New Page

   Content goes here.
   ```

2. Add the page as an object under the appropriate group in `docs.json`:

   ```json
   {
     "label": "Guides",
     "pages": [
       { "file": "guides/writing-content" },
       { "file": "guides/components" },
       { "file": "guides/validate" },
       { "file": "guides/deploy" },
       { "file": "guides/my-new-page" }
     ]
   }
   ```

   Every page is an object with a `file` field (MDX path without `.mdx`). Add `path` to override the URL or `label` to override the sidebar display.

### Customize the theme

Edit the `theme` section in `docs.json`. cmdocs ships with 11 presets — pick one and override the brand color:

```json
{
  "theme": {
    "preset": "neutral",
    "colors": { "primary": "#2563EB" },
    "darkMode": true
  }
}
```

Available presets: `neutral`, `black`, `vitepress`, `dusk`, `catppuccin`, `ocean`, `purple`, `solar`, `emerald`, `ruby`, `aspen`.

### Configure the navbar logo

The `navbar.logo` field supports three modes:

```jsonc
// 1. Brand name only
{ "navbar": { "title": "My Docs" } }

// 2. Square icon + brand name
{ "navbar": { "title": "My Docs", "logo": "/logo/icon.svg" } }

// 3. Logo with text baked in (hides the title)
{
  "navbar": {
    "logo": {
      "light": "/logo/light.svg",
      "dark": "/logo/dark.svg",
      "display": "logo-only",
      "width": 140,
      "height": 36
    }
  }
}
```

## Validate before committing

Run `cmdocs check` to lint `docs.json`, MDX frontmatter, referenced assets, and every internal link:

```bash
npx cmdocs check
```

Wire it into a git pre-commit hook so broken docs never reach `main`. See [guides/validate.mdx](./guides/validate.mdx) for a one-minute setup.

## Deploy

cmdocs is push-to-deploy. Connect your GitHub repo in the [cmdocs dashboard](https://cmdocs.sh) and every commit triggers a build and deploys to `<your-project>.cmdocs.app`. Production builds are handled entirely by the dashboard — there is no local `build` command. See [guides/deploy.mdx](./guides/deploy.mdx) for the walkthrough.

## Learn more

- [cmdocs Documentation](https://docs.cmdocs.sh)
- [cmdocs Dashboard](https://cmdocs.sh)
