# Frequently Asked Questions — StableMint

> **Search-Optimized FAQ** covering Solana stablecoins, Token-2022, governance, and DeFi operations.

---

## General Questions

### What is StableMint?
**StableMint** is an open-source Software-as-a-Service (SaaS) platform for launching, managing, and monitoring fiat-backed stablecoins on the Solana blockchain. Built entirely on SPL Token-2022 extensions, it enables banks, fintechs, and DeFi protocols to issue production-ready stablecoins without custom Solana programs, Metaplex infrastructure, or expensive audits.

**Use Cases**:
- 🏦 **Banks & Fintechs**: Launch CBDC-equivalent stablecoins
- 💰 **Treasuries**: Issue corporate or sovereign stablecoins
- 🪙 **DeFi Protocols**: Create collateralized stablecoins (e.g., UST-like)
- 📈 **Fintech Startups**: Rapid stablecoin issuance without 6-month development cycles

---

### How is StableMint different from USDC, USDT, or PYUSD?
| Feature | StableMint | USDC / USDT | PYUSD |
|---------|-----------|------------|-------|
| **Open Source** | ✅ Yes | ❌ No | ❌ No |
| **Self-Hosted** | ✅ Yes | ❌ No | ❌ No |
| **Custom Governance** | ✅ Yes (Squads) | ❌ No | ❌ No |
| **No Metaplex Dependency** | ✅ Yes | ❌ Metaplex SPL | ❌ Metaplex SPL |
| **Token-2022 Native** | ✅ Yes | ❌ Legacy SPL | ❌ Legacy SPL |
| **Audit Trail** | ✅ Full on-chain | ❌ Limited | ❌ Limited |
| **Fee Engine** | ✅ Fully Configurable | ⚠️ Fixed | ⚠️ Fixed |

**Bottom Line**: StableMint is the **builder's platform**; USDC/USDT are consumer-facing stablecoins. Use StableMint to *create* your own.

---

### Is StableMint production-ready?
**Yes, with caveats**:
- ✅ **Technical**: Fully functional on devnet and mainnet-beta
- ✅ **Token-2022**: Uses battle-tested SPL Token-2022 standards
- ⚠️ **Regulatory**: Stablecoins are **highly regulated**. Consult legal counsel before issuing real stablecoins.
- ⚠️ **Audit**: For >$1M TVL, consider hiring an external auditor (e.g., Soteria, OtterSec)

See [SECURITY.md](../SECURITY.md) for full legal disclaimers.

---

## Technical Questions

### What is Token-2022?
**Token-2022** (also called **Token Extensions**) is the next-generation token standard for Solana, succeeding the legacy SPL Token program.

**Key Improvements**:
| Feature | SPL Token (Legacy) | Token-2022 |
|---------|------------------|-----------|
| **Metadata** | Via Metaplex (separate) | Native on-mint (`MetadataPointer`) |
| **Transfer Hooks** | ❌ Not possible | ✅ Custom logic on every transfer |
| **Interest-Bearing** | ❌ No | ✅ Built-in rate updates |
| **Confidential Transfers** | ❌ No | ✅ With Zk-SNARKs |
| **Permanent Delegate** | ❌ No | ✅ Upgrade/governance authority |
| **Fee on Transfer** | ❌ External only | ✅ Native support |

**Why StableMint Uses Token-2022**: 
- **No Metaplex overhead**: Metadata lives on-chain
- **Native fee collection**: Built-in transfer fees without middleware
- **Compliance-ready**: Freeze/Thaw for KYC, AML, OFAC workflows
- **Future-proof**: Standard will dominate Solana in 2026+

👉 **Learn more**: [spl.solana.com/token-2022](https://spl.solana.com/token-2022)

---

### Why no custom Solana program?
StableMint relies entirely on **SPL Token-2022 extensions**, avoiding a custom program because:

1. **Security**: Audited, battle-tested standard vs. new code
2. **Simplicity**: 0 Rust development required; deploy in seconds
3. **Cost**: No custom audits needed ($50K-200K saved)
4. **Maintenance**: Solana Foundation maintains, not you
5. **Compatibility**: Works with all Solana wallets & DEXs out-of-the-box

This is the **biggest innovation** in stablecoin issuance since 2021.

---

### Can I use StableMint on mainnet?
**Yes**, but with considerations:

**Devnet** (Recommended for Testing)
- Free SOL airdrops
- No financial risk
- Full feature parity with mainnet

**Mainnet-Beta** (Production)
- Real SOL costs (~0.005 SOL = $0.50 for stablecoin creation)
- Irreversible transactions
- Real reserve requirements

**Getting Started**:
```bash
# Set in .env
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

⚠️ **Before mainnet deployment**: 
- Ensure regulatory compliance
- Test thoroughly on devnet
- Set up liquidity infrastructure
- Maintain >100% collateral reserves

---

### What's the difference between "Freeze" and "Pause"?
| Mechanism | Scope | Use Case | Reversible |
|-----------|-------|----------|-----------|
| **Freeze Account** | Single wallet | KYC/AML/OFAC compliance | ✅ Thaw to reverse |
| **Pause (Transfer)** | All users | Emergency halt | ✅ Unpause to reverse |
| **Pause (Mint/Burn)** | Global supply | Circuit breaker triggered | ✅ Unpause to reverse |

**Example Compliance Flow**:
1. User suspected of OFAC violation → **Freeze account**
2. Threat detected (peg -50%) → **Pause transfers** + activate circuit breaker
3. Issue resolved → **Thaw account** or **Unpause transfers**

All actions logged to audit trail with timestamp & executor wallet.

---

## Governance & Compliance

### What is Squads V4?
**Squads** is the leading **multi-signature wallet** on Solana, owned by the Squads DAO. It enables:

- ✅ **M-of-N approvals**: e.g., 3-of-5 executives must approve each mint
- ✅ **Hierarchical control**: Different roles (Treasurer, Compliance Officer, CEO)
- ✅ **Timelocks**: Delay execution after approval (security best practice)
- ✅ **Programmable workflows**: Custom approval logic per action type
- ✅ **Full audit trail**: On-chain record of who approved what, when

**StableMint Integration**:
- Every admin action (mint, burn, fee changes, freeze) can require multi-sig approval
- Solves: "No single person can drain the reserve or change fees"
- Enterprise-grade governance

👉 **Learn more**: [squads.so](https://squads.so)

---

### Can I use StableMint for compliance?
**Yes**, StableMint is **compliance-first**:

| Requirement | StableMint Support |
|-------------|------------------|
| **KYC/AML** | ✅ Freeze non-compliant accounts |
| **OFAC Screening** | ✅ Automated freeze on flagged addresses |
| **Audit Logs** | ✅ Tamper-proof on-blockchain |
| **Operator Segregation** | ✅ Via Squads multi-sig |
| **Reserve Transparency** | ✅ On-chain collateral proof |
| **Transaction History** | ✅ Explorable in dashboard |

**Regulatory Note**: StableMint handles *operations*. You still need:
- Banking relationships (reserve custody)
- Legal framework (jurisdiction-specific)
- External audit (for consumer stablecoins)

---

### How does the fee engine work?
StableMint supports **5 independent fee types**:

```typescript
{
  "mintFee": 0.5,           // 0.5% on each mint
  "burnFee": 0.3,           // 0.3% on each burn
  "transferFee": 0.1,       // 0.1% on each transfer
  "stabilityFee": 0.05,     // APR on circulating supply
  "liquidationPenalty": 2.0 // 2% on liquidated collateral
}
```

**Revenue Routing**:
- All fees collected to `feeCollectorAddress` (your treasury)
- Configurable per-mint
- Visible in dashboard with daily/weekly/monthly breakdowns

**Example**: 1M tokens issued, $0.1 transfer fee = $100K annual transfer revenue

---

## Monitoring & Operations

### What's a "peg"?
The **peg** is your stablecoin's **target price** in USD (or other fiat).

- **Peg = $1.00** (ideal)
- **Above peg ($1.05)** → supply is constrained; increase burning or rewards
- **Below peg ($0.95)** → reserve concern; increase collateral or reduce supply

**StableMint Peg Monitor** tracks:
- ✅ Real-time price (via oracle)
- ✅ Deviation threshold alerts (e.g., "alert if >2% below peg")
- ✅ Historical peg history (charted over days/weeks/months)
- ✅ Automatic circuit breaker trigger (e.g., pause if >10% deviation)

👉 **Supported Oracles**: Pyth, Switchboard (roadmap)

---

### What are circuit breakers?
**Circuit breakers** are **automated emergency pauses** that trigger if:
- Supply changes >X% in N minutes
- Peg deviates >Y% from target
- Manual emergency trigger activated

**Example**:
```
IF supply_change_5min > 15% THEN pause_minting
IF peg_deviation > 10% THEN pause_all_transfers
```

**Why?** Protects users from flash crashes, hacks, or reserve failures.

---

### How do I monitor reserve health?
StableMint dashboard shows:

1. **Collateral Ratio**: (Reserve / Circulating Supply) × 100%
   - Target: >100% (over-collateralized)
   - Red zone: <100% (under-collateralized)

2. **Reserve Balance**: Raw USD-denominated collateral on-chain or in custody

3. **Runway**: Months until reserve depletes at current burn rate

4. **Holder Count**: Distribution of token across N wallets (concentration risk)

5. **Supply Growth**: Daily/weekly supply change with annotations

---

## Development & Deployment

### Can I deploy StableMint to production?
**Yes**. The deployment process:

```bash
# 1. Prepare environment (mainnet-beta)
cp .env.example .env.production
# → Set NEXT_PUBLIC_SOLANA_RPC_URL to mainnet RPC
# → Set DATABASE_URL to PostgreSQL (not SQLite)
# → Set NEXT_PUBLIC_SQUADS_MULTISIG to your vault

# 2. Database
npx prisma migrate deploy

# 3. Build
npm run build

# 4. Deploy to Vercel / Railway / AWS
vercel --prod
```

**Hosting Recommendations**:
- **Frontend**: Vercel (Next.js native, auto-scaling)
- **Database**: Supabase or AWS RDS (PostgreSQL)
- **RPC**: Helius or QuickNode (enterprise tier)
- **Wallet**: Phantom, Solflare, or Ledger (user-managed)

---

### Is there a Docker setup?
**Not yet**, but adding one is [a great contribution](./CONTRIBUTING.md)!

For now:
- **Local dev**: `npm install && npm run dev`
- **Cloud**: Deploy to Vercel (serverless) or Railway (containers)

---

### What database does StableMint use?
**Prisma ORM** with:
- **Dev**: SQLite (included in repo, no setup)
- **Prod**: PostgreSQL (recommended)

**Why Prisma?**
- Type-safe queries (TypeScript auto-completion)
- Auto-migrations
- Multi-database support

**Switching to PostgreSQL**:
```env
DATABASE_URL=postgresql://user:password@host:5432/stablemint_prod
```

---

## Community & Support

### How do I contribute?
See [CONTRIBUTING.md](../CONTRIBUTING.md) for:
- ✅ Code style guidelines
- ✅ PR workflow
- ✅ Issue labeling conventions
- ✅ Feature request process

**Great first contributions**:
- Documentation improvements
- Bug fixes
- Unit test coverage
- UI/UX enhancements

### Where can I ask questions?
- **GitHub Discussions**: [stablemint/discussions](https://github.com/mrtomdev/Solana-Stablecoin-SaaS/discussions)
- **Issues**: [Report bugs here](https://github.com/mrtomdev/Solana-Stablecoin-SaaS/issues)
- **Security**: [SECURITY.md](../SECURITY.md) (responsible disclosure)

### Is there a roadmap?
**Yes**, see [README.md](../README.md#-roadmap) for:
- ✅ Completed features
- 🔄 In-progress work
- ⏳ Upcoming features (Pyth oracle, PoR, CCTP bridge)

---

## Legal & Compliance

### Do I need a legal team?
**Absolutely**. StableMint handles *operations*, not *regulation*.

Before issuing real stablecoins, engage:
- 🏛️ **Securities/Banking Counsel**: Jurisdiction-specific rules
- 📋 **Compliance Officer**: KYC/AML/OFAC workflows
- 🔍 **Auditor**: External validation of reserves

**Regulatory Frameworks**:
- 🇺🇸 **USA**: OCC guidance (2021), SEC oversight
- 🇪🇺 **EU**: MiCA (Markets in Crypto Assets Regulation)
- 🇸🇬 **Singapore**: MAS (Monetary Authority of Singapore)

See [SECURITY.md](../SECURITY.md) for full disclaimers.

---

### What if I find a security vulnerability?
**Please do NOT open a public issue.**

Instead, follow [SECURITY.md](../SECURITY.md) for responsible disclosure:
1. Email: [security@stablemint.dev](mailto:security@stablemint.dev)
2. Include: vulnerability details, impact, proof-of-concept
3. Await: 90-day disclosure timeline

---

## Stablecoin Fundamentals

### What makes a stablecoin "stable"?
Stability comes from **collateralization**:

| Type | Mechanism | Example |
|------|-----------|---------|
| **Fiat-Backed** | 1:1 reserve (USD/EUR) | USDC, USDT |
| **Crypto-Backed** | Over-collateralized crypto | DAI |
| **Algorithmic** | Supply manipulation | LUNA/UST (failed) |
| **Commodity-Backed** | Gold/oil reserves | DGX, PAX Gold |

**StableMint is fiat-backed** (by design):
- You hold USD in a bank account
- Users hold StableMint tokens
- Peg monitor ensures 1:1 backing

---

### What's the difference between stablecoins and CBDCs?
| Feature | Stablecoin | CBDC |
|---------|-----------|------|
| **Issuer** | Private entity | Central bank |
| **Legal Status** | Regulated asset | Legal tender |
| **Decentralization** | Varies | None (sovereign) |
| **Privacy** | Medium | Low |
| **Smart Contracts** | ✅ Yes | ⚠️ Limited |

**Bottom Line**: StableMint can launch both, but CBDCs require central bank integration.

---

### Why Solana for stablecoins?
**Solana advantages**:
| Feature | Solana | Ethereum | Polygon |
|---------|--------|----------|---------|
| **Speed** | 400 TPS | 15 TPS | 7,000 TPS |
| **Cost** | $0.00001 | $1-50 | $0.001 |
| **Finality** | 6.4 sec | 15 min | 2 sec |
| **Token Standard** | SPL Token-2022 | ERC-20 | ERC-20 |
| **MEV Risk** | Low | High | Medium |

**Solana Stablecoin Use Cases**:
- ✅ Payments (low cost, high speed)
- ✅ Remittances (cross-border, instant)
- ✅ DeFi (low slippage, capital efficiency)
- ✅ Gaming (in-game currency)

---

## Troubleshooting

### Stablecoin not appearing in wallet?
**Solutions**:
1. **Token list**: Add to Solana token list registry
   - URL: [solana-labs/token-list](https://github.com/solana-labs/token-list)
2. **Phantom**: Token → + → Custom SPL → Paste mint address
3. **Balance update**: Refresh wallet (hard refresh: Cmd+Shift+R)

### Transaction failed with "insufficient SOL"?
Each transaction requires ~0.00144 SOL (transaction fee).
- **Solution**: Add SOL to wallet
- **Devnet**: Use [solana-faucet](https://faucet.solana.com)
- **Mainnet**: Buy SOL on Coinbase or Jupiter

### Peg monitor showing wrong price?
**Diagnostic Steps**:
1. Check RPC connection: `solana cluster` (devnet / mainnet)
2. Verify oracle endpoint (Pyth / Switchboard)
3. Check token mint address in dashboard settings
4. Restart dashboard: Hard refresh + clear cache

---

## Resources

- 📚 **Docs**: [/docs](../docs)
- 🧪 **Examples**: [/examples](../examples) (coming soon)
- 🔗 **API Docs**: OpenAPI spec (coming soon)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/mrtomdev/Solana-Stablecoin-SaaS/discussions)
- 📖 **Blog**: [stablemint.io/blog](https://stablemint.io/blog) (coming soon)

---

**Last Updated**: May 13, 2026 | **Maintainer**: mrtomdev | **Contributing**: See [CONTRIBUTING.md](../CONTRIBUTING.md)
