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
import { useCreateNote } from "@/hooks/use-create-note";
import { useRouter } from "@/hooks/use-router";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import KnowledgeNoteLink from "./knowledge-note-link";

type Props = React.ComponentProps<typeof Sidebar>;

export function NotesSidebar({ children, ...props }: Props) {
  const router = useRouter();
  const { isPending, createNewNote } = useCreateNote();

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/notes">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <WandSparkles className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">AI Notes</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <Button
          variant="bordered"
          size="sm"
          color="primary"
          className="self-end"
          startContent={
            !isPending &&
            !router.isNavigating && <PlusIcon className="size-4" />
          }
          onPress={() => void createNewNote()}
          isLoading={isPending || router.isNavigating}
        >
          New Note
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <KnowledgeNoteLink />
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
