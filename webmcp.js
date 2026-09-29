(() => {
  "use strict";

  // The current WebMCP draft exposes document.modelContext. Cloudflare's
  // readiness scanner still injects the earlier navigator.modelContext API,
  // so support both during the transition.
  const modelContext = document.modelContext ?? navigator.modelContext;
  if (!modelContext || typeof modelContext.registerTool !== "function") return;

  const registration = new AbortController();
  const pages = Object.freeze({
    home: "https://campfiresms.com/",
    about: "https://campfiresms.com/about.html",
    install: "https://campfiresms.com/install.html",
    guides: "https://campfiresms.com/guides/",
    grokWake: "https://campfiresms.com/guides/grok-bot-sms-routine.html",
    bridge: "https://campfiresms.com/sms-bridge-coding-agents/",
    pager: "https://campfiresms.com/coding-agent-pager/",
    privacy: "https://campfiresms.com/privacy.html",
    terms: "https://campfiresms.com/terms.html",
    setup: "https://api.campfiresms.com/join",
    login: "https://api.campfiresms.com/login",
  });

  const register = (tool) => {
    try {
      const result = modelContext.registerTool(tool, { signal: registration.signal });
      if (result && typeof result.catch === "function") void result.catch(() => {});
    } catch {
      // WebMCP is progressive enhancement; normal site navigation must remain
      // available when an experimental implementation rejects registration.
    }
  };

  register({
    name: "campfiresms_get_site_info",
    title: "Get CampfireSMS site information",
    description: "Return CampfireSMS capabilities, safety boundaries, and canonical setup links.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, untrustedContentHint: false },
    execute() {
      return JSON.stringify({
        product: "CampfireSMS",
        purpose: "Hosted two-way SMS bridge for Grok Bot webhook wake and active local-agent connections",
        supports: ["incoming SMS triggers a configured Grok Bot cloud routine", "SMS updates and replies with active local agents", "task instructions within existing authority"],
        grokWebhookWake: {
          behavior: "Incoming SMS queues a message and wake event. Grok’s cloud routine retrieves the message through hosted MCP and can reply by SMS while the user’s PC is off.",
          requirements: "Hosted MCP with the owning installation’s bearer, an active webhook routine, and its URL and key saved in the CampfireSMS account.",
          verification: "A real SMS, webhook run, authenticated message retrieval, and received SMS reply. A webhook probe confirms acceptance only.",
          guide: pages.grokWake,
        },
        doesNotSupport: ["running an AI model", "native approvals", "permission grants", "secret transfer"],
        about: pages.about,
        compatibleAgents: ["Codex", "Grok", "Claude", "OpenCode", "other compatible MCP or HTTP API hosts"],
        setupRequirements: "Grok Bot: enroll an installation, connect hosted MCP securely, and configure webhook wake. Local agents: install the connector; detected Codex and Grok Build CLIs can be registered automatically.",
        vmSetup: "Linux/VM: run as the agent user, create and activate a Python 3.12+ venv before npx setup, and configure MCP with its absolute Python path. Do not use sudo pip, system pip, or --break-system-packages. Hosted MCP needs no pip install. See https://campfiresms.com/install.html#linux-vm.",
        localConnectorRequirements: "For local connections, keep the computer awake and online with the agent running and checking for replies. A local scheduled workflow needs an available runtime. The local connector does not wake stopped sessions.",
        smsPrivacy: "SMS is not end-to-end encrypted.",
        pricing: `${pages.home}#pricing`,
        install: pages.install,
        setup: pages.setup,
      });
    },
  });

  register({
    name: "campfiresms_open_page",
    title: "Open a CampfireSMS page",
    description: "Navigate this browser tab to a canonical CampfireSMS information, setup, or account page.",
    inputSchema: {
      type: "object",
      properties: {
        page: {
          type: "string",
          enum: Object.keys(pages),
          description: "The CampfireSMS page to open.",
        },
      },
      required: ["page"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: false, untrustedContentHint: false },
    execute({ page }) {
      const destination = pages[page];
      if (!destination) throw new TypeError("Unknown CampfireSMS page");
      window.location.assign(destination);
      return `Opening ${destination}`;
    },
  });
})();
