"use client";
import { ChatOnly } from "@/components/features/playground";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import usePlaygroundStore from "@/storage/playground-store";
import flowStore from "@/storage/flow-store";
import { generateFlowName } from "@/components/actions/openai";
import { toast } from "sonner";

const ChatPage = () => {
  const searchParams = useSearchParams();
  const agent_id = searchParams.get("agent_id");
  const [currentFlowId, setCurrentFlowId] = useState(null);
  const { messages, isDone } = usePlaygroundStore();
  const { updateFlow } = flowStore();

  // Effect to set initial flow name and update it when conversation is completed
  useEffect(() => {
    const handleFlowName = async () => {
      if (!currentFlowId) return;

      try {
        // First, set the initial name to chat-[id] format
        if (!isDone) {
          await updateFlow(currentFlowId, {
            name: `chat-${currentFlowId.substring(0, 8)}`,
            updated_at: Date.now(),
          });
          return;
        }

        // Only proceed with AI name generation if conversation is done and we have messages
        if (messages.length === 0) return;

        // Generate a descriptive name based on the conversation
        const generatedName = await generateFlowName(messages);

        // Update the flow with the new name
        await updateFlow(currentFlowId, {
          name: generatedName,
          updated_at: Date.now(),
        });

        toast.success("Flow name updated based on conversation");
      } catch (error) {
        console.error("Error updating flow name:", error);
      }
    };

    handleFlowName();
  }, [currentFlowId, messages, isDone, updateFlow]);

  return (
    <ChatOnly
      agent_id={agent_id}
      mode="new"
      onFlowCreated={(flow_id) => {
        // Store the flow ID for later use
        setCurrentFlowId(flow_id);

        // Seamless URL transition
        const newUrl = `/chat/${flow_id}`;
        window.history.replaceState(null, "", newUrl);
      }}
    />
  );
};

export default ChatPage;
