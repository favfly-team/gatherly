"use client";

import Button from "@/components/layout/button";
import { RefreshCw, RotateCcw, Save } from "lucide-react";
import usePlaygroundStore from "@/storage/playground-store";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";
import agentStore from "@/storage/agent-store";
import userStore from "@/storage/user-store";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PromptPanel() {
  // ===== STORES =====
  const { updateAgentAsDraft } = agentStore();
  const { user } = userStore();

  // ===== PLAYGROUND STORE =====
  const {
    systemPrompt,
    initialMessage,
    setSystemPrompt,
    setInitialMessage,
    resetChat,
    resetAll,
    isLoading,
    loadSystemPrompt,
  } = usePlaygroundStore();

  // ===== PARAMS =====
  const { agent_id } = useParams();

  // ===== STATE =====
  const [isSaving, setIsSaving] = useState(false);

  // ===== LOAD AGENT =====
  useEffect(() => {
    if (agent_id) {
      // Load current version for workspace access (not published)
      loadSystemPrompt(agent_id, false);
    }
  }, [agent_id, loadSystemPrompt]);

  // ===== SAVE AS DRAFT =====
  const handleSavePrompt = async () => {
    if (!agent_id || !user?.id) {
      toast.error("User not authenticated");
      return;
    }

    try {
      setIsSaving(true);
      await updateAgentAsDraft(
        agent_id,
        {
          system_prompt: systemPrompt,
          initial_message: initialMessage || "Hello! How can I help you today!",
        },
        user.id
      );
      toast.success("Saved as draft");
    } catch (error) {
      console.error("Error saving system prompt:", error);
      toast.error("Failed to save system prompt");
    } finally {
      setIsSaving(false);
    }
  };

  // ===== RESET CHAT ONLY =====
  const handleResetChat = () => {
    resetChat();
    toast.success("Chat reset");
  };

  // ===== RESET ALL =====
  const handleResetAll = async () => {
    if (agent_id) {
      try {
        await resetAll(agent_id, false); // Use current version, not published
        toast.success("Reset to latest agent settings");
      } catch (error) {
        console.error("Error resetting:", error);
        toast.error("Failed to reset agent settings");
      }
    }
  };

  return (
    <div className="flex flex-col h-full p-4 border-r bg-muted/50">
      <div className="flex justify-between items-center gap-2 mb-4">
        <label className="font-semibold">Agent Settings</label>
        <div className="flex gap-2">
          {/* ===== SAVE ===== */}
          <Button
            variant="default"
            size="sm"
            disabled={!systemPrompt.trim() || isSaving}
            onClick={handleSavePrompt}
            isLoading={isSaving}
            icon={<Save />}
          >
            Save
          </Button>

          {/* ===== RESET CHAT ===== */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetChat}
            title="Clear chat messages"
            icon={<RefreshCw />}
          />

          {/* ===== RESET ALL ===== */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetAll}
            title="Reload agent settings and clear chat"
            icon={<RotateCcw />}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-full bg-white border rounded-md">
          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="flex flex-col h-full gap-4">
          {/* ===== SYSTEM PROMPT SECTION ===== */}
          <div className="flex flex-col flex-1">
            <label className="font-medium text-sm mb-2">System Prompt</label>
            <Textarea
              className="w-full h-full p-2 rounded border bg-background resize-none"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Enter system prompt that defines how your agent should behave and respond to users..."
            />
          </div>

          {/* ===== INITIAL MESSAGE SECTION ===== */}
          <div className="flex flex-col h-24">
            <label className="font-medium text-sm mb-2">Initial Message</label>
            <Textarea
              className="w-full h-full p-2 rounded border bg-background resize-none"
              value={initialMessage}
              onChange={(e) => setInitialMessage(e.target.value)}
              placeholder="Enter the first message your agent will send to users..."
            />
          </div>
        </div>
      )}
    </div>
  );
}
