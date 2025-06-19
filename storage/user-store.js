// ===== USER STORE =====
import { create } from "zustand";
import {
  loadSingleDataAction,
  createDataAction,
  updateDataAction,
} from "@/components/actions/data-actions";
import { toast } from "sonner";

const userStore = create((set, get) => ({
  user: null,
  isLoading: true,
  isUpdating: false,
  error: null,

  // ===== LOAD USER PROFILE =====
  loadUserProfile: async (user_id) => {
    try {
      set({ isLoading: true, error: null });
      const res = await loadSingleDataAction({
        table_name: "users",
        id: user_id,
      });

      if (res?.error) {
        throw new Error(res?.error);
      }

      set({
        user: res,
        isLoading: false,
      });

      return res;
    } catch (error) {
      console.error("Error loading user profile:", error.message);
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  // ===== CREATE USER PROFILE =====
  createUserProfile: async (user_id, data) => {
    try {
      const res = await createDataAction({
        table_name: "users",
        id: user_id, // Use Firebase Auth UID as document ID
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

      set({ user: res });
      toast.success("User profile created successfully");

      return res;
    } catch (error) {
      console.error("Error creating user profile:", error.message);
      throw error;
    }
  },

  // ===== UPDATE USER PROFILE =====
  updateUserProfile: async (user_id, data) => {
    try {
      set({ isUpdating: true });
      const res = await updateDataAction({
        table_name: "users",
        query: {
          where: {
            id: user_id,
          },
          data: {
            ...data,
            updated_at: Date.now(),
          },
        },
      });

      if (res?.error) {
        throw new Error(res?.error);
      }

      // Update local state
      set((state) => ({
        user: { ...state.user, ...data },
      }));

      toast.success("Profile updated successfully");

      return res;
    } catch (error) {
      console.error("Error updating user profile:", error.message);
      throw error;
    } finally {
      set({ isUpdating: false });
    }
  },

  // ===== SET USER =====
  setUser: (user) => {
    set({ user, isLoading: false });
  },

  // ===== CLEAR USER =====
  clearUser: () => {
    set({ user: null, isLoading: false, error: null });
  },

  // ===== GET USER =====
  getUser: () => {
    const { user } = get();
    return user;
  },

  // ===== CHECK IF USER EXISTS =====
  checkUserExists: async (user_id) => {
    try {
      const res = await loadSingleDataAction({
        table_name: "users",
        id: user_id,
      });

      return res && !res.error;
    } catch (error) {
      console.error("Error checking if user exists:", error.message);
      return false;
    }
  },
}));

export default userStore;
