"use client";
import usePlaygroundStore from "@/storage/playground-store";
import ChatMessage from "./chat-message";
import ChatInput from "./chat-input";

export default function ChatPanel() {
  // ===== INITIALIZE STATES =====
  const { messages } = usePlaygroundStore();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, i) => (
          <ChatMessage key={i} {...msg} />
        ))}
      </div>
      <div className="border-t p-4">
        <ChatInput />
      </div>
    </div>
  );
}
