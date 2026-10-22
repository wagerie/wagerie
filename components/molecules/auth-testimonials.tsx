import { Ticket, Wallet, Trophy } from "lucide-react";

export default function AuthTestimonials() {
  return (
    <div className="space-y-6 text-white">
      <h2 className="text-3xl font-bold">Your entries, in one place.</h2>
      <p className="max-w-md text-sm leading-relaxed text-slate-300">
        Explore prize draws, review ticket prices, and follow your confirmed
        entries from your account.
      </p>
      <ul className="space-y-4 text-sm">
        {[
          { Icon: Ticket, text: "Track recorded tickets" },
          { Icon: Wallet, text: "Review wallet transactions" },
          { Icon: Trophy, text: "Follow results and prize claims" },
        ].map(({ Icon, text }) => (
          <li key={text} className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-blue-300" aria-hidden="true" />
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
}
