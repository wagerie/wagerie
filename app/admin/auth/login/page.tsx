"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import InputComponent from "@/components/atoms/input-component";
import { BtnComponent } from "@/components/atoms/button-component";
import { PrimaryLogo } from "@/components/atoms/logo";
import { loginSchema, LoginInput } from "@/lib/schemas";
import { toast } from "sonner";
import api from "@/lib/axios";
import { API_ROUTES } from "@/constants/routes";
import { Badge } from "@/components/ui/badge";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      await api.post(API_ROUTES.ADMIN_SIGNIN, {
        email: data.email,
        password: data.password,
      });

      toast.success("Admin authorization granted");
      router.push("/admin/dashboard");
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Invalid operator credentials";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <PrimaryLogo className="text-2xl font-black" />
          </Link>
          <div className="flex items-center justify-center gap-1.5 pt-1">
            <Badge className="border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-semibold">
              <ShieldCheck className="mr-1 h-3 w-3" />
              Operator Portal
            </Badge>
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Admin Authentication
          </h2>
          <p className="text-xs text-muted-foreground">
            Authorized operations and platform governance only.
          </p>
        </div>

        {/* Form Container */}
        <div className="rounded-3xl border border-border bg-card p-8 shadow-2xl space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-foreground">
                      Operator Email
                    </FormLabel>
                    <FormControl>
                      <InputComponent
                        {...field}
                        type="email"
                        placeholder="admin@wagerie.com"
                        hasRightIcon
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-xs font-semibold text-foreground">
                        Master Password
                      </FormLabel>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-xs text-blue-400 hover:text-blue-300"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    <FormControl>
                      <InputComponent
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        hasRightIcon
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <BtnComponent
                type="submit"
                className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30"
                loading={isLoading}
              >
                Sign In as Operator
              </BtnComponent>
            </form>
          </Form>

          <div className="border-t border-border pt-4 text-center">
            <Link
              href="/auth/login"
              className="text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              ← Back to Player Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
