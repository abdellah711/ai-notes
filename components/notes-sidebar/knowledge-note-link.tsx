"use client";

import { useNotesStore } from "@/stores/notes";
import React from "react";
import { SidebarMenuButton } from "../ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";

type Props = {};

export default function KnowledgeNoteLink({}: Props) {
  const note = useNotesStore((state) => state.notes)?.filter(
    (note) => note.isKnowledgeNote
  )[0];
  const isLoading = useNotesStore((state) => state.isLoading);
  const pathname = usePathname();

  if (isLoading || !note) return null;
  return (
    <SidebarMenuButton
      asChild
      className="mt-2"
      isActive={pathname === `/notes/knowledge`}
    >
      <Link href={`/notes/knowledge`}>
        <span className="text-medium">{note?.emoji || "🧠"}</span>
        <span>{note?.title || "Knowledge"}</span>
      </Link>
    </SidebarMenuButton>
  );
}
