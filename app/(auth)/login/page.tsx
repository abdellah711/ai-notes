"use client";
import { authClient } from "@/lib/auth-client";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import { Alert } from "@nextui-org/alert";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useReducer, useTransition } from "react";
import NextLink from "next/link";

type FormType = {
  email: string;
  password: string;
};

export default function SignupPage() {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useReducer(
    (state: FormType, newState: Partial<FormType>) => ({
      ...state,
      ...newState,
    }),
    {
      email: "",
      password: "",
    }
  );
  const router = useRouter();
  const {
    isPending: isLoading,
    mutate,
    error,
    isError,
  } = useMutation({
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      const { error, data } = await authClient.signIn.email(formData);
      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      startTransition(() => {
        router.push("/");
      });
    },
  });

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="max-w-md w-full px-7 py-5 bg-content1 shadow-small rounded-medium">
        <div className="space-y-1 mb-4">
          <h1 className="text-2xl font-medium">Login</h1>
          <p className="text-sm text-foreground-500">Login to your account</p>
        </div>
        <form className="flex flex-col gap-4" onSubmit={mutate}>
          <Alert
            color="danger"
            isVisible={isError}
            title={error?.message ?? "Something went wrong"}
          />
          <Input
            type="email"
            size="sm"
            label="Email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ email: e.target.value })}
          />
          <Input
            type="password"
            size="sm"
            label="Password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ password: e.target.value })}
          />
          <Button
            color="primary"
            type="submit"
            isLoading={isPending || isLoading}
          >
            Sign in
          </Button>
        </form>
        <p className="text-center text-small text-foreground-600 mt-5">
          Need an account?{" "}
          <Link href="/signup" as={NextLink} size="sm">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
