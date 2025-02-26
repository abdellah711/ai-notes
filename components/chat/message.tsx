import { cn } from "@/lib/utils";
import { Spinner } from "@nextui-org/react";
import { Message, ToolInvocation } from "ai";
import { CheckIcon } from "lucide-react";
import Markdown from "markdown-to-jsx";

type MessageProps = {
  message: Message;
};

export default function MessageItem({ message }: MessageProps) {
  if (message.toolInvocations?.length) {
    return message.toolInvocations.map((toolInvocation) => (
      <ToolInvocationsItem
        key={toolInvocation.toolCallId}
        tool={toolInvocation}
      />
    ));
  }

  return (
    <div
      className={cn(
        "py-2 selection:bg-primary-300 prose prose-sm dark:prose-invert mb-2",
        {
          "bg-primary-100 self-end px-3 rounded-lg max-w-[80%]":
            message.role === "user",
          "justify-start": message.role === "assistant",
        }
      )}
    >
      <Markdown>{message.content}</Markdown>
    </div>
  );
}

type ToolInvocationsProps = {
  tool: ToolInvocation;
};

function ToolInvocationsItem({ tool }: ToolInvocationsProps) {
  if (
    ["getRelevantNotes", "getUserNotes", "getNotesDetails"].includes(
      tool.toolName
    )
  ) {
    return <CheckingNotesItem tool={tool} />;
  }

  if (tool.toolName === "generateNote") {
    return <GenerateNoteItem tool={tool} />;
  }

  return null;
}

function CheckingNotesItem({ tool }: ToolInvocationsProps) {
  return (
    <div className="text-sm text-foreground-500 flex items-center gap-2 select-none">
      {tool.state === "call" ? (
        <>
          <Spinner size="sm" classNames={{ wrapper: "w-4 h-4" }} />
          <span>Checking notes</span>
        </>
      ) : (
        <>
          <CheckIcon className="w-4 h-4" /> <span>Notes checked</span>
        </>
      )}
    </div>
  );
}

function GenerateNoteItem({ tool }: ToolInvocationsProps) {
  return (
    <div className="text-sm text-foreground-500 flex items-center gap-2 select-none">
      {tool.state === "call" ? (
        <>
          <Spinner size="sm" classNames={{ wrapper: "w-4 h-4" }} />
          <span>Generating note...</span>
        </>
      ) : (
        <>
          <CheckIcon className="w-4 h-4" /> <span>Note generated</span>
        </>
      )}
    </div>
  );
}
