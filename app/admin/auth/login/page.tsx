"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
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
import AuthComponent from "@/components/molecules/auth-component";
import { loginSchema, LoginInput } from "@/lib/schemas";
import { toast } from "sonner";
import api from "@/lib/axios";
import { API_ROUTES } from "@/constants/routes";

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
      // For Phase 1, use mock login
      await api.post(API_ROUTES.ADMIN_SIGNIN, {
        email: data.email,
        password: data.password,
      });

      toast.success("Admin login successful");
      router.push("/admin/dashboard");
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Invalid admin credentials";
      toast.error(message);
      console.error("Admin login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AuthComponent
        pageInfo={{
          heading: "Admin Login",
          desc: "Sign in to access the admin dashboard",
        }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <InputComponent
                      {...field}
                      type="email"
                      placeholder="Enter your email"
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
                    <FormLabel>Password</FormLabel>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-xs text-primary hover:underline"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <InputComponent
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        hasRightIcon
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <BtnComponent
              type="submit"
              className="w-full"
              loading={isLoading}
            >
              Sign In as Admin
            </BtnComponent>

            {/* User Login Link */}
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Not an admin? </span>
              <Link
                href="/auth/login"
                className="text-primary hover:underline font-medium"
              >
                User Login
              </Link>
            </div>
          </form>
        </Form>
      </AuthComponent>
    </div>
  );
}
