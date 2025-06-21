// ===== AGENT STORE =====
import { create } from "zustand";
import {
  loadAllDataAction,
  loadSingleDataAction,
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
  currentAgentVersions: {}, // Store versions for loaded agents

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

  // ===== CREATE AGENT WITH INITIAL VERSION =====
  createAgent: async (data) => {
    try {
      const {
        name,
        workspace_id,
        system_prompt = "",
        initial_message = "",
        created_by_id,
      } = data;

      // Validate required fields
      if (!created_by_id) {
        throw new Error("User ID is required to create an agent");
      }

      // Step 1: Create the bot document
      const botData = {
        workspace_id, // This should be the workspace table ID, not slug
        name,
        created_at: Date.now(),
        updated_at: Date.now(),
        // Version IDs will be set after creating the initial version
        current_version_id: null,
        published_version_id: null,
      };

      const bot = await createDataAction({
        table_name: "bots",
        query: {
          data: botData,
        },
      });

      if (bot?.error) {
        throw new Error(bot?.error);
      }

      // Step 2: Create the initial draft version
      const versionData = {
        bot_id: bot.id,
        settings: {
          system_prompt: system_prompt || "",
          initial_message:
            initial_message || "Hello! How can I help you today?",
        },
        status: "draft",
        created_by_id: created_by_id, // Use actual user ID from users table
        created_at: Date.now(),
        updated_at: Date.now(),
        published_at: null,
      };

      const version = await createDataAction({
        table_name: "bot_versions",
        query: {
          data: versionData,
        },
      });

      if (version?.error) {
        // Rollback: Delete the bot if version creation fails
        await deleteDataAction({
          table_name: "bots",
          query: { where: { id: bot.id } },
        });
        throw new Error(version?.error);
      }

      // Step 3: Update bot with current_version_id
      const updatedBot = await updateDataAction({
        table_name: "bots",
        query: {
          where: { id: bot.id },
          data: {
            current_version_id: version.id,
            updated_at: Date.now(),
          },
        },
      });

      if (updatedBot?.error) {
        throw new Error(updatedBot?.error);
      }

      // Combine bot data with version reference for local state
      const completeBotData = {
        ...bot,
        current_version_id: version.id,
        published_version_id: null,
      };

      // Update agents list
      set((state) => ({
        agents: [completeBotData, ...state.agents],
        currentAgentVersions: {
          ...state.currentAgentVersions,
          [bot.id]: version,
        },
      }));

      toast.success("Agent created successfully");
      return completeBotData;
    } catch (error) {
      console.error("Error creating agent:", error.message);
      throw error;
    }
  },

  // ===== LOAD AGENT WITH CURRENT VERSION =====
  loadAgentWithVersion: async (agent_id) => {
    try {
      // Load bot data
      const bot = await loadSingleDataAction({
        table_name: "bots",
        id: agent_id,
      });

      if (bot?.error) {
        throw new Error(bot?.error);
      }

      if (!bot.current_version_id) {
        throw new Error("Agent has no current version");
      }

      // Load current version
      const currentVersion = await loadSingleDataAction({
        table_name: "bot_versions",
        id: bot.current_version_id,
      });

      if (currentVersion?.error) {
        throw new Error(currentVersion?.error);
      }

      // Update local state
      set((state) => ({
        currentAgentVersions: {
          ...state.currentAgentVersions,
          [agent_id]: currentVersion,
        },
      }));

      return {
        bot,
        currentVersion,
        settings: currentVersion.settings,
      };
    } catch (error) {
      console.error("Error loading agent with version:", error.message);
      throw error;
    }
  },

  // ===== FIND CURRENT DRAFT VERSION FOR BOT =====
  findCurrentDraftVersion: async (bot_id) => {
    try {
      const versions = await loadAllDataAction({
        table_name: "bot_versions",
        query: {
          where: {
            bot_id: bot_id,
            status: "draft",
          },
        },
      });

      if (versions && versions.length > 0) {
        // Return the most recent draft (in case there are multiple)
        return versions.sort((a, b) => b.created_at - a.created_at)[0];
      }

      return null;
    } catch (error) {
      console.error("Error finding current draft version:", error.message);
      return null;
    }
  },

  // ===== UPDATE AGENT SETTINGS (UPDATE EXISTING DRAFT OR CREATE NEW) =====
  updateAgentSettings: async (agent_id, settings, created_by_id) => {
    try {
      set({ isUpdating: true });

      // Validate required fields
      if (!created_by_id) {
        throw new Error("User ID is required to update agent settings");
      }

      // Load current bot data
      const bot = await loadSingleDataAction({
        table_name: "bots",
        id: agent_id,
      });

      if (bot?.error) {
        throw new Error(bot?.error);
      }

      // Check if there's already a draft version
      const existingDraft = await get().findCurrentDraftVersion(agent_id);

      let version;

      if (existingDraft) {
        // Update existing draft version
        const updateResult = await updateDataAction({
          table_name: "bot_versions",
          query: {
            where: { id: existingDraft.id },
            data: {
              settings: {
                system_prompt: settings.system_prompt || "",
                initial_message:
                  settings.initial_message ||
                  "Hello! How can I help you today?",
              },
              updated_at: Date.now(),
            },
          },
        });

        if (updateResult?.error) {
          throw new Error(updateResult?.error);
        }

        // Create updated version object for local state
        version = {
          ...existingDraft,
          settings: {
            system_prompt: settings.system_prompt || "",
            initial_message:
              settings.initial_message || "Hello! How can I help you today?",
          },
          updated_at: Date.now(),
        };

        toast.success("Draft updated successfully");
      } else {
        // Create new draft version
        const newVersionData = {
          bot_id: agent_id,
          settings: {
            system_prompt: settings.system_prompt || "",
            initial_message:
              settings.initial_message || "Hello! How can I help you today?",
          },
          status: "draft",
          created_by_id: created_by_id,
          created_at: Date.now(),
          updated_at: Date.now(),
          published_at: null,
        };

        version = await createDataAction({
          table_name: "bot_versions",
          query: {
            data: newVersionData,
          },
        });

        if (version?.error) {
          throw new Error(version?.error);
        }

        // Update bot's current_version_id to point to new draft
        await updateDataAction({
          table_name: "bots",
          query: {
            where: { id: agent_id },
            data: {
              current_version_id: version.id,
              updated_at: Date.now(),
            },
          },
        });

        toast.success("New draft created successfully");
      }

      // Update local state
      set((state) => ({
        currentAgentVersions: {
          ...state.currentAgentVersions,
          [agent_id]: version,
        },
      }));

      return version;
    } catch (error) {
      console.error("Error updating agent settings:", error.message);
      throw error;
    } finally {
      set({ isUpdating: false });
    }
  },

  // ===== PUBLISH AGENT VERSION =====
  publishAgentVersion: async (agent_id, version_id) => {
    try {
      set({ isUpdating: true });

      // Update the version status to published
      await updateDataAction({
        table_name: "bot_versions",
        query: {
          where: { id: version_id },
          data: {
            status: "published",
            published_at: Date.now(),
            updated_at: Date.now(),
          },
        },
      });

      // Update bot's published_version_id
      await updateDataAction({
        table_name: "bots",
        query: {
          where: { id: agent_id },
          data: {
            published_version_id: version_id,
            updated_at: Date.now(),
          },
        },
      });

      // Update local state
      set((state) => {
        const updatedAgents = state.agents.map((agent) =>
          agent.id === agent_id
            ? { ...agent, published_version_id: version_id }
            : agent
        );

        return {
          agents: updatedAgents,
          currentAgentVersions: {
            ...state.currentAgentVersions,
            [agent_id]: {
              ...state.currentAgentVersions[agent_id],
              status: "published",
              published_at: Date.now(),
            },
          },
        };
      });

      toast.success("Agent version published successfully");
    } catch (error) {
      console.error("Error publishing agent version:", error.message);
      throw error;
    } finally {
      set({ isUpdating: false });
    }
  },

  // ===== GET PUBLISHED VERSION FOR PUBLIC ACCESS =====
  getPublishedVersion: async (agent_id) => {
    try {
      // Load bot data
      const bot = await loadSingleDataAction({
        table_name: "bots",
        id: agent_id,
      });

      if (bot?.error) {
        throw new Error(bot?.error);
      }

      if (!bot.published_version_id) {
        throw new Error("Agent has no published version");
      }

      // Load published version
      const publishedVersion = await loadSingleDataAction({
        table_name: "bot_versions",
        id: bot.published_version_id,
      });

      if (publishedVersion?.error) {
        throw new Error(publishedVersion?.error);
      }

      return {
        bot,
        publishedVersion,
        settings: publishedVersion.settings,
      };
    } catch (error) {
      console.error("Error loading published version:", error.message);
      throw error;
    }
  },

  // ===== UPDATE AGENT BASIC INFO (NAME ONLY) =====
  updateAgent: async (agent_id, data) => {
    try {
      set({ isUpdating: true });
      const res = await updateDataAction({
        table_name: "bots",
        query: {
          where: {
            id: agent_id,
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
        agents: state.agents.map((agent) =>
          agent.id === agent_id
            ? { ...agent, ...data, updated_at: Date.now() }
            : agent
        ),
      }));

      toast.success("Agent updated successfully");
    } catch (error) {
      console.error("Error updating agent:", error.message);
      throw error;
    } finally {
      set({ isUpdating: false });
    }
  },

  // ===== DELETE AGENT AND ALL VERSIONS =====
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

      // Delete all flows
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

      // Load and delete all bot versions
      const versions = await loadAllDataAction({
        table_name: "bot_versions",
        query: {
          where: {
            bot_id: agent_id,
          },
        },
      });

      if (versions && versions.length > 0) {
        for (const version of versions) {
          await deleteDataAction({
            table_name: "bot_versions",
            query: {
              where: {
                id: version.id,
              },
            },
          });
        }
      }

      // Finally, delete the bot
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

      // Remove from local state
      set((state) => ({
        agents: state.agents.filter((agent) => agent.id !== agent_id),
        currentAgentVersions: {
          ...state.currentAgentVersions,
          [agent_id]: undefined,
        },
      }));

      toast.success("Agent deleted successfully");
    } catch (error) {
      console.error("Error deleting agent:", error.message);
      throw error;
    } finally {
      set({ isDeleting: false });
    }
  },

  // ===== GET CURRENT VERSION FROM LOCAL STATE =====
  getCurrentVersion: (agent_id) => {
    const state = get();
    return state.currentAgentVersions[agent_id];
  },
}));

export default agentStore;
