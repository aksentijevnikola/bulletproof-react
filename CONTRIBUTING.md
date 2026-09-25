# Contributing

Work from the repository root. Read `AGENTS.md` and the scoped rules under `.agents/rules` before changes. Preserve unrelated work and review generated source rather than hand-editing it.

Run `pnpm install --frozen-lockfile`, `pnpm check`, and `pnpm test:e2e` (after `pnpm exec playwright install chromium`). The optional `pnpm prepare-vite-hooks` enables a fast local gate; CI remains required. Do not commit secrets in `VITE_*` variables.

Keep changes in the owning page or neutral shared boundary. Add libraries only for implemented behavior. Use `pnpm outdated` and the opt-in `pnpm upgrade:interactive` or `pnpm upgrade:latest` commands for reviewed dependency updates; use `:fresh` only when explicitly accepting a release-age bypass. Review the manifest, lockfile, workspace catalog/overrides, and release-age exceptions, then run `pnpm check` and `pnpm test:e2e`. Regenerate OpenAPI output with `pnpm api:gen`; add UI primitives through the pinned `pnpm ui:add` command and inspect its diff. Use `pnpm format` before submitting work.
