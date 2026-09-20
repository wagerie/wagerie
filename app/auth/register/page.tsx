"use client";
import React from "react";
import { BtnComponent } from "@/components/atoms/button-component";
import InputComponent from "@/components/atoms/input-component";
import AuthLayout from "@/components/layout/auth-layout";
import AuthComponent from "@/components/molecules/auth-component";
import { Form, FormField } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useGet, usePost } from "@/hooks/use-api";
import { useRouter } from "next/navigation";
import { API_ROUTES, APP_ROUTES } from "@/constants/routes";

const formSchema = z
  .object({
    email: z
      .string()
      .email("Please enter a valid email")
      .nonempty("Email is required"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be 30 characters or fewer")
      .regex(
        /^[a-zA-Z0-9._]+$/,
        "Use letters, numbers, underscores, or periods only",
      ),
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

  const {
    watch,
    handleSubmit,
    control,
    formState,
    trigger,
    setError,
    clearErrors,
  } = form;

  // Re-validate confirmPassword when password changes
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const username = watch("username");
  const [usernameState, setUsernameState] = React.useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [debouncedUsername, setDebouncedUsername] = React.useState("");

  React.useEffect(() => {
    if (confirmPassword) {
      trigger("confirmPassword");
    }
  }, [password, confirmPassword, trigger]);

  React.useEffect(() => {
    const normalized = username.trim().toLowerCase();
    if (!/^[a-z0-9._]{3,30}$/.test(normalized)) {
      setUsernameState("idle");
      setSuggestions([]);
    } else {
      setUsernameState("checking");
    }

    const timeout = window.setTimeout(() => {
      setDebouncedUsername(normalized);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [username]);

  const normalizedUsername = debouncedUsername;
  const isUsernameValid = /^[a-z0-9._]{3,30}$/.test(normalizedUsername);
  const {
    data: usernameCheck,
    isError: isUsernameCheckError,
    isFetching: isCheckingUsername,
  } = useGet<{
    available: boolean;
    suggestions: string[];
  }>(
    ["check-username", normalizedUsername],
    `${API_ROUTES.CHECK_USERNAME}?username=${encodeURIComponent(normalizedUsername)}`,
    { enabled: isUsernameValid },
  );

  React.useEffect(() => {
    if (!isUsernameValid) {
      setUsernameState("idle");
      setSuggestions([]);
      return;
    }

    if (isUsernameCheckError) {
      setUsernameState("idle");
      return;
    }

    if (isCheckingUsername || !usernameCheck) {
      setUsernameState("checking");
      return;
    }

    if (usernameCheck.available) {
      setUsernameState("available");
      setSuggestions([]);
      clearErrors("username");
      return;
    }

    setUsernameState("taken");
    setSuggestions(usernameCheck.suggestions);
    setError("username", {
      type: "validate",
      message: "That username is already taken",
    });
  }, [
    clearErrors,
    isCheckingUsername,
    isUsernameCheckError,
    isUsernameValid,
    setError,
    usernameCheck,
    username,
  ]);

  const { mutate: register, isPending } = usePost(API_ROUTES.SIGNUP, {
    onSuccess: (response: any, variables: any) => {
      router.push(`${APP_ROUTES.OTP_VERIFICATION}?email=${variables?.email}`);
    },
  });

  const onSubmit = (
    values: z.infer<typeof formSchema>,
    e?: React.BaseSyntheticEvent,
  ) => {
    e?.preventDefault();
    if (usernameState !== "available") {
      setError("username", {
        type: "validate",
        message: "Please choose an available username",
      });
      return;
    }
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
            <FormField
              control={control}
              name="username"
              render={({ field }) => (
                <div className="space-y-2">
                  <InputComponent
                    label="Username"
                    type="text"
                    placeholder="Enter your username"
                    rhk
                    state={formState.errors.username?.message ? "error" : null}
                    {...field}
                  />
                  {usernameState === "checking" && (
                    <p className="text-xs text-muted-foreground">
                      Checking availability…
                    </p>
                  )}
                  {usernameState === "available" && (
                    <p className="text-xs text-emerald-600">
                      Username is available.
                    </p>
                  )}
                  {usernameState === "taken" && (
                    <div className="space-y-1">
                      <p className="text-xs text-destructive">
                        That username is taken.
                      </p>
                      {suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {suggestions.map((suggestion) => (
                            <button
                              className="rounded-full border border-border px-2 py-1 text-xs hover:bg-muted"
                              key={suggestion}
                              onClick={(event) => {
                                event.preventDefault();
                                field.onChange(suggestion);
                              }}
                              type="button"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            />

            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <InputComponent
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  rhk
                  state={formState.errors.email?.message ? "error" : null}
                  {...field}
                />
              )}
            />

            <FormField
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

            <FormField
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
