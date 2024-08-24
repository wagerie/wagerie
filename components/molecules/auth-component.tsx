import Link from "next/link";
import React from "react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { BtnComponent } from "../atoms/button-component";
import Image from "next/image";

function AuthComponent({
  children,
  auths,
}: {
  children: React.ReactNode;
  auths?: boolean;
}) {
  return (
    <div className="flex flex-col gap-8 max-w-[454px] w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-[#1B1818] text-[36px] font-semibold">
          Welcome back!
        </h1>
        <p className="text-sm font-normal text-[#645D5D]">
          Don`&apos;`t have an account?{" "}
          <Link href={"/"} className="capitalize text-[#EB5017] font-semibold">
            sign up
          </Link>
        </p>
      </div>
      {children}
      {auths ? (
        <div className="flex flex-col gap-3">
          <div className="relative h-7 flex items-center">
            <Separator className="" />
            <span className="bg-white px-2 text-gray-500 text-sm font-normal absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
              Or
            </span>
          </div>
          <BtnComponent
            className="flex gap-4 border-gray-300 h-auto p-4 text-gray-700 font-semibold"
            variant="outline"
          >
            <Image
              src={"/assets/brand/google.png"}
              width={20}
              height={20}
              alt="google-icon"
            />
            Continue with Google
          </BtnComponent>
        </div>
      ) : null}
    </div>
  );
}

export default AuthComponent;
