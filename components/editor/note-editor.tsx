"use client";

import { Plate } from "@udecode/plate/react";

import { useCreateEditor } from "@/components/editor/use-create-editor";
import { Editor, EditorContainer } from "@/components/plate-ui/editor";
import { useRef } from "react";

export function NoteEditor() {
  const editor = useCreateEditor();
  const editorRef = useRef<HTMLDivElement>(null);

  return (
    <div className="size-full px-12 pb-24 pt-4 text-base sm:px-[max(30px,calc(50%-350px))]">
      <Plate editor={editor} onValueChange={({ value }) => console.log(value)}>
        <input
          placeholder="Title..."
          className="outline-none text-4xl font-[inherit] bg-transparent font-bold text-foreground-800 my-7 placeholder:font-normal"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              editorRef.current?.focus();
            }
          }}
        />
        <EditorContainer>
          <Editor
            variant="none"
            placeholder="Type something..."
            ref={editorRef}
            className="text-foreground-700"
            onKeyDown={(e) => {
              if (e.ctrlKey && e.key === "b") {
                e.stopPropagation();
              }
            }}
          />
        </EditorContainer>
      </Plate>
    </div>
  );
}
