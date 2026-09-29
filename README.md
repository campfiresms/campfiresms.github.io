# Campfire SMS

Dependency-free GitHub Pages site for Campfire SMS, including the homepage, public SMS opt-in flow, privacy policy, and SMS terms.

## Guides

The static `guides/` section contains the Grok Bot webhook-wake walkthrough, local-agent workflow articles, and links to supporting product explanations. Edit their HTML directly; no build step is required. Keep examples aligned with the product behavior, label illustrative exchanges, and update `sitemap.xml` when adding public pages. Every page uses the same header and footer markup and shared styles.css typography. Setup and articles use pages.css; guides.css adds only listing styles. Keep the shared navigation’s single signup link when editing pages. Each guide has its own title, description, canonical URL, social metadata, and Article structured data.

Preview locally with `python -m http.server 8000 --bind 127.0.0.1` and open `http://localhost:8000/`.
