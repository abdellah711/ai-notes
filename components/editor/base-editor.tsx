import { cn } from "@nextui-org/react";
import { Plate } from "@udecode/plate/react";
import { EditorContainer, Editor } from "../plate-ui/editor";
import { useCreateEditor } from "./use-create-editor";
import { useRef } from "react";

type Props = {
  placeholder?: string;
  className?: string;
  title?: string;
  onTitleChange?: (value: string) => void;
  onChange?: (value: any) => void;
  editor: ReturnType<typeof useCreateEditor>;
};

export default function BaseEditor({
  placeholder,
  className,
  title,
  onTitleChange,
  onChange,
  editor,
}: Props) {
  const editorRef = useRef<HTMLDivElement>(null);

  return (
    <Plate
      editor={editor}
      onValueChange={({ value }) => onChange?.(value)}
      onChange={onChange}
    >
      <input
        placeholder="Untitled"
        className={cn(
          "outline-none text-4xl font-[inherit] bg-transparent font-bold text-foreground-800 mb-7 placeholder:font-normal",
          className
        )}
        value={title ?? ""}
        onChange={(e) => onTitleChange?.(e.target.value)}
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
          placeholder={placeholder}
          ref={editorRef}
          className={cn("text-foreground-700 pb-24 relative", className)}
          onKeyDown={(e) => {
            if (e.ctrlKey && e.key === "b") {
              e.stopPropagation();
            }
          }}
        />
      </EditorContainer>
    </Plate>
  );
}
