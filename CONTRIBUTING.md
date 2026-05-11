# Contributing to StableMint

First off — thank you for taking the time to contribute! 🎉

## Ways to contribute

- 🐛 **Report bugs** via [GitHub Issues](https://github.com/mrtomdev/solana-stablecoin-saas/issues)
- 💡 **Suggest features** — open a discussion first for large changes
- 📖 **Improve docs** — README, code comments, screenshots
- 🧪 **Write tests** — we welcome unit + e2e contributions
- 🔧 **Fix issues** — check the [`good first issue`](https://github.com/mrtomdev/solana-stablecoin-saas/labels/good%20first%20issue) label

## Development setup

```bash
git clone https://github.com/mrtomdev/solana-stablecoin-saas.git
cd solana-stablecoin-saas
npm install
cp .env.example .env
npx prisma generate && npx prisma db push
npm run dev
```

## Pull request process

1. Fork the repo and create a feature branch: `git checkout -b feat/your-feature`
2. Make your changes — keep PRs focused (one feature/fix per PR)
3. Run `npm run lint` and ensure the build passes: `npm run build`
4. Commit with a clear, conventional message (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`)
5. Push and open a PR against `main`
6. Link any related issues in the PR description
7. Be patient — maintainers will review as soon as possible

## Code style

- TypeScript strict mode — no `any` unless justified
- Tailwind for styles — avoid inline `style={}` unless dynamic
- Keep components < 200 LOC; split when they grow
- Server-side: never log secrets or wallet private keys (there shouldn't be any!)

## Reporting security issues

**Please do NOT open public issues for security vulnerabilities.** See [SECURITY.md](SECURITY.md).

## Code of conduct

Be kind. Be respectful. Assume good intent. That's it.

---

Thanks again — every contribution, no matter how small, makes this project better. ❤️
