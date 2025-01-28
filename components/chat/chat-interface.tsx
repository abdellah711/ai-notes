import { cn } from "@/lib/utils";
import { Textarea, Button, Alert } from "@nextui-org/react";
import { Message, useChat } from "ai/react";
import { SendIcon } from "lucide-react";
import Markdown from "markdown-to-jsx";
import { KeyboardEventHandler } from "react";

type Props = {};

export default function ChatInterface({}: Props) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    error,
    reload,
    isLoading,
    stop,
  } = useChat({
    initialMessages: [
      {
        id: "1",
        content: "Hello! How can I help you?",
        role: "assistant",
      },
    ],
    maxSteps: 3,
    onError: console.error,
  });

  const handleKeyDown: KeyboardEventHandler = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  const handleStop = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isLoading) return;
    e.preventDefault();
    stop();
  };

  return (
    <>
      <div className="mb-3 px-5">
        <div>
          <h1 className="text-lg font-semibold text-foreground-700">
            Chat with AI
          </h1>
          <p className="text-foreground-500">
            Ask any question related to your notes
          </p>
        </div>
      </div>
      <div className="min-h-72 flex-1 flex flex-col-reverse gap-2 mt-3 px-5 w-full text-foreground-800 overflow-y-auto chat-scrollbar">
        <div className="flex-1" />
        {error && (
          <Alert
            color="danger"
            classNames={{
              base: "items-center grow-0 py-2",
              description: "text-sm",
              iconWrapper: "h-7 w-7",
              alertIcon: "w-4 h-4",
            }}
            endContent={
              <Button
                variant="light"
                color="danger"
                size="sm"
                onPress={() => reload()}
              >
                Retry
              </Button>
            }
          >
            {error.message}
          </Alert>
        )}
        {messages.toReversed().map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
      </div>
      <form className="flex gap-2 w-full mt-4" onSubmit={handleSubmit}>
        <Textarea
          placeholder="Ask a question..."
          value={input}
          onChange={handleInputChange}
          className="flex-1 [&_textarea]:chat-scrollbar"
          rows={1}
          minRows={1}
          maxRows={3}
          onKeyDown={handleKeyDown}
        />
        <Button
          type="submit"
          isIconOnly
          color="primary"
          radius="full"
          onClick={handleStop}
        >
          {isLoading ? (
            <div className="size-3.5 bg-current rounded-[2px] animate-in" />
          ) : (
            <SendIcon size={20} />
          )}
        </Button>
      </form>
    </>
  );
}

type MessageProps = {
  message: Message;
};

function MessageItem({ message }: MessageProps) {
  return (
    <div
      className={cn(
        "py-2 selection:bg-primary-300 prose prose-sm dark:prose-invert",
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
