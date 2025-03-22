import { INITIAL_MESSAGES, useChatHistoryStore } from "@/stores/chat-history";
import { useGeneratedNote } from "@/stores/generated-note";
import {
  Alert,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Textarea,
} from "@nextui-org/react";
import { useChat } from "ai/react";
import { MoreVerticalIcon, SendIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { KeyboardEventHandler, useEffect } from "react";
import MessageItem from "./message";

type Props = {};

export default function ChatInterface({}: Props) {
  const chatHistory = useChatHistoryStore();
  const setGeneratedNote = useGeneratedNote((state) => state.setGeneratedNote);
  const router = useRouter();
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
    onToolCall: ({ toolCall }) => {
      if (toolCall.toolName === "generateNote") {
        const { title, emoji } = toolCall.args as {
          title: string;
          emoji: string;
        };
        setGeneratedNote({ title, emoji, content: "" });
        router.push(`/notes/generate`);
      }
    },
  });

  useEffect(() => {
    chatHistory.setMessages(messages);
    const lastToolInvocation = messages.at(-1)?.toolInvocations?.[0];
    if (
      lastToolInvocation?.toolName === "generateNote" &&
      lastToolInvocation?.state === "result"
    ) {
      setGeneratedNote(lastToolInvocation?.result as any);
    }
  }, [messages]);
  console.log({ messages });
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
