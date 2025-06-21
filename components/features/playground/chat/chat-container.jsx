"use client";
import { useEffect, useRef } from "react";
import { useParams, usePathname } from "next/navigation";
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
    initialMessage,
  } = usePlaygroundStore();

  // ===== GET PARAMS AND PATH =====
  const { flow_id, agent_id: paramAgentId } = useParams();
  const pathname = usePathname();
  const effectiveAgentId = agent_id || paramAgentId;

  // ===== DETERMINE IF THIS IS PUBLIC ACCESS =====
  const isPublicAccess = pathname.startsWith("/chat");

  const messagesEndRef = useRef(null);

  // ===== LOAD DATA BASED ON MODE =====
  useEffect(() => {
    if (mode === "existing") {
      if (flow_id) {
        // For existing flows, load messages and associated agent settings
        loadMessagesAndSystemPrompt(flow_id);
      } else if (effectiveAgentId) {
        reset();
        // Use published version for public access, current version for workspace access
        loadSystemPrompt(effectiveAgentId, isPublicAccess);
      }
    } else if (mode === "new" && effectiveAgentId) {
      // ===== RESET AND LOAD SYSTEM PROMPT FOR NEW CHATS =====
      reset();
      // Use published version for public access, current version for workspace access
      loadSystemPrompt(effectiveAgentId, isPublicAccess);
    }
  }, [
    mode,
    flow_id,
    effectiveAgentId,
    isPublicAccess,
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
    }
  }, [messages, loading, setIsDone]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const initialBotMessage = {
    role: "assistant",
    content: initialMessage || "Hello! How can I help you today?",
  };

  // ===== MAIN CHAT INTERFACE =====
  return (
    <div className="flex flex-col h-full w-full">
      <ScrollArea className="h-full">
        <div className="space-y-4 max-w-screen-md mx-auto py-4">
          {[initialBotMessage, ...messages].map((msg, i) => (
            <ChatMessage key={i} {...msg} />
          ))}

          {loading && <ChatMessage role="assistant" content="Thinking..." />}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      <div className="max-w-screen-md mx-auto w-full">
        {isDone ? (
          <div className="flex gap-2 w-full justify-center">
            <Badge variant="secondary" className="h-8">
              <CheckCircle className="w-4 h-4 mr-2" />
              Completed! Now you can close the window
            </Badge>
          </div>
        ) : (
          <ChatInput
            mode={mode}
            agent_id={effectiveAgentId}
            onFlowCreated={onFlowCreated}
          />
        )}
      </div>
    </div>
  );
}
