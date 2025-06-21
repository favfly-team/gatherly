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
  onChatCreated = null,
  playground = false,
}) {
  // ===== PARAMS & STATE =====
  const { chat_id, agent_id, workspace_id } = useParams();
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

  const messagesEndRef = useRef(null);

  // ===== MODE DETECTION =====
  // 1. Playground mode: /[workspace_id]/agents/[agent_id] - temporary testing, no DB updates
  // 2. New chat mode: /agent/[agent_id] - create new chat in DB
  // 3. Existing chat mode: /chat/[chat_id] - load existing chat from DB
  const isPlaygroundMode =
    playground && !!workspace_id && !!agent_id && !chat_id;
  const isNewChatMode = !!agent_id && !workspace_id && !chat_id;
  const isExistingChatMode = !!chat_id;

  // ===== LOAD DATA BASED ON MODE =====
  useEffect(() => {
    if (isExistingChatMode) {
      // EXISTING CHAT: Load past messages and agent settings
      loadMessagesAndSystemPrompt(chat_id);
    } else if (isNewChatMode) {
      // NEW CHAT: Reset and load published agent settings (public access)
      reset();
      loadSystemPrompt(agent_id, true); // Use published version for public
    } else if (isPlaygroundMode) {
      // PLAYGROUND: Reset and load current agent settings (workspace access)
      reset();
      loadSystemPrompt(agent_id, false); // Use current version for testing
    }
  }, [
    chat_id,
    agent_id,
    workspace_id,
    isPlaygroundMode,
    isNewChatMode,
    isExistingChatMode,
    loadMessagesAndSystemPrompt,
    reset,
    loadSystemPrompt,
  ]);

  // ===== AUTO SCROLL & COMPLETION CHECK =====
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    if (
      messages.length > 0 &&
      messages[messages.length - 1].content.includes("###GATHERLY_DONE###")
    ) {
      setIsDone(true);
    }
  }, [messages, loading, setIsDone]);

  // ===== RENDER =====
  return (
    <div className="flex flex-col h-full w-full">
      <ScrollArea className="h-full">
        <div className="space-y-4 max-w-screen-md mx-auto py-4">
          <ChatMessage
            role="assistant"
            content={initialMessage || "Hello! How can I help you today?"}
          />
          {messages.map((msg, i) => (
            <ChatMessage key={i} {...msg} />
          ))}
          {loading && messages?.[messages.length - 1]?.role === "user" && (
            <ChatMessage role="assistant" content="Thinking..." />
          )}
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
            mode={
              isPlaygroundMode
                ? "playground"
                : isNewChatMode
                ? "new"
                : "existing"
            }
            onChatCreated={onChatCreated}
          />
        )}
      </div>
    </div>
  );
}
