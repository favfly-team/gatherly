// ===== AGENT STORE =====
import { create } from "zustand";
import {
  loadAllDataAction,
  createDataAction,
  updateDataAction,
} from "@/components/actions/data-actions";
import sortBy from "sort-by";
import { toast } from "sonner";

const agentStore = create((set, get) => ({
  agents: [],
  isLoading: true,
  isUpdating: false,
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

      toast.success("Agent created successfully");

      return res;
    } catch (error) {
      console.error("Error creating agent:", error.message);
      throw error;
    }
  },

  // ===== UPDATE AGENT =====
  updateAgent: async (agent_id, data) => {
    try {
      set({ isUpdating: true });
      const res = await updateDataAction({
        table_name: "bots",
        query: {
          where: {
            id: agent_id,
          },
          data,
        },
      });

      if (res?.error) {
        throw new Error(res?.error);
      }

      toast.success("Agent updated successfully");
    } catch (error) {
      console.error("Error updating agent:", error.message);
      throw error;
    } finally {
      set({ isUpdating: false });
    }
  },
}));

export default agentStore;
