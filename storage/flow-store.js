// ===== FLOW STORE =====
import { create } from "zustand";
import {
  loadAllDataAction,
  createDataAction,
} from "@/components/actions/data-actions";
import sortBy from "sort-by";

const flowStore = create((set, get) => ({
  flows: [],
  isLoading: true,
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
      // Set expires_at to 12 hours from now if not provided
      const expires_at =
        data.expires_at || new Date(Date.now() + 12 * 60 * 60 * 1000);

      const res = await createDataAction({
        table_name: "flows",
        query: {
          data: {
            ...data,
            expires_at,
            messages: [],
            created_at: new Date(),
            updated_at: new Date(),
          },
        },
      });

      if (res?.error) {
        throw new Error(res?.error);
      }

      // Update flows list
      set((state) => ({
        flows: [res, ...state.flows],
      }));

      return res;
    } catch (error) {
      console.error("Error creating flow:", error.message);
      throw error;
    }
  },
}));

export default flowStore;
