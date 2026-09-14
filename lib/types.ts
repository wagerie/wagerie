// ============================================
// USER & AUTHENTICATION TYPES
// ============================================

export type UserRole = "user" | "admin";

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthToken {
  accessToken: string;
  expiresIn: number;
  tokenType: "Bearer";
}

export interface AuthPayload {
  user: User;
  token: AuthToken;
}

// ============================================
// WALLET & TRANSACTION TYPES
// ============================================

export type TransactionType =
  | "deposit"
  | "withdrawal"
  | "stake"
  | "refund"
  | "winnings";
export type TransactionStatus = "pending" | "completed" | "failed";

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: "USD";
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  description?: string;
  reference?: string;
  pollId?: string;
  stakeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// PRODUCT LISTINGS AND STAKING TYPES
// ============================================

export type PollStatus = "active" | "closed" | "completed" | "cancelled";
export type PrizeType = "cash" | "product";

export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
  description: string;
  image?: string | null;
  images?: string[];
  targetAmount: number | string;
  ticketPrice: number | string;
  raisedAmount: number | string;
  status: PollStatus;
  winnerUserId?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductEnrollment {
  id: number;
  productId: number;
  userId: number;
  ticketsBought: number;
  amountPaid: number | string;
  createdAt: string;
}

export interface Prize {
  id: string;
  name: string;
  description?: string;
  type: PrizeType;
  value: number; // USD value
  image?: string;
  physicalProduct?: {
    name: string;
    description: string;
    weight?: number;
    dimensions?: {
      width: number;
      height: number;
      depth: number;
    };
  };
}

export interface Poll {
  id: string;
  prizeId?: string;
  prize?: Prize;
  totalSlots?: number;
  filledSlots?: number;
  pricePerSlot?: number;
  status: PollStatus;
  endsAt: Date;
  createdAt: Date;
  updatedAt?: Date;
  createdBy?: string;
  winningNumber?: number;
  winnerUserId?: string;
  // Display/UI properties
  title?: string;
  description?: string;
  category?: string;
  totalStaked?: number;
  participants?: number;
  options?: Array<{ id: string; label: string; votes: number }>;
}

export type StakeStatus = "active" | "won" | "lost" | "claimed" | "pending";

export interface Stake {
  id: string;
  userId: string;
  pollId: string;
  numbers?: number[]; // array of unique numbers purchased
  amount: number; // total amount staked
  quantity?: number; // number of slots
  status: StakeStatus;
  createdAt: Date;
  updatedAt?: Date;
  // Display/UI properties
  pollTitle?: string;
  selectedOption?: string;
  potentialWinnings?: number;
}

// ============================================
// WINNER & PRIZE CLAIMING TYPES
// ============================================

export type PrizeClaimMethod = "cash" | "physical";
export type ClaimStatus = "pending" | "processing" | "claimed" | "rejected";

export interface Winner {
  id: string;
  stakeId: string;
  userId: string;
  pollId: string;
  winningNumber: number;
  prizeValue: number;
  claimStatus: ClaimStatus;
  claimMethod?: PrizeClaimMethod;
  claimedAt?: Date;
  claimDetails?: {
    transactionId?: string; // for cash claims
    shippingAddress?: string; // for physical claims
    trackingNumber?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Testimonial {
  id: string;
  winnerId: string;
  userId: string;
  stakeId: string;
  pollId: string;
  content: string;
  rating?: number;
  displayName?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export type NotificationType =
  | "stake_confirmed"
  | "poll_closing_soon"
  | "poll_closed"
  | "you_won"
  | "withdrawal_confirmed"
  | "deposit_confirmed"
  | "claim_prize";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  relatedId?: string; // poll/stake/winner ID
  relatedLink?: string;
  createdAt: Date;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// ============================================
// FILTER & QUERY TYPES
// ============================================

export interface TransactionFilter {
  type?: TransactionType;
  status?: TransactionStatus;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  pageSize?: number;
}

export interface PollFilter {
  status?: PollStatus;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: "createdAt" | "endsAt" | "filledSlots";
  page?: number;
  pageSize?: number;
}

// ============================================
// ADMIN TYPES
// ============================================

export interface AdminStats {
  totalUsers: number;
  totalPolls: number;
  activePolls: number;
  totalRevenue: number;
  recentTransactions: Transaction[];
  recentStakes: Stake[];
}
