import Image from "next/image";
import { Montserrat_Alternates } from "next/font/google";
import { cn } from "@/lib/utils";

const montserratAlternates = Montserrat_Alternates({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const PrimaryLogo = ({ className }: { className?: string }) => {
  return (
    <>
      {/* <Image
        src={"/logo.svg"}
        alt="logo"
        width={150}
        height={28}
        draggable={false}
      /> */}
      <h1
        className={cn(
          "text-main-bg text-3xl font-semibold dark:text-primary",
          montserratAlternates.className,
          className,
        )}
      >
        Wagerie
      </h1>
    </>
  );
};
