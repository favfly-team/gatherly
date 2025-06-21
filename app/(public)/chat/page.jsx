"use client";
import { ChatOnly } from "@/components/features/playground";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import usePlaygroundStore from "@/storage/playground-store";
import chatStore from "@/storage/chat-store";
import { generateChatName } from "@/components/actions/openai";
import { toast } from "sonner";

const ChatPage = () => {
  const searchParams = useSearchParams();
  const agent_id = searchParams.get("agent_id");
  const [currentChatId, setCurrentChatId] = useState(null);
  const { messages, isDone } = usePlaygroundStore();
  const { updateChat } = chatStore();

  // Effect to set initial chat name and update it when conversation is completed
  useEffect(() => {
    const handleChatName = async () => {
      if (!currentChatId) return;

      try {
        // First, set the initial name to chat-[id] format
        if (!isDone) {
          await updateChat(currentChatId, {
            name: `chat-${currentChatId.substring(0, 8)}`,
            updated_at: Date.now(),
          });
          return;
        }

        // Only proceed with AI name generation if conversation is done and we have messages
        if (messages.length === 0) return;

        // Generate a descriptive name based on the conversation
        const generatedName = await generateChatName(messages);

        // Update the chat with the new name
        await updateChat(currentChatId, {
          name: generatedName,
          updated_at: Date.now(),
        });

        toast.success("Chat name updated based on conversation");
      } catch (error) {
        console.error("Error updating chat name:", error);
      }
    };

    handleChatName();
  }, [currentChatId, messages, isDone, updateChat]);

  return (
    <ChatOnly
      agent_id={agent_id}
      mode="new"
      onChatCreated={(chat_id) => {
        // Store the chat ID for later use
        setCurrentChatId(chat_id);

        // Seamless URL transition
        const newUrl = `/chat/${chat_id}`;
        window.history.replaceState(null, "", newUrl);
      }}
    />
  );
};

export default ChatPage;
