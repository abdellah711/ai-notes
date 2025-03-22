"use client";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useNotesStore } from "@/stores/notes";
import { Skeleton } from "@nextui-org/skeleton";
import Link from "next/link";
import { useParams } from "next/navigation";

type Props = {};

export function NavNotes({}: Props) {
  const notes = useNotesStore((state) => state.notes)?.filter(
    (item) => !item.isKnowledgeNote
  );
  const isLoading = useNotesStore((state) => state.isLoading);
  const { noteId } = useParams();

  if (isLoading) {
    return <NotesSkeleton />;
  }

  return notes.length ? (
    <SidebarMenu>
      {notes.map((item) => (
        <SidebarMenuItem key={item.noteId}>
          <SidebarMenuButton
            asChild
            tooltip={item.title || "Untitled"}
            isActive={item.noteId === Number(noteId)}
          >
            <Link href={`/notes/${item.noteId}`}>
              <span className="text-medium">{item.emoji}</span>
              <span>{item.title || "Untitled"}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  ) : (
    <p className="text-small text-center py-9 text-foreground-500">
      No notes yet, click the button above to create one
    </p>
  );
}

export const NotesSkeleton = () => (
  <div className="space-y-2.5">
    {new Array(5).fill(0).map((_, i) => (
      <Skeleton className="h-7 rounded-md" key={i} />
    ))}
  </div>
);
