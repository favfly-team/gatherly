import { useCallback } from "react";
import usePlaygroundStore from "@/storage/playground-store";
import chatStore from "@/storage/chat-store";
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

  const { createChat } = chatStore();

  // ===== OPTIMIZED MESSAGE SENDER =====
  const sendMessage = useCallback(
    async ({
      input,
      mode = "existing",
      agent_id = null,
      chat_id = null,
      onChatCreated = null,
    }) => {
      if (!input?.trim() || loading) return false;

      const userMessage = { role: "user", content: input };
      let currentChatId = chat_id;

      try {
        // ===== ADD USER MESSAGE TO LOCAL STATE IMMEDIATELY =====
        const newMessages = [...messages, userMessage];
        setMessages(newMessages); // Update local state first for UI responsiveness

        setLoading(true);

        // ===== CREATE CHAT FOR NEW CHATS =====
        if (mode === "new" && messages.length === 0 && agent_id) {
          // Create a temporary name - will be updated by the page component
          const tempChatName = "New Chat";

          const newChat = await createChat({
            name: tempChatName,
            bot_id: agent_id,
          });

          currentChatId = newChat.id;

          // ===== NOTIFY PARENT COMPONENT =====
          if (onChatCreated) {
            onChatCreated(newChat.id);
          }
        }

        // ===== UPDATE MESSAGES IN DATABASE =====
        if (currentChatId) {
          await updateMessages(currentChatId, newMessages);
        }

        // ===== GET AI RESPONSE =====
        const aiReply = await fetchOpenAIChat({
          messages: newMessages,
          systemPrompt: `${DEFAULT_PROMPT}\n\n${systemPrompt}`,
        });

        // ===== UPDATE LOCAL STATE WITH AI RESPONSE =====
        const finalMessages = [
          ...newMessages,
          { role: "assistant", content: aiReply },
        ];
        setMessages(finalMessages); // Update local state first

        // ===== UPDATE DATABASE WITH AI RESPONSE =====
        if (currentChatId) {
          await updateMessages(currentChatId, finalMessages);
        }

        // ===== CHECK FOR COMPLETION =====
        if (aiReply.includes("###GATHERLY_DONE###")) {
          setIsDone(true);
        }

        return true;
      } catch (error) {
        console.error("Error sending message:", error);

        // ===== ERROR HANDLING =====
        const errorMessage = {
          role: "assistant",
          content: "Sorry, there was an error.",
        };

        // ===== UPDATE LOCAL STATE WITH ERROR =====
        setMessages([...messages, userMessage, errorMessage]);

        // ===== UPDATE DATABASE WITH ERROR =====
        if (currentChatId) {
          await updateMessages(currentChatId, [
            ...messages,
            userMessage,
            errorMessage,
          ]);
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
      createChat,
    ]
  );

  return {
    sendMessage,
    messages,
    loading,
  };
}
