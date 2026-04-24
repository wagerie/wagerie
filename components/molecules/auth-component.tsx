import Link from "next/link";
import React from "react";
import { Separator } from "../ui/separator";
import { BtnComponent } from "../atoms/button-component";
import Image from "next/image";

function AuthComponent({
  children,
  auths,
  pageInfo,
}: {
  children: React.ReactNode;
  auths?: boolean;
  pageInfo?: {
    heading?: string;
    desc?: string;
    link_tag?: string;
    path?: string;
  };
}) {
  return (
    <div className="flex flex-col gap-8 max-w-113.5 w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-[#1B1818] dark:text-primary text-[36px] font-semibold">
          {pageInfo?.heading}
        </h1>
        <p className="text-sm font-normal text-[#645D5D] dark:text-secondary">
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
              src={"/assets/brand/google.png"}
              width={20}
              height={20}
              alt="google-icon"
            />
            Continue with Google
          </BtnComponent>
          <div className="relative h-7 flex items-center">
            <Separator />
            <span className="bg-white dark:bg-main-bg px-2 text-gray-500 dark:text-secondary text-sm font-normal absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
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
