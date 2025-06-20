// ===== FLOW STORE =====
import { create } from "zustand";
import {
  loadAllDataAction,
  createDataAction,
  updateDataAction,
  deleteDataAction,
} from "@/components/actions/data-actions";
import sortBy from "sort-by";
import { toast } from "sonner";

const flowStore = create((set, get) => ({
  flows: [],
  isLoading: true,
  isUpdating: false,
  isDeleting: false,
  error: null,

  // ===== LOAD FLOWS =====
  loadFlows: async (agent_id) => {
    try {
      set({ isLoading: true, error: null });
      const res = await loadAllDataAction({
        table_name: "flows",
        query: {
          where: {
            bot_id: agent_id,
          },
        },
      });

      if (res?.error) {
        throw new Error(res?.error);
      }

      set({
        flows: res.sort(sortBy("-created_at")) || [],
        isLoading: false,
      });
    } catch (error) {
      console.error("Error loading flows:", error.message);
      set({ error: error.message, isLoading: false });
    }
  },

  // ===== CREATE FLOW =====
  createFlow: async (data) => {
    try {
      // ===== SET EXPIRES AT =====
      const expires_at = data.expires_at || Date.now() + 12 * 60 * 60 * 1000;

      const res = await createDataAction({
        table_name: "flows",
        query: {
          data: {
            ...data,
            expires_at,
            messages: [],
            created_at: Date.now(),
            updated_at: Date.now(),
          },
        },
      });

      if (res?.error) {
        throw new Error(res?.error);
      }

      // ===== UPDATE FLOWS LIST =====
      set((state) => ({
        flows: [res, ...state.flows],
      }));

      return res;
    } catch (error) {
      console.error("Error creating flow:", error.message);
      throw error;
    }
  },

  // ===== UPDATE FLOW =====
  updateFlow: async (flow_id, data) => {
    try {
      set({ isUpdating: true });
      const res = await updateDataAction({
        table_name: "flows",
        query: {
          where: {
            id: flow_id,
          },
          data,
        },
      });

      if (res?.error) {
        throw new Error(res?.error);
      }

      toast.success("Flow updated successfully");
    } catch (error) {
      console.error("Error updating flow:", error.message);
      throw error;
    } finally {
      set({ isUpdating: false });
    }
  },

  // ===== DELETE FLOW =====
  deleteFlow: async (flow_id) => {
    try {
      set({ isDeleting: true });
      const res = await deleteDataAction({
        table_name: "flows",
        query: {
          where: {
            id: flow_id,
          },
        },
      });

      if (res?.error) {
        throw new Error(res?.error);
      }

      // Remove flow from local state
      set((state) => ({
        flows: state.flows.filter((flow) => flow.id !== flow_id),
      }));

      toast.success("Flow deleted successfully");
    } catch (error) {
      console.error("Error deleting flow:", error.message);
      throw error;
    } finally {
      set({ isDeleting: false });
    }
  },
}));

export default flowStore;
