# Wagerie Implementation Plan

Last reviewed: 2026-10-08

## Product

Wagerie is a wallet-funded prize-entry platform. Users browse products, purchase entries, and follow product and account status. Admins manage catalog products and categories.

## Implemented In The Frontend

These items exist in the code; production behavior and live API contracts still need end-to-end verification.

- Authentication screens, OTP flows, user workspace layouts, wallet UI, and transaction history.
- Product catalog browsing with category filters, search, sorting, grid/table views, and paginated API data.
- Product detail pages with ticket quantity selection, balance checks, enrollment submission, and confirmation UI.
- My Stakes view with entry history and claim UI.
- Admin product and category create, edit, and delete workflows. Product create/edit uses a standalone React Hook Form component, Zod resolver, image URL, product value, slot count, and derived ticket price.
- UUID product/category identifiers and API response fields such as `productValueAmount`, `totalSlots`, `slotsLeft`, and `percentage`.
- Landing hero spotlight and featured products loaded from the catalog API with loading, error, and empty states.
- Shared currency formatting for monetary values.
- Responsive dashboard/admin shells and common UI primitives.

## To Do

### P0: Launch Blockers

#### Authentication, identity, and authorization

- [ ] Verify login/register responses, token persistence, refresh behavior, and expiry against the live API.
- [ ] Ensure every authenticated request uses the current user's identity and the backend's documented token mechanism; remove any remaining hardcoded user IDs.
- [ ] Enforce admin roles on the server and in route protection, not merely token presence.
- [ ] Test account isolation and unauthorized behavior for wallet, stakes, profile, and admin APIs.

#### Catalog and entry workflow

- [ ] Confirm product/category response shapes, pagination semantics, UUID handling, and request payloads with current API documentation.
- [x] Use documented global draw stats and category-specific stats for active, soon-to-full, completed, and winner counts.
- [ ] Verify category-specific stats and counts against the live API.
- [ ] Verify product value, internal funding-target math, slots, ticket price, progress, and remaining-slot calculations against backend rules.
- [x] Keep the funding target internal; do not display `targetAmount` to customers.
- [ ] Test enrollment success, insufficient balance, sold-out/closed products, duplicate requests, and returned ticket numbers against the live API.
- [ ] Ensure stakes and wallet transactions refresh after enrollment and remain correct after reload.
- [ ] Confirm direct product links and post-registration return behavior; product detail routes currently require authentication.
- [x] Load My Stakes from `GET /catalog/draws/joined`, display its account summary, and use joined product/participation records.
- [x] Submit claims through `POST /catalog/draws/:id/claim` using `claimType` and the documented `shippingDetails` physical-claim shape.
- [ ] Confirm whether joined-draw pagination accepts `page` and `limit`; the collection response includes pagination but the Postman request documents no query parameters.
- [ ] Document the response contract for `GET /catalog/draws/won`; until then, use the joined-draw `isWinner` and summary fields.

#### Draw integrity and winner records

- [ ] Document and implement the authoritative winner-selection method, eligibility, draw timing, and audit evidence on the backend.
- [x] Remove unsupported frontend promises of cryptographic randomness, smart contracts, fixed cash alternatives, free shipping, and insurance; keep product-specific claim terms conditional.
- [ ] Add documented winner/result endpoints and return prize value, winning entry, result time, claim status, and permitted claim methods.
- [ ] Verify that the UI only exposes claim methods returned for the specific product and confirmed winner.
- [ ] Add winner-result and claim-flow integration tests before publishing social proof.

#### Payments and claims

- [ ] Confirm the real deposit provider, production credentials, and verifiable provider outcomes.
- [ ] Validate withdrawal rules, status changes, duplicate requests, and transaction records.
- [ ] Confirm cash-versus-physical claim eligibility and amounts per product; do not derive a guaranteed cash offer from product value alone.
- [x] Preserve the customer choice between the cash equivalent and the prize itself without inventing a cash amount.
- [ ] Add clear failure, retry, pending, and reconciliation states for payment and claim flows.

### P1: Product Readiness

#### Discovery and conversion

- [x] Replace hard-coded landing featured draws with active products from the catalog API.
- [ ] Decide whether to expose a public product preview/detail route before sign-in; if not, preserve the signup gate and carry the selected product through authentication.
- [ ] Confirm catalog sorting/search scope across all server pages; current client filtering only covers the fetched page.
- [ ] Add closing dates/countdowns only after the API provides authoritative timestamps and timezone rules.
- [ ] Verify empty, loading, API error, and no-active-products states on both landing and catalog pages.
- [x] Keep customer-facing product value based on `productValueAmount`; keep funding/progress based on its separate API fields.

#### Trust and operations

- [ ] Add published product terms for draw method, closing schedule, prize condition, delivery, fees, and cash alternatives.
- [ ] Add a public winner archive only after real result records and permission to publish winner identity/media are available.
- [ ] Add support contact, privacy, terms, responsible-play guidance, refund rules, and regional eligibility information.
- [ ] Add production error monitoring and operational ownership for payment, email/OTP, and API incidents.

#### Admin

- [ ] Replace admin dashboard placeholder metrics and transaction rows with API data.
- [ ] Confirm admin CRUD payloads and state transitions against backend responses.
- [ ] Implement or remove visible admin links that point to unavailable views.

### P2: Quality And Release

- [ ] Add tests for schema validation, currency values, pagination, enrollment, claims, and access control.
- [ ] Run desktop/mobile smoke tests against a production-like API.
- [ ] Test slow/offline API, stale sessions, duplicate submissions, refresh during mutations, and inaccessible product images.
- [ ] Use an owned image upload/CDN for optimization and predictable delivery; until then, arbitrary external product URLs use native browser images.
- [ ] Prepare staging/production environment checklists and rollback procedures.

## Definition Of Done

- A user can authenticate and only see their own wallet, stakes, and transactions.
- Catalog values and availability match the live API, and the user can enter an eligible product with backend-confirmed results.
- Winner selection, results, and claim options are documented and verifiable; UI claims match those rules.
- Payment and withdrawal flows are confirmed against the production provider and have recoverable error states.
- Admin authorization and catalog operations are enforced and verified by the backend.
- Public copy is supported by published product terms and operational evidence.
- Type checks, tests, build, and desktop/mobile smoke tests pass against the release configuration.
