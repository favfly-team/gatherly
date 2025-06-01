"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw, RotateCcw, Save, Loader2 } from "lucide-react";
import usePlaygroundStore from "@/storage/playground-store";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";
import agentStore from "@/storage/agent-store";
import { useEffect } from "react";

export default function PromptPanel() {
  // ===== INITIALIZE AGENT STORE =====
  const { updateAgent, isUpdating } = agentStore();

  // ===== INITIALIZE PLAYGROUND STORE =====
  const {
    systemPrompt,
    setSystemPrompt,
    resetChat,
    resetAll,
    isLoading,
    loadSystemPrompt,
  } = usePlaygroundStore();

  // ===== GET AGENT ID =====
  const { agent_id } = useParams();

  // ===== LOAD AGENT =====
  useEffect(() => {
    loadSystemPrompt(agent_id);
  }, []);

  return (
    <div className="flex flex-col h-full p-4 border-r bg-muted/50">
      <div className="flex justify-between items-center gap-2 mb-4">
        <label className="font-semibold">System prompt</label>
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            disabled={isUpdating}
            onClick={() => {
              updateAgent(agent_id, { system_prompt: systemPrompt });
            }}
          >
            {isUpdating ? <Loader2 className="animate-spin" /> : <Save />}
            Save to agent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              resetChat();
            }}
            title="Restart chat"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              resetAll(agent_id);
            }}
            title="Restart all"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-full bg-white border rounded-md">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        // ===== SYSTEM PROMPT =====
        <Textarea
          className="w-full h-full p-2 rounded border bg-background resize-none"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          placeholder="Enter system prompt"
        />
      )}
    </div>
  );
}
