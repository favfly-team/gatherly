"use client";

import Button from "@/components/layout/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleCheckBig, Share2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import agentStore from "@/storage/agent-store";
import userStore from "@/storage/user-store";

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
    { value: "flows", label: "Flows" },
    { value: "playground", label: "Playground" },
    { value: "settings", label: "Settings" },
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
        <ShareAgent />
        <PublishAgent />
      </div>
    </div>
  );
};

const AgentName = () => {
  // ===== PARAMS =====
  const { agent_id } = useParams();

  // ===== STORE =====
  const { loadAgent } = agentStore();

  // ===== STATE =====
  const [agentName, setAgentName] = useState("Loading...");

  // ===== LOAD AGENT NAME =====
  useEffect(() => {
    const loadAgentName = async () => {
      if (!agent_id) return;

      try {
        const agent = await loadAgent(agent_id);
        setAgentName(agent.name || "Unnamed Agent");
      } catch (error) {
        console.error("Error loading agent name:", error);
        setAgentName("Unknown Agent");
      }
    };

    loadAgentName();
  }, [agent_id, loadAgent]);

  return (
    <div className="w-1/3">
      <h3 className="font-medium truncate">{agentName}</h3>
    </div>
  );
};

const ShareAgent = () => {
  return (
    <Button variant="outline" size="sm">
      <Share2 className="h-4 w-4" />
      Share
    </Button>
  );
};

const PublishAgent = () => {
  // ===== PARAMS =====
  const { agent_id } = useParams();

  // ===== STORES =====
  const { loadAgent, publishAgent, agent } = agentStore();
  const { user } = userStore();

  // ===== STATE =====
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  // ===== LOAD AGENT =====
  useEffect(() => {
    const loadCurrentAgent = async () => {
      if (!agent_id) return;

      try {
        setIsLoading(true);
        await loadAgent(agent_id);
      } catch (error) {
        console.error("Error loading agent:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCurrentAgent();
  }, [agent_id, loadAgent]);

  // ===== HANDLE PUBLISH =====
  const handlePublish = async () => {
    if (!agent_id || !user?.id) {
      toast.error("Unable to publish. Please try again.");
      return;
    }

    try {
      setIsPublishing(true);
      await publishAgent(agent_id);
    } catch (error) {
      console.error("Error publishing agent:", error);
      toast.error("Failed to publish agent");
    } finally {
      setIsPublishing(false);
    }
  };

  // ===== BUTTON STATE =====
  const isPublished = agent?.currentVersion?.status === "published";
  const isDraft = agent?.currentVersion?.status === "draft";
  const isDisabled = isLoading || !isDraft || isPublishing;

  return (
    <Button
      size="sm"
      disabled={isDisabled}
      onClick={handlePublish}
      isLoading={isLoading || isPublishing}
    >
      <CircleCheckBig className="h-4 w-4" />
      {isPublished ? "Published" : "Publish"}
    </Button>
  );
};

export default AgentLayout;
