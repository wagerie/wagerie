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
import { useRouter } from "next/navigation";
import { API_ROUTES, APP_ROUTES } from "@/constants/routes";
import React from "react";

const formSchema = z.object({
  email: z.string().email("Invalid email").min(1, "Email is required"),
});

export default function ForgotPassword() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate: forgotPassword, isPending } = usePost(
    API_ROUTES.FORGOT_PASSWORD,
    {
      onSuccess: (_, variables) => {
        router.push(`${APP_ROUTES.VERIFY_FORGOT_PASSWORD}?email=${variables.email}`);
      },
    }
  );

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    forgotPassword(values);
  };

  const pageInfo = {
    heading: "Forgot Password",
    desc: "Enter your email address to receive a password reset code.",
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
              name="email"
              render={({ field }) => (
                <InputComponent
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  rhk
                  hasRightIcon
                  state={form.formState.errors.email?.message ? "error" : null}
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
