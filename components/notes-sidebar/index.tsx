"use client";

import { PlusIcon, WandSparkles } from "lucide-react";
import * as React from "react";

import { NavUser } from "@/components/notes-sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { createNewNote } from "@/db/actions";
import { Button } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";

type Props = React.ComponentProps<typeof Sidebar>;

export function NotesSidebar({ children, ...props }: Props) {
  const { isPending, mutate } = useMutation({ mutationFn: createNewNote });

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <WandSparkles className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">AI Notes</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <Button
          variant="bordered"
          size="sm"
          color="primary"
          className="self-end"
          startContent={!isPending && <PlusIcon className="size-4" />}
          onPress={() => void mutate()}
          isLoading={isPending}
        >
          New Note
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Notes</SidebarGroupLabel>
          {children}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
