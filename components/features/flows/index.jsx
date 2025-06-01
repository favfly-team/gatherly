"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Share2, Workflow, FileDown } from "lucide-react";
import CreateFlowModal from "./create-flow-modal";
import flowStore from "@/storage/flow-store";
import SyncLoading from "@/components/layout/loading/sync-loading";

const Flows = () => {
  const { agent_id } = useParams();
  const { flows, isLoading, loadFlows } = flowStore();

  useEffect(() => {
    if (agent_id) loadFlows(agent_id);
  }, [agent_id, loadFlows]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full -m-6">
        <SyncLoading className="h-full" />
      </div>
    );
  }

  if (flows.length === 0) {
    return (
      <div className="flex justify-center items-center h-32 text-muted-foreground">
        No flows found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <FlowsHeader />

      <div className="space-y-4 mt-4">
        {flows.map((flow) => (
          <FlowCardItem key={flow.id} flow={flow} />
        ))}
      </div>
    </div>
  );
};

const FlowsHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-2xl font-bold">Flows</h3>
      <CreateFlowModal />
    </div>
  );
};

const FlowCardItem = ({ flow }) => {
  return (
    <Card className="flex flex-col gap-2 p-4 shadow-md rounded-lg border border-muted bg-white hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <i className="p-2 rounded-full bg-muted-foreground/10 text-primary">
            <Workflow />
          </i>
          <span className="font-semibold text-lg">{flow.name}</span>
        </div>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="[&_svg]:size-5"
            disabled
          >
            <FileDown />
          </Button>
          <Button variant="ghost" size="icon" className="[&_svg]:size-5">
            <Share2 />
          </Button>
        </div>
      </div>
      <div className="flex items-center text-sm text-muted-foreground gap-4 mt-2">
        <span>
          <span className="font-medium">Date:</span>{" "}
          {flow.created_at
            ? new Date(flow.created_at).toLocaleDateString()
            : "-"}
        </span>
        <span>
          <span className="font-medium">Expiry:</span>{" "}
          {flow.expires_at
            ? new Date(flow.expires_at).toLocaleDateString()
            : "-"}
        </span>
      </div>
    </Card>
  );
};

export default Flows;
