"use client";
import React from "react";
import { BtnComponent } from "@/components/atoms/button-component";
import InputComponent from "@/components/atoms/input-component";
import AuthLayout from "@/components/layout/auth-layout";
import AuthComponent from "@/components/molecules/auth-component";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { usePost } from "@/hooks/use-api";
import { useRouter } from "next/navigation";
import { API_ROUTES, APP_ROUTES } from "@/constants/routes";

const formSchema = z
  .object({
    username: z
      .string()
      .email("Please enter a valid email")
      .nonempty("Email is required"), // Maps to "username" in payload
    email: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .nonempty("Name is required"), // Maps to "email" in payload
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

export default function Register() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { watch, handleSubmit, control, formState, trigger } = form;

  // Re-validate confirmPassword when password changes
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const allValues = watch();

  React.useEffect(() => {
    console.log("Current Form Values:", allValues);
  }, [allValues]);

  React.useEffect(() => {
    if (confirmPassword) {
      trigger("confirmPassword");
    }
  }, [password, confirmPassword, trigger]);

  const { mutate: register, isPending } = usePost(API_ROUTES.REGISTER, {
    onSuccess: (response: any) => {
      // Assuming registration successful, redirect to login or home
      router.push(APP_ROUTES.LOGIN);
    },
  });

  const onSubmit = (
    values: z.infer<typeof formSchema>,
    e?: React.BaseSyntheticEvent,
  ) => {
    e?.preventDefault();
    console.log("Form data:", values);
    const { confirmPassword, ...payload } = values;
    register(payload);
  };

  const pageInfo = {
    heading: "Create an account",
    desc: "Already have an account?",
    link_tag: "Login",
    path: APP_ROUTES.LOGIN,
  };

  return (
    <AuthLayout>
      <AuthComponent pageInfo={pageInfo} auths>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <InputComponent
                  label="Name"
                  type="text"
                  placeholder="Enter your name"
                  rhk
                  state={formState.errors.email?.message ? "error" : null}
                  {...field}
                />
              )}
            />

            <Controller
              control={control}
              name="username"
              render={({ field }) => (
                <InputComponent
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  rhk
                  state={formState.errors.username?.message ? "error" : null}
                  {...field}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <InputComponent
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                  rhk
                  hasRightIcon
                  state={formState.errors.password?.message ? "error" : null}
                  {...field}
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <InputComponent
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  rhk
                  hasRightIcon
                  state={
                    formState.errors.confirmPassword?.message ? "error" : null
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
              Sign Up
            </BtnComponent>
          </form>
        </Form>
      </AuthComponent>
    </AuthLayout>
  );
}
