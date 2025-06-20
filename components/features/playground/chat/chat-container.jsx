"use client";
import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import usePlaygroundStore from "@/storage/playground-store";
import ChatMessage from "./chat-message";
import ChatInput from "./chat-input";

export default function ChatContainer({
  mode = "existing", // "new" | "existing"
  agent_id = null,
  onFlowCreated = null,
}) {
  // ===== INITIALIZE STATES =====
  const {
    messages,
    loading,
    loadMessagesAndSystemPrompt,
    setIsDone,
    reset,
    loadSystemPrompt,
    isDone,
  } = usePlaygroundStore();

  // ===== GET PARAMS =====
  const { flow_id, agent_id: paramAgentId } = useParams();
  const effectiveAgentId = agent_id || paramAgentId;

  const messagesEndRef = useRef(null);

  // ===== LOAD DATA BASED ON MODE =====
  useEffect(() => {
    if (mode === "existing") {
      if (flow_id) {
        loadMessagesAndSystemPrompt(flow_id);
      } else if (effectiveAgentId) {
        reset();
        loadSystemPrompt(effectiveAgentId);
      }
    }
  }, [
    mode,
    flow_id,
    effectiveAgentId,
    loadMessagesAndSystemPrompt,
    reset,
    loadSystemPrompt,
  ]);

  // ===== AUTO SCROLL & COMPLETION CHECK =====
  useEffect(() => {
    scrollToBottom();

    if (
      messages.length > 0 &&
      messages[messages.length - 1].content.includes("###GATHERLY_DONE###")
    ) {
      setIsDone(true);
    } else {
    }
  }, [messages, loading, setIsDone]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ===== COMPLETED STATE =====
  if (isDone) {
    return (
      <div className="flex flex-col h-full w-full">
        <ScrollArea className="h-full">
          <div className="space-y-4 max-w-screen-md mx-auto py-4">
            {messages.map((msg, i) => (
              <ChatMessage key={i} {...msg} />
            ))}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>
        <div className="max-w-screen-md mx-auto w-full">
          <div className="flex gap-2 w-full justify-center">
            <Badge variant="secondary" className="h-8">
              <CheckCircle className="w-4 h-4 mr-2" />
              Completed! Now you can close the window
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  // ===== MAIN CHAT INTERFACE =====
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
        <ChatInput
          mode={mode}
          agent_id={effectiveAgentId}
          onFlowCreated={onFlowCreated}
        />
      </div>
    </div>
  );
}
