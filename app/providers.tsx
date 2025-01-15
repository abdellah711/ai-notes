"use client";
import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { PropsWithChildren } from "react";
import { ThemeProvider } from "next-themes";

const client = new QueryClient();

export default function Providers({ children }: PropsWithChildren) {
  return (
    <NextUIProvider>
      <ThemeProvider attribute="class" defaultTheme="system">
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      </ThemeProvider>
    </NextUIProvider>
  );
}
