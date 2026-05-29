import { z } from "zod";

// ============================================
// WALLET SCHEMAS
// ============================================

export const depositSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be greater than $0")
    .max(100000, "Maximum deposit is $100,000")
    .refine((val) => val >= 1, "Minimum deposit is $1")
    .refine((val) => Number.isFinite(val), "Invalid amount"),
  paymentMethod: z.enum(["credit_card", "bank_transfer", "paypal"]),
  cardDetails: z
    .object({
      cardNumber: z.string().regex(/^\d{16}$/, "Invalid card number"),
      expiryDate: z
        .string()
        .regex(/^\d{2}\/\d{2}$/, "Invalid expiry date (MM/YY)"),
      cvv: z.string().regex(/^\d{3,4}$/, "Invalid CVV"),
    })
    .optional(),
});

export const withdrawSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be greater than $0")
    .max(50000, "Maximum withdrawal is $50,000")
    .refine((val) => val >= 1, "Minimum withdrawal is $1"),
  bankDetails: z.object({
    accountNumber: z.string().min(10, "Invalid account number"),
    routingNumber: z.string().min(8, "Invalid routing number"),
    accountHolderName: z.string().min(2, "Invalid account holder name"),
  }),
  minWalletBalance: z.number().optional(),
});

// ============================================
// POLLING & STAKING SCHEMAS
// ============================================

export const createStakeSchema = z.object({
  pollId: z.string().uuid("Invalid poll ID"),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Must purchase at least 1 slot")
    .max(100, "Maximum 100 slots per purchase"),
});

export const createPollSchema = z.object({
  prizeName: z.string().min(3, "Prize name must be at least 3 characters"),
  prizeDescription: z.string().optional(),
  prizeValue: z
    .number()
    .positive("Prize value must be positive")
    .max(1000000, "Prize value exceeds maximum"),
  prizeImage: z.string().url("Invalid image URL").optional(),
  totalSlots: z
    .number()
    .int("Slots must be whole number")
    .min(10, "Minimum 10 slots")
    .max(10000, "Maximum 10,000 slots"),
  pricePerSlot: z
    .number()
    .positive("Price per slot must be positive")
    .max(1000, "Price per slot exceeds maximum"),
  duration: z
    .number()
    .int("Duration must be in hours")
    .min(1, "Minimum duration is 1 hour")
    .max(720, "Maximum duration is 30 days"),
  prizeType: z.enum(["cash", "product"]),
});

export const claimPrizeSchema = z.object({
  stakeId: z.string().uuid("Invalid stake ID"),
  method: z.enum(["cash", "physical"]),
  shippingAddress: z
    .object({
      street: z.string().min(5, "Invalid street address"),
      city: z.string().min(2, "Invalid city"),
      state: z.string().min(2, "Invalid state"),
      zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
      country: z.string().min(2, "Invalid country"),
    })
    .optional(),
});

export const testimonialSchema = z.object({
  stakeId: z.string().uuid("Invalid stake ID"),
  content: z
    .string()
    .min(10, "Testimonial must be at least 10 characters")
    .max(500, "Testimonial must not exceed 500 characters"),
  rating: z
    .number()
    .int("Rating must be whole number")
    .min(1, "Rating must be 1-5 stars")
    .max(5, "Rating must be 1-5 stars")
    .optional(),
});

// ============================================
// FORM SCHEMAS (for React Hook Form)
// ============================================

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    firstName: z.string().min(2, "First name is required").optional(),
    lastName: z.string().min(2, "Last name is required").optional(),
    terms: z.boolean().refine((val) => val === true, "You must agree to terms"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Export types inferred from schemas
export type DepositInput = z.infer<typeof depositSchema>;
export type WithdrawInput = z.infer<typeof withdrawSchema>;
export type CreateStakeInput = z.infer<typeof createStakeSchema>;
export type CreatePollInput = z.infer<typeof createPollSchema>;
export type ClaimPrizeInput = z.infer<typeof claimPrizeSchema>;
export type TestimonialInput = z.infer<typeof testimonialSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
