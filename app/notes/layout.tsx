import NoteDropdownMenu from "@/components/note-dropdown-menu";
import { NotesSidebar } from "@/components/notes-sidebar";
import { NavNotes } from "@/components/notes-sidebar/nav-notes";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
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
        <SidebarInset>
          <header className="flex pt-4 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4 justify-between w-full">
              <SidebarTrigger className="-ml-1" />
              <NoteDropdownMenu />
            </div>
          </header>
          {children}
        </SidebarInset>
      </NotesStoreProvider>
    </SidebarProvider>
  );
}
