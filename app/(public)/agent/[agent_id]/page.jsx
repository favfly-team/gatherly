"use client";
import { ChatOnly } from "@/components/features/playground";

const AgentPage = ({ params }) => {
  const { agent_id } = params;

  // ===== HANDLE CHAT CREATED =====
  const handleChatCreated = (chat_id) => {
    window.history.replaceState(null, "", `/chat/${chat_id}`);
  };

  return (
    <ChatOnly
      agent_id={agent_id}
      mode="new"
      onChatCreated={handleChatCreated}
    />
  );
};

export default AgentPage;
