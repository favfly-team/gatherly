import { useCallback } from "react";
import usePlaygroundStore from "@/storage/playground-store";
import flowStore from "@/storage/flow-store";
import { fetchOpenAIChat } from "@/components/actions/openai";

const DEFAULT_PROMPT = `
When, and only when, you have collected every piece of information you need from the user, end your reply with the single line:
###GATHERLY_DONE###
Before that final line, continue the conversation normally: ask follow-up questions, acknowledge answers, and provide guidance.
Do not include "###GATHERLY_DONE###" anywhere until you are completely ready to generate the final document.`;

export default function useChat() {
  // ===== STORE INTEGRATION =====
  const {
    messages,
    systemPrompt,
    loading,
    setLoading,
    updateMessages,
    setMessages,
    setIsDone,
  } = usePlaygroundStore();

  const { createFlow } = flowStore();

  // ===== OPTIMIZED MESSAGE SENDER =====
  const sendMessage = useCallback(
    async ({
      input,
      mode = "existing",
      agent_id = null,
      flow_id = null,
      onFlowCreated = null,
    }) => {
      if (!input?.trim() || loading) return false;

      const userMessage = { role: "user", content: input };
      const newMessages = [...messages, userMessage];
      let currentFlowId = flow_id;

      try {
        // ===== ADD USER MESSAGE IMMEDIATELY =====
        if (currentFlowId) {
          await updateMessages(currentFlowId, newMessages);
        } else {
          setMessages(newMessages);
        }

        setLoading(true);

        // ===== CREATE FLOW FOR NEW CHATS =====
        if (mode === "new" && messages.length === 0 && agent_id) {
          const flowName =
            input.length > 50 ? input.substring(0, 47) + "..." : input;

          const newFlow = await createFlow({
            name: flowName,
            bot_id: agent_id,
          });

          currentFlowId = newFlow.id;

          if (onFlowCreated) {
            onFlowCreated(newFlow.id);
          }

          await updateMessages(currentFlowId, newMessages);
        }

        // ===== GET AI RESPONSE =====
        const aiReply = await fetchOpenAIChat({
          messages: newMessages,
          systemPrompt: `${DEFAULT_PROMPT}\n\n${systemPrompt}`,
        });

        const finalMessages = [
          ...newMessages,
          { role: "assistant", content: aiReply },
        ];

        // ===== UPDATE MESSAGES =====
        if (currentFlowId) {
          await updateMessages(currentFlowId, finalMessages);
        } else {
          setMessages(finalMessages);
        }

        // ===== CHECK FOR COMPLETION =====
        if (aiReply.includes("###GATHERLY_DONE###")) {
          setIsDone(true);
        }

        return true;
      } catch (error) {
        console.error("Error sending message:", error);
        const errorMessages = [
          ...newMessages,
          { role: "assistant", content: "Sorry, there was an error." },
        ];

        if (currentFlowId) {
          await updateMessages(currentFlowId, errorMessages);
        } else {
          setMessages(errorMessages);
        }

        return false;
      } finally {
        setLoading(false);
      }
    },
    [
      messages,
      systemPrompt,
      loading,
      updateMessages,
      setMessages,
      setLoading,
      setIsDone,
      createFlow,
    ]
  );

  return {
    sendMessage,
    messages,
    loading,
  };
}
