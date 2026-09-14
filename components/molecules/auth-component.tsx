import Link from "next/link";
import React from "react";
import { Separator } from "../ui/separator";
import { BtnComponent } from "../atoms/button-component";
import { cn } from "@/lib/utils";
import Image from "next/image";

function AuthComponent({
  children,
  auths,
  pageInfo,
  otp,
}: {
  children: React.ReactNode;
  auths?: boolean;
  pageInfo?: {
    heading?: string;
    desc?: string | React.ReactNode;
    link_tag?: string;
    path?: string;
  };
  otp?: boolean;
}) {
  return (
    <div className="flex flex-col gap-8 max-w-113.5 w-full">
      <div className={cn("flex flex-col gap-2", otp && "items-center")}>
        <h1
          className={cn(
            "text-foreground text-[36px] font-semibold",
            otp ? "text-center" : "",
          )}
        >
          {pageInfo?.heading}
        </h1>
        <p
          className={cn(
            "text-sm font-normal text-muted-foreground",
            otp ? "text-center" : "",
          )}
        >
          {pageInfo?.desc}{" "}
          <Link
            href={pageInfo?.path ?? "/"}
            className="capitalize text-blue-600 font-semibold"
          >
            {pageInfo?.link_tag}
          </Link>
        </p>
      </div>
      {auths ? (
        <div className="flex flex-col gap-3">
          <BtnComponent
            className="flex gap-4 font-semibold"
            variant="secondary"
            size="lg"
          >
            <Image
              src="/assets/brand/google.png"
              width={20}
              height={20}
              draggable={false}
              alt="google-icon"
            />
            Continue with Google
          </BtnComponent>
          <div className="relative h-7 flex items-center">
            <Separator />
            <span className="bg-background px-2 text-muted-foreground text-sm font-normal absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
              Or
            </span>
          </div>
        </div>
      ) : null}
      {children}
    </div>
  );
}

export default AuthComponent;
