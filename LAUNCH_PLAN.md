# Wagerie Launch Plan

This is the working launch reference for Wagerie. Add new findings, decisions, and acceptance criteria here as the product develops.

Last reviewed: 2026-09-03

## Product Definition

Wagerie is a wallet-powered polling and raffle platform. Users fund a wallet, discover live polls, stake on available opportunities, and track outcomes, winnings, and withdrawals. Operators manage polls, users, transactions, and platform analytics.

## Current Status

The application builds successfully and has a Peucox-inspired product shell: dark navy workspace, blue primary actions, detached sidebar and navbar, collapsible desktop navigation, and responsive mobile navigation.

The application is not launch-ready until the blockers below are closed and verified against the live API.

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

- [ ] Add a poll detail route using the documented poll ID endpoint.
- [ ] Make each active poll action navigate to its poll detail or staking flow.
- [ ] Implement the documented stake request and validate available balance/slots.
- [ ] Display purchased numbers or selected options from the real response.
- [ ] Confirm successful stakes appear in My Stakes and Transactions.
- [ ] Handle closed, full, cancelled, and already-staked poll states.

Relevant files: `app/(client)/polls/page.tsx`, `constants/routes.ts`, `lib/types.ts`.

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
- [ ] Replace fabricated landing and admin metrics before launch, or label them explicitly as marketing content.
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

## Decision Log

Use this section for decisions that affect implementation. Record the date, decision, and reason.

- 2026-09-03: Auth pages remain unchanged during visual redesign work.
- 2026-09-03: Deposit is a global navbar action; Withdraw is intentionally restricted to Profile.
- 2026-09-03: The authenticated workspace uses a dark navy background with blue primary actions and a collapsible detached sidebar.

## New Findings

Add newly discovered blockers, customer feedback, API changes, or launch decisions below this line.
