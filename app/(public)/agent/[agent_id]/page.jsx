"use client";
import { ChatOnly } from "@/components/features/playground";

const AgentPage = () => {
  // ===== HANDLE CHAT CREATED =====
  const handleChatCreated = (chat_id) => {
    window.history.replaceState(null, "", `/chat/${chat_id}`);
  };

  return <ChatOnly onChatCreated={handleChatCreated} />;
};

export default AgentPage;
