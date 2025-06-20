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

export default function ChatInput({
  mode = "existing", // "new" | "existing"
  agent_id = null,
  onFlowCreated = null,
}) {
  // ===== CUSTOM HOOK FOR CHAT LOGIC =====
  const { sendMessage } = useChat();
  const { isDone } = usePlaygroundStore();
  const { flow_id } = useParams();

  const defaultInputMessage = "Hi, start the conversation";

  // ===== LOCAL STATES =====
  const [input, setInput] = useState(
    mode === "existing" ? "" : defaultInputMessage
  );
  const [isCreatingFlow, setIsCreatingFlow] = useState(false);
  const inputRef = useRef(null);

  // ===== HANDLE MESSAGE SENDING =====
  const handleSendMessage = async () => {
    if (!input.trim() || isCreatingFlow) return;

    const currentInput = input;
    setInput("");

    // ===== SET CREATING FLOW STATE FOR NEW CHATS =====
    if (mode === "new") {
      setIsCreatingFlow(true);
    }

    try {
      const success = await sendMessage({
        input: currentInput,
        mode,
        agent_id,
        flow_id,
        onFlowCreated,
      });

      if (success) {
        // ===== RESET TEXTAREA HEIGHT =====
        if (inputRef.current) {
          inputRef.current.style.height = "auto";
        }
      } else {
        // ===== RESTORE INPUT ON FAILURE =====
        setInput(currentInput);
      }
    } finally {
      setIsCreatingFlow(false);

      // ===== FOCUS INPUT AFTER DELAY =====
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
        disabled={isCreatingFlow}
      />
      <div className="flex-1">
        <Button
          type="submit"
          size="icon"
          disabled={isCreatingFlow || !input.trim()}
          className="shrink-0 rounded-full [&_svg]:size-5 mb-2 me-2"
        >
          <ArrowUp className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}
