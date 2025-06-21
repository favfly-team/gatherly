"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw, RotateCcw, Save, Loader2 } from "lucide-react";
import usePlaygroundStore from "@/storage/playground-store";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";
import agentStore from "@/storage/agent-store";
import userStore from "@/storage/user-store";
import { useEffect } from "react";
import { toast } from "sonner";

export default function PromptPanel() {
  // ===== INITIALIZE STORES =====
  const { updateAgentSettings, isUpdating } = agentStore();
  const { user } = userStore();

  // ===== INITIALIZE PLAYGROUND STORE =====
  const {
    systemPrompt,
    initialMessage,
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
    if (agent_id) {
      // Load current version for workspace access (not published)
      loadSystemPrompt(agent_id, false);
    }
  }, [agent_id, loadSystemPrompt]);

  // ===== SAVE SYSTEM PROMPT AS NEW VERSION =====
  const handleSavePrompt = async () => {
    if (!agent_id || !user?.id) {
      toast.error("User not authenticated");
      return;
    }

    try {
      await updateAgentSettings(
        agent_id,
        {
          system_prompt: systemPrompt,
          initial_message: initialMessage || "Hello! How can I help you today!",
        },
        user.id // Pass actual user ID from users table
      );
      // Success message is now handled in the store based on whether
      // it's updating existing draft or creating new draft
    } catch (error) {
      console.error("Error saving system prompt:", error);
      toast.error("Failed to save system prompt");
    }
  };

  // ===== RESET CHAT ONLY =====
  const handleResetChat = () => {
    resetChat();
    toast.success("Chat reset");
  };

  // ===== RESET ALL (RELOAD SYSTEM PROMPT AND RESET CHAT) =====
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
        <label className="font-semibold">System prompt</label>
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            disabled={isUpdating || !systemPrompt.trim()}
            onClick={handleSavePrompt}
          >
            {isUpdating ? <Loader2 className="animate-spin" /> : <Save />}
            Save as Draft
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetChat}
            title="Clear chat messages"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetAll}
            title="Reload agent settings and clear chat"
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
          placeholder="Enter system prompt that defines how your agent should behave and respond to users..."
        />
      )}
    </div>
  );
}
