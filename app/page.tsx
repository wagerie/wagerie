import { BtnComponent } from "@/components/atoms/button-component";
import { ModeToggle } from "@/components/atoms/toggle-theme";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen justify-between p-4 gap-4">
      <Link href={"/"} className="text-2xl font-bold uppercase dark:text-white">Wagerie</Link>
      <div className="flex justify-end gap-4">
        <ModeToggle />

        <BtnComponent variant="outline">
          <Link href={"/auth/login"}>login</Link>
        </BtnComponent>
      </div>
    </main>
  );
}
