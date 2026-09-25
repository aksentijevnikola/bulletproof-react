# Agent guidance inventory

`AGENTS.md` is the only canonical project instruction file; `CLAUDE.md` points to it. `.agents/rules/frontend` covers the application, and `.agents/rules/shared` covers the browser/service contract seam. There are no project backend rules or duplicate `.claude/skills` tree.

The project-owned `.agents/skills` set is intentionally small:

| Skill                                                        | Role and provenance                                                                                                                                         |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `feature-sliced-design`                                      | Current FSD v2.1 guidance from [fsd.how](https://fsd.how); installed `SKILL.md` SHA-256: `cdea84378bf7579ecf85e284f39202d41fe44a4cab295fb399aceb3296a38746` |
| `tanstack-form`, `tanstack-query`                            | Locally installed general library guidance; verify examples against pinned package types and official docs before use                                       |
| `msw`, `orval`, `playwright-best-practices`, `vitest`, `zod` | External skill sources and hashes recorded in `skills-lock.json`; these are guidance, not a substitute for the installed package API                        |

TanStack Router and Table use package-versioned Intent skills exposed by the installed `@tanstack/intent` package. Run `pnpm skills:list` before loading a specific supported skill with `pnpm skills:load '<package>#<skill>'`. Form and Query do not have package Intent guidance in the current installed set; their local guidance must not be mistaken for it. Do not install unrelated backend, product-specific, or unused-library skills into this shell.

Skills are copied documentation with separate upstream ownership. Their content is excluded from application formatting/linting and does not enter the runtime bundle. Review upstream provenance and license terms before redistributing the guidance separately from this application.
