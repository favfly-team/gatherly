"use client";
import { useState, useRef } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import usePlaygroundStore from "@/storage/playground-store";
import { fetchOpenAIChat } from "@/components/actions/openai";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function ChatInput() {
  // ===== INITIALIZE STATES =====
  const {
    messages,
    systemPrompt,
    loading,
    setLoading,
    updateMessages,
    setMessages,
    isDone,
    setIsDone,
  } = usePlaygroundStore();

  const defaultPrompt = `
    When, and only when, you have collected every piece of information you need from the user, end your reply with the single line:
    ###GATHERLY_DONE###
    Before that final line, continue the conversation normally: ask follow-up questions, acknowledge answers, and provide guidance.
    Do not include "###GATHERLY_DONE###" anywhere until you are completely ready to generate the final document.`;

  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  // ===== GET FLOW ID =====
  const { flow_id } = useParams();

  // ===== SEND MESSAGE =====
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const newMessages = [...messages, { role: "user", content: input }];

    // ===== UPDATE MESSAGES TO DATABASE =====
    if (flow_id) {
      await updateMessages(flow_id, newMessages);
    } else {
      setMessages(newMessages);
    }

    setInput("");
    setLoading(true);
    try {
      const aiReply = await fetchOpenAIChat({
        messages: newMessages,
        systemPrompt: `${defaultPrompt}\n\n${systemPrompt}`,
      });

      if (flow_id) {
        await updateMessages(flow_id, [
          ...newMessages,
          { role: "assistant", content: aiReply },
        ]);
      } else {
        setMessages([...newMessages, { role: "assistant", content: aiReply }]);
      }

      if (aiReply.includes("###GATHERLY_DONE###")) {
        setIsDone(true);
      }
    } catch (e) {
      if (flow_id) {
        await updateMessages(flow_id, [
          ...newMessages,
          { role: "assistant", content: "Sorry, there was an error." },
        ]);
      } else {
        setMessages([
          ...newMessages,
          { role: "assistant", content: "Sorry, there was an error." },
        ]);
      }
    } finally {
      setLoading(false);

      await new Promise((resolve) => setTimeout(resolve, 100));
      if (inputRef.current) inputRef.current.focus();
    }
  };

  if (isDone) {
    return (
      <div className="flex gap-2 w-full justify-center">
        <Badge variant="secondary" className="h-8">
          <CheckCircle className="w-4 h-4 mr-2" />
          Completed
        </Badge>
      </div>
    );
  }

  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage();
      }}
    >
      <Textarea
        ref={inputRef}
        autoFocus
        className="flex-1 border rounded px-3 py-2 bg-background max-h-[260px] resize-none"
        placeholder="Message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={loading}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          } else if (e.key === "Enter" && e.shiftKey) {
            inputRef.current.style.height = "auto";
            inputRef.current.style.height =
              inputRef.current.scrollHeight + "px";
          }
        }}
      />
      <Button type="submit" size="icon" disabled={loading || !input.trim()}>
        <Send className="w-4 h-4" />
      </Button>
    </form>
  );
}
