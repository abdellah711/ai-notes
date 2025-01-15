import { useRouter as useNextRouter } from "next/navigation";
import { useTransition } from "react";
export const useRouter = () => {
  const router = useNextRouter();
  const [isNavigating, startTransition] = useTransition();
  return {
    ...router,
    isNavigating,
    push: (...args: Parameters<typeof router.push>) =>
      startTransition(() => router.push(...args)),
    replace: (...args: Parameters<typeof router.replace>) =>
      startTransition(() => router.replace(...args)),
  };
};
