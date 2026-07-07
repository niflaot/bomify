# AGENTS

This file centralizes the most relevant coding and collaboration rules for this repository.

## Core coding rules
- Use strict TypeScript typing everywhere
- Add explicit return types for exported/public functions
- Use single quotes (`'`) and do not use semicolons
- Keep code readable; prefer small composable functions over inline complexity

## TSDoc/JSDoc requirements
- Document all exported functions, components, types, and classes
- Use meaningful comments only (avoid obvious comments)
- Include `@param` and `@returns` where applicable.

## Architecture and structure
- Keep route files in `src/app` thin; delegate UI composition to `src/views`
- Place reusable UI in `src/components`
- Place layout pieces in `src/layout`
- Keep domain/service logic in `src/core`
- Keep utility helpers in `src/core/utils`
- Keep translations in `messages/{locale}.json`

## Naming conventions
- Renderable components: PascalCase directory and file (`Component/Component.tsx`)
- Component tests: colocated (`Component.test.tsx`)
- Non-renderable files (services, utils, config): lower dotted case (`http.service.ts`)
- Parent-specific subcomponents: place under `partial/`

## Component size and decomposition
- Avoid oversized components; split by responsibility into reusable `partial/` components
- Any component approaching ~250 lines must be reviewed for decomposition
- Keep orchestration/state in the parent and move presentational blocks to `partial/`
- Extract pure transforms/selectors into `*.utils.ts` and stateful reusable logic into hooks

## Configuration rules
- Never hardcode environment or storage URLs in feature code
- Read runtime config from `src/core/config/*`
- MinIO/S3 configuration comes from `storage.config.ts`
- Keep resource wiring centralized in config (do not duplicate it in services)

## API and services
- Encapsulate API access in service modules under `src/core/services`
- Keep UI components free of direct `fetch` calls
- Use typed request/response contracts from `src/core/types`
- Throw descriptive errors for non-OK responses and propagate status codes when possible

## Resilience and retries
- For image display flows, implement bounded retry logic before fallback (avoid infinite retries)
- Use a small retry cap (e.g. 2-3 attempts) with lightweight cache-busting for image reload attempts
- Reset image loading/error/retry state whenever the image identity changes (e.g. different asset id)
- After retries are exhausted, render a deterministic fallback placeholder instead of leaving broken/blank UI
- For essential requests (critical reads/writes), implement retry with backoff and jitter when failures are transient
- Restrict retries to retryable scenarios (network errors, timeouts, and 5xx); do not retry most 4xx errors
- Keep retry behavior centralized in shared service/utils code so feature code does not duplicate policies
- Always surface graceful UX states during retry cycles (loading, temporary failure, final fallback/error)

## Permissions and fallbacks
- Every action that requires permissions must explicitly check scopes before rendering or executing
- Every permission-gated action must define a fallback behavior (hide action, disable action with explanation, or read-only summary)
- Navigation visibility must use capability-based checks with fallbacks (e.g. allow module entry when user has read/create/manage as applicable)
- Cross-module links (e.g. order -> contact/product) must be gated by target-module read permission
- Every view page that renders content from another module/realm must validate the required scope(s) before fetching or rendering that content (e.g. contacts -> orders, products -> assets/variations), and must render a deterministic permission fallback when denied

## Internationalization
- All user-facing strings must be translated
- Do not hardcode UI labels, messages, errors, or notifications
- Use `next-intl` and keys from `messages/*.json`
- Prefer lowercase translation keys

## Styling and UI system
- Use shadcn/ui with Tailwind CSS as the only application UI system
- The shadcn preset is `b1oVxsfY`, initialized as:
  `pnpm dlx shadcn@latest init --preset b1oVxsfY --template next`
- Keep `components.json` aligned with that preset (`style: base-sera`, `baseColor: neutral`, `iconLibrary: lucide`)
- Keep theme colors, radii, borders, dark mode tokens, and chart/sidebar tokens in `src/styles/globals.css`
- Use Inter via `next/font/google` as the app font for both body text and headings
- Use shadcn primitives from `src/components/ui/*.tsx`; these files may follow the shadcn lowercase filename convention
- Use the shared shadcn `Select` component from `src/components/ui/select.tsx` for every dropdown; do not render native browser `<select>` elements in app UI
- Do not add SCSS, BEM-only styling, Radix Theme styling, or unrelated custom design systems
- Compose layouts with Tailwind utility classes and shadcn tokens such as `bg-background`, `text-foreground`, `border-border`, `bg-card`, and `text-muted-foreground`
- Use lucide icons in buttons and icon controls when an icon exists
- Every button must use `cursor: pointer` unless disabled (`not-allowed`)

## Forms
- Use shadcn form primitives (`Input`, `Textarea`, `Label`, `Button`, `Card`) and Tailwind layout utilities
- Keep reserved error-message space to avoid layout shift
- Include loading/disabled states for async submissions
- Include a visible loading bar during async submissions or route-level loading states
- Reset dependent fields when controlling fields change format/type
- Any modifying or destructive action must require an explicit confirm/cancel step

## Listings
- Use shadcn cards, buttons, badges, and Tailwind responsive grids for listings
- Keep responsive grid alignment consistent between controls and rows/cards
- Use truncation and `minWidth: 0` guards to prevent overflow regressions

## Testing and quality
- Use Jest + React Testing Library
- Add/maintain unit tests for behavior changes
- Every component must be testable and have its own unit tests
- Every view must have a skeleton/loading version and related tests
- Test async/loading states when applicable
- Run checks before finalizing:
  - `npm run lint`
  - `npm test`

## Product display name
- **Always** derive a product's display name via `getProductDisplayName` from `src/core/utils/product.utils.ts`.
- Resolution order: (1) `default` realm datasheet name, (2) first datasheet with a non-empty name, (3) product SKU as last resort.
- Never read `datasheets[0].name` directly — the `default` realm is not guaranteed to be the first element.
- This rule applies to every surface: list rows, detail headers, comboboxes, order item labels, segment filters, and any other place a product name is shown.

## Data loading policy
- For product edit screens (and any view requiring fetches), render skeleton-only until all required data sources are loaded
- Every route or view that awaits required server data must provide a loading skeleton and loading bar
- Do not render partial/intermediate editable UI with incomplete required data (avoid partial hydration of forms)
- Gate rendering with an explicit aggregated readiness condition (e.g. `isReady = allRequiredRequestsSucceeded`)
- While not ready, keep interactive controls hidden/disabled and show only deterministic loading states
- If any required request fails, show explicit error/fallback state instead of rendering partially loaded contents
