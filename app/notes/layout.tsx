import { NotesSidebar } from "@/components/notes-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React, { PropsWithChildren } from "react";

type Props = PropsWithChildren<{}>;

export default function NotesLayout({ children }: Props) {
  return (
    <SidebarProvider>
      <NotesSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
