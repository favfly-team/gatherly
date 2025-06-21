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

const agentStore = create((set, get) => ({
  // ===== STATE =====
  agents: [], // All agents list
  agent: null, // Current single agent

  // ===== LOAD AGENTS =====
  loadAgents: async (workspace_id) => {
    try {
      const res = await loadAllDataAction({
        table_name: "bots",
        query: { where: { workspace_id } },
      });

      if (res?.error) throw new Error(res?.error);

      set({ agents: res.sort(sortBy("-created_at")) || [] });
    } catch (error) {
      console.error("Error loading agents:", error.message);
      throw error;
    }
  },

  // ===== CREATE AGENT =====
  createAgent: async (data) => {
    try {
      const {
        name,
        workspace_id,
        system_prompt = "",
        initial_message = "",
        created_by_id,
      } = data;

      if (!created_by_id) throw new Error("User ID is required");

      // Create bot
      const bot = await createDataAction({
        table_name: "bots",
        query: {
          data: {
            workspace_id,
            name,
            created_at: Date.now(),
            updated_at: Date.now(),
            current_version_id: null,
            published_version_id: null,
          },
        },
      });

      if (bot?.error) throw new Error(bot?.error);

      // Create initial draft version
      const version = await createDataAction({
        table_name: "bot_versions",
        query: {
          data: {
            bot_id: bot.id,
            settings: {
              system_prompt: system_prompt || "",
              initial_message:
                initial_message || "Hello! How can I help you today?",
            },
            status: "draft",
            created_by_id,
            created_at: Date.now(),
            updated_at: Date.now(),
            published_at: null,
          },
        },
      });

      if (version?.error) {
        // Rollback bot creation
        await deleteDataAction({
          table_name: "bots",
          query: { where: { id: bot.id } },
        });
        throw new Error(version?.error);
      }

      // Update bot with version ID
      await updateDataAction({
        table_name: "bots",
        query: {
          where: { id: bot.id },
          data: { current_version_id: version.id, updated_at: Date.now() },
        },
      });

      const completeBot = { ...bot, current_version_id: version.id };

      // Update state
      set((state) => ({
        agents: [completeBot, ...state.agents],
      }));

      return completeBot;
    } catch (error) {
      console.error("Error creating agent:", error.message);
      throw error;
    }
  },

  // ===== LOAD AGENT =====
  loadAgent: async (agent_id) => {
    try {
      // Load bot
      const bot = await loadSingleDataAction({
        table_name: "bots",
        id: agent_id,
      });

      if (bot?.error) throw new Error(bot?.error);
      if (!bot.current_version_id)
        throw new Error("Agent has no current version");

      // Load current version
      const currentVersion = await loadSingleDataAction({
        table_name: "bot_versions",
        id: bot.current_version_id,
      });

      if (currentVersion?.error) throw new Error(currentVersion?.error);

      const agentData = {
        ...bot,
        currentVersion,
        settings: currentVersion.settings,
      };

      set({ agent: agentData });
      return agentData;
    } catch (error) {
      console.error("Error loading agent:", error.message);
      throw error;
    }
  },

  // ===== UPDATE AGENT AS DRAFT =====
  updateAgentAsDraft: async (agent_id, settings, created_by_id) => {
    try {
      if (!created_by_id) throw new Error("User ID is required");

      // Find current draft version
      const versions = await loadAllDataAction({
        table_name: "bot_versions",
        query: {
          where: { bot_id: agent_id, status: "draft" },
        },
      });

      const existingDraft =
        versions?.length > 0
          ? versions.sort((a, b) => b.created_at - a.created_at)[0]
          : null;

      let version;

      if (existingDraft) {
        // Update existing draft
        await updateDataAction({
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

        version = {
          ...existingDraft,
          settings: {
            system_prompt: settings.system_prompt || "",
            initial_message:
              settings.initial_message || "Hello! How can I help you today?",
          },
          updated_at: Date.now(),
        };
      } else {
        // Create new draft
        version = await createDataAction({
          table_name: "bot_versions",
          query: {
            data: {
              bot_id: agent_id,
              settings: {
                system_prompt: settings.system_prompt || "",
                initial_message:
                  settings.initial_message ||
                  "Hello! How can I help you today?",
              },
              status: "draft",
              created_by_id,
              created_at: Date.now(),
              updated_at: Date.now(),
              published_at: null,
            },
          },
        });

        if (version?.error) throw new Error(version?.error);

        // Update bot's current_version_id
        await updateDataAction({
          table_name: "bots",
          query: {
            where: { id: agent_id },
            data: { current_version_id: version.id, updated_at: Date.now() },
          },
        });
      }

      // Update current agent in state
      set((state) => ({
        agent:
          state.agent?.id === agent_id
            ? {
                ...state.agent,
                currentVersion: version,
                settings: version.settings,
              }
            : state.agent,
      }));

      return version;
    } catch (error) {
      console.error("Error updating agent as draft:", error.message);
      throw error;
    }
  },

  // ===== PUBLISH AGENT =====
  publishAgent: async (agent_id) => {
    try {
      const state = get();
      const version_id = state.agent?.currentVersion?.id;

      if (!version_id) throw new Error("No current version to publish");

      // Update version status to published
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

      // Update state
      set((state) => ({
        agent:
          state.agent?.id === agent_id
            ? {
                ...state.agent,
                published_version_id: version_id,
                currentVersion: {
                  ...state.agent.currentVersion,
                  status: "published",
                  published_at: Date.now(),
                },
              }
            : state.agent,
        agents: state.agents.map((agent) =>
          agent.id === agent_id
            ? { ...agent, published_version_id: version_id }
            : agent
        ),
      }));
    } catch (error) {
      console.error("Error publishing agent:", error.message);
      throw error;
    }
  },

  // ===== GET PUBLISHED VERSION =====
  getPublishedVersion: async (agent_id) => {
    try {
      // Load bot
      const bot = await loadSingleDataAction({
        table_name: "bots",
        id: agent_id,
      });

      if (bot?.error) throw new Error(bot?.error);
      if (!bot.published_version_id)
        throw new Error("Agent has no published version");

      // Load published version
      const publishedVersion = await loadSingleDataAction({
        table_name: "bot_versions",
        id: bot.published_version_id,
      });

      if (publishedVersion?.error) throw new Error(publishedVersion?.error);

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

  // ===== DELETE AGENT =====
  deleteAgent: async (agent_id) => {
    try {
      // Delete all chats
      const chats = await loadAllDataAction({
        table_name: "chats",
        query: { where: { bot_id: agent_id } },
      });

      if (chats?.length > 0) {
        for (const chat of chats) {
          await deleteDataAction({
            table_name: "chats",
            query: { where: { id: chat.id } },
          });
        }
      }

      // Delete all versions
      const versions = await loadAllDataAction({
        table_name: "bot_versions",
        query: { where: { bot_id: agent_id } },
      });

      if (versions?.length > 0) {
        for (const version of versions) {
          await deleteDataAction({
            table_name: "bot_versions",
            query: { where: { id: version.id } },
          });
        }
      }

      // Delete bot
      await deleteDataAction({
        table_name: "bots",
        query: { where: { id: agent_id } },
      });

      // Update state
      set((state) => ({
        agents: state.agents.filter((agent) => agent.id !== agent_id),
        agent: state.agent?.id === agent_id ? null : state.agent,
      }));
    } catch (error) {
      console.error("Error deleting agent:", error.message);
      throw error;
    }
  },
}));

export default agentStore;
