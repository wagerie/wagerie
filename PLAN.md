# Wagerie Frontend Implementation Plan

**Product**: Staking-based polling platform where users stake money on polls to win prizes through random raffle draw.

**Timeline**: 2-4 weeks  
**Approach**: 3 sequential phases with mock data (easily swappable for real API)

---

## Architecture Overview

### Tech Stack

- **Framework**: Next.js 16 + React 19 + TypeScript
- **UI**: Tailwind CSS + shadcn/ui components
- **Forms**: React Hook Form + Zod validation
- **State**: React Query (server state) + React Hook Form (form state)
- **HTTP**: Axios with Bearer token auth
- **Styling**: Dark-first theme with custom Tailwind config

### Key Decisions

✅ **Mock API**: Environment variable `USE_MOCK_API=true` switches between mock and real  
✅ **Admin Auth**: Separate admin login with JWT `role: "admin"` field  
✅ **Middleware**: Admin routes validate role and reject non-admins  
✅ **Payment**: Completely mocked (easy to integrate real processor later)  
✅ **Notifications**: Deferred to Phase 2+ (use toast notifications for now)

---

## Phase 1: Wallet System & Dashboard Foundation (Week 1)

### Goals

- Build wallet infrastructure (balance, deposit, withdraw)
- Create dashboard layout and navigation
- Establish transaction logging pattern
- Set up mock API layer for easy real API integration

### Implementation Checklist

#### Infrastructure

- [ ] Create shared types: `lib/types.ts` (User, Wallet, Transaction, etc.)
- [ ] Create validation schemas: `lib/schemas.ts` (Zod)
- [ ] Create mock data: `lib/mock-data.ts` (sample wallets, transactions)
- [ ] Create mock API layer: `lib/mock-api.ts` (interceptor)
- [ ] Update axios: Integrate mock API logic based on `USE_MOCK_API` env

#### Components

- [ ] Dashboard layout: `components/layout/dashboard-layout.tsx` (sidebar + navbar)
  - Navbar: logo, user profile dropdown, wallet balance, theme toggle
  - Sidebar: navigation (dashboard, polls, transactions, admin link)
  - Main content area
- [ ] Wallet card: `components/molecules/wallet-card.tsx` (display balance, action buttons)
- [ ] Deposit modal: `components/molecules/deposit-modal.tsx` (form + validation)
- [ ] Withdraw modal: `components/molecules/withdraw-modal.tsx` (form + validation)
- [ ] Transactions page: `app/(client)/transactions/page.tsx` (table with filters)

#### Hooks & API

- [ ] Create wallet hooks: `hooks/use-wallet.ts`
  - `useGetBalance()` - fetch wallet balance
  - `useDeposit()` - deposit mutation
  - `useWithdraw()` - withdrawal mutation
  - `useTransactionHistory()` - transactions with filtering
- [ ] Update main dashboard: `app/(client)/dashboard/page.tsx`

#### Admin Auth

- [ ] Update middleware: `proxy.ts` to validate admin role on `/admin/*`
- [ ] Create admin login: `app/admin/auth/login/page.tsx`
- [ ] Admin layout: `components/layout/admin-layout.tsx` (admin-specific nav)

#### Testing

- [ ] Dashboard loads without errors
- [ ] Wallet balance displays (mock data)
- [ ] Deposit/withdraw forms validate correctly
- [ ] Transactions page fetches and filters data
- [ ] All modals open/close properly
- [ ] Admin login works, rejects non-admins

---

## Phase 2: Poll System & Staking (Week 2)

### Goals

- Display available polls with rich UI
- Implement staking (purchase slots, generate unique numbers)
- Track user's active stakes
- Establish real-time poll state patterns

### Key Components

- Polls listing page with filters and search
- Poll detail page with staking interface
- Poll card component (preview)
- Stake purchase modal
- My Stakes dashboard
- Winner notification card (preview)

### API Hooks

- `useGetPolls()`, `usePollDetail()`, `useCreateStake()`, `useUserStakes()`, `useCheckWinnings()`

### Shared Types

```typescript
type Poll = {
  id: string;
  prizeName: string;
  prizeImage: string;
  prizeValue: number;
  totalSlots: number;
  filledSlots: number;
  pricePerSlot: number;
  status: "active" | "closed" | "completed";
  endsAt: Date;
  winningNumber?: number;
};

type Stake = {
  id: string;
  userId: string;
  pollId: string;
  numbers: number[];
  amount: number;
  status: "active" | "won" | "lost";
  createdAt: Date;
};
```

---

## Phase 3: Winner Selection, Admin Dashboard & Notifications (Week 3-4)

### Goals

- Implement winner selection system (random draw)
- Create comprehensive admin dashboard
- Build prize claiming flow
- Add transaction management UI

### Key Components

- Admin dashboard with analytics
- Poll management (create, edit, draw)
- User management
- Prize claiming page (cash or physical)
- Winner draw modal with animation
- Testimonial submission (optional)

### API Routes (Full List)

```
WALLET (Phase 1):
GET /wallet/balance
POST /wallet/deposit
POST /wallet/withdraw
GET /wallet/transactions

POLLS (Phase 2):
GET /polls
GET /polls/:id
POST /polls/:id/stake
GET /user/stakes
GET /user/winnings

ADMIN (Phase 3):
POST /admin/polls
PUT /admin/polls/:id
DELETE /admin/polls/:id
GET /admin/users
GET /admin/transactions
GET /admin/analytics
POST /polls/:id/draw

PRIZE CLAIMING (Phase 3):
POST /user/claim-prize
POST /user/testimonial
```

---

## File Structure

```
app/
  (client)/
    dashboard/                    [NEW] Main dashboard
    transactions/                 [NEW] Transaction history
    polls/                        [NEW] Poll listing (Phase 2)
      [pollId]/                   [NEW] Poll detail (Phase 2)
    my-stakes/                    [NEW] User stakes (Phase 2)
    claim-prize/                  [NEW] Prize claiming (Phase 3)
  admin/
    auth/
      login/                      [NEW] Admin login
    dashboard/                    [NEW] Admin overview (Phase 3)
    polls/                        [NEW] Poll management (Phase 3)
    users/                        [NEW] User management (Phase 3)
    transactions/                 [NEW] Transaction logs (Phase 3)

components/
  layout/
    dashboard-layout.tsx          [NEW] Sidebar + navbar for dashboard
    admin-layout.tsx              [NEW] Admin-specific layout (Phase 3)
  molecules/
    wallet-card.tsx               [NEW] Wallet balance display
    deposit-modal.tsx             [NEW] Deposit form
    withdraw-modal.tsx            [NEW] Withdraw form
    poll-card.tsx                 [NEW] Poll preview (Phase 2)
    stake-modal.tsx               [NEW] Staking form (Phase 2)
    winner-card.tsx               [NEW] Winner info (Phase 2)
    draw-modal.tsx                [NEW] Winner draw UI (Phase 3)
    create-poll-form.tsx          [NEW] Create poll (Phase 3)
    notifications-dropdown.tsx    [NEW] Notifications (Phase 3)

hooks/
  use-wallet.ts                   [NEW] Wallet API hooks
  use-polls.ts                    [NEW] Poll API hooks (Phase 2)
  use-winner.ts                   [NEW] Winner API hooks (Phase 3)
  use-admin.ts                    [NEW] Admin API hooks (Phase 3)
  use-notifications.ts            [NEW] Notifications hooks (Phase 3)

lib/
  types.ts                        [NEW] All TypeScript types
  schemas.ts                      [NEW] Zod validation schemas
  mock-data.ts                    [NEW] Mock API data
  mock-api.ts                     [NEW] Mock API interceptor
  axios.ts                        [UPDATE] Integrate mock API
  query-provider.tsx              [EXISTING] React Query config

constants/
  routes.ts                       [UPDATE] Add new routes
```

---

## Development Workflow

### Getting Started

1. Copy `.env.example` to `.env.local`
2. Set `USE_MOCK_API=true` (default for development)
3. Run `pnpm dev` and navigate to `http://localhost:3000`

### Switching to Real API

1. Set `USE_MOCK_API=false` in `.env.local`
2. Update `NEXT_PUBLIC_BASE_API_URL` to real backend
3. **No code changes required** – same hooks work with real endpoints

### During Development

- Mock data in `lib/mock-data.ts` matches real API response structure
- Forms validate same as backend would (Zod schemas)
- Errors/loading states tested with mock before real API integration

---

## Testing Checklist

### Phase 1

- [ ] Dashboard layout responsive (desktop, tablet, mobile)
- [ ] Wallet balance displays correctly (fetches mock data)
- [ ] Deposit modal: amount input, validation, submit button works
- [ ] Withdraw modal: balance check, form validation works
- [ ] Transactions page: loads data, filters by type/date/status work
- [ ] All modals: open/close animations smooth
- [ ] Error handling: invalid amounts show proper errors
- [ ] Loading states: spinners show during mutations
- [ ] Admin login: works, non-admin users blocked from `/admin`

### Phase 2

- [ ] Polls page loads with mock data
- [ ] Poll cards display images, progress bars, time remaining
- [ ] Poll detail page shows all information
- [ ] Staking: quantity input, balance check, numbers generate
- [ ] My Stakes page: shows user's participation history
- [ ] Poll fill percentage updates dynamically

### Phase 3

- [ ] Admin dashboard: shows analytics, overview cards
- [ ] Create poll: form validates, creates new poll
- [ ] Draw winner: animation runs, winner selected correctly
- [ ] Prize claiming: both cash and physical options work
- [ ] Testimonials: display on winner cards
- [ ] All transactions logged and visible

---

## Deployment

### Production Environment Variables

```
USE_MOCK_API=false
NEXT_PUBLIC_BASE_API_URL=https://api.wagerie.com
```

### Build & Deploy

```bash
pnpm build
pnpm start
```

Deploy to Vercel, Netlify, or your preferred host.

---

## Notes

- **Authentication**: Already implemented (email/password + OTP). Extend with role-based access for admin.
- **Payment Integration**: Mocked in Phase 1; integrate Stripe/PayPal in Phase 2.
- **Real-Time Updates**: Use React Query polling; upgrade to WebSocket in Phase 2+ if needed.
- **Mobile Responsive**: All components built mobile-first using Tailwind.
- **Accessibility**: Use shadcn/ui Radix components (built-in a11y support).

---

**Status**: Ready for Phase 1 Implementation ✅
