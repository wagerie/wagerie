import Link from "next/link";
import React from "react";
import { ModeToggle } from "../atoms/toggle-theme";

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 min-h-screen">
      <div className="border p-4">
        <Link
          href={"/"}
          className="text-2xl font-bold uppercase dark:text-white"
        >
          Wagerie
        </Link>
      </div>
      <div className="p-4 relative">
        <ModeToggle className="absolute top-4 right-4" />
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
