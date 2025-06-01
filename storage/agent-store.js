// ===== AGENT STORE =====
import { create } from "zustand";
import {
  loadAllDataAction,
  createDataAction,
} from "@/components/actions/data-actions";
import sortBy from "sort-by";

const agentStore = create((set, get) => ({
  agents: [],
  isLoading: true,
  error: null,

  // ===== LOAD AGENTS =====
  loadAgents: async (workspace_id) => {
    try {
      set({ isLoading: true, error: null });
      const res = await loadAllDataAction({
        table_name: "bots",
        query: {
          where: {
            workspace_id,
          },
        },
      });

      if (res?.error) {
        throw new Error(res?.error);
      }

      set({
        agents: res.sort(sortBy("-created_at")) || [],
        isLoading: false,
      });
    } catch (error) {
      console.error("Error loading agents:", error.message);
      set({ error: error.message, isLoading: false });
    }
  },

  // ===== CREATE AGENT =====
  createAgent: async (data) => {
    try {
      const res = await createDataAction({
        table_name: "bots",
        query: {
          data: {
            ...data,
            created_at: new Date(),
            updated_at: new Date(),
          },
        },
      });

      if (res?.error) {
        throw new Error(res?.error);
      }

      // Update agents list
      set((state) => ({
        agents: [res, ...state.agents],
      }));

      return res;
    } catch (error) {
      console.error("Error creating agent:", error.message);
      throw error;
    }
  },
}));

export default agentStore;
