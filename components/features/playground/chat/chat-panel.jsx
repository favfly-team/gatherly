"use client";
import ChatContainer from "./chat-container";

export default function ChatPanel({ playground = false }) {
  return <ChatContainer playground={playground} />;
}
