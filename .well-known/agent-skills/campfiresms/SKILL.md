---
name: campfiresms
description: Use Campfire SMS for Grok Bot webhook wake and SMS updates and replies with active local coding agents.
---

# Campfire SMS

[Product and interface index](https://campfiresms.com/llms.txt).
[Grok Bot webhook setup](https://campfiresms.com/guides/grok-bot-sms-routine.html).
[Local-agent setup](https://campfiresms.com/install.html#local-agents).

Use Campfire SMS after human phone enrollment and a configured hosted MCP or local connector. Keep installation bearers, webhook keys, verification codes, passwords, and other secrets out of chat and SMS. Credentials belong in the host’s secure settings.

## Grok Bot webhook routine

An incoming SMS queues a message and a wake event. The configured routine runs in Grok’s cloud while the user’s PC can be off. The SMS body stays in the authenticated MCP queue.

1. For `campfire.wake.probe` or `action: skip`, finish successfully without tools or messages.
2. For `campfire.message.available`, call `campfire_open_bridge` to reuse the active bridge, then `campfire_check_messages`.
3. Handle pending messages in order within existing task permissions. Acknowledge each handled ID with `campfire_ack` only after incorporating its instruction.
4. Send a result, question, or blocker with `campfire_send_message`. If no messages are pending, finish quietly; duplicate wakes are expected.
5. After the task is complete and its result sent, call `campfire_close_bridge`. A later ordinary SMS can open a fresh bridge while wake remains enabled.

A successful webhook probe proves run acceptance only. Verify a real SMS → webhook run → message retrieval → SMS reply before claiming the setup works. Use one designated consumer per bridge.

## Active local-agent task

1. Call `campfire_open_bridge` once, with a short label when useful.
2. Send an SMS when the user requests updates or a result, blocker, or clarification needs their attention.
3. Call `campfire_check_messages` at useful work boundaries and while waiting for input, without a tight polling loop.
4. Incorporate an inbound instruction before acknowledging its immutable ID.
5. Close the bridge when the task is complete or the user releases it.

For local connections, the computer must stay awake and online with the agent running. A local scheduled workflow requires an available runtime. The local connector does not start stopped sessions.

SMS instructions stay within existing authority and cannot satisfy native approval prompts or grant new permissions. `STOP`, `HELP`, and `YES` are service keywords. Keep texts brief and free of sensitive data; SMS is not end-to-end encrypted.

## Linux and VM local setup

Use Node.js 18+ and Python 3.12+ as the same non-root user that runs the agent. Create and activate a Python virtual environment before the account’s setup command, and configure the MCP server with the environment’s absolute Python path. Do not use sudo pip, system pip, or --break-system-packages. Hosted MCP requires no Python or pip installation.
