"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Bot, MoreVertical, Pen, Share, Share2, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import agentStore from "@/storage/agent-store";
import SyncLoading from "@/components/layout/loading/sync-loading";
import DropdownMenu from "@/components/layout/dropdown-menu";
import RenameAgentModal from "./rename-agent-modal";
import DeleteAgentModal from "./delete-agent-modal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Agents = () => {
  // ======= INITIALIZE PARAMS ========
  const { workspace_id } = useParams();

  // ======= INITIALIZE STORE ========
  const { agents, isLoading, loadAgents } = agentStore();

  // ======= LOAD AGENTS ========
  useEffect(() => {
    loadAgents(workspace_id);
  }, [workspace_id, loadAgents]);

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
    <div className="space-y-4 max-w-2xl mx-auto">
      {agents.map((agent) => (
        <AgentCardItem key={agent.id} agent={agent} />
      ))}
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

  // ======= SHARE AGENT ========
  const shareAgent = () => {
    const url = `${window.location.origin}/chatbot/${id}`;
    navigator.clipboard.writeText(url);
    toast.success("Chatbot URL copied");
  };

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
                onClick={shareAgent}
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

export default Agents;
