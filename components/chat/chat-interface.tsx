import { cn } from "@/lib/utils";
import {
  Textarea,
  Button,
  Alert,
  Spinner,
  DropdownMenu,
  DropdownTrigger,
  Dropdown,
  DropdownItem,
} from "@nextui-org/react";
import { ToolInvocation } from "ai";
import { Message, useChat } from "ai/react";
import { CheckIcon, MoreVerticalIcon, SendIcon } from "lucide-react";
import Markdown from "markdown-to-jsx";
import { KeyboardEventHandler, useEffect } from "react";
import { INITIAL_MESSAGES, useChatHistoryStore } from "@/stores/chat-history";

type Props = {};

export default function ChatInterface({}: Props) {
  const chatHistory = useChatHistoryStore();
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    error,
    reload,
    isLoading,
    stop,
    setMessages,
  } = useChat({
    initialMessages: chatHistory.messages,
    maxSteps: 3,
    onError: console.error,
  });

  useEffect(() => {
    chatHistory.setMessages(messages);
  }, [messages]);

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

  const handleClear = () => {
    chatHistory.clearMessages();
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <>
      <div className="mb-3 px-5 flex w-full">
        <div>
          <h1 className="text-lg font-semibold text-foreground-700">
            Chat with Notes
          </h1>
          <p className="text-foreground-500">
            Ask any question related to your notes
          </p>
        </div>
        <Dropdown size="sm" className="min-w-32" placement="bottom-end">
          <DropdownTrigger className="ms-auto">
            <Button size="sm" variant="light" isIconOnly>
              <MoreVerticalIcon size={16} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem key="clear" onPress={handleClear}>
              Clear Chat
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className="min-h-72 flex-1 flex flex-col-reverse mt-3 px-5 w-full text-foreground-800 overflow-y-auto chat-scrollbar">
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
  if (message.toolInvocations?.length) {
    return <CheckingNotesItem tool={message.toolInvocations[0]} />;
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

function CheckingNotesItem({ tool }: { tool: ToolInvocation }) {
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
