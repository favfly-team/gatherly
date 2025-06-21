// ===== MEMBER STORE =====
import { create } from "zustand";
import {
  loadAllDataAction,
  createDataAction,
  updateDataAction,
  loadSingleDataAction,
} from "@/components/actions/data-actions";
import sortBy from "sort-by";
import { toast } from "sonner";

const memberStore = create((set, get) => ({
  members: [],
  isLoading: true,
  isUpdating: false,
  error: null,

  // ===== LOAD WORKSPACE MEMBERS =====
  loadWorkspaceMembers: async (workspace_id) => {
    try {
      set({ isLoading: true, error: null });

      const members = await loadAllDataAction({
        table_name: "workspace_members",
        query: {
          where: {
            workspace_id: workspace_id,
          },
        },
      });

      if (members?.error) {
        throw new Error(members?.error);
      }

      // Get user details for each member
      const membersWithUserData = await Promise.all(
        members.map(async (member) => {
          const user = await loadSingleDataAction({
            table_name: "users",
            id: member.user_id,
          });

          return {
            ...member,
            user: user || {
              id: member.user_id,
              display_name: "Unknown",
              email: "Unknown",
            },
          };
        })
      );

      set({
        members: membersWithUserData.sort(sortBy("user.display_name")) || [],
        isLoading: false,
      });
    } catch (error) {
      console.error("Error loading workspace members:", error.message);
      set({ error: error.message, isLoading: false });
    }
  },

  // ===== ADD MEMBER TO WORKSPACE =====
  addMemberToWorkspace: async (workspace_id, user_id, role = "member") => {
    try {
      // Check if user is already a member
      const existingMember = await loadAllDataAction({
        table_name: "workspace_members",
        query: {
          where: {
            workspace_id: workspace_id,
            user_id: user_id,
          },
        },
      });

      if (existingMember && existingMember.length > 0) {
        toast.error("User is already a member of this workspace");
        return null;
      }

      const memberData = {
        workspace_id,
        user_id,
        role,
        status: "active",
        created_at: Date.now(),
        updated_at: Date.now(),
      };

      const res = await createDataAction({
        table_name: "workspace_members",
        query: {
          data: memberData,
        },
      });

      if (res?.error) {
        throw new Error(res?.error);
      }

      // Get user data for the new member
      const user = await loadSingleDataAction({
        table_name: "users",
        id: user_id,
      });

      const newMember = {
        ...res,
        user: user || {
          id: user_id,
          display_name: "Unknown",
          email: "Unknown",
        },
      };

      // Update local state
      set((state) => ({
        members: [...state.members, newMember].sort(
          sortBy("user.display_name")
        ),
      }));

      return res;
    } catch (error) {
      console.error("Error adding member to workspace:", error.message);
      throw error;
    }
  },

  // ===== UPDATE MEMBER =====
  updateMember: async (member_id, data) => {
    try {
      set({ isUpdating: true });

      const res = await updateDataAction({
        table_name: "workspace_members",
        query: {
          where: {
            id: member_id,
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
        members: state.members.map((member) =>
          member.id === member_id ? { ...member, ...data } : member
        ),
      }));

      return res;
    } catch (error) {
      console.error("Error updating member:", error.message);
      throw error;
    } finally {
      set({ isUpdating: false });
    }
  },

  // ===== REMOVE MEMBER FROM WORKSPACE =====
  removeMemberFromWorkspace: async (member_id) => {
    try {
      // For now, we'll use soft delete by updating status
      const res = await updateDataAction({
        table_name: "workspace_members",
        query: {
          where: {
            id: member_id,
          },
          data: {
            status: "removed",
            updated_at: Date.now(),
          },
        },
      });

      if (res?.error) {
        throw new Error(res?.error);
      }

      // Remove from local state
      set((state) => ({
        members: state.members.filter((member) => member.id !== member_id),
      }));

      return res;
    } catch (error) {
      console.error("Error removing member from workspace:", error.message);
      throw error;
    }
  },

  // ===== CHECK IF USER EXISTS =====
  checkUserExists: async (email) => {
    try {
      const users = await loadAllDataAction({
        table_name: "users",
        query: {
          where: {
            email: email,
          },
        },
      });

      if (users?.error) {
        throw new Error(users?.error);
      }

      if (users && users.length > 0) {
        return {
          exists: true,
          user: users[0],
        };
      }

      return {
        exists: false,
      };
    } catch (error) {
      console.error("Error checking if user exists:", error.message);
      return {
        exists: false,
        error: error.message,
      };
    }
  },

  // ===== GET MEMBER BY USER ID =====
  getMemberByUserId: (user_id) => {
    const { members } = get();
    return members.find((member) => member.user_id === user_id);
  },

  // ===== CLEAR MEMBERS =====
  clearMembers: () => {
    set({ members: [], isLoading: false, error: null });
  },
}));

export default memberStore;
