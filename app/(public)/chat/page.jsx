"use client";
import { ChatOnly } from "@/components/features/playground";
import { useSearchParams } from "next/navigation";

const ChatPage = () => {
  const searchParams = useSearchParams();
  const agent_id = searchParams.get("agent_id");

  return (
    <ChatOnly
      agent_id={agent_id}
      mode="new"
      onFlowCreated={(flow_id) => {
        // ===== SEAMLESS URL TRANSITION =====
        const newUrl = `/chat/${flow_id}`;
        window.history.replaceState(null, "", newUrl);
      }}
    />
  );
};

export default ChatPage;
