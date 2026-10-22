"use client";
import { BtnComponent } from "@/components/atoms/button-component";
import InputComponent from "@/components/atoms/input-component";
import AuthLayout from "@/components/layout/auth-layout";
import AuthComponent from "@/components/molecules/auth-component";
import { Form, FormField } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEntryReturnPath } from "@/hooks/use-entry-return-path";
import { safeAccountReturnPath } from "@/lib/account-state";
import { toast } from "sonner";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { getApiPayload, usePost } from "@/hooks/use-api";
import { useRouter } from "next/navigation";
import { API_ROUTES, APP_ROUTES } from "@/constants/routes";
import { setCookie } from "@/hooks/use-cookies";

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
  const returnPath = useEntryReturnPath();

  // 1. Define your form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: login, isPending } = usePost<unknown>(API_ROUTES.SIGNIN, {
    onSuccess: (response) => {
      const payload = getApiPayload<{
        accessToken?: string;
        refreshToken?: string;
        token?: string;
      }>(response);
      const token = payload.accessToken ?? payload.token;
      if (!token) {
        toast.error(
          "Sign-in did not return a usable session. Please try again.",
        );
        return;
      }
      setCookie("wagerie_token", token);
      const next = new URLSearchParams(window.location.search).get("next");
      router.push(safeAccountReturnPath(next) || APP_ROUTES.DASHBOARD);
    },
  });

  // 2. Define a submit handler.
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    login(values);
  };

  const onInvalid = (errors: any) => {
    // Field validation errors are displayed beside the inputs.
  };

  const pageInfo = {
    heading: "Welcome back",
    desc: "Don't have an account?",
    link_tag: "Sign up",
    path: returnPath
      ? `${APP_ROUTES.REGISTER}?next=${encodeURIComponent(returnPath)}`
      : APP_ROUTES.REGISTER,
  };

  return (
    <AuthLayout>
      <AuthComponent pageInfo={pageInfo} auths>
        <p className="text-sm text-muted-foreground">
          Sign in to continue to your account. If your previous session expired,
          your saved entries remain in My Entries.
        </p>
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

        <div className="flex items-center justify-between text-xs sm:text-sm font-normal pt-2">
          <Link
            href={APP_ROUTES.FORGOT_PASSWORD}
            className="text-blue-500 hover:underline font-semibold"
          >
            Forgot password?
          </Link>
          <span className="text-slate-400">
            Need an account?{" "}
            <Link
              href={APP_ROUTES.REGISTER}
              className="text-blue-500 font-semibold hover:underline"
            >
              Sign up
            </Link>
          </span>
        </div>
      </AuthComponent>
    </AuthLayout>
  );
}
