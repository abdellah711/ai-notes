"use client";

import { ChevronsUpDown, LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRouter } from "@/hooks/use-router";
import { authClient } from "@/lib/auth-client";
import { Avatar } from "@nextui-org/avatar";
import { Skeleton } from "@nextui-org/skeleton";
import { useState } from "react";
import { ThemeSwitcher } from "../theme-switcher";

export function NavUser() {
  const { isMobile } = useSidebar();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const { data, isPending } = authClient.useSession();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    await authClient.signOut();
    setIsLoggingOut(false);
    router.push("/login");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <Avatar name={data?.user.name.toUpperCase()} />
              <div className="grid flex-1 text-left text-sm leading-tight">
                {isPending ? (
                  <>
                    <Skeleton className="w-1/2 h-3" />
                    <Skeleton className="w-full h-2.5 mt-1" />
                  </>
                ) : (
                  <>
                    <span className="truncate font-semibold capitalize">
                      {data?.user.name}
                    </span>
                    <span className="truncate text-xs">{data?.user.email}</span>
                  </>
                )}
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar name={data?.user.name.toUpperCase()} />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold capitalize">
                    {data?.user.name}
                  </span>
                  <span className="truncate text-xs">{data?.user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ThemeSwitcher />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              {isLoggingOut || router.isNavigating
                ? "Logging out..."
                : "Log out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
