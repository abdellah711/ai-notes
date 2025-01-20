import { NotesSidebar } from "@/components/notes-sidebar";
import { NavNotes } from "@/components/notes-sidebar/nav-notes";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getNotes } from "@/db/actions";
import { NotesStoreProvider } from "@/stores/notes";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{}>;

export default function NotesLayout({ children }: Props) {
  const notes = getNotes();

  return (
    <SidebarProvider>
      <NotesStoreProvider notesPromise={notes}>
        <NotesSidebar>
          <NavNotes />
        </NotesSidebar>
        <SidebarInset>{children}</SidebarInset>
      </NotesStoreProvider>
    </SidebarProvider>
  );
}
