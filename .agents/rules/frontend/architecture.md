# Frontend architecture

- Use the current `feature-sliced-design` skill in `.agents/skills` as architectural authority.
- Start with `src/app`, `src/pages`, and `src/shared`; add feature or entity slices only after demonstrated reuse and an independent reason to change. Do not add `widgets` for routine layout.
- App owns global providers, router, shell, theme, and boundaries. Pages own route-specific UI, queries, forms, validation, and mutations. Shared owns neutral UI, transport, config, and mock infrastructure.
- Imports descend `app -> pages -> shared`; never cross-import sibling page slices. Every page has a public `index.ts`. Shared exposes segment or focused component entry points, never `shared/index.ts`.
- Router owns URLs and route lifecycle. Query owns server state. Form owns form state. Table owns sortable row models. React state owns only local UI state.
- Orval output and `src/app/routeTree.gen.ts` are generated. Do not edit them manually. Keep the API façade and browser mocks removable.
- Production must not start MSW. Frontend controls never substitute for backend authorization.

See `docs/architecture.md` for rationale and documented exceptions.
