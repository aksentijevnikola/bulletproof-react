# Frontend code style

- Strict TypeScript, explicit type imports, no `any` or unnecessary enums.
- Keep components semantic and keyboard-accessible. Use real headings, labels, landmarks, focus styles, and responsive layouts.
- React Compiler owns routine memoization. Add manual memoization only for a measured or API-required reason. Effects synchronize external systems; do not mirror derived state.
- Use shadcn-generated Radix components as editable source in `src/shared/ui`; review generator output before updates. CSS custom properties in `src/app/styles.css` are the semantic token source. Tailwind utilities consume those tokens; CSS Modules are allowed for local complex styling.
- Validate untrusted API data through Orval-generated Zod schemas. Validate form input with Zod before mutation. Never trust generated TypeScript types alone.
- Use `pnpm format`, `pnpm lint`, `pnpm typecheck`, `pnpm fsd:check`, and `pnpm test:ci` while changing code. `pnpm check` is the non-interactive completion gate. Do not claim an unrun check passed.
- Do not stage, commit, push, or overwrite unrelated work without explicit authorization.
