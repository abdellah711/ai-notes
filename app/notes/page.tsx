"use client";
import { useCreateNote } from "@/hooks/use-create-note";
import { useNotesStore } from "@/stores/notes";
import { Button } from "@nextui-org/react";
import { formatRelative } from "date-fns";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function NotesHomePage() {
  const notes = useNotesStore((state) => state.notes);
  const isLoading = useNotesStore((state) => state.isLoading);
  const { isPending, createNewNote } = useCreateNote();
  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <div className="mb-9">
        <h1 className="text-3xl font-bold mb-3">Welcome to AI Notes</h1>
        <p className="text-foreground-500">
          Your intelligent note-taking companion
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-9">
        <Button
          className="h-auto flex-1"
          variant="bordered"
          color="primary"
          size="lg"
          isLoading={isPending}
          onPress={() => void createNewNote()}
          startContent={
            !isPending && <Plus className="size-7 text-primary shrink-0" />
          }
        >
          <div className="text-start flex-1 py-6">
            <h3 className="font-semibold text-lg">Create New Note</h3>
            <p className="text-foreground-500 text-wrap">
              Start writing a new note with AI assistance
            </p>
          </div>
        </Button>
      </div>

      <section className="mb-9 flex flex-col gap-3">
        <p className="text-sm text-foreground-500">Getting started</p>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center justify-center bg-primary-50 rounded-full size-7 text-primary-600">
            1
          </div>
          <div>
            <h3 className="text-foreground-700 font-medium">
              Create a New Note
            </h3>
            <p className="text-foreground-500">
              Click the "Create New Note" button to start writing. Use AI
              suggestions to enhance your writing.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center justify-center bg-primary-50 rounded-full size-7 text-primary-600">
            2
          </div>
          <div>
            <h3 className="text-foreground-700 font-medium">
              Organize with Emoji
            </h3>
            <p className="text-foreground-500">
              Add emojis to your notes for better visual organization and quick
              recognition.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center justify-center bg-primary-50 rounded-full size-7 text-primary-600">
            3
          </div>
          <div>
            <h3 className="text-foreground-700 font-medium">Chat with AI</h3>
            <p className="text-foreground-500">
              Communicate with your notes using natural language.
            </p>
          </div>
        </div>
      </section>

      <section className="">
        <p className="text-sm text-foreground-500 mb-4">Recent notes</p>
        {notes.length > 0 ? (
          <div className="flex flex-col gap-3">
            {notes.slice(0, 5).map((note) => (
              <Button
                key={note.noteId}
                href={`/notes/${note.noteId}`}
                variant="flat"
                className="justify-start"
                as={Link}
                startContent={<span>{note.emoji}</span>}
                endContent={
                  <p className="ms-auto text-sm text-foreground-400">
                    {formatRelative(
                      note.updatedAt ?? note.createdAt,
                      Date.now()
                    )}
                  </p>
                }
              >
                {note.title || "Untitled"}
              </Button>
            ))}
          </div>
        ) : isLoading ? (
          <div className="text-center py-8 text-foreground-500 text-sm">
            <p>Loading notes...</p>
          </div>
        ) : (
          <div className="text-center py-8 text-foreground-500 text-sm">
            <p>No notes yet. Start by creating your first note!</p>
          </div>
        )}
      </section>
    </div>
  );
}
