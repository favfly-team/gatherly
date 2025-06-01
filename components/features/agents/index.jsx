"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Bot } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import agentStore from "@/storage/agent-store";
import SyncLoading from "@/components/layout/loading/sync-loading";

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4">
      {agents.map((agent) => (
        <AgentCardItem key={agent.id} agent={agent} />
      ))}
    </div>
  );
};

const AgentCardItem = ({ agent }) => {
  const { id, name } = agent;

  return (
    <Link href={`agents/${id}`}>
      <Card className="aspect-square hover:bg-white/80 transition-colors">
        <CardHeader className="flex justify-center items-center gap-2 p-4 h-full">
          <i className="size-10 rounded-full bg-muted-foreground/20 flex items-center justify-center">
            <Bot />
          </i>
          <CardTitle>{name}</CardTitle>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default Agents;
