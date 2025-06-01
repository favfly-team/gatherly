import { create } from "zustand";
import { loadSingleDataAction } from "@/components/actions/data-actions";
const usePlaygroundStore = create((set, get) => ({
  systemPrompt: "",
  messages: [],
  loading: false,
  isLoading: false,

  setSystemPrompt: (prompt) => set({ systemPrompt: prompt }),
  setMessages: (messages) => set({ messages }),
  setLoading: (loading) => set({ loading }),
  loadSystemPrompt: async (agent_id) => {
    set({ isLoading: true });
    const agent = await loadSingleDataAction({
      table_name: "bots",
      id: agent_id,
    });

    if (agent?.error) {
      throw new Error(agent?.error);
    }

    set({ systemPrompt: agent?.system_prompt });
    set({ isLoading: false });
  },

  resetChat: () => set({ messages: [] }),
  resetAll: (agent_id) => {
    // load system prompt
    get().loadSystemPrompt(agent_id);

    set({ messages: [] });
  },
}));

export default usePlaygroundStore;
