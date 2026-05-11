<div align="center">

<img src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png" width="84" alt="Solana"/>

# 🪙 StableMint — The Open-Source Solana Stablecoin SaaS

### Launch, manage, and scale **production-ready stablecoins on Solana** in minutes. No Metaplex. No backend keys. 100% Token-2022 native.

[![Solana](https://img.shields.io/badge/Solana-Token--2022-9945FF?style=for-the-badge&logo=solana&logoColor=white)](https://solana.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](CONTRIBUTING.md)
[![Stars](https://img.shields.io/github/stars/mrtomdev/solana-stablecoin-saas?style=for-the-badge&logo=github&color=yellow)](https://github.com/mrtomdev/solana-stablecoin-saas/stargazers)

**[🚀 Quick Start](#-quick-start) · [✨ Features](#-features) · [📸 Screenshots](#-screenshots) · [🏗️ Architecture](#️-architecture) · [🤝 Contributing](CONTRIBUTING.md) · [🛡️ Security](SECURITY.md)**

> The fastest way to launch a **fiat-backed, multi-sig governed, fully-auditable stablecoin** on Solana. Built for DeFi founders, fintechs, banks, and treasuries.

</div>

---

## ⭐ Why StableMint?

Launching a stablecoin used to require an army of Rust developers, a custom Solana program, custodial infrastructure, and 6+ months of audits. **StableMint changes that.**

It ships a complete **stablecoin issuance & operations platform** built entirely on **SPL Token-2022 extensions** — no custom on-chain program required, no Metaplex dependency, no server-side private keys. Connect a wallet, click a button, and your stablecoin is live on Solana mainnet with mint, burn, freeze, pause, peg monitoring, fee collection, liquidity reserves, circuit breakers, and Squads multi-sig — all wired into a clean Next.js dashboard.

> If [Circle (USDC)](https://www.circle.com), [Tether (USDT)](https://tether.to), [Paxos (USDP)](https://paxos.com), and [PayPal (PYUSD)](https://www.paypal.com/pyusd) had an **open-source little brother for Solana** — this is it.

---

## ✨ Features

### 🔥 Core Issuance
- ✅ **One-click stablecoin creation** — SPL Token-2022 with `MetadataPointer` extension
- ✅ **Native on-chain metadata** — name, symbol, image, description embedded directly in the mint (no Metaplex)
- ✅ **Configurable decimals, supply cap, and authorities**
- ✅ **Devnet & mainnet-beta** support out of the box
- ✅ **Mint, Burn, Freeze, Thaw** — full authority control flows

### 🛡️ Governance & Compliance
- ✅ **Squads V4 multi-sig integration** (`@sqds/multisig`) — enterprise-grade key management
- ✅ **Freeze / Thaw individual accounts** — KYC, AML, OFAC compliance workflows
- ✅ **Global Pause & per-action pause** — Mint, Burn, Transfer, Freeze independently pausable
- ✅ **Audit log** of every admin action with wallet, signature, and timestamp
- ✅ **Role-based admin auth** via wallet signature

### 📊 Real-Time Monitoring
- ✅ **Live peg monitor** — track USD price deviation with configurable threshold alerts
- ✅ **Supply analytics** — historical supply snapshots, holder count, growth charts (Recharts)
- ✅ **Fee revenue dashboard** — per-fee-type breakdown with daily/weekly/monthly views
- ✅ **Transaction explorer** — paginated, filterable history of all admin operations
- ✅ **Pause history** with reason tracking

### 💰 Economic Controls
- ✅ **Configurable fee engine** — mint fee, burn fee, transfer fee, stability fee, liquidation penalty
- ✅ **Fee collector address** routing for revenue
- ✅ **Liquidity reserve tracking** — collateral ratio, reserve target, runway alerts
- ✅ **Peg config** — target price + deviation threshold per token

### 🚨 Risk Management
- ✅ **Circuit breakers** — auto-pause if supply changes more than X% in N minutes
- ✅ **Configurable per-mint thresholds**
- ✅ **Emergency global kill switch**

### 🎨 Developer & UX
- ✅ **100% client-side transaction signing** — zero private keys server-side
- ✅ **TanStack Query** for snappy, cached UX
- ✅ **Tailwind + custom design system** — looks great out of the box
- ✅ **Wallet adapter** — Phantom, Solflare, Backpack, Ledger, and 30+ wallets
- ✅ **Prisma + SQLite** for fast local dev — drop in PostgreSQL for prod
- ✅ **Strict TypeScript**, ESLint, Next.js 16 App Router, React 18, RSC-ready

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

```bash
# 1. Clone
git clone https://github.com/mrtomdev/solana-stablecoin-saas.git
cd solana-stablecoin-saas

# 2. Install
npm install

# 3. Configure
cp .env.example .env
#   → set NEXT_PUBLIC_SOLANA_RPC_URL (Helius / QuickNode / public devnet)
#   → set DATABASE_URL (defaults to local SQLite)

# 4. Database
npx prisma generate
npx prisma db push

# 5. Run
npm run dev
```

Open **http://localhost:3000**, connect your wallet, click **Create Stablecoin**, sign one transaction, and **your stablecoin is live on Solana**.

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        BROWSER (Wallet)                          │
│   Phantom · Solflare · Backpack · Ledger · 30+ adapters          │
└──────────────────┬─────────────────────────┬─────────────────────┘
                   │ signs                   │ reads
                   ▼                         ▼
┌──────────────────────────┐     ┌──────────────────────────┐
│   Next.js 16 App Router  │     │      Solana RPC          │
│   ─────────────────────  │     │   (Helius / QuickNode)   │
│   /create  /dashboard    │     └──────────────┬───────────┘
│   /api/peg /api/fees ... │                    │
└──────────┬───────────────┘                    │
           │                                    │
           │ Prisma                             │
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
│   │   ├── analytics/supply  # Supply snapshots
│   │   ├── fees/             # Fee config + revenue
│   │   ├── liquidity/        # Reserve config
│   │   ├── pause/            # Pause state, circuit breaker, history
│   │   ├── peg/              # Peg config + history
│   │   └── token/            # Token info, holders, transactions
│   ├── create/               # Stablecoin creation flow
│   ├── dashboard/
│   │   ├── mint, burn        # Mint / burn operations
│   │   ├── freeze            # Freeze / thaw accounts
│   │   ├── peg               # Peg monitoring
│   │   ├── fees              # Fee engine config
│   │   ├── liquidity         # Reserves & collateral
│   │   ├── pause             # Global pause + circuit breakers
│   │   ├── transactions      # Audit log
│   │   └── settings          # Token settings
│   └── page.tsx              # Marketing landing
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
# Solana
NEXT_PUBLIC_SOLANA_NETWORK=devnet                    # devnet | mainnet-beta
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_MINT_ADDRESS=                            # auto-set after creation

# Database
DATABASE_URL="file:./prisma/dev.db"                  # or postgresql://...

# Optional: Squads multi-sig vault
NEXT_PUBLIC_SQUADS_MULTISIG=
```

---

## 🧪 Roadmap

- [x] Token-2022 issuance with native metadata
- [x] Mint / Burn / Freeze / Thaw flows
- [x] Squads V4 multi-sig integration
- [x] Peg monitor with deviation alerts
- [x] Configurable fee engine + revenue tracking
- [x] Circuit breakers + global pause
- [x] Audit log for every admin action
- [ ] Pyth / Switchboard oracle integration (live peg pricing)
- [ ] Proof-of-Reserves with Chainlink PoR
- [ ] One-click Solana Pay checkout
- [ ] Jupiter swap integration for instant liquidity
- [ ] Mobile app (React Native + Expo)
- [ ] CCTP-style cross-chain bridge

> 💡 **Have an idea?** [Open an issue](https://github.com/mrtomdev/solana-stablecoin-saas/issues/new) or vote on existing ones.

---

## 🤝 Contributing

We love contributions! Whether you're fixing a typo or shipping a new feature, please read **[CONTRIBUTING.md](CONTRIBUTING.md)** first.

```bash
# 1. Fork the repo
# 2. Create your feature branch: git checkout -b feat/awesome-feature
# 3. Commit your changes: git commit -m 'feat: add awesome feature'
# 4. Push: git push origin feat/awesome-feature
# 5. Open a PR
```

---

## 🛡️ Security

Found a vulnerability? **Please do NOT open a public issue.** See **[SECURITY.md](SECURITY.md)** for responsible disclosure instructions.

> ⚠️ **This software is provided as-is, MIT-licensed. Stablecoins are highly regulated financial instruments.** Operating a real stablecoin requires legal counsel, banking partners, reserve attestations, and compliance with money transmission laws in every jurisdiction you serve. **You are solely responsible for compliance.**

---

## 📜 License

[MIT](LICENSE) © 2026 — Free to use, fork, modify, and ship.

---

## 💎 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=mrtomdev/solana-stablecoin-saas&type=Date)](https://star-history.com/#mrtomdev/solana-stablecoin-saas&Date)

---

## 🌐 Keywords

> *Helping search engines and devs find us.*

`solana` · `stablecoin` · `defi` · `web3` · `token-2022` · `spl-token` · `solana-program` · `solana-dapp` · `stablecoin-issuance` · `usdc` · `usdt` · `pyusd` · `fiat-backed-token` · `crypto-saas` · `squads-multisig` · `next.js` · `typescript` · `prisma` · `tailwindcss` · `react` · `metadata-pointer` · `peg-monitor` · `circuit-breaker` · `fee-engine` · `liquidity-reserves` · `audit-log` · `compliance` · `kyc` · `aml` · `freeze-authority` · `mint-authority` · `solana-wallet-adapter` · `phantom` · `solflare` · `backpack` · `helius` · `quicknode` · `solana-devnet` · `solana-mainnet` · `open-source-stablecoin` · `cbdc` · `tokenization` · `real-world-assets` · `rwa` · `fintech` · `treasury-management`

---

<div align="center">

### ⭐ If you find this useful, please star the repo — it helps a lot!

**Built with ❤️ for the Solana ecosystem.**

[Report Bug](https://github.com/mrtomdev/solana-stablecoin-saas/issues) · [Request Feature](https://github.com/mrtomdev/solana-stablecoin-saas/issues) · [Discussions](https://github.com/mrtomdev/solana-stablecoin-saas/discussions)

</div>
