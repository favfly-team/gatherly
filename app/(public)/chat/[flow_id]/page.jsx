"use client";
import { ChatOnly } from "@/components/features/playground";
import { loadSingleDataAction } from "@/components/actions/data-actions";
import usePlaygroundStore from "@/storage/playground-store";
import { useState, useEffect } from "react";
import SyncLoading from "@/components/layout/loading/sync-loading";

const ChatPage = ({ params }) => {
  const { flow_id } = params;

  // ===== INITIALIZE PLAYGROUND STORE =====
  const {
    systemPrompt,
    setSystemPrompt,
    resetChat,
    resetAll,
    isLoading,
    loadSystemPrompt,
  } = usePlaygroundStore();

  const [flow, setFlow] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!flow_id) return;

    const loadFlow = async () => {
      setPageLoading(true);
      const flow = await loadSingleDataAction({
        table_name: "flows",
        id: flow_id,
      });

      if (flow?.error) {
        throw new Error(flow?.error);
      }

      loadSystemPrompt(flow?.bot_id);
      setFlow(flow);
      setPageLoading(false);
    };

    loadFlow();
  }, [flow_id]);

  if (pageLoading) {
    return <SyncLoading className="h-screen" />;
  }

  return <ChatOnly flow={flow} />;
};

export default ChatPage;
