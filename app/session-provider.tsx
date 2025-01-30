"use client";
import { authClient } from "@/lib/auth-client";
import { createContext, PropsWithChildren, use } from "react";

const SessionContext = createContext<
  ReturnType<(typeof authClient)["useSession"]>
>({
  data: null,
  isPending: false,
  error: null,
});

export function SessionProvider({ children }: PropsWithChildren) {
  const session = authClient.useSession();
  return <SessionContext value={session}>{children}</SessionContext>;
}

export function useSession() {
  return use(SessionContext);
}
