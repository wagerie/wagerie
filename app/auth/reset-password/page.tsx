"use client";

import { BtnComponent } from "@/components/atoms/button-component";
import InputComponent from "@/components/atoms/input-component";
import AuthLayout from "@/components/layout/auth-layout";
import AuthComponent from "@/components/molecules/auth-component";
import { Form, FormField } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { usePost } from "@/hooks/use-api";
import { useRouter, useSearchParams } from "next/navigation";
import { API_ROUTES, APP_ROUTES } from "@/constants/routes";
import React from "react";

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(1, "Confirmation is required"),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
        fatal: true,
      });
    }
  });

export default function ResetPassword() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </React.Suspense>
  );
}

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { watch, trigger } = form;
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  React.useEffect(() => {
    if (confirmPassword) {
      trigger("confirmPassword");
    }
  }, [password, confirmPassword, trigger]);

  const { mutate: resetPassword, isPending } = usePost(
    API_ROUTES.RESET_PASSWORD,
    {
      onSuccess: () => {
        router.push(APP_ROUTES.LOGIN);
      },
    }
  );

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    resetPassword({
      email,
      password: values.password,
      confirmPassword: values.confirmPassword,
    });
  };

  const pageInfo = {
    heading: "Reset Password",
    desc: "Please enter your new password.",
  };

  return (
    <AuthLayout>
      <AuthComponent pageInfo={pageInfo}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <InputComponent
                  label="New Password"
                  type="password"
                  placeholder="Enter new password"
                  rhk
                  hasRightIcon
                  state={form.formState.errors.password?.message ? "error" : null}
                  {...field}
                />
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <InputComponent
                  label="Confirm New Password"
                  type="password"
                  placeholder="Confirm your new password"
                  rhk
                  hasRightIcon
                  state={
                    form.formState.errors.confirmPassword?.message ? "error" : null
                  }
                  {...field}
                />
              )}
            />

            <BtnComponent
              className="w-full"
              size="lg"
              loading={isPending}
              disabled={isPending}
              type="submit"
            >
              Reset Password
            </BtnComponent>
          </form>
        </Form>
      </AuthComponent>
    </AuthLayout>
  );
}
