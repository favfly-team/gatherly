"use client";
import usePlaygroundStore from "@/storage/playground-store";
import ChatMessage from "./chat-message";
import ChatInput from "./chat-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function ChatPanel() {
  // ===== INITIALIZE STATES =====
  const { messages, loading, loadMessages } = usePlaygroundStore();

  // ===== GET FLOW ID =====
  const { flow_id } = useParams();

  // ===== LOAD MESSAGES =====
  useEffect(() => {
    if (flow_id) {
      loadMessages(flow_id);
    }
  }, [flow_id]);

  return (
    <div className="flex flex-col h-full w-full">
      <ScrollArea className="h-[calc(100%-100px)]">
        <div className="p-4 space-y-4">
          {messages.map((msg, i) => (
            <ChatMessage key={i} {...msg} />
          ))}

          {loading && <ChatMessage role="assistant" content="Thinking..." />}
        </div>
      </ScrollArea>
      <div className="border-t p-4 w-full">
        <ChatInput />
      </div>
    </div>
  );
}
