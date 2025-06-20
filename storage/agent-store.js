// ===== AGENT STORE =====
import { create } from "zustand";
import {
  loadAllDataAction,
  createDataAction,
  updateDataAction,
  deleteDataAction,
} from "@/components/actions/data-actions";
import sortBy from "sort-by";
import { toast } from "sonner";

const agentStore = create((set, get) => ({
  agents: [],
  isLoading: true,
  isUpdating: false,
  isDeleting: false,
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
            created_at: Date.now(),
            updated_at: Date.now(),
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

  // ===== DELETE AGENT =====
  deleteAgent: async (agent_id) => {
    try {
      set({ isDeleting: true });

      // First, load all flows for this agent
      const flows = await loadAllDataAction({
        table_name: "flows",
        query: {
          where: {
            bot_id: agent_id,
          },
        },
      });

      if (flows?.error) {
        throw new Error(flows?.error);
      }

      // Delete all flows (this will also delete their messages)
      if (flows && flows.length > 0) {
        for (const flow of flows) {
          const deleteFlowRes = await deleteDataAction({
            table_name: "flows",
            query: {
              where: {
                id: flow.id,
              },
            },
          });

          if (deleteFlowRes?.error) {
            throw new Error(deleteFlowRes?.error);
          }
        }
      }

      // Now delete the agent
      const res = await deleteDataAction({
        table_name: "bots",
        query: {
          where: {
            id: agent_id,
          },
        },
      });

      if (res?.error) {
        throw new Error(res?.error);
      }

      // Remove agent from local state
      set((state) => ({
        agents: state.agents.filter((agent) => agent.id !== agent_id),
      }));

      toast.success("Agent deleted successfully");
    } catch (error) {
      console.error("Error deleting agent:", error.message);
      throw error;
    } finally {
      set({ isDeleting: false });
    }
  },
}));

export default agentStore;
