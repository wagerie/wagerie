"use client";
import { BtnComponent } from "@/components/atoms/button-component";
import InputComponent from "@/components/atoms/input-component";
import AuthLayout from "@/components/layout/auth-layout";
import AuthComponent from "@/components/molecules/auth-component";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { errorToJSON } from "next/dist/server/render";

import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z
    .string().email().nonempty(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
}).required();

export default function Login() {
  // 1. Define your form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // do something with the form values.
    // This will be type-safe validated
    console.log(values);
  };
  return (
    <AuthLayout>
      <AuthComponent auths>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <InputComponent
                  label="Email"
                  type="email"
                  defaultValue={field.name}
                  placeholder="enter email"
                  rhk
                  hasRightIcon
                  state={
                    form.formState.errors.email?.message ? "error" : null
                  }
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
                  defaultValue={field.name}
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


            <BtnComponent className="w-full" size="lg">
              Login
            </BtnComponent>
          </form>
        </Form>
      </AuthComponent>
    </AuthLayout>
  );
}
