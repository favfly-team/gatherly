import { useCallback } from "react";
import usePlaygroundStore from "@/storage/playground-store";
import chatStore from "@/storage/chat-store";
import { fetchOpenAIChat, generateChatName } from "@/components/actions/openai";
import {
  findUniqueDataAction,
  loadAllDataAction,
} from "@/components/actions/data-actions";
import { sendChatCompletionEmail } from "./send-submission-mail";
import { generatePDF } from "@/lib/pdf-generator";

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

  const { createChat, updateChat } = chatStore();

  // ===== MESSAGE SENDER WITH MODE HANDLING =====
  const sendMessage = useCallback(
    async ({
      input,
      mode = "existing", // playground | new | existing
      agent_id = null,
      chat_id = null,
      onChatCreated = null,
    }) => {
      if (!input?.trim() || loading) return { success: false };

      const userMessage = { role: "user", content: input };
      let currentChatId = chat_id;

      try {
        // ===== UPDATE LOCAL STATE FIRST (ALL MODES) =====
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setLoading(true);

        // ===== HANDLE DATABASE OPERATIONS BASED ON MODE =====
        if (mode === "new" && messages.length === 0 && agent_id) {
          // NEW CHAT MODE: Create new chat in database
          const newChat = await createChat({
            name: "New Chat", // Temporary name
            bot_id: agent_id,
          });

          currentChatId = newChat.id;

          // ===== UPDATE CHAT NAME WITH ID =====
          const chatNameWithId = `chat-${currentChatId.substring(0, 8)}`;
          await updateChat(currentChatId, {
            name: chatNameWithId,
            updated_at: Date.now(),
          });

          // Notify parent component for URL update
          if (onChatCreated) {
            onChatCreated(newChat.id);
          }

          // Update messages in database
          await updateMessages(currentChatId, newMessages);
        } else if (mode === "existing" && currentChatId) {
          // EXISTING CHAT MODE: Update existing chat in database
          await updateMessages(currentChatId, newMessages);
        }
        // PLAYGROUND MODE: Skip database operations (temporary testing)

        // ===== GET AI RESPONSE (ALL MODES) =====
        const aiReply = await fetchOpenAIChat({
          messages: newMessages,
          systemPrompt: `${DEFAULT_PROMPT}\n\n${systemPrompt}`,
        });

        // ===== UPDATE LOCAL STATE WITH AI RESPONSE (ALL MODES) =====
        const finalMessages = [
          ...newMessages,
          { role: "assistant", content: aiReply },
        ];
        setMessages(finalMessages);

        // ===== UPDATE DATABASE WITH AI RESPONSE (ONLY FOR NEW/EXISTING) =====
        if (mode !== "playground" && currentChatId) {
          await updateMessages(currentChatId, finalMessages);
        }

        // ===== CHECK FOR COMPLETION (ALL MODES) =====
        if (aiReply.includes("###GATHERLY_DONE###")) {
          setIsDone(true);

          // ===== UPDATE CHAT NAME WITH AI-GENERATED NAME (ONLY FOR NEW/EXISTING) =====
          if (
            mode !== "playground" &&
            currentChatId &&
            finalMessages.length > 2
          ) {
            try {
              const generatedName = await generateChatName(finalMessages);
              await updateChat(currentChatId, {
                name: generatedName,
                updated_at: Date.now(),
              });

              // ===== SEND COMPLETION EMAIL =====
              const chat = await findUniqueDataAction({
                table_name: "chats",
                query: {
                  where: {
                    id: currentChatId,
                  },
                },
              });

              const agent = await findUniqueDataAction({
                table_name: "bots",
                query: {
                  where: {
                    id: chat?.bot_id,
                  },
                },
              });

              const workspace = await findUniqueDataAction({
                table_name: "workspaces",
                query: {
                  where: {
                    id: agent?.workspace_id,
                  },
                },
              });

              const workspaceMembers = await loadAllDataAction({
                table_name: "workspace_members",
                query: {
                  where: {
                    workspace_id: workspace?.id,
                  },
                },
              });

              const users = await Promise.all(
                workspaceMembers.map(async (member) => {
                  const user = await findUniqueDataAction({
                    table_name: "users",
                    query: {
                      where: {
                        id: member.user_id,
                      },
                    },
                  });
                  return user;
                })
              );

              const emails = users
                .filter((user) => user?.email)
                .map((user) => user?.email);

              // generate pdf
              // const pdf_content = await generatePDF(finalMessages);

              await sendChatCompletionEmail({
                recipient_emails: emails,
                chat_id: currentChatId,
                workspace_name: workspace.name,
                agent_name: agent.name,
                chat_name: generatedName,
                submitted_on: Date.now(),
                submission_url: `${process.env.NEXT_PUBLIC_SITE_URL}/chat/${currentChatId}`,
                // pdf_content: pdf_content,
              });

              return;
            } catch (error) {
              console.error("Error generating chat name:", error);
              // Keep the existing name if generation fails
            }
          }
        }

        return {
          success: true,
          chat_id: currentChatId,
        };
      } catch (error) {
        console.error("Error sending message:", error);

        // ===== ERROR HANDLING (ALL MODES) =====
        const errorMessage = {
          role: "assistant",
          content: "Sorry, there was an error.",
        };

        const messagesWithError = [...messages, userMessage, errorMessage];
        setMessages(messagesWithError);

        // Update database with error (only for new/existing modes)
        if (mode !== "playground" && currentChatId) {
          await updateMessages(currentChatId, messagesWithError);
        }

        return { success: false };
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
      updateChat,
    ]
  );

  return {
    sendMessage,
    messages,
    loading,
  };
}
