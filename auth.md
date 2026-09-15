# CampfireSMS authentication

CampfireSMS does not support autonomous agent registration or OAuth.

## User enrollment

A human user starts at https://api.campfiresms.com/join, verifies control of a
phone number, and runs the single-use installation command on the computer that
will use CampfireSMS. The installer stores a separate installation credential
locally. Agents must not ask users to paste that credential, a verification
code, password, API key, or other secret into chat.

## MCP and REST authentication

The hosted MCP endpoint is `https://api.campfiresms.com/mcp`. Authenticated MCP
and bridge REST requests use the installation credential as an HTTP bearer:

`Authorization: Bearer <installation-credential>`

The credential is scoped to one installation and can be revoked independently
from the user's CampfireSMS account. A verified phone and installation bearer
do not grant authority to approve tools, reveal secrets, perform destructive
work, or bypass the coding agent's native approval system.

## Human account access

Existing users sign in at https://api.campfiresms.com/login using the supported
phone-verification and PIN flow. Agents should direct the user to that page and
must not collect or submit the user's PIN or verification code.
