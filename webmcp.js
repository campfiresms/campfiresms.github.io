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
    install: "https://campfiresms.com/install.html",
    guides: "https://campfiresms.com/guides/",
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
        purpose: "SMS bridge for an already-running coding-agent task",
        supports: ["concise progress updates", "questions and replies", "task instructions within existing authority"],
        doesNotSupport: ["running an AI model", "native approvals", "permission grants", "secret transfer"],
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
