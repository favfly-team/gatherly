"use server";

import {
  createDataAction,
  loadAllDataAction,
  updateDataAction,
  loadSingleDataAction,
} from "@/components/actions/data-actions";
import { errorHandler } from "@/hooks/error";
import { adminAuth } from "@/firebase/firebase-admin";

const createTeamMemberAction = async (values) => {
  try {
    const { display_name, email, password, user_id, workspace_id } = values;

    // ===== CREATE TEAM MEMBER FUNCTION =====
    const createTeamMemberDb = async (userId, workspace_id) => {
      // ===== CHECK IF USER IS ALREADY A MEMBER OF THE WORKSPACE =====
      const existingMembers = await loadAllDataAction({
        table_name: "workspace_members",
        query: {
          where: {
            workspace_id: workspace_id,
            user_id: userId,
          },
        },
      });

      if (existingMembers?.error) {
        throw existingMembers.error;
      }

      if (existingMembers && existingMembers.length > 0) {
        throw new Error("User is already a member of this workspace");
      }

      // ===== CREATE WORKSPACE MEMBER =====
      const teamMember = await createDataAction({
        table_name: "workspace_members",
        query: {
          data: {
            workspace_id,
            user_id: userId,
            role: "member",
            status: "active",
            created_at: Date.now(),
            updated_at: Date.now(),
          },
        },
      });

      if (teamMember?.error) {
        throw teamMember.error;
      }

      // ===== ADD USER TO WORKSPACE MEMBERS ARRAY =====
      // Get current workspace to update the workspace_members array
      const workspace = await loadSingleDataAction({
        table_name: "workspaces",
        id: workspace_id,
      });

      if (workspace?.error) {
        throw workspace.error;
      }

      if (workspace) {
        const currentMembers = workspace.workspace_members || [];

        // Add user to workspace_members array if not already present
        if (!currentMembers.includes(userId)) {
          const updatedMembers = [...currentMembers, userId];

          await updateDataAction({
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
        }
      }

      return teamMember;
    };

    // Case 1: Existing user - just add to workspace
    if (user_id) {
      const teamMember = await createTeamMemberDb(user_id, workspace_id);
      return teamMember;
    }

    // Case 2: New user - create user first, then add to workspace
    if (!email || !display_name || !password) {
      throw new Error(
        "Email, display name and password are required for new users"
      );
    }

    // Check if user already exists with this email
    const existingUsers = await loadAllDataAction({
      table_name: "users",
      query: {
        where: {
          email,
        },
      },
    });

    if (existingUsers?.error) {
      throw existingUsers.error;
    }

    if (existingUsers && existingUsers.length > 0) {
      throw new Error(
        "User with this email already exists. Please add them using their existing account."
      );
    }

    // Create user in Firebase Auth using Admin SDK
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: display_name,
      emailVerified: true, // Auto-verify for admin created users
    });

    if (!userRecord) {
      throw new Error("Failed to create user in Firebase Auth");
    }

    // Create user profile in Firestore
    const newUser = await createDataAction({
      table_name: "users",
      id: userRecord.uid,
      query: {
        data: {
          display_name,
          email,
          profile_image: "",
          created_at: Date.now(),
          updated_at: Date.now(),
        },
      },
    });

    if (newUser?.error) {
      // If user profile creation fails, delete the auth user to maintain consistency
      try {
        await adminAuth.deleteUser(userRecord.uid);
      } catch (deleteError) {
        console.error(
          "Failed to cleanup auth user after profile creation error:",
          deleteError
        );
      }
      throw newUser.error;
    }

    // Add user to workspace
    const teamMember = await createTeamMemberDb(userRecord.uid, workspace_id);

    if (teamMember?.error) {
      // If workspace member creation fails, cleanup both auth user and profile
      try {
        await adminAuth.deleteUser(userRecord.uid);
      } catch (deleteError) {
        console.error(
          "Failed to cleanup auth user after team member creation error:",
          deleteError
        );
      }
      throw teamMember.error;
    }

    return teamMember;
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

export default createTeamMemberAction;
