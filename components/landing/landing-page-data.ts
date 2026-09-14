import {
  CheckCircle2,
  Lock,
  ShieldCheck,
  Ticket,
  Trophy,
  Wallet,
} from "lucide-react";

export const featuredDraws = [
  {
    name: "iPhone 16 Pro Max 256GB",
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
    value: "$1,299",
    cash: "$1,150",
    ticketPrice: "$5.00",
    progress: 74,
    ticketsLeft: 68,
    category: "Luxury Tech",
  },
  {
    name: "Rolex Submariner Date 41mm",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
    value: "$14,500",
    cash: "$13,000",
    ticketPrice: "$10.00",
    progress: 88,
    ticketsLeft: 174,
    category: "Horology",
  },
  {
    name: "$5,000 Cash Vault",
    image:
      "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=800&q=80",
    value: "$5,000",
    cash: "$5,000",
    ticketPrice: "$2.00",
    progress: 62,
    ticketsLeft: 950,
    category: "Instant Cash",
  },
] as const;

export const trustMechanisms = [
  [
    CheckCircle2,
    "Verified entries",
    "Each entry is associated with the signed-in account.",
  ],
  [
    Ticket,
    "Visible progress",
    "See price, target, filled percentage, and entries remaining.",
  ],
  [
    Lock,
    "Account history",
    "Review your entries and outcomes from the workspace.",
  ],
  [
    ShieldCheck,
    "Clear outcomes",
    "Winning selection and fulfillment details are communicated after a draw.",
  ],
] as const;

export const howItWorksSteps = [
  {
    step: "01",
    icon: Wallet,
    title: "Deposit & Pick a Prize",
    desc: "Fund your wallet in seconds with card, bank, or PayPal. Browse verified luxury draws starting at just $1 per entry.",
  },
  {
    step: "02",
    icon: Ticket,
    title: "Get Verifiable Numbers",
    desc: "Select your desired tickets. Each ticket receives a cryptographic sequential number stored in your account ledger.",
  },
  {
    step: "03",
    icon: Trophy,
    title: "Automated Draw & Win",
    desc: "When the pool is ready, a winning entry is selected and the outcome is communicated. Claim options depend on the product terms.",
  },
] as const;

export const faqItems = [
  {
    question: "How does Wagerie work?",
    answer:
      "Choose an available product, select your number of entries, and submit the enrollment. Your entries are linked to your account for tracking.",
  },
  {
    question: "Can I see my entries?",
    answer:
      "Yes. Your entries and account activity are available in the signed-in workspace.",
  },
  {
    question: "How are products selected?",
    answer:
      "Each product listing shows its name, category, target amount, ticket price, raised amount, and status before enrollment.",
  },
  {
    question: "What happens if I win?",
    answer:
      "The completed draw outcome and next claim steps will be communicated through the product and account experience.",
  },
  {
    question: "Is there always a cash alternative?",
    answer:
      "Cash alternatives should only be expected where the specific product listing or winner terms make them available.",
  },
] as const;
