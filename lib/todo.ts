// TODO:
// Add authenticated user receipt confirmation in grid and table views; admin shipment updates and tracking already use the fulfillment API. Keep carrier delivery separate from user-confirmed receipt.
// Add admin analytics/users API data for all-time ticket participation, user identities, prize wins, payout values, and fulfillment queues; current UI only summarizes the loaded products page and winner IDs.
// Frontend alignment: use the winner username already documented in Postman; do not request a replacement nested winner response.
// Add focused tests for claimed_cash/claimed_item recognition, delivery status transitions, and receipt confirmation in grid and table views.

// PUBLIC WEBSITE / DEMO DATA INTEGRATIONS (2026-10-22)
// hooks/use-public-catalog.ts (usePublicCatalog/usePublicCategories): public catalogue/categories use existing API routes. On request failure, show labelled fixtures from lib/public-demo.ts; successful empty responses stay empty. Confirm anonymous GET access to /catalog/products, /catalog/products/:id, /catalog/categories, and /catalog/categories/:id/products.
// Public catalogue /draws and /categories/:slug: search/sort currently apply to the loaded page (12 items). Add API-wide search, sort (newest, ticket price, progress), active-status filtering, and category slug lookup. Homepage collections likewise use the first page only.
// components/public/results.tsx and lib/public-demo.ts: /winners and homepage results use DEMO records only. Provide a public paginated results endpoint with draw ID, prize, completedAt, consent-approved winner display name, winning ticket, and fulfillment status. No private user IDs or personal/banking details should be published.
// Results fulfillment evidence is illustrative text only. Add admin evidence upload, redaction/review, winner publication consent, approved media URLs, and public result detail data before displaying real payout/delivery proof. No upload endpoint is currently assumed.
// /support: support email, service hours, response targets and ticket submission are unavailable; contact block is a labelled placeholder, with no fake sending or success state. Supply verified contacts; add a contact API only if an actual form is required.
// /about: operator identity, registration, address and service territories are labelled placeholder content pending business confirmation.
// /terms and /privacy: draft placeholder content only. Supply approved eligibility, draw/claim rules, payment/refund/withdrawal policies, responsible participation process, privacy controller/contact, data usage, cookies/providers, retention, and rights before launch.
// Demo product IDs never reach entry/payment flows. /draws/demo-* are preview-only. Remove fixture fallbacks when anonymous API integration is accepted; do not treat sample results as real activity.

// Live winners: components/public/live-winners.tsx on the homepage and /winners uses fixed demoLiveWinners from lib/public-demo.ts. No simulated events, polling, or fabricated recency. Connect a public winners endpoint and pass winners + isDemo=false once available; add loading/error states and polling or SSE with stable IDs/deduplication as supported by the backend.
// Proposed PublicWinner contract in lib/types.ts: id, displayName (consent-approved public identity), prizeName, prizeValue (USD, matching formatCurrency), ticketCount, wonAt (ISO timestamp). Confirm currency and whether value represents a prize award or settled payout; current feed intentionally says prize value. Preserve an empty feed for a successful empty API response and never expose private user IDs.

// REVIEW FIXES / BACKEND HANDOFF (2026-10-22)
// Share docs/BACKEND_HANDOFF.md with the backend engineer. It now lists existing documented features, remaining screen-driven backend work, and frontend alignment tasks without prescribing API contracts.
// Profile: hooks/use-account-profile.ts only requests an endpoint when NEXT_PUBLIC_ACCOUNT_PROFILE_PATH is configured. Actual identity, KYC, 2FA, roles and referral capabilities must come from the authenticated account API; fabricated profile details were removed.
// Entry: ticket numbers now come only from the server's unwrapped ticketNumbers array. Missing allocations remain unavailable. Return durable enrollment ID, tickets, amount, currency, allocation status, and assigned numbers in both enrollment and joined-draw payloads.
// Draw terms are informational and do not gate enrollment. Entry uses active status, available tickets, valid quantity, a loaded wallet and backend validation. Claim submission currently requires explicit allowedClaimTypes; align this separately with the documented claim flow.
// Receipt: delivered is distinct from received. Set NEXT_PUBLIC_RECEIPT_API_PATH with :id only after confirming the authenticated receipt endpoint; otherwise both entry views show the unavailable confirmation state.
// Wallet: finite amount/error/loading states and transaction alias normalization are implemented. Confirm currency, direction, provider checkout, limits/fees, network and legacy usdtAddresj migration. Frontend success means request accepted unless backend confirms settlement.
// Still backend-dependent: account-wide analytics, catalogue-wide search/sort, public results/live feed, media upload/evidence approval, real support/company/policy data, role enforcement and production payment reconciliation. Do not replace these gaps with unlabelled dummy state.

// POSTMAN REVIEW (2026-10-22): https://documenter.getpostman.com/view/19877378/2sBXqRjHFy
// Account/admin identity is already documented in sign-in; customer tracking and winner usernames are documented too. Integrate these existing capabilities before treating them as new backend work.
// Earlier allowedClaimTypes/profile-path expectations are frontend placeholder assumptions, not agreed backend contracts. Align their blocking checks with the documented enrollment and cash/physical claim flows. The handoff does not require the backend to adopt those proposed shapes.
// Withdrawal request naming needs frontend alignment with the published documentation. Full customer tracking states also need frontend integration. This documentation-only review has not changed runtime behaviour.
// Removed the invented draw-rules Product fields, fallback badge and associated rendering. Product types should follow documented backend data.
