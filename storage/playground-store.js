import { create } from "zustand";
import { loadSingleDataAction } from "@/components/actions/data-actions";
import { updateDataAction } from "@/components/actions/data-actions";
const usePlaygroundStore = create((set, get) => ({
  systemPrompt: "",
  messages: [],
  loading: false,
  isLoading: false,
  isDone: false,
  setSystemPrompt: (prompt) => set({ systemPrompt: prompt }),
  setMessages: (messages) => set({ messages }),
  setLoading: (loading) => set({ loading }),
  setIsDone: (isDone) => set({ isDone }),
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
  loadMessages: async (flow_id) => {
    const res = await loadSingleDataAction({
      table_name: "flows",
      id: flow_id,
    });

    if (res?.error) {
      throw res?.error;
    }

    set({ messages: res?.messages });
  },
  updateMessages: async (flow_id, messages) => {
    const res = await updateDataAction({
      table_name: "flows",
      query: { where: { id: flow_id }, data: { messages } },
    });

    console.log(res);

    if (res?.error) {
      throw res?.error;
    }

    set({ messages });
  },

  resetChat: () => set({ messages: [], isDone: false }),
  resetAll: (agent_id) => {
    // load system prompt
    get().loadSystemPrompt(agent_id);

    set({ messages: [], isDone: false });
  },
}));

export default usePlaygroundStore;
