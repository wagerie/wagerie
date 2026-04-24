"use client";
import { BtnComponent } from "@/components/atoms/button-component";
import InputComponent from "@/components/atoms/input-component";
import AuthLayout from "@/components/layout/auth-layout";
import AuthComponent from "@/components/molecules/auth-component";
import { Form, FormField } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { usePost } from "@/hooks/use-api";
import { useRouter } from "next/navigation";
import { API_ROUTES, APP_ROUTES } from "@/constants/routes";

const formSchema = z
  .object({
    email: z.string().email("Invalid email").min(1, "Email is required"),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .required();

export default function Login() {
  const router = useRouter();

  // 1. Define your form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: login, isPending } = usePost(API_ROUTES.LOGIN, {
    onSuccess: (response: any) => {
      // Assuming response.token exists
      if (response.token || response.accessToken) {
        localStorage.setItem("token", response.token || response.accessToken);
        router.push(APP_ROUTES.DASHBOARD);
      }
    },
  });

  // 2. Define a submit handler.
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Login validated:", values);
    login(values);
  };

  const onInvalid = (errors: any) => {
    console.log("Login validation failed:", errors);
  };

  const pageInfo = {
    heading: "Welcome back",
    desc: "Don't have an account?",
    link_tag: "Sign up",
    path: APP_ROUTES.REGISTER,
  };

  return (
    <AuthLayout>
      <AuthComponent pageInfo={pageInfo} auths>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onInvalid)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <InputComponent
                  label="Email"
                  type="email"
                  placeholder="enter email"
                  rhk
                  hasRightIcon
                  state={form.formState.errors.email?.message ? "error" : null}
                  {...field}
                />
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <InputComponent
                  label="Password"
                  type="password"
                  placeholder="enter password"
                  rhk
                  hasRightIcon
                  state={
                    form.formState.errors.password?.message ? "error" : null
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
              {isPending ? "Logging in..." : "Login"}
            </BtnComponent>
          </form>
        </Form>

        <p className="text-sm font-normal text-[#645D5D] dark:text-secondary">
          Don&apos;t have an account?{" "}
          <Link href={"/"} className="capitalize text-blue-600 font-semibold">
            Recover
          </Link>
        </p>
      </AuthComponent>
    </AuthLayout>
  );
}
