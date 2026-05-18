"use client";

import { BtnComponent } from "@/components/atoms/button-component";
import AuthLayout from "@/components/layout/auth-layout";
import AuthComponent from "@/components/molecules/auth-component";
import { API_ROUTES, APP_ROUTES } from "@/constants/routes";
import { usePost } from "@/hooks/use-api";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function Page() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();
  const [otp, setOtp] = React.useState("");
  const [countdown, setCountdown] = React.useState(60);

  React.useEffect(() => {
    if (countdown > 0) {
      const timerId = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [countdown]);

  const pageInfo = {
    heading: "OTP Verification",
    desc: (
      <>
        Enter the verification code sent to - <strong>{email}</strong>
      </>
    ),
    // link_tag: "Back to Login",
    // path: "/login",
  };

  const { mutate: verifyOtp, isPending } = usePost(API_ROUTES.VERIFY_OTP, {
    onSuccess: () => {
      router.push(APP_ROUTES.LOGIN);
    },
  });
  const { mutate: resendOtp, isPending: isResendPending } = usePost(
    API_ROUTES.RESEND_OTP,
    {
      onSuccess: () => {
        setCountdown(60);
      },
    },
  );

  const onSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    verifyOtp({
      otp: otp,
      email: email,
    });
  };

  const handleResendOtp = () => {
    resendOtp({
      email: email,
    });
  };
  return (
    <AuthLayout>
      <AuthComponent pageInfo={pageInfo} otp={true}>
        <form onSubmit={onSubmit} className="flex flex-col space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <BtnComponent
            type="submit"
            loading={isPending}
            disabled={isPending || otp.length < 6}
            // className="w-full"
          >
            Verify OTP
          </BtnComponent>
          <div className="flex flex-col items-center justify-center space-y-2 mt-4 text-sm text-[#645D5D] dark:text-gray-400">
            <p className="flex items-center">
              Didn&apos;t receive the code?{" "}
              {countdown > 0 ? (
                <span className="px-1">
                  Resend in{" "}
                  <span className="font-semibold text-blue-600">
                    {countdown}s
                  </span>
                </span>
              ) : (
                <BtnComponent
                  variant={"link"}
                  type="button"
                  className="text-blue-600 dark:text-blue-500"
                  onClick={handleResendOtp}
                  disabled={countdown > 0 || isResendPending}
                  loading={isResendPending}
                >
                  Resend OTP
                </BtnComponent>
              )}
            </p>
          </div>
        </form>
      </AuthComponent>
    </AuthLayout>
  );
}
