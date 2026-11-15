# Focus Cinema Website

Static 3-page website (no build step needed).

```
site/                  <- the deployable website (publish this folder)
  index.html           Home
  portfolio.html       Portfolio (9 categories)
  packages.html        Monthly packages (Basic / Silver / Gold)
  images/              all photos and video thumbnails
  404.html  robots.txt  sitemap.xml  favicon.svg
render.yaml            Render static-site config (publishes ./site)
ANTIGRAVITY_PROMPT.md  full brief to hand to Antigravity AI
docs/ADDING_CONTENT.md how to add videos, photos and thumbnails
```

Preview locally: `cd site && python3 -m http.server 8000` then open http://localhost:8000

Placeholder to replace before launch: `focuscinemaa.com` (canonical, og:url, sitemap, robots, JSON-LD).

Never commit passwords, API keys or hosting credentials to this repo.
