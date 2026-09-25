# Frontend and service contract boundary

- `openapi/sample-records.yaml` is a disposable, repository-owned OpenAPI example. A real integration replaces it with an approved service contract; never invent backend routes, roles, or DTOs.
- `pnpm api:gen` explicitly regenerates `src/shared/api/generated` with Orval. `pnpm api:check` compares regeneration in an isolated temporary directory without changing checked-in output.
- `src/shared/api/index.ts` is the page-facing transport entry point. Keep generated files hidden behind it. The generated Fetch client uses a runtime base URL; its built-in JSON validation is supplemented by façade status checks and Zod parsing of every returned body, including non-JSON responses.
- MSW fixtures and handlers under `src/shared/mocks` are deterministic local examples, not a backend substitute. Development mock mode defaults on; production mode always leaves the worker off. Turning mocks off must expose a missing service honestly.
- Keep secrets out of `VITE_*` inputs. The browser can read all such values. Service-side authentication and authorization remain the service's responsibility.
