"use client";
import { useState, useRef } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { useParams } from "next/navigation";
import usePlaygroundStore from "@/storage/playground-store";
import useChat from "./use-chat";

export default function ChatInput({ mode = "existing", onChatCreated = null }) {
  // ===== PARAMS & STATE =====
  const { chat_id, agent_id } = useParams();
  const { sendMessage } = useChat();
  const { isDone } = usePlaygroundStore();

  const [chat, setChat] = useState(null);

  // ===== LOCAL STATE =====
  const [input, setInput] = useState(mode === "new" ? "" : "");
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const inputRef = useRef(null);

  // ===== HANDLE MESSAGE SENDING =====
  const handleSendMessage = async () => {
    if (!input.trim() || isCreatingChat) return;

    const currentInput = input;
    setInput("");

    // Set creating state for new chat mode (database creation)
    if (mode === "new") {
      setIsCreatingChat(true);
    }

    try {
      const { success, chat_id: newChatId } = await sendMessage({
        input: currentInput,
        mode: chat?.mode || mode,
        agent_id,
        chat_id: chat?.chat_id || chat_id,
        onChatCreated,
      });

      if (success && newChatId) {
        setChat({
          chat_id: newChatId,
          mode: "existing",
        });
      }

      if (success && inputRef.current) {
        inputRef.current.style.height = "auto";
      } else {
        setInput(currentInput);
      }
    } finally {
      setIsCreatingChat(false);
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
    }
  };

  // ===== HANDLE INPUT CHANGE =====
  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = inputRef.current.scrollHeight + "px";
    }
  };

  // ===== HANDLE KEY DOWN =====
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
      }
    }
  };

  // ===== COMPLETED STATE =====
  if (isDone) {
    return (
      <div className="flex gap-2 w-full justify-center">
        <Badge variant="secondary" className="h-8">
          <CheckCircle className="w-4 h-4 mr-2" />
          Completed! Now you can close the window
        </Badge>
      </div>
    );
  }

  // ===== MAIN INPUT FORM =====
  return (
    <form
      className="flex items-end gap-2 rounded-3xl bg-background border border-border"
      onSubmit={(e) => {
        e.preventDefault();
        handleSendMessage();
      }}
    >
      <Textarea
        ref={inputRef}
        autoFocus
        className="py-3 px-4 bg-background resize-none rounded-3xl focus-visible:ring-0 border-none shadow-none max-h-[160px] min-h-0"
        placeholder="Type message..."
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        disabled={isCreatingChat}
      />
      <div className="flex-1">
        <Button
          type="submit"
          size="icon"
          disabled={isCreatingChat || !input.trim()}
          className="shrink-0 rounded-full [&_svg]:size-5 mb-2 me-2"
        >
          <ArrowUp className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}
