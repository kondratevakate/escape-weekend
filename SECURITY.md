# Security Policy

## Reporting a vulnerability

**Please do not open a public GitHub issue for security problems.**

Instead, message the curator directly: [@twoushka_bot](https://t.me/twoushka_bot) on Telegram with subject line `[security]`.

Include:
- A description of the issue
- Steps to reproduce (or a proof-of-concept)
- Affected URL / commit hash if known
- Your suggested severity (low / medium / high / critical)

You'll get an acknowledgement within 72 hours. We aim to ship a fix or a mitigation within 14 days for high/critical issues.

## Scope

WoWAtlas is currently a client-side app. The most likely attack surfaces are:

- XSS via user-submitted club post content (markdown rendering)
- Malicious payloads in `locations.json` PRs (we manually review every place PR)
- Open redirects via Telegram deeplink utilities

If you find anything outside this scope (e.g. supply-chain risk in a dependency), please still report.

## Out of scope

- Reports about missing security headers on the demo site (Lovable hosts it; we don't control headers)
- Self-XSS that requires the victim to paste code into devtools
- Issues requiring a compromised browser extension

## Recognition

We don't have a paid bounty program (yet). Reporters of legitimate issues will be credited in [`CHANGELOG.md`](./CHANGELOG.md) unless they prefer to remain anonymous.

Thank you for keeping the community safe.
