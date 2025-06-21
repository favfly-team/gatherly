// ===== CHAT STORE =====
import { create } from "zustand";
import {
  loadAllDataAction,
  createDataAction,
  updateDataAction,
  deleteDataAction,
} from "@/components/actions/data-actions";
import sortBy from "sort-by";
import { toast } from "sonner";

const chatStore = create((set, get) => ({
  chats: [],
  isLoading: true,
  isUpdating: false,
  isDeleting: false,
  error: null,

  // ===== LOAD CHATS =====
  loadChats: async (agent_id) => {
    try {
      set({ isLoading: true, error: null });
      const res = await loadAllDataAction({
        table_name: "chats",
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
        chats: res.sort(sortBy("-created_at")) || [],
        isLoading: false,
      });
    } catch (error) {
      console.error("Error loading chats:", error.message);
      set({ error: error.message, isLoading: false });
    }
  },

  // ===== CREATE CHAT =====
  createChat: async (data) => {
    try {
      // ===== SET EXPIRES AT =====
      const expires_at = data.expires_at || Date.now() + 12 * 60 * 60 * 1000;

      const res = await createDataAction({
        table_name: "chats",
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

      // ===== UPDATE CHATS LIST =====
      set((state) => ({
        chats: [res, ...state.chats],
      }));

      return res;
    } catch (error) {
      console.error("Error creating chat:", error.message);
      throw error;
    }
  },

  // ===== UPDATE CHAT =====
  updateChat: async (chat_id, data) => {
    try {
      set({ isUpdating: true });
      const res = await updateDataAction({
        table_name: "chats",
        query: {
          where: {
            id: chat_id,
          },
          data,
        },
      });

      if (res?.error) {
        throw new Error(res?.error);
      }

      toast.success("Chat updated successfully");
    } catch (error) {
      console.error("Error updating chat:", error.message);
      throw error;
    } finally {
      set({ isUpdating: false });
    }
  },

  // ===== DELETE CHAT =====
  deleteChat: async (chat_id) => {
    try {
      set({ isDeleting: true });
      const res = await deleteDataAction({
        table_name: "chats",
        query: {
          where: {
            id: chat_id,
          },
        },
      });

      if (res?.error) {
        throw new Error(res?.error);
      }

      // Remove chat from local state
      set((state) => ({
        chats: state.chats.filter((chat) => chat.id !== chat_id),
      }));

      toast.success("Chat deleted successfully");
    } catch (error) {
      console.error("Error deleting chat:", error.message);
      throw error;
    } finally {
      set({ isDeleting: false });
    }
  },
}));

export default chatStore;
