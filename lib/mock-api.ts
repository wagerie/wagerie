import {
  Wallet,
  Transaction,
  Poll,
  Stake,
  Winner,
  User,
  TransactionFilter,
  PaginatedResponse,
} from "./types";
import {
  mockWallets,
  mockTransactions,
  mockPolls,
  mockStakes,
  mockWinners,
  mockUsers,
  getMockWalletByUserId,
  getMockTransactionsByUserId,
  getMockPollById,
  getMockStakesByUserId,
  getMockStakesByPollId,
  generateUniqueNumbers,
} from "./mock-data";

// Mock response delay (ms) for realistic behavior
const MOCK_DELAY = 300;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================
// MOCK API HANDLERS
// ============================================

export const mockApiHandlers = {
  // ========== WALLET ==========

  getBalance: async (userId: string): Promise<Wallet> => {
    await delay(MOCK_DELAY);
    const wallet = getMockWalletByUserId(userId);
    if (!wallet) {
      throw new Error("Wallet not found");
    }
    return wallet;
  },

  deposit: async (
    userId: string,
    amount: number,
    paymentMethod: string,
  ): Promise<{ wallet: Wallet; transaction: Transaction }> => {
    await delay(MOCK_DELAY * 2); // Simulate payment processing
    const wallet = getMockWalletByUserId(userId);
    if (!wallet) {
      throw new Error("Wallet not found");
    }

    // Update mock wallet balance
    wallet.balance += amount;
    wallet.updatedAt = new Date();

    // Create mock transaction
    const transaction: Transaction = {
      id: `tx-${Date.now()}`,
      userId,
      type: "deposit",
      amount,
      status: "completed",
      description: `Deposit via ${paymentMethod}`,
      reference: `DEP-${new Date().toISOString().split("T")[0]}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockTransactions.push(transaction);
    return { wallet, transaction };
  },

  withdraw: async (
    userId: string,
    amount: number,
    bankDetails: unknown,
  ): Promise<{ wallet: Wallet; transaction: Transaction }> => {
    await delay(MOCK_DELAY * 2);
    const wallet = getMockWalletByUserId(userId);
    if (!wallet) {
      throw new Error("Wallet not found");
    }

    if (wallet.balance < amount) {
      throw new Error("Insufficient funds");
    }

    wallet.balance -= amount;
    wallet.updatedAt = new Date();

    const transaction: Transaction = {
      id: `tx-${Date.now()}`,
      userId,
      type: "withdrawal",
      amount,
      status: "completed",
      description: "Withdrawal to bank account",
      reference: `WTH-${new Date().toISOString().split("T")[0]}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockTransactions.push(transaction);
    return { wallet, transaction };
  },

  getTransactions: async (
    userId: string,
    filter?: TransactionFilter,
  ): Promise<PaginatedResponse<Transaction>> => {
    await delay(MOCK_DELAY);
    let transactions = getMockTransactionsByUserId(userId, 100);

    if (filter?.type) {
      transactions = transactions.filter((t) => t.type === filter.type);
    }

    if (filter?.status) {
      transactions = transactions.filter((t) => t.status === filter.status);
    }

    const page = filter?.page || 1;
    const pageSize = filter?.pageSize || 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
      data: transactions.slice(start, end),
      total: transactions.length,
      page,
      pageSize,
      totalPages: Math.ceil(transactions.length / pageSize),
    };
  },

  // ========== POLLS ==========

  getPolls: async (filter?: unknown): Promise<PaginatedResponse<Poll>> => {
    await delay(MOCK_DELAY);
    const polls = mockPolls;

    return {
      data: polls,
      total: polls.length,
      page: 1,
      pageSize: 10,
      totalPages: 1,
    };
  },

  getPollById: async (pollId: string): Promise<Poll> => {
    await delay(MOCK_DELAY);
    const poll = getMockPollById(pollId);
    if (!poll) {
      throw new Error("Poll not found");
    }
    return poll;
  },

  // ========== STAKES ==========

  createStake: async (
    userId: string,
    pollId: string,
    quantity: number,
  ): Promise<{
    stake: Stake;
    wallet: Wallet;
    transaction: Transaction;
  }> => {
    await delay(MOCK_DELAY * 1.5);

    const poll = getMockPollById(pollId);
    if (!poll) {
      throw new Error("Poll not found");
    }

    const wallet = getMockWalletByUserId(userId);
    if (!wallet) {
      throw new Error("Wallet not found");
    }

    const { pricePerSlot, filledSlots, totalSlots, prize } = poll;
    if (
      pricePerSlot === undefined ||
      filledSlots === undefined ||
      totalSlots === undefined ||
      !prize
    ) {
      throw new Error("Poll is missing stake configuration");
    }

    const totalAmount = quantity * pricePerSlot;

    if (wallet.balance < totalAmount) {
      throw new Error("Insufficient funds");
    }

    // Check if poll has available slots
    if (filledSlots + quantity > totalSlots) {
      throw new Error("Not enough slots available");
    }

    // Deduct from wallet
    wallet.balance -= totalAmount;
    wallet.updatedAt = new Date();

    // Generate unique numbers for this stake
    const numbers = generateUniqueNumbers(quantity, totalSlots);

    // Create stake
    const stake: Stake = {
      id: `stake-${Date.now()}`,
      userId,
      pollId,
      numbers,
      amount: totalAmount,
      quantity,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Update poll filled slots
    poll.filledSlots = filledSlots + quantity;
    poll.updatedAt = new Date();

    // Create transaction
    const transaction: Transaction = {
      id: `tx-${Date.now()}`,
      userId,
      type: "stake",
      amount: totalAmount,
      status: "completed",
      description: `Staked in ${prize.name} poll`,
      reference: `STK-${new Date().toISOString().split("T")[0]}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      pollId,
      stakeId: stake.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockStakes.push(stake);
    mockTransactions.push(transaction);

    return { stake, wallet, transaction };
  },

  getUserStakes: async (userId: string): Promise<Stake[]> => {
    await delay(MOCK_DELAY);
    return getMockStakesByUserId(userId);
  },

  getPollStakes: async (pollId: string): Promise<Stake[]> => {
    await delay(MOCK_DELAY);
    return getMockStakesByPollId(pollId);
  },

  // ========== WINNERS ==========

  drawWinner: async (pollId: string): Promise<Winner> => {
    await delay(MOCK_DELAY * 3); // Simulate drawing process

    const poll = getMockPollById(pollId);
    if (!poll) {
      throw new Error("Poll not found");
    }

    const stakes = getMockStakesByPollId(pollId);
    if (stakes.length === 0) {
      throw new Error("No stakes in this poll");
    }

    if (poll.totalSlots === undefined || !poll.prize) {
      throw new Error("Poll is missing winner configuration");
    }

    // Select random winning number
    const winningNumber = Math.floor(Math.random() * poll.totalSlots) + 1;
    poll.winningNumber = winningNumber;

    // Find winning stake
    const winningStake = stakes.find((s) =>
      s.numbers?.includes(winningNumber),
    );
    if (!winningStake) {
      throw new Error("No winner found");
    }

    // Create winner record
    const winner: Winner = {
      id: `winner-${Date.now()}`,
      stakeId: winningStake.id,
      userId: winningStake.userId,
      pollId,
      winningNumber,
      prizeValue: poll.prize.value,
      claimStatus: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockWinners.push(winner);
    return winner;
  },

  // ========== AUTH (Admin) ==========

  loginAdmin: async (
    email: string,
    password: string,
  ): Promise<{ user: User; token: string }> => {
    await delay(MOCK_DELAY);
    const user = mockUsers.find((u) => u.email === email && u.role === "admin");
    if (!user) {
      throw new Error("Invalid admin credentials");
    }

    const token = `admin-token-${Date.now()}`;
    return { user, token };
  },

  // ========== ADMIN DASHBOARD ==========

  getAdminStats: async (): Promise<any> => {
    await delay(MOCK_DELAY);
    return {
      totalUsers: mockUsers.length,
      totalPolls: mockPolls.length,
      activePolls: mockPolls.filter((p) => p.status === "active").length,
      totalRevenue: mockTransactions
        .filter((t) => t.type === "stake")
        .reduce((sum, t) => sum + t.amount, 0),
      recentTransactions: mockTransactions.slice(-5),
      recentStakes: mockStakes.slice(-5),
    };
  },
};

// ============================================
// API REQUEST INTERCEPTOR
// ============================================

export const mockApiInterceptor = (config: any) => {
  const useMockApi = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

  if (!useMockApi) {
    return config;
  }

  const { method, url } = config;
  const originalRequest = config;

  // Intercept specific endpoints
  if (method?.toLowerCase() === "get" && url?.includes("/wallet/balance")) {
    const userId = new URLSearchParams(url.split("?")[1]).get("userId");
    return {
      ...originalRequest,
      adapter: async () => ({
        data: await mockApiHandlers.getBalance(userId!),
        status: 200,
        statusText: "OK",
      }),
    };
  }

  if (method?.toLowerCase() === "post" && url?.includes("/wallet/deposit")) {
    const { userId, amount, paymentMethod } = originalRequest.data;
    return {
      ...originalRequest,
      adapter: async () => ({
        data: await mockApiHandlers.deposit(userId, amount, paymentMethod),
        status: 200,
        statusText: "OK",
      }),
    };
  }

  if (method?.toLowerCase() === "post" && url?.includes("/wallet/withdraw")) {
    const { userId, amount, bankDetails } = originalRequest.data;
    return {
      ...originalRequest,
      adapter: async () => ({
        data: await mockApiHandlers.withdraw(userId, amount, bankDetails),
        status: 200,
        statusText: "OK",
      }),
    };
  }

  if (
    method?.toLowerCase() === "get" &&
    url?.includes("/wallet/transactions")
  ) {
    const userId = new URLSearchParams(url.split("?")[1]).get("userId");
    const filterParam = new URLSearchParams(url.split("?")[1]);
    return {
      ...originalRequest,
      adapter: async () => ({
        data: await mockApiHandlers.getTransactions(userId!, {
          type: filterParam.get("type") as any,
          page: parseInt(filterParam.get("page") || "1"),
          pageSize: parseInt(filterParam.get("pageSize") || "10"),
        }),
        status: 200,
        statusText: "OK",
      }),
    };
  }

  if (method?.toLowerCase() === "get" && url?.includes("/polls")) {
    if (!url.includes("/polls/")) {
      return {
        ...originalRequest,
        adapter: async () => ({
          data: await mockApiHandlers.getPolls(),
          status: 200,
          statusText: "OK",
        }),
      };
    }
  }

  if (method?.toLowerCase() === "get" && url?.match(/\/polls\/[\w-]+$/)) {
    const pollId = url.split("/").pop();
    return {
      ...originalRequest,
      adapter: async () => ({
        data: await mockApiHandlers.getPollById(pollId!),
        status: 200,
        statusText: "OK",
      }),
    };
  }

  if (
    method?.toLowerCase() === "post" &&
    url?.includes("/polls/") &&
    url?.includes("/stake")
  ) {
    const { userId, quantity } = originalRequest.data;
    const pollId = url.split("/")[2];
    return {
      ...originalRequest,
      adapter: async () => ({
        data: await mockApiHandlers.createStake(userId, pollId, quantity),
        status: 201,
        statusText: "Created",
      }),
    };
  }

  if (method?.toLowerCase() === "get" && url?.includes("/user/stakes")) {
    const userId = new URLSearchParams(url.split("?")[1]).get("userId");
    return {
      ...originalRequest,
      adapter: async () => ({
        data: await mockApiHandlers.getUserStakes(userId!),
        status: 200,
        statusText: "OK",
      }),
    };
  }

  if (
    method?.toLowerCase() === "post" &&
    url?.includes("/polls/") &&
    url?.includes("/draw")
  ) {
    const pollId = url.split("/")[2];
    return {
      ...originalRequest,
      adapter: async () => ({
        data: await mockApiHandlers.drawWinner(pollId),
        status: 200,
        statusText: "OK",
      }),
    };
  }

  // ========== ADMIN AUTH ==========
  if (method?.toLowerCase() === "post" && url?.includes("/auth/admin/signin")) {
    const { email, password } = originalRequest.data;
    return {
      ...originalRequest,
      adapter: async () => ({
        data: await mockApiHandlers.loginAdmin(email, password),
        status: 200,
        statusText: "OK",
      }),
    };
  }

  // Default: pass through to real API
  return config;
};
