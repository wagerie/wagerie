import Link from "next/link";
import React from "react";
import { ModeToggle } from "../atoms/toggle-theme";
import { PrimaryLogo } from "../atoms/logo";
import AuthTestimonials from "../molecules/auth-testimonials";

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 min-h-screen p-5 container">
      <div className="p-[60px] bg-[#1c202c] dark:bg-[url('/assets/images/soft-light.png'),_url('/assets/images/overlay.png')] rounded-[30px] bg-[url('/assets/images/overlay.png'),_url('/assets/images/group.png')] bg-[size:cover,_cover] bg-[position:center,_center] flex flex-col justify-between">
        <Link href={"/"}>
          <PrimaryLogo className="text-primary" />
        </Link>

        <AuthTestimonials />
      </div>
      <div className="p-4 relative flex items-center justify-center">
        <ModeToggle className="absolute top-4 right-4" />
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
