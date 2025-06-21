"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Bot, MoreVertical, Pen, Trash2, Share2 } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import agentStore from "@/storage/agent-store";
import workspaceStore from "@/storage/workspace-store";
import SyncLoading from "@/components/layout/loading/sync-loading";
import DropdownMenu from "@/components/layout/dropdown-menu";
import RenameAgentModal from "./rename-agent-modal";
import DeleteAgentModal from "./delete-agent-modal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

const Agents = () => {
  // ======= INITIALIZE PARAMS ========
  const { workspace_id } = useParams(); // This is actually the workspace slug

  // ======= INITIALIZE STORES ========
  const { agents, isLoading, loadAgents } = agentStore();
  const { getWorkspaceBySlug } = workspaceStore();

  // ======= LOCAL STATE ========
  const [currentWorkspace, setCurrentWorkspace] = useState(null);

  // ======= LOAD AGENTS ========
  useEffect(() => {
    const loadData = async () => {
      try {
        // Convert workspace slug to ID
        const workspace = await getWorkspaceBySlug(workspace_id);
        if (workspace) {
          setCurrentWorkspace(workspace);
          // Load agents using actual workspace ID
          loadAgents(workspace.id);
        } else {
          console.error("Workspace not found for slug:", workspace_id);
        }
      } catch (error) {
        console.error("Error loading workspace and agents:", error);
      }
    };

    if (workspace_id) {
      loadData();
    }
  }, [workspace_id, loadAgents, getWorkspaceBySlug]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full -m-4">
        <SyncLoading className="h-full" />
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="flex justify-center items-center h-full -m-4">
        <p className="text-muted-foreground">No agents found</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <ScrollArea className="h-[calc(100vh-10rem)]">
        <div className="space-y-4">
          {agents.map((agent) => (
            <AgentCardItem key={agent.id} agent={agent} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

const AgentCardItem = ({ agent }) => {
  // ======= INITIALIZE STATES ========
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // ======= AGENT DATA ========
  const { id, name } = agent;

  // ======= DROPDOWN MENU ITEMS ========
  const dropdownItems = [
    {
      icon: <Pen />,
      label: "Rename",
      onClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsRenameOpen(true);
      },
    },
    {
      icon: <Trash2 />,
      label: "Delete",
      onClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDeleteOpen(true);
      },
    },
  ];

  return (
    <>
      <Link href={`agents/${id}`} className="block">
        <Card className="hover:bg-white/80 transition-colors relative">
          <CardHeader className="flex-row items-center gap-4 p-4 space-y-0">
            <i className="size-10 rounded-full bg-muted flex items-center justify-center shrink-0">
              <Bot />
            </i>
            <CardTitle className="flex-1 text-lg capitalize">{name}</CardTitle>

            {/* // ===== DROPDOWN MENU ===== */}
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="ml-auto flex items-center gap-2"
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0"
                onClick={() => handleShareAgent(id)}
              >
                <Share2 />
              </Button>

              <DropdownMenu
                items={dropdownItems}
                trigger={<MoreVertical className="h-4 w-4" />}
                triggerClassName="p-2 hover:bg-muted rounded-md"
              />
            </div>
          </CardHeader>
        </Card>
      </Link>

      {/* // ===== RENAME MODAL ===== */}
      <RenameAgentModal
        agent={agent}
        isOpen={isRenameOpen}
        setIsOpen={setIsRenameOpen}
      />

      {/* // ===== DELETE MODAL ===== */}
      <DeleteAgentModal
        agent={agent}
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
      />
    </>
  );
};

// ======= SHARE AGENT ========
export const handleShareAgent = (id) => {
  const url = `${window.location.origin}/chat?agent_id=${id}`;
  navigator.clipboard.writeText(url);
  toast.success("Chatbot URL copied");
};

export default Agents;
