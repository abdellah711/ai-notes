"use client";
import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { PropsWithChildren } from "react";

const client = new QueryClient();

export default function Providers({ children }: PropsWithChildren) {
  return (
    <NextUIProvider>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </NextUIProvider>
  );
}
