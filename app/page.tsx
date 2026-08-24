"use client";

import { BtnComponent } from "@/components/atoms/button-component";
import { PrimaryLogo } from "@/components/atoms/logo";
import { ModeToggle } from "@/components/atoms/toggle-theme";

import { APP_ROUTES } from "@/constants/routes";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen justify-between p-4 gap-4 container mx-auto">
      <PrimaryLogo />
      <div className="flex justify-end gap-4 relative z-10">
        <ModeToggle />

        <BtnComponent variant="outline" asChild>
          <Link href={APP_ROUTES.LOGIN}>
          login
          </Link>
        </BtnComponent>
      </div>
    </main>
  );
}
