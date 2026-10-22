import { APP_ROUTES } from "@/constants/routes";
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
            href={pageInfo?.path ?? APP_ROUTES.HOME}
            className="capitalize text-blue-600 font-semibold"
          >
            {pageInfo?.link_tag}
          </Link>
        </p>
      </div>
      {children}
    </div>
  );
}

export default AuthComponent;
