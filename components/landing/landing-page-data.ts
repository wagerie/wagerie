import {
  CheckCircle2,
  Lock,
  ShieldCheck,
  Ticket,
  Trophy,
  Wallet,
} from "lucide-react";

export const trustMechanisms = [
  [
    CheckCircle2,
    "Account-linked entries",
    "Review entries recorded for your account in My Stakes.",
  ],
  [
    Ticket,
    "Live product details",
    "See product value, ticket price, progress, and remaining entries.",
  ],
  [
    Lock,
    "Account history",
    "Review your entries and outcomes from the workspace.",
  ],
  [
    ShieldCheck,
    "Recorded outcomes",
    "Draw results and claim status appear when they are published to your account.",
  ],
] as const;

export const howItWorksSteps = [
  {
    step: "01",
    icon: Wallet,
    title: "Browse Active Products",
    desc: "Compare product value, ticket prices, and available entries before choosing a draw.",
  },
  {
    step: "02",
    icon: Ticket,
    title: "Choose Your Entries",
    desc: "Select how many entries to buy and review the total before submitting. Your recorded entries appear in My Stakes.",
  },
  {
    step: "03",
    icon: Trophy,
    title: "Track the Outcome",
    desc: "Follow your entries and the product status. Draw results and claim options depend on the published product terms.",
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
      "Each product listing shows its name, product value, ticket price, progress, and remaining entries before enrollment.",
  },
  {
    question: "What happens if I win?",
    answer:
      "Winner and claim details depend on the product terms and confirmed draw result. Published outcomes appear in your account.",
  },
  {
    question: "Is there always a cash alternative?",
    answer:
      "Cash alternatives should only be expected where the specific product listing or winner terms make them available.",
  },
] as const;
