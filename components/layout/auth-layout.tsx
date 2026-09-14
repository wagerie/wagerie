import Link from "next/link";
import React from "react";
import { ModeToggle } from "../atoms/toggle-theme";
import { PrimaryLogo } from "../atoms/logo";
import AuthTestimonials from "../molecules/auth-testimonials";

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-background p-4 text-foreground sm:p-6 container mx-auto items-center">
      {/* Visual Brand Column (Visible on Desktop) */}
      <div className="hidden lg:flex p-12 bg-secondary-dark-bg bg-[url('/assets/images/soft-light.png'),url('/assets/images/overlay.png')] rounded-[30px]  bg-cover bg-center flex-col justify-between h-full min-h-160">
        <Link href={"/"}>
          <PrimaryLogo className="text-white" />
        </Link>

        <AuthTestimonials />
      </div>

      {/* Form Column */}
      <div className="p-4 sm:p-8 relative flex flex-col items-center justify-center w-full">
        {/* Mobile Header with Logo */}
        <div className="lg:hidden flex items-center justify-between w-full max-w-113.5 mb-8">
          <Link href="/">
            <PrimaryLogo className="text-2xl font-black" />
          </Link>
          <ModeToggle />
        </div>

        <div className="hidden lg:block absolute top-4 right-4">
          <ModeToggle />
        </div>

        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
