# Campfire SMS

Dependency-free GitHub Pages site for Campfire SMS, including the homepage, public SMS opt-in flow, privacy policy, and SMS terms.

## Guides

The static `guides/` section contains the Grok Bot webhook-wake walkthrough, local-agent workflow articles, and links to supporting product explanations. Edit their HTML directly; no build step is required. Keep examples aligned with the product behavior, label illustrative exchanges, and update `sitemap.xml` when adding public pages. Every page uses the same header and footer markup and shared styles.css typography. Setup and articles use pages.css; guides.css adds only listing styles. Keep the shared navigation’s single signup link when editing pages. Each guide has its own title, description, canonical URL, social metadata, and Article structured data.

Preview locally with `python -m http.server 8000 --bind 127.0.0.1` and open `http://localhost:8000/`.

## Coding-agent search pages

The root directories `codex-sms/`, `claude-code-sms/`, `codex-phone-notifications/`, `claude-code-phone-notifications/`, `remote-control-codex/`, `remote-control-claude-code/`, `approve-coding-agent-from-phone/`, `photon-vs-campfiresms/`, `agentphone-vs-campfiresms/`, `agentcall-vs-campfiresms/`, `textbee-vs-campfiresms/`, `sendblue-vs-campfiresms/`, `imessage-vs-sms-coding-agents/`, and `twilio-coding-agent-sms/` contain distinct static articles. They share `agent-guides.css`, include examples and related links, and are listed in the guides hub, sitemap, and `llms.txt`.

Edit the HTML directly. Keep the existing-agent positioning accurate: no Campfire SMS project or repo import is required, but account verification and connector setup are. Local sessions must remain active and check replies. SMS task decisions do not replace native permissions. Cite current primary sources for competitor and client-feature comparisons, and update visible review dates and structured metadata when the content changes. Keep keyword variants for the same intent on one canonical article rather than adding duplicate pages.
