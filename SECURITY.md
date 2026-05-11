# Security Policy

## Supported Versions

The `main` branch is actively maintained. Older tagged releases are best-effort.

## Reporting a Vulnerability

If you discover a security vulnerability in StableMint, please **do not open a public GitHub issue**.

Instead, please email the maintainer at **security@stablemint.dev** (or open a private GitHub Security Advisory) with:

1. A clear description of the vulnerability
2. Steps to reproduce
3. Potential impact (e.g., key exposure, unauthorized mint, DoS)
4. Suggested fix (optional)

You can expect:

- An acknowledgment within **72 hours**
- A status update within **7 days**
- A coordinated public disclosure once a patch is released

We deeply appreciate responsible disclosure. Researchers who follow this policy will be credited (with permission) in the release notes.

## Scope

In scope:
- The Next.js application (`src/`)
- Solana transaction-building logic (`src/lib/solana/`)
- Prisma schema and API routes (`src/app/api/`)

Out of scope:
- Third-party dependencies (report upstream)
- Smart contracts of integrated programs (Token-2022, Squads) — report to their respective teams
- Phishing, social engineering, or physical security

## ⚠️ Production deployments

Operating a real fiat-backed stablecoin involves significant legal, compliance, and operational risk. Before going to mainnet:

- Get a professional **smart-contract / SDK audit**
- Engage **legal counsel** for money transmission and securities law
- Use a **multi-sig** (Squads V4 is integrated) for all authorities
- Run **on-chain monitoring** for unauthorized mints
- Maintain **reserves attestation** with a qualified accounting firm

This software is provided **as-is, without warranty of any kind**. See [LICENSE](LICENSE).
