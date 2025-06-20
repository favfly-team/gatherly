"use client";
import { useEffect } from "react";
import usePlaygroundStore from "@/storage/playground-store";
import ChatContainer from "./chat-container";
import { ChatOnly } from "..";

export default function NewChat({ agent_id }) {
  // ===== INITIALIZE PLAYGROUND STORE =====
  const { reset, loadSystemPrompt } = usePlaygroundStore();

  // ===== SETUP FOR NEW CHAT =====
  useEffect(() => {
    if (agent_id) {
      reset();
      loadSystemPrompt(agent_id);
    }
  }, [agent_id, reset, loadSystemPrompt]);

  return (
    <ChatOnly
      mode="new"
      agent_id={agent_id}
      onFlowCreated={(flow_id) => {
        // ===== SEAMLESS URL TRANSITION =====
        const newUrl = `/chat/${flow_id}`;
        window.history.replaceState(null, "", newUrl);
      }}
    />
  );
}
