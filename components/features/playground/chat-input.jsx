"use client";
import { useState, useRef } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import usePlaygroundStore from "@/storage/playground-store";
import { fetchOpenAIChat } from "@/components/actions/openai";
import { Input } from "@/components/ui/input";

export default function ChatInput() {
  // ===== INITIALIZE STATES =====
  const { messages, setMessages, systemPrompt, loading, setLoading } =
    usePlaygroundStore();

  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  // ===== SEND MESSAGE =====
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const aiReply = await fetchOpenAIChat({
        messages: newMessages,
        systemPrompt,
      });
      setMessages([...newMessages, { role: "assistant", content: aiReply }]);
    } catch (e) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Sorry, there was an error." },
      ]);
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.focus();
    }
  };

  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage();
      }}
    >
      <Input
        ref={inputRef}
        autoFocus
        className="flex-1 border rounded px-3 py-2 bg-background"
        placeholder="Message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={loading}
      />
      <Button type="submit" size="icon" disabled={loading || !input.trim()}>
        <Send className="w-4 h-4" />
      </Button>
    </form>
  );
}
