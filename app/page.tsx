import { BtnComponent } from "@/components/atoms/button-component";
import { PrimaryLogo } from "@/components/atoms/logo";
import { ModeToggle } from "@/components/atoms/toggle-theme";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes";

export default function Home() {
  return (
    <main className="flex min-h-screen justify-between p-4 gap-4 container">
      <PrimaryLogo />
      <div className="flex justify-end gap-4">
        <ModeToggle />

        <BtnComponent variant="outline">
          <Link href={APP_ROUTES.LOGIN}>login</Link>
        </BtnComponent>
      </div>
    </main>
  );
}
