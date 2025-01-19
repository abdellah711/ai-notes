"use client";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { Note } from "@/db/schema/note";
import { Skeleton } from "@nextui-org/skeleton";
import Link from "next/link";
import { useParams } from "next/navigation";
import { use } from "react";

type Props = {
  notesPromise: Promise<Note[]>;
};

export function NavNotes({ notesPromise }: Props) {
  const notes = use(notesPromise);
  const { noteId } = useParams();

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
              <span className="text-medium">{"🔥"}</span>
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
