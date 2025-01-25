"use client";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { MessageCircleIcon } from "lucide-react";
import ChatInterface from "./chat-interface";

type Props = {};

export default function ChatFab({}: Props) {
  return (
    <Popover>
      <PopoverTrigger>
        <Button
          isIconOnly
          className="fixed bottom-5 right-5 md:bottom-12 md:right-12 animate-appearance-in"
          size="lg"
          color="primary"
        >
          <MessageCircleIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="items-start py-5 w-[30vw] max-w-[450px] min-w-[300px] h-[70vh] max-h-[500px]">
        <ChatInterface />
      </PopoverContent>
    </Popover>
  );
}
