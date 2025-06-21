// ===== WORKSPACE STORE =====
import { create } from "zustand";
import {
  loadAllDataAction,
  createDataAction,
  updateDataAction,
} from "@/components/actions/data-actions";
import sortBy from "sort-by";
import { toast } from "sonner";

const workspaceStore = create((set, get) => ({
  workspaces: [],
  isLoading: true,
  isUpdating: false,
  error: null,

  // ===== LOAD WORKSPACES =====
  loadWorkspaces: async (user_id) => {
    try {
      set({ isLoading: true, error: null });

      // Query workspaces where workspace_members array contains the user_id
      const workspaces = await loadAllDataAction({
        table_name: "workspaces",
        query: {
          where: {
            workspace_members: [user_id], // This will be converted to array-contains in data-actions.js
          },
        },
      });

      if (workspaces?.error) {
        throw new Error(workspaces?.error);
      }

      set({
        workspaces: workspaces.sort(sortBy("name")) || [],
        isLoading: false,
      });
    } catch (error) {
      console.error("Error loading workspaces:", error.message);
      set({ error: error.message, isLoading: false });
    }
  },

  // ===== CREATE WORKSPACE =====
  createWorkspace: async (data, user_id) => {
    try {
      const res = await createDataAction({
        table_name: "workspaces",
        query: {
          data: {
            ...data,
            workspace_members: [user_id], // Add creator to members array
            owner_id: user_id, // Track the owner
            created_at: Date.now(),
            updated_at: Date.now(),
          },
        },
      });

      if (res?.error) {
        throw new Error(res?.error);
      }

      // Update workspaces list
      set((state) => ({
        workspaces: [res, ...state.workspaces].sort(sortBy("name")),
      }));

      return res;
    } catch (error) {
      console.error("Error creating workspace:", error.message);
      throw error;
    }
  },

  // ===== UPDATE WORKSPACE =====
  updateWorkspace: async (workspace_id, data) => {
    try {
      set({ isUpdating: true });
      const res = await updateDataAction({
        table_name: "workspaces",
        query: {
          where: {
            id: workspace_id,
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
        workspaces: state.workspaces.map((workspace) =>
          workspace.id === workspace_id ? { ...workspace, ...data } : workspace
        ),
      }));

      toast.success("Workspace updated successfully");

      return res;
    } catch (error) {
      console.error("Error updating workspace:", error.message);
      throw error;
    } finally {
      set({ isUpdating: false });
    }
  },

  // ===== GET WORKSPACE BY SLUG =====
  getWorkspaceBySlug: async (slug) => {
    try {
      const workspaces = await loadAllDataAction({
        table_name: "workspaces",
        query: {
          where: {
            slug: slug,
          },
        },
      });

      if (workspaces && workspaces.length > 0) {
        return workspaces[0];
      }

      return null;
    } catch (error) {
      console.error("Error getting workspace by slug:", error.message);
      return null;
    }
  },

  // ===== GET WORKSPACE BY ID =====
  getWorkspaceById: (workspace_id) => {
    const { workspaces } = get();
    return workspaces.find((workspace) => workspace.id === workspace_id);
  },

  // ===== ADD MEMBER TO WORKSPACE =====
  addMemberToWorkspace: async (workspace_id, user_id) => {
    try {
      // Get current workspace
      const workspace = get().workspaces.find((w) => w.id === workspace_id);
      if (!workspace) {
        throw new Error("Workspace not found");
      }

      // Check if user is already a member
      if (workspace.workspace_members?.includes(user_id)) {
        toast.error("User is already a member of this workspace");
        return;
      }

      // Add user to workspace_members array
      const updatedMembers = [...(workspace.workspace_members || []), user_id];

      const res = await updateDataAction({
        table_name: "workspaces",
        query: {
          where: {
            id: workspace_id,
          },
          data: {
            workspace_members: updatedMembers,
            updated_at: Date.now(),
          },
        },
      });

      if (res?.error) {
        throw new Error(res?.error);
      }

      // Update local state
      set((state) => ({
        workspaces: state.workspaces.map((workspace) =>
          workspace.id === workspace_id
            ? { ...workspace, workspace_members: updatedMembers }
            : workspace
        ),
      }));

      toast.success("Member added to workspace successfully");

      return res;
    } catch (error) {
      console.error("Error adding member to workspace:", error.message);
      throw error;
    }
  },

  // ===== REMOVE MEMBER FROM WORKSPACE =====
  removeMemberFromWorkspace: async (workspace_id, user_id) => {
    try {
      // Get current workspace
      const workspace = get().workspaces.find((w) => w.id === workspace_id);
      if (!workspace) {
        throw new Error("Workspace not found");
      }

      // Check if user is the owner
      if (workspace.owner_id === user_id) {
        toast.error("Cannot remove the workspace owner");
        return;
      }

      // Remove user from workspace_members array
      const updatedMembers = (workspace.workspace_members || []).filter(
        (memberId) => memberId !== user_id
      );

      const res = await updateDataAction({
        table_name: "workspaces",
        query: {
          where: {
            id: workspace_id,
          },
          data: {
            workspace_members: updatedMembers,
            updated_at: Date.now(),
          },
        },
      });

      if (res?.error) {
        throw new Error(res?.error);
      }

      // Update local state
      set((state) => ({
        workspaces: state.workspaces.map((workspace) =>
          workspace.id === workspace_id
            ? { ...workspace, workspace_members: updatedMembers }
            : workspace
        ),
      }));

      toast.success("Member removed from workspace successfully");

      return res;
    } catch (error) {
      console.error("Error removing member from workspace:", error.message);
      throw error;
    }
  },
}));

export default workspaceStore;
