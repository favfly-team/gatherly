import { create } from "zustand";
import { loadSingleDataAction } from "@/components/actions/data-actions";
import { updateDataAction } from "@/components/actions/data-actions";
import agentStore from "./agent-store";

const usePlaygroundStore = create((set, get) => ({
  systemPrompt: "",
  initialMessage: "",
  messages: [],
  loading: false,
  isLoading: false,
  isDone: false,

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
  setMessages: (messages) => set({ messages }),
  setLoading: (loading) => set({ loading }),
  setIsDone: (isDone) => set({ isDone }),

  // ===== LOAD SYSTEM PROMPT FROM PUBLISHED VERSION (PUBLIC ACCESS) =====
  loadSystemPrompt: async (agent_id, usePublished = true) => {
    try {
      set({ isLoading: true });

      if (usePublished) {
        // For public access, use published version
        const data = await agentStore.getState().getPublishedVersion(agent_id);
        set({
          systemPrompt: data.settings?.system_prompt || "",
          initialMessage:
            data.settings?.initial_message ||
            "Hello! How can I help you today?",
        });
      } else {
        // For workspace access, use current version
        const data = await agentStore.getState().loadAgentWithVersion(agent_id);
        set({
          systemPrompt: data.settings?.system_prompt || "",
          initialMessage:
            data.settings?.initial_message ||
            "Hello! How can I help you today?",
        });
      }
    } catch (error) {
      console.error("Error loading system prompt:", error);
      // Fallback to basic values
      set({
        systemPrompt: "",
        initialMessage: "Hello! How can I help you today?",
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // ===== LOAD MESSAGES ONLY =====
  loadMessages: async (flow_id) => {
    try {
      const res = await loadSingleDataAction({
        table_name: "flows",
        id: flow_id,
      });

      if (res?.error) {
        throw res?.error;
      }

      set({ messages: res?.messages || [] });
    } catch (error) {
      console.error("Error loading messages:", error);
      throw error;
    }
  },

  // ===== LOAD MESSAGES AND SYSTEM PROMPT (FOR EXISTING FLOWS) =====
  loadMessagesAndSystemPrompt: async (flow_id) => {
    try {
      set({ isLoading: true });

      // Load flow data
      const flow = await loadSingleDataAction({
        table_name: "flows",
        id: flow_id,
      });

      if (flow?.error) {
        throw flow?.error;
      }

      // Load agent settings using bot_id from flow
      if (flow?.bot_id) {
        try {
          // Try to load current version first (for workspace users)
          const agentData = await agentStore
            .getState()
            .loadAgentWithVersion(flow.bot_id);
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
            // Fallback to published version (for public access)
            const publishedData = await agentStore
              .getState()
              .getPublishedVersion(flow.bot_id);
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

      set({ messages: flow?.messages || [] });
    } catch (error) {
      console.error("Error loading messages and system prompt:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // ===== UPDATE MESSAGES IN FLOW =====
  updateMessages: async (flow_id, messages) => {
    try {
      const res = await updateDataAction({
        table_name: "flows",
        query: {
          where: { id: flow_id },
          data: {
            messages,
            updated_at: Date.now(),
          },
        },
      });

      if (res?.error) {
        throw res?.error;
      }

      set({ messages });
    } catch (error) {
      console.error("Error updating messages:", error);
      throw error;
    }
  },

  // ===== RESET CHAT MESSAGES =====
  resetChat: () => set({ messages: [], isDone: false }),

  // ===== RESET ALL AND RELOAD SYSTEM PROMPT =====
  resetAll: async (agent_id, usePublished = true) => {
    try {
      // Load system prompt
      await get().loadSystemPrompt(agent_id, usePublished);

      // Reset messages
      set({ messages: [], isDone: false });
    } catch (error) {
      console.error("Error resetting all:", error);
      // Still reset messages even if system prompt loading fails
      set({ messages: [], isDone: false });
    }
  },
}));

export default usePlaygroundStore;
