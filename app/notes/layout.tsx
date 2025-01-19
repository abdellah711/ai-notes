import { NotesSidebar } from "@/components/notes-sidebar";
import { NavNotes, NotesSkeleton } from "@/components/notes-sidebar/nav-notes";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getNotes } from "@/db/actions";
import { PropsWithChildren, Suspense } from "react";

type Props = PropsWithChildren<{}>;

export default function NotesLayout({ children }: Props) {
  const notes = getNotes();

  return (
    <SidebarProvider>
      <NotesSidebar>
        <Suspense fallback={<NotesSkeleton />}>
          <NavNotes notesPromise={notes} />
        </Suspense>
      </NotesSidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
