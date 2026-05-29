import { User, Wallet, Transaction, Poll, Prize, Stake, Winner } from "./types";

// ============================================
// MOCK USERS
// ============================================

export const mockUsers: User[] = [
  {
    id: "user-1",
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
    role: "user",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-05-20"),
  },
  {
    id: "user-2",
    email: "jane@example.com",
    firstName: "Jane",
    lastName: "Smith",
    role: "user",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-05-19"),
  },
  {
    id: "user-3",
    email: "admin@wagerie.com",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-05-21"),
  },
  {
    id: "user-4",
    email: "mike@example.com",
    firstName: "Mike",
    lastName: "Johnson",
    role: "user",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    createdAt: new Date("2024-03-05"),
    updatedAt: new Date("2024-05-18"),
  },
];

// ============================================
// MOCK WALLETS
// ============================================

export const mockWallets: Wallet[] = [
  {
    id: "wallet-1",
    userId: "user-1",
    balance: 5234.5,
    currency: "USD",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-05-21"),
  },
  {
    id: "wallet-2",
    userId: "user-2",
    balance: 1200.0,
    currency: "USD",
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-05-20"),
  },
  {
    id: "wallet-3",
    userId: "user-3",
    balance: 50000.0,
    currency: "USD",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-05-21"),
  },
  {
    id: "wallet-4",
    userId: "user-4",
    balance: 750.25,
    currency: "USD",
    createdAt: new Date("2024-03-05"),
    updatedAt: new Date("2024-05-21"),
  },
];

// ============================================
// MOCK TRANSACTIONS
// ============================================

export const mockTransactions: Transaction[] = [
  {
    id: "tx-1",
    userId: "user-1",
    type: "deposit",
    amount: 5000,
    status: "completed",
    description: "Deposit via credit card",
    reference: "DEP-2024-05-20-001",
    createdAt: new Date("2024-05-20"),
    updatedAt: new Date("2024-05-20"),
  },
  {
    id: "tx-2",
    userId: "user-1",
    type: "stake",
    amount: 50,
    status: "completed",
    description: "Staked in iPhone 15 Pro poll",
    reference: "STK-2024-05-21-001",
    pollId: "poll-1",
    stakeId: "stake-1",
    createdAt: new Date("2024-05-21"),
    updatedAt: new Date("2024-05-21"),
  },
  {
    id: "tx-3",
    userId: "user-2",
    type: "deposit",
    amount: 1000,
    status: "completed",
    description: "Deposit via bank transfer",
    reference: "DEP-2024-05-19-001",
    createdAt: new Date("2024-05-19"),
    updatedAt: new Date("2024-05-19"),
  },
  {
    id: "tx-4",
    userId: "user-2",
    type: "withdrawal",
    amount: 200,
    status: "completed",
    description: "Withdrawal to bank account",
    reference: "WTH-2024-05-18-001",
    createdAt: new Date("2024-05-18"),
    updatedAt: new Date("2024-05-18"),
  },
  {
    id: "tx-5",
    userId: "user-4",
    type: "stake",
    amount: 25,
    status: "completed",
    description: "Staked in MacBook Pro poll",
    reference: "STK-2024-05-21-002",
    pollId: "poll-2",
    stakeId: "stake-2",
    createdAt: new Date("2024-05-21"),
    updatedAt: new Date("2024-05-21"),
  },
];

// ============================================
// MOCK PRIZES
// ============================================

export const mockPrizes: Prize[] = [
  {
    id: "prize-1",
    name: "iPhone 15 Pro",
    description: "Latest Apple iPhone 15 Pro with A17 Pro chip",
    type: "product",
    value: 999,
    image: "https://images.unsplash.com/photo-1592286927505-1def25115558?w=500",
    physicalProduct: {
      name: "Apple iPhone 15 Pro",
      description: "256GB, Space Black",
      weight: 187,
      dimensions: {
        width: 70.6,
        height: 147.6,
        depth: 8.25,
      },
    },
  },
  {
    id: "prize-2",
    name: "MacBook Pro 16",
    description: "16-inch MacBook Pro with M3 Max chip",
    type: "product",
    value: 3499,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500",
    physicalProduct: {
      name: "Apple MacBook Pro 16",
      description: "512GB SSD, 24GB RAM",
      weight: 2170,
    },
  },
  {
    id: "prize-3",
    name: "$500 Amazon Gift Card",
    description: "Amazon gift card worth $500",
    type: "cash",
    value: 500,
    image: "https://images.unsplash.com/photo-1501127122-f385ca6ddd7d?w=500",
  },
  {
    id: "prize-4",
    name: "AirPods Pro",
    description: "Apple AirPods Pro with active noise cancellation",
    type: "product",
    value: 249,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    physicalProduct: {
      name: "Apple AirPods Pro",
      description: "2nd Generation",
      weight: 4.3,
    },
  },
];

// ============================================
// MOCK POLLS
// ============================================

export const mockPolls: Poll[] = [
  {
    id: "poll-1",
    prizeId: "prize-1",
    prize: mockPrizes[0],
    totalSlots: 100,
    filledSlots: 67,
    pricePerSlot: 50,
    status: "active",
    createdAt: new Date("2024-05-15"),
    updatedAt: new Date("2024-05-21T10:30:00"),
    endsAt: new Date("2024-05-30"),
    createdBy: "user-3",
  },
  {
    id: "poll-2",
    prizeId: "prize-2",
    prize: mockPrizes[1],
    totalSlots: 50,
    filledSlots: 38,
    pricePerSlot: 100,
    status: "active",
    createdAt: new Date("2024-05-18"),
    updatedAt: new Date("2024-05-21T09:15:00"),
    endsAt: new Date("2024-06-02"),
    createdBy: "user-3",
  },
  {
    id: "poll-3",
    prizeId: "prize-3",
    prize: mockPrizes[2],
    totalSlots: 200,
    filledSlots: 156,
    pricePerSlot: 25,
    status: "active",
    createdAt: new Date("2024-05-10"),
    updatedAt: new Date("2024-05-21T14:45:00"),
    endsAt: new Date("2024-05-25"),
    createdBy: "user-3",
  },
  {
    id: "poll-4",
    prizeId: "prize-4",
    prize: mockPrizes[3],
    totalSlots: 75,
    filledSlots: 45,
    pricePerSlot: 30,
    status: "active",
    createdAt: new Date("2024-05-19"),
    updatedAt: new Date("2024-05-21T11:20:00"),
    endsAt: new Date("2024-05-28"),
    createdBy: "user-3",
  },
];

// ============================================
// MOCK STAKES
// ============================================

export const mockStakes: Stake[] = [
  {
    id: "stake-1",
    userId: "user-1",
    pollId: "poll-1",
    numbers: [42, 87],
    amount: 100,
    quantity: 2,
    status: "active",
    createdAt: new Date("2024-05-21T08:00:00"),
    updatedAt: new Date("2024-05-21T08:00:00"),
  },
  {
    id: "stake-2",
    userId: "user-4",
    pollId: "poll-2",
    numbers: [15],
    amount: 100,
    quantity: 1,
    status: "active",
    createdAt: new Date("2024-05-21T09:30:00"),
    updatedAt: new Date("2024-05-21T09:30:00"),
  },
  {
    id: "stake-3",
    userId: "user-2",
    pollId: "poll-3",
    numbers: [23, 45, 67, 89],
    amount: 100,
    quantity: 4,
    status: "active",
    createdAt: new Date("2024-05-20T16:45:00"),
    updatedAt: new Date("2024-05-20T16:45:00"),
  },
];

// ============================================
// MOCK WINNERS
// ============================================

export const mockWinners: Winner[] = [
  {
    id: "winner-1",
    stakeId: "stake-1",
    userId: "user-1",
    pollId: "poll-1",
    winningNumber: 42,
    prizeValue: 999,
    claimStatus: "pending",
    createdAt: new Date("2024-05-15T10:00:00"),
    updatedAt: new Date("2024-05-15T10:00:00"),
  },
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

export const getMockWalletByUserId = (userId: string): Wallet | undefined => {
  return mockWallets.find((w) => w.userId === userId);
};

export const getMockUserById = (userId: string): User | undefined => {
  return mockUsers.find((u) => u.id === userId);
};

export const getMockTransactionsByUserId = (
  userId: string,
  limit = 10,
): Transaction[] => {
  return mockTransactions
    .filter((t) => t.userId === userId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, limit);
};

export const getMockPollById = (pollId: string): Poll | undefined => {
  return mockPolls.find((p) => p.id === pollId);
};

export const getMockStakesByUserId = (userId: string): Stake[] => {
  return mockStakes.filter((s) => s.userId === userId);
};

export const getMockStakesByPollId = (pollId: string): Stake[] => {
  return mockStakes.filter((s) => s.pollId === pollId);
};

export const generateUniqueNumbers = (count: number, max: number): number[] => {
  const numbers = new Set<number>();
  while (numbers.size < count) {
    numbers.add(Math.floor(Math.random() * max) + 1);
  }
  return Array.from(numbers).sort((a, b) => a - b);
};
