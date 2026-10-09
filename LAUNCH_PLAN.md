# Wagerie Launch Plan

This is the working launch reference for Wagerie. Add new findings, decisions, and acceptance criteria here as the product develops.

Last reviewed: 2026-10-08

## Product Definition

Wagerie is a wallet-powered polling and raffle platform. Users fund a wallet, discover live polls, stake on available opportunities, and track outcomes, winnings, and withdrawals. Operators manage polls, users, transactions, and platform analytics.

## Current Status

The codebase includes the user/admin shells, wallet screens, catalog listing/detail flows, enrollment UI, and admin catalog management. The landing hero and featured draws now use live catalog data. Product detail routes remain behind authentication, and landing CTAs route guests to registration.

The code-level UI does not establish that the production API, draw process, payment flows, or claims are launch-ready. The blockers below remain open until verified against the live API and operational terms.

## P0 Launch Blockers

### 1. Live authentication and user identity

- [ ] Confirm the login response shape and persist the authenticated user's ID and profile data.
- [ ] Remove hardcoded `user-1` values from dashboard, profile, transactions, and wallet requests.
- [ ] Ensure every authenticated request sends the `wagerie_token` as a Bearer token or through the backend's documented auth mechanism.
- [ ] Confirm token expiry and invalid-token behavior redirects users to login.
- [ ] Test a newly registered user and an existing user independently.
- [ ] Confirm the live API no longer returns `401` for valid logged-in sessions.

Relevant files: `proxy.ts`, `lib/axios.ts`, `app/auth/login/page.tsx`, `app/(client)/dashboard/page.tsx`, `app/(client)/profile/page.tsx`, `app/(client)/transactions/page.tsx`.

### 2. Real user dashboard data

- [ ] Replace hardcoded dashboard counts such as active stakes, open polls, and portfolio exposure with API-backed values.
- [ ] Show useful loading, empty, and API error states.
- [ ] Confirm wallet balance, recent transactions, stakes, and polls belong to the logged-in user.
- [ ] Make deposit refresh balance and transaction history after a successful response.

Relevant files: `app/(client)/dashboard/page.tsx`, `hooks/use-wallet.ts`.

### 3. Complete the staking workflow

- [x] Add product listing/detail routes and link catalog actions to product details.
- [x] Load My Stakes from `GET /catalog/draws/joined` and render the documented product, participation, summary, and claim-status fields.
- [x] Submit cash/physical claims to `POST /catalog/draws/:id/claim` with the documented request body.
- [ ] Verify the product detail endpoint, enrollment payload, and returned ticket numbers against the documented API contract.
- [ ] Implement the documented stake request and validate available balance/slots.
- [ ] Display purchased numbers or selected options from the real response.
- [ ] Confirm successful stakes appear in My Stakes and Transactions.
- [ ] Handle closed, full, cancelled, and already-staked poll states.
- [ ] Decide whether guests can preview product details; if not, preserve signup gating and return users to the selected product after authentication.
- [ ] Confirm catalog `pagination.total` represents active draws before using it as an active-draw count.
- [ ] Confirm joined-draw pagination query parameters; Postman shows response pagination but no request parameters.
- [ ] Obtain a response schema for `GET /catalog/draws/won`; current UI uses joined-draw winner flags and summary.

Relevant files: `app/(client)/polls/page.tsx`, `app/(client)/polls/[id]/page.tsx`, `components/landing/landing-page-featured-draws.tsx`, `constants/routes.ts`, `lib/types.ts`.

### 4. Admin data and authorization

- [ ] Replace admin dashboard placeholder metrics and transaction rows with API data.
- [ ] Implement or remove admin links that point to missing pages.
- [ ] Enforce admin role authorization server-side and in the proxy, not only token presence.
- [ ] Add real admin poll, user, transaction, and analytics views where required by the API contract.
- [ ] Verify a normal user cannot access admin pages.

Relevant files: `app/admin/dashboard/page.tsx`, `components/layout/admin-layout.tsx`, `proxy.ts`, `constants/routes.ts`.

### 5. Payment and withdrawal readiness

- [ ] Confirm the deposit provider and production credentials/configuration.
- [ ] Confirm the deposit flow is not simulated and has a verifiable provider response.
- [ ] Validate withdrawal bank details and required country/provider rules.
- [ ] Confirm withdrawal status transitions and transaction records.
- [ ] Confirm Withdraw is available only on Profile, while Deposit remains available in the navbar.
- [ ] Add clear failure and retry states for payment operations.

Relevant files: `components/molecules/modals/deposit-modal.tsx`, `components/molecules/modals/withdraw-modal.tsx`, `hooks/use-wallet.ts`.

## P1 Before Public Release

### API contract

- [ ] Compare every entry in `constants/routes.ts` with the latest API documentation.
- [ ] Confirm request bodies, query parameters, pagination shape, and error shape for every used endpoint.
- [ ] Centralize Bearer token injection in the Axios client.
- [ ] Add a single unauthorized-response path that clears the session and redirects to login.
- [ ] Confirm production CORS, cookies, HTTPS, and environment variables.

### Navigation and UX

- [ ] Verify every visible link resolves to an implemented route.
- [ ] Preserve the shared dashboard shell across Dashboard, Polls, My Stakes, Transactions, and Profile.
- [ ] Verify detached sidebar/navbar spacing at desktop, tablet, and mobile widths.
- [ ] Verify collapse/expand behavior, icon labels, keyboard focus, and mobile drawer behavior.
- [ ] Make active navigation state correct for nested routes.
- [ ] Add a profile menu route and ensure logout clears the local token.

### Visual quality

- [ ] Keep the blue primary color consistent with the landing page and product shell.
- [ ] Remove accidental white borders and generic light-theme surfaces from dark workspace pages.
- [ ] Check typography, spacing, contrast, overflow, and table responsiveness.
- [x] Replace hard-coded landing featured products with live catalog products.
- [x] Integrate catalog draw stats and category stats in the polls page header.
- [ ] Replace admin dashboard placeholder metrics and transaction rows with API data.
- [ ] Verify customer-facing value uses `productValueAmount`, while target/funding progress uses the correct separate fields.
- [x] Keep `targetAmount` internal to funding/progress calculations; do not show it to customers.
- [x] Keep both cash-equivalent and physical-prize claim choices in the UI without fabricating a cash amount.
- [ ] Confirm all public prize, draw, cash alternative, delivery, and fairness claims are backed by product terms and API behavior.
- [ ] Review empty states so they provide a useful next action.

### Security and reliability

- [ ] Never log credentials, access tokens, or sensitive payment data.
- [ ] Confirm token storage, cookie flags, expiry, and logout invalidation with the backend.
- [ ] Confirm authorization is enforced by the backend for wallet, stake, profile, and admin requests.
- [ ] Add rate-limit and abuse expectations for login, staking, deposits, and withdrawals.
- [ ] Verify sensitive fields are not exposed in client-rendered content or URLs.
- [ ] Add error monitoring and production logging without storing secrets.

## P2 Operational Readiness

- [ ] Add test coverage for authentication, wallet mutations, staking, pagination, and unauthorized responses.
- [ ] Run desktop and mobile smoke tests against a production-like environment.
- [ ] Test slow network, API downtime, expired sessions, duplicate submissions, and refresh during mutations.
- [ ] Confirm database, payment, email/OTP, and API monitoring are configured.
- [ ] Prepare support contact, privacy policy, terms, responsible gaming language, and refund/withdrawal policy.
- [ ] Define launch rollback steps and database/payment incident ownership.
- [ ] Create staging and production environment checklists.

## Definition Of Done

Wagerie is ready for launch when:

- A real user can register or log in, remains authenticated across refreshes, and sees only their own data.
- A user can deposit, browse a live poll, stake successfully, see the stake recorded, and track the result.
- A user can view transactions and withdraw from Profile with correct validation and status handling.
- An authorized admin can manage the platform through real API data, while a normal user is denied admin access.
- Every visible navigation item works and all primary flows have loading, empty, error, and success states.
- The UI is responsive and visually consistent with the approved Peucox-inspired navy/blue system.
- Production build, type checking, smoke tests, and security checks pass against the live configuration.

## Verification Log

- 2026-09-03: `npm run build` passed; all 17 application routes generated.
- 2026-09-03: Desktop sidebar collapse/expand behavior visually checked.
- 2026-09-03: Detached sidebar and navbar spacing visually checked.
- 2026-09-03: Current browser session observed live API `401` responses; authentication/session handling remains a P0 blocker.
- 2026-10-08: Product listing/detail and admin catalog workflows exist in code; live API acceptance remains open.
- 2026-10-08: Landing hero and featured draws now use the catalog API with loading, error, and empty states.
- 2026-10-08: Customer product value uses `productValueAmount`; unsupported draw-security, delivery, and fixed cash-estimate claims were removed from customer-facing copy.
- 2026-10-08: Editor diagnostics were checked for touched UI files; no code/type errors were reported. A full release build and end-to-end live API test were not run in this review.
- 2026-10-09: Integrated `GET /catalog/draws/joined` into My Stakes and `POST /catalog/draws/:id/claim` with the documented physical shipping payload. TypeScript was checked with `pnpm`; live authenticated endpoint acceptance remains unverified.
- 2026-10-09: Integrated `GET /catalog/draws/stats` and `GET /catalog/categories/:categoryId/stats` for the polls-page counts. `pnpm` TypeScript check passed; live API values remain to verify.

## Decision Log

Use this section for decisions that affect implementation. Record the date, decision, and reason.

- 2026-09-03: Auth pages remain unchanged during visual redesign work.
- 2026-09-03: Deposit is a global navbar action; Withdraw is intentionally restricted to Profile.
- 2026-09-03: The authenticated workspace uses a dark navy background with blue primary actions and a collapsible detached sidebar.
- 2026-10-08: Do not display winner stories, countdowns, independent verification, or guaranteed claim options until supported by authoritative API fields and product terms.
- 2026-10-08: The customer claim choices are cash equivalent or the prize itself; any cash amount and fulfillment terms must come from the product/claim contract. `targetAmount` is an internal pool target and is not customer-facing.
- 2026-10-08: Until product images use a controlled CDN, render API-provided external image URLs with native browser images rather than requiring arbitrary host allowlists in Next image config.

## New Findings

Add newly discovered blockers, customer feedback, API changes, or launch decisions below this line.
