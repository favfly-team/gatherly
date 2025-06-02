"use client";
import usePlaygroundStore from "@/storage/playground-store";
import ChatMessage from "./chat-message";
import ChatInput from "./chat-input";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ChatPanel() {
  // ===== INITIALIZE STATES =====
  const { messages, loading } = usePlaygroundStore();

  return (
    <div className="flex flex-col h-full w-full">
      <ScrollArea className="h-[calc(100%-100px)]">
        <div className="p-4 space-y-4">
          {messages.map((msg, i) => (
            <ChatMessage key={i} {...msg} />
          ))}

          {loading && <ChatMessage message="Thinking..." />}
        </div>
      </ScrollArea>
      <div className="border-t p-4 w-full">
        <ChatInput />
      </div>
    </div>
  );
}
