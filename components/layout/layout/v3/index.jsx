"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleCheckBig, Users, Loader2, Share2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import agentStore from "@/storage/agent-store";
import userStore from "@/storage/user-store";
import { handleShareAgent } from "@/components/features/agents";

const AgentLayout = ({ children }) => {
  return (
    <Tabs defaultValue="flows" className="flex flex-col bg-white w-full h-full">
      <Header />

      <div className="w-full h-full p-4">{children}</div>
    </Tabs>
  );
};

const Header = () => {
  // ===== TABS =====
  const tabs = [
    {
      value: "flows",
      label: "Flows",
    },
    {
      value: "playground",
      label: "Playground",
    },
    {
      value: "settings",
      label: "Settings",
    },
  ];

  return (
    <div className="bg-white border-b h-12 flex items-center px-4">
      {/* ===== AGENT NAME ===== */}
      <AgentName />

      {/* ===== TABS ===== */}
      <TabsList className="w-full rounded-none h-full bg-white">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="data-[state=active]:shadow-none data-[state=active]:hover:bg-muted hover:bg-muted relative before:content-none data-[state=active]:before:content-[''] before:absolute before:w-full before:h-[2px] before:bg-primary before:-bottom-[10px] before:left-0"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* ===== ACTIONS ===== */}
      <div className="w-1/3 flex justify-end items-center gap-2">
        {/* ===== SHARE AGENT ===== */}
        <ShareAgent />

        {/* ===== PUBLISH AGENT ===== */}
        <PublishAgent />
      </div>
    </div>
  );
};

const AgentName = () => {
  // ===== GET AGENT ID =====
  const { agent_id } = useParams();

  // ===== STORES =====
  const { loadAgentWithVersion } = agentStore();

  // ===== LOCAL STATE =====
  const [agentName, setAgentName] = useState("Loading...");

  // ===== LOAD AGENT NAME =====
  useEffect(() => {
    const loadAgentName = async () => {
      if (!agent_id) return;

      try {
        const data = await loadAgentWithVersion(agent_id);
        setAgentName(data.bot.name || "Unnamed Agent");
      } catch (error) {
        console.error("Error loading agent name:", error);
        setAgentName("Unknown Agent");
      }
    };

    loadAgentName();
  }, [agent_id, loadAgentWithVersion]);

  return (
    <div className="w-1/3">
      <h3 className="font-medium truncate">{agentName}</h3>
    </div>
  );
};

const ShareAgent = () => {
  // ===== GET AGENT ID =====
  const { agent_id } = useParams();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => handleShareAgent(agent_id)}
    >
      <Share2 className="h-4 w-4" />
      Share Agent
    </Button>
  );
};

const PublishAgent = () => {
  // ===== GET AGENT ID =====
  const { agent_id } = useParams();

  // ===== STORES =====
  const {
    loadAgentWithVersion,
    publishAgentVersion,
    getCurrentVersion,
    isUpdating,
    currentAgentVersions,
  } = agentStore();
  const { user } = userStore();

  // ===== LOCAL STATE =====
  const [currentVersion, setCurrentVersion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  // ===== LOAD AGENT VERSION STATUS =====
  useEffect(() => {
    const loadVersionStatus = async () => {
      if (!agent_id) return;

      try {
        setIsLoading(true);
        const data = await loadAgentWithVersion(agent_id);
        setCurrentVersion(data.currentVersion);
      } catch (error) {
        console.error("Error loading agent version:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVersionStatus();
  }, [agent_id, loadAgentWithVersion]);

  // ===== SYNC WITH STORE'S CURRENT VERSION =====
  useEffect(() => {
    if (agent_id && currentAgentVersions[agent_id]) {
      setCurrentVersion(currentAgentVersions[agent_id]);
    }
  }, [agent_id, currentAgentVersions]);

  // ===== HANDLE PUBLISH =====
  const handlePublish = async () => {
    if (!agent_id || !currentVersion?.id || !user?.id) {
      toast.error("Unable to publish. Please try again.");
      return;
    }

    try {
      setIsPublishing(true);
      await publishAgentVersion(agent_id, currentVersion.id);

      // Update local state
      setCurrentVersion((prev) => ({
        ...prev,
        status: "published",
        published_at: Date.now(),
      }));

      // Remove success toast - only show errors
    } catch (error) {
      console.error("Error publishing agent:", error);
      toast.error("Failed to publish agent");
    } finally {
      setIsPublishing(false);
    }
  };

  // ===== DETERMINE BUTTON STATE =====
  const isPublished = currentVersion?.status === "published";
  const isDraft = currentVersion?.status === "draft";
  const isDisabled = isLoading || !isDraft || isPublishing || isUpdating;

  // ===== LOADING STATE =====
  if (isLoading) {
    return (
      <Button size="sm" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  return (
    <Button size="sm" disabled={isDisabled} onClick={handlePublish}>
      {isPublishing ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Publishing...
        </>
      ) : (
        <>
          <CircleCheckBig className="h-4 w-4" />
          {isPublished ? "Published" : "Publish"}
        </>
      )}
    </Button>
  );
};

export default AgentLayout;
