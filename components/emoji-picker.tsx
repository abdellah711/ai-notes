import Picker from "@emoji-mart/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type Props = {
  emoji?: string;
  onSelect?: (emoji: string) => void;
};

export default function EmojiPicker({ emoji, onSelect }: Props) {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(emoji ?? "📄");

  useEffect(() => {
    emoji && setSelectedEmoji(emoji);
  }, [emoji]);

  const handleSelect = (e: any) => {
    onSelect?.(e.native);
    setSelectedEmoji(e.native);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="text-3xl size-12 -ms-1.5">
          {selectedEmoji}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 border-none bg-transparent">
        <Picker onEmojiSelect={handleSelect} theme={theme.theme} />
      </PopoverContent>
    </Popover>
  );
}
