"use client";

import { BtnComponent } from "@/components/atoms/button-component";
import { PrimaryLogo } from "@/components/atoms/logo";
import { ModeToggle } from "@/components/atoms/toggle-theme";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex min-h-screen justify-between p-4 gap-4 container mx-auto">
      <PrimaryLogo />
      <div className="flex justify-end gap-4">
        <ModeToggle />

        <BtnComponent
          variant="outline"
          onClick={() => router.push(APP_ROUTES.LOGIN)}
        >
          login
        </BtnComponent>
      </div>
    </main>
  );
}
