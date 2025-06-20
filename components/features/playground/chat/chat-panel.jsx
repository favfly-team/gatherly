"use client";
import ChatContainer from "./chat-container";

export default function ChatPanel({ ...props }) {
  return <ChatContainer mode="existing" {...props} />;
}
