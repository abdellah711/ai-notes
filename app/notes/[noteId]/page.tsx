import { NoteEditor } from "@/components/editor/note-editor";
import { getNote } from "@/db/actions";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    noteId: string;
  }>;
};

export default async function NotePage({ params }: Props) {
  const { noteId } = await params;
  const note = await getNote(noteId).catch((err) => {
    console.error(err);
    notFound();
  });
  return <NoteEditor note={note} />;
}
