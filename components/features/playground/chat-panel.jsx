"use client";
import usePlaygroundStore from "@/storage/playground-store";
import ChatMessage from "./chat-message";
import ChatInput from "./chat-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function ChatPanel() {
  // ===== INITIALIZE STATES =====
  const { messages, loading, loadMessages, setIsDone, reset } =
    usePlaygroundStore();

  // ===== GET FLOW ID =====
  const { flow_id, agent_id } = useParams();

  const messagesEndRef = useRef(null);

  // ===== LOAD MESSAGES =====
  useEffect(() => {
    if (flow_id) {
      loadMessages(flow_id);
    }

    if (agent_id) {
      reset();
    }
  }, [flow_id, agent_id]);

  useEffect(() => {
    scrollToBottom();

    if (
      messages.length > 0 &&
      messages[messages.length - 1].content.includes("###GATHERLY_DONE###")
    ) {
      setIsDone(true);
    }
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col h-full w-full">
      <ScrollArea className="h-full">
        <div className="space-y-4 max-w-screen-md mx-auto py-4">
          {messages.map((msg, i) => (
            <ChatMessage key={i} {...msg} />
          ))}

          {loading && <ChatMessage role="assistant" content="Thinking..." />}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>
      <div className="max-w-screen-md mx-auto w-full">
        <ChatInput />
      </div>
    </div>
  );
}
