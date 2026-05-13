<div align="center">

<img src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png" width="84" alt="Solana"/>

# 🪙 StableMint — The Open-Source Solana Stablecoin SaaS Platform

### Launch, manage, and scale **production-ready stablecoins on Solana** in minutes. No Metaplex. No backend keys. 100% Token-2022 native.

[![Solana](https://img.shields.io/badge/Solana-Token--2022-9945FF?style=for-the-badge&logo=solana&logoColor=white)](https://solana.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](CONTRIBUTING.md)
[![Stars](https://img.shields.io/github/stars/mrtomdev/solana-stablecoin-saas?style=for-the-badge&logo=github&color=yellow)](https://github.com/mrtomdev/solana-stablecoin-saas/stargazers)

**[🚀 Quick Start](#-quick-start) · [✨ Features](#-features) · [📚 Docs](#-documentation) · [❓ FAQ](#-faq) · [📸 Screenshots](#-screenshots) · [🏗️ Architecture](#️-architecture) · [🤝 Contributing](CONTRIBUTING.md)**

> The fastest way to launch a **fiat-backed, multi-sig governed, fully-auditable stablecoin on Solana**. Built for DeFi founders, fintechs, banks, and treasuries. Built on SPL Token-2022 for enterprise-grade compliance.

</div>

---

## ⭐ Why StableMint?

Launching a **stablecoin used to require** an army of Rust developers, a custom Solana program, custodial infrastructure, and 6+ months of audits. **StableMint changes that.**

It ships a complete **stablecoin issuance & operations platform** built entirely on **SPL Token-2022 extensions** — no custom on-chain program required, no Metaplex dependency, no server-side private keys, 100% open-source.

> If [Circle (USDC)](https://www.circle.com), [Tether (USDT)](https://tether.to), [Paxos (USDP)](https://paxos.com), and [PayPal (PYUSD)](https://www.paypal.com/pyusd) had an **open-source little sibling**, this would be it.

**Who Should Use StableMint?**
- 🏦 **Banks & Fintechs**: Launch CBDC-equivalent stablecoins on Solana
- 💰 **Treasuries**: Issue corporate or sovereign stablecoins for treasury management
- 🪙 **DeFi Protocols**: Create collateralized stablecoins (like MakerDAO but simpler)
- 📈 **Fintech Startups**: Skip 6-month dev cycles; go live in days

---

## ✨ Features

### 🔥 Core Issuance — Stablecoin Creation
- ✅ **One-click stablecoin creation** — SPL Token-2022 with `MetadataPointer` extension (no Metaplex)
- ✅ **Native on-chain metadata** — name, symbol, image, description embedded directly in the mint
- ✅ **Configurable decimals, supply cap, and authorities** for your stablecoin
- ✅ **Devnet & mainnet-beta support** out of the box
- ✅ **Mint, Burn, Freeze, Thaw** — full authority control flows for stablecoin management

### 🛡️ Governance & Compliance
- ✅ **Squads V4 multi-sig integration** (`@sqds/multisig`) — enterprise-grade key management for stablecoin governance
- ✅ **Freeze / Thaw individual accounts** — KYC, AML, OFAC compliance workflows built-in
- ✅ **Global Pause & per-action pause** — Mint, Burn, Transfer, Freeze independently pausable
- ✅ **Audit log** of every admin action with wallet, signature, and timestamp for regulatory compliance
- ✅ **Role-based admin auth** via wallet signature (no API keys)

### 📊 Real-Time Monitoring & Analytics
- ✅ **Live peg monitor** — track USD price deviation with configurable threshold alerts
- ✅ **Supply analytics** — historical supply snapshots, holder count, growth charts (Recharts)
- ✅ **Fee revenue dashboard** — per-fee-type breakdown with daily/weekly/monthly views
- ✅ **Transaction explorer** — paginated, filterable history of all admin operations
- ✅ **Pause history** with reason tracking for compliance audits

### 💰 Economic Controls & Fee Engine
- ✅ **Configurable fee engine** — mint fee, burn fee, transfer fee, stability fee, liquidation penalty
- ✅ **Fee collector address** routing for revenue management
- ✅ **Liquidity reserve tracking** — collateral ratio, reserve target, runway alerts
- ✅ **Peg config** — target price + deviation threshold per token

### 🚨 Risk Management — Circuit Breakers
- ✅ **Circuit breakers** — auto-pause if supply changes more than X% in N minutes
- ✅ **Configurable per-mint thresholds** for different stablecoins
- ✅ **Emergency global kill switch** for immediate market halts

### 🎨 Developer & UX Excellence
- ✅ **100% client-side transaction signing** — zero private keys server-side (security first)
- ✅ **TanStack Query** for snappy, cached UX
- ✅ **Tailwind + custom design system** — looks great out of the box
- ✅ **Wallet adapter** — Phantom, Solflare, Backpack, Ledger, and 30+ wallets supported
- ✅ **Prisma + SQLite** for fast local dev — drop in PostgreSQL for production
- ✅ **Strict TypeScript**, ESLint, Next.js 16 App Router, React 18, RSC-ready

---

## 📚 Documentation

**Quick Links to Deep Dives**:
- 📖 **[FAQ.md](docs/FAQ.md)** — 50+ questions on stablecoins, Token-2022, governance, and compliance
- 🔐 **[SECURITY.md](SECURITY.md)** — Security practices, responsible disclosure, legal disclaimers
- 🤝 **[CONTRIBUTING.md](CONTRIBUTING.md)** — How to contribute code, report bugs, request features
- 🎯 **[SEO.md](docs/SEO.md)** — SEO strategy, content roadmap, keyword research

---

## ❓ FAQ — Popular Questions

<details>
<summary><strong>What is Token-2022 and why does StableMint use it?</strong></summary>

**Token-2022** is the next-generation token standard for Solana, featuring native metadata, transfer hooks, and built-in fee support. Unlike legacy SPL tokens:
- ✅ No Metaplex dependency (metadata stored on-mint)
- ✅ Native transfer fees (no middleware)
- ✅ Freeze/Thaw for compliance (KYC/AML/OFAC)

👉 **Full explanation**: [docs/FAQ.md#what-is-token-2022](docs/FAQ.md#what-is-token-2022)
</details>

<details>
<summary><strong>Can I deploy StableMint on mainnet?</strong></summary>

**Yes.** StableMint is production-ready on mainnet-beta. However:
- ⚠️ Ensure regulatory compliance before issuing real stablecoins
- ⚠️ Maintain >100% collateral reserves
- ⚠️ Consider external audits for >$1M TVL

👉 **Full guide**: [docs/FAQ.md#can-i-use-stablemint-on-mainnet](docs/FAQ.md#can-i-use-stablemint-on-mainnet)
</details>

<details>
<summary><strong>What's the difference between Freeze and Pause?</strong></summary>

| Mechanism | Scope | Use Case |
|-----------|-------|----------|
| **Freeze** | Single wallet | KYC/AML/OFAC compliance |
| **Pause** | All users | Emergency supply halt |

👉 **Full comparison**: [docs/FAQ.md#whats-the-difference-between-freeze-and-pause](docs/FAQ.md#whats-the-difference-between-freeze-and-pause)
</details>

<details>
<summary><strong>How does the fee engine work?</strong></summary>

StableMint supports 5 independent fee types: mint, burn, transfer, stability, and liquidation fees. All revenue routes to your treasury address.

👉 **Full details**: [docs/FAQ.md#how-does-the-fee-engine-work](docs/FAQ.md#how-does-the-fee-engine-work)
</details>

**👉 More FAQs**: [docs/FAQ.md](docs/FAQ.md)

---

## 📸 Screenshots

> Drop your dashboard screenshots into `/docs/screenshots/` and they'll render here.

| Landing | Create Stablecoin | Dashboard |
|---|---|---|
| ![Landing](docs/screenshots/landing.png) | ![Create](docs/screenshots/create.png) | ![Dashboard](docs/screenshots/dashboard.png) |

| Mint & Burn | Peg Monitor | Fee Revenue |
|---|---|---|
| ![Mint](docs/screenshots/mint.png) | ![Peg](docs/screenshots/peg.png) | ![Fees](docs/screenshots/fees.png) |

---

## 🚀 Quick Start

**Launch a production stablecoin in 5 minutes:**

```bash
# 1. Clone
git clone https://github.com/mrtomdev/solana-stablecoin-saas.git
cd solana-stablecoin-saas

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
#   → set NEXT_PUBLIC_SOLANA_RPC_URL (Helius / QuickNode / public devnet)
#   → set DATABASE_URL (defaults to local SQLite)

# 4. Setup database
npx prisma generate
npx prisma db push

# 5. Run locally
npm run dev
```

**Open [http://localhost:3000](http://localhost:3000):**
1. Connect your Solana wallet (Phantom, Solflare, etc.)
2. Click **Create Stablecoin**
3. Sign one transaction
4. **Your stablecoin is live on Solana** ✨

**For mainnet deployment**, see [docs/FAQ.md#can-i-deploy-stablemint-to-production](docs/FAQ.md#can-i-deploy-stablemint-to-production).

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                        BROWSER (Wallet)                            │
│   Phantom · Solflare · Backpack · Ledger · 30+ adapters            │
└──────────────────┬─────────────────────────┬───────────────────────┘
                   │ signs                   │ reads
                   ▼                         ▼
┌──────────────────────────┐     ┌──────────────────────────┐
│   Next.js 16 App Router  │     │      Solana RPC          │
│   ─────────────────────  │     │   (Helius / QuickNode)   │
│   /create  /dashboard    │     └──────────────┬───────────┘
│   /api/peg /api/fees ... │                    │
└──────────┬───────────────┘                    │
           │                                    │
           │ Prisma ORM                         │
           ▼                                    ▼
┌──────────────────────┐         ┌──────────────────────────┐
│  SQLite / Postgres   │         │  SPL Token-2022 Mint     │
│  ─────────────────   │         │  + MetadataPointer       │
│  Configs · Audit Log │         │  + Squads V4 Multi-sig   │
│  Snapshots · Fees    │         └──────────────────────────┘
└──────────────────────┘
```

### Tech Stack

| Layer | Tech |
|---|---|
| **Frontend** | Next.js 16 · React 18 · TypeScript 5 · Tailwind 3.4 |
| **State** | TanStack Query · React Context |
| **Blockchain** | `@solana/web3.js` · `@solana/spl-token` (Token-2022) · `@solana/spl-token-metadata` |
| **Wallets** | `@solana/wallet-adapter-*` (Phantom, Solflare, Backpack, +30) |
| **Multi-sig** | `@sqds/multisig` (Squads V4) |
| **Backend** | Next.js API Routes · Prisma 5 · SQLite (dev) / PostgreSQL (prod) |
| **Charts** | Recharts |
| **UX** | react-hot-toast · custom design system |

---

## 📂 Project Structure

```
src/
├── app/
│   ├── api/                  # REST API routes
│   │   ├── analytics/supply  # Supply snapshots & analytics
│   │   ├── fees/             # Fee config + revenue
│   │   ├── liquidity/        # Reserve config
│   │   ├── pause/            # Pause state, circuit breaker, history
│   │   ├── peg/              # Peg config + historical data
│   │   └── token/            # Token info, holders, transactions
│   ├── create/               # Stablecoin creation flow
│   ├── dashboard/
│   │   ├── mint, burn        # Mint / burn operations
│   │   ├── freeze            # Freeze / thaw accounts
│   │   ├── peg               # Peg monitoring dashboard
│   │   ├── fees              # Fee engine config
│   │   ├── liquidity         # Reserves & collateral tracking
│   │   ├── pause             # Global pause + circuit breakers
│   │   ├── transactions      # Audit log explorer
│   │   └── settings          # Token settings
│   └── page.tsx              # Marketing landing page
├── components/
│   ├── dashboard/            # 14 dashboard widgets
│   └── ui/                   # Button · Card · Dialog · Input
├── contexts/                 # Wallet · Token · Config providers
├── hooks/                    # useFees · usePeg · usePause · useSquads · ...
├── lib/
│   ├── solana/               # Token-2022 ops, metadata, Squads, account utils
│   └── db/                   # Prisma client + queries
prisma/schema.prisma          # 10 models: config, audit, peg, fees, pause, ...
```

---

## 🔑 Environment Variables

```dotenv
# Solana Blockchain Configuration
NEXT_PUBLIC_SOLANA_NETWORK=devnet                    # devnet | mainnet-beta
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_MINT_ADDRESS=                            # auto-set after stablecoin creation

# Database Configuration
DATABASE_URL="file:./prisma/dev.db"                  # or postgresql://user:pass@host/db

# Optional: Squads V4 Multi-sig Integration
NEXT_PUBLIC_SQUADS_MULTISIG=

# Optional: Oracle Configuration (future)
NEXT_PUBLIC_PYTH_PROGRAM_ID=
NEXT_PUBLIC_SWITCHBOARD_PROGRAM_ID=
```

---

## 🧪 Roadmap

### ✅ Completed
- [x] Token-2022 issuance with native metadata
- [x] Mint / Burn / Freeze / Thaw flows
- [x] Squads V4 multi-sig integration
- [x] Peg monitor with deviation alerts
- [x] Configurable fee engine + revenue tracking
- [x] Circuit breakers + global pause
- [x] Audit log for every admin action
- [x] Comprehensive documentation & FAQ

### 🔄 In Progress
- [ ] Pyth / Switchboard oracle integration (live peg pricing)
- [ ] API documentation (OpenAPI/Swagger)
- [ ] Docker deployment support

### ⏳ Planned
- [ ] Proof-of-Reserves with Chainlink PoR
- [ ] One-click Solana Pay checkout
- [ ] Jupiter swap integration for instant liquidity
- [ ] Mobile app (React Native + Expo)
- [ ] CCTP-style cross-chain bridge
- [ ] Enterprise SLA support tier

> 💡 **Have an idea?** [Open an issue](https://github.com/mrtomdev/Solana-Stablecoin-SaaS/issues/new) or [vote on existing ones](https://github.com/mrtomdev/Solana-Stablecoin-SaaS/discussions).

---

## 🤝 Contributing

We love contributions! Whether you're fixing a typo, improving docs, or shipping a feature, read **[CONTRIBUTING.md](CONTRIBUTING.md)** first.

```bash
# 1. Fork the repo
# 2. Create your feature branch: git checkout -b feat/awesome-feature
# 3. Commit your changes: git commit -m 'feat: add awesome feature'
# 4. Push: git push origin feat/awesome-feature
# 5. Open a Pull Request
```

**Great first contributions**:
- 📖 Documentation improvements
- 🐛 Bug fixes
- ✅ Unit test coverage
- 🎨 UI/UX enhancements
- 📝 Blog posts or tutorials

---

## 🛡️ Security

Found a vulnerability? **Please do NOT open a public issue.** See **[SECURITY.md](SECURITY.md)** for responsible disclosure instructions.

> ⚠️ **This software is provided as-is, MIT-licensed. Stablecoins are highly regulated financial instruments.** Operating a real stablecoin requires legal counsel, banking partners, reserve audits, and regulatory compliance. See [SECURITY.md](SECURITY.md) for full disclaimers.

---

## 📜 License

[MIT](LICENSE) © 2026 — Free to use, fork, modify, and ship. See LICENSE for details.

---

## 💎 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=mrtomdev/solana-stablecoin-saas&type=Date)](https://star-history.com/#mrtomdev/solana-stablecoin-saas&Date)

---

## 🌐 Keywords & SEO

> *Helping search engines and devs discover StableMint.*

**Core Keywords**:
`solana stablecoin` · `open-source stablecoin` · `token-2022` · `solana defi` · `stablecoin saas` · `fiat-backed stablecoin` · `spl-token` · `solana-dapp` · `stablecoin-issuance`

**Related Keywords**:
`usdc alternative` · `solana fintech` · `solana treasury` · `multi-sig governance` · `circuit breaker` · `peg monitor` · `fee engine` · `audit log` · `compliance stablecoin` · `solana blockchain` · `cryptocurrency token` · `payment processing`

**Use Cases**:
`how to create a stablecoin` · `launch stablecoin on solana` · `stablecoin platform` · `token issuance platform` · `defi stablecoin`

---

<div align="center">

### ⭐ If you find this useful, please star the repo — it helps a lot!

**Built with ❤️ for the Solana ecosystem.**

[Report Bug](https://github.com/mrtomdev/Solana-Stablecoin-SaaS/issues) · [Request Feature](https://github.com/mrtomdev/Solana-Stablecoin-SaaS/issues) · [Discussions](https://github.com/mrtomdev/Solana-Stablecoin-SaaS/discussions) · [Blog](docs/SEO.md)

</div>