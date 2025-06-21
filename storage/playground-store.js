import { create } from "zustand";
import {
  loadSingleDataAction,
  updateDataAction,
} from "@/components/actions/data-actions";
import agentStore from "./agent-store";

const usePlaygroundStore = create((set, get) => ({
  // ===== STATE =====
  systemPrompt: "",
  initialMessage: "",
  messages: [],
  loading: false,
  isLoading: false,
  isDone: false,

  // ===== ACTIONS =====
  reset: () =>
    set({
      systemPrompt: "",
      initialMessage: "",
      messages: [],
      loading: false,
      isLoading: false,
      isDone: false,
    }),

  setSystemPrompt: (prompt) => set({ systemPrompt: prompt }),
  setInitialMessage: (message) => set({ initialMessage: message }),
  setMessages: (messages) => set({ messages }),
  setLoading: (loading) => set({ loading }),
  setIsDone: (isDone) => set({ isDone }),

  // ===== HELPER: LOAD AGENT DATA =====
  _loadAgentData: async (agent_id, usePublished) => {
    const agentState = agentStore.getState();

    if (usePublished) {
      return await agentState.getPublishedVersion(agent_id);
    } else {
      return await agentState.loadAgent(agent_id);
    }
  },

  // ===== LOAD SYSTEM PROMPT =====
  loadSystemPrompt: async (agent_id, usePublished = true) => {
    try {
      set({ isLoading: true });

      const data = await get()._loadAgentData(agent_id, usePublished);

      set({
        systemPrompt: data.settings?.system_prompt || "",
        initialMessage:
          data.settings?.initial_message || "Hello! How can I help you today?",
      });
    } catch (error) {
      console.error("Error loading system prompt:", error);
      set({
        systemPrompt: "",
        initialMessage: "Hello! How can I help you today?",
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // ===== LOAD MESSAGES =====
  loadMessages: async (chat_id) => {
    try {
      const res = await loadSingleDataAction({
        table_name: "chats",
        id: chat_id,
      });

      if (res?.error) throw new Error(res.error);

      set({ messages: res?.messages || [] });
    } catch (error) {
      console.error("Error loading messages:", error);
      throw error;
    }
  },

  // ===== LOAD MESSAGES AND SYSTEM PROMPT =====
  loadMessagesAndSystemPrompt: async (chat_id) => {
    try {
      set({ isLoading: true });

      // Load chat data
      const chat = await loadSingleDataAction({
        table_name: "chats",
        id: chat_id,
      });

      if (chat?.error) throw new Error(chat.error);

      // Load agent settings
      if (chat?.bot_id) {
        try {
          // Try current version first (workspace users)
          const agentData = await get()._loadAgentData(chat.bot_id, false);
          set({
            systemPrompt: agentData.settings?.system_prompt || "",
            initialMessage:
              agentData.settings?.initial_message ||
              "Hello! How can I help you today?",
          });
        } catch (error) {
          console.warn(
            "Could not load current version, trying published version:",
            error
          );
          try {
            // Fallback to published version (public users)
            const publishedData = await get()._loadAgentData(chat.bot_id, true);
            set({
              systemPrompt: publishedData.settings?.system_prompt || "",
              initialMessage:
                publishedData.settings?.initial_message ||
                "Hello! How can I help you today?",
            });
          } catch (publishedError) {
            console.error("Could not load any version:", publishedError);
            set({
              systemPrompt: "",
              initialMessage: "Hello! How can I help you today?",
            });
          }
        }
      }

      set({ messages: chat?.messages || [] });
    } catch (error) {
      console.error("Error loading messages and system prompt:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // ===== UPDATE MESSAGES =====
  updateMessages: async (chat_id, messages) => {
    try {
      const res = await updateDataAction({
        table_name: "chats",
        query: {
          where: { id: chat_id },
          data: {
            messages,
            updated_at: Date.now(),
          },
        },
      });

      if (res?.error) throw new Error(res.error);

      set({ messages });
    } catch (error) {
      console.error("Error updating messages:", error);
      throw error;
    }
  },

  // ===== RESET CHAT =====
  resetChat: () => set({ messages: [], isDone: false }),

  // ===== RESET ALL =====
  resetAll: async (agent_id, usePublished = true) => {
    try {
      await get().loadSystemPrompt(agent_id, usePublished);
      set({ messages: [], isDone: false });
    } catch (error) {
      console.error("Error resetting all:", error);
      set({ messages: [], isDone: false });
    }
  },
}));

export default usePlaygroundStore;
