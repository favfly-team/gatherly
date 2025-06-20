"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Share2,
  Workflow,
  FileDown,
  Copy,
  MoreVertical,
  Pen,
} from "lucide-react";
import CreateFlowModal from "./create-flow-modal";
import RenameFlowModal from "./rename-flow-modal";
import DropdownMenu from "@/components/layout/dropdown-menu";
import flowStore from "@/storage/flow-store";
import SyncLoading from "@/components/layout/loading/sync-loading";
import { toast } from "sonner";
import { format } from "date-fns";

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

  return (
    <div className="max-w-4xl mx-auto">
      <FlowsHeader />

      {flows.length > 0 ? (
        <div className="space-y-4 mt-4">
          {flows.map((flow) => (
            <FlowCardItem key={flow.id} flow={flow} />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-32 text-muted-foreground">
          No flows found.
        </div>
      )}
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
  // ======= INITIALIZE STATES ========
  const [isRenameOpen, setIsRenameOpen] = useState(false);

  // ===== COPY ALL CONVERSATION =====
  const copyAllChatConversation = () => {
    const messages = flow.messages;

    const conversation = messages.map((message) => {
      return `${message.role}: ${message.content}`;
    });

    navigator.clipboard.writeText(conversation.join("\n\n"));

    toast.success("Conversation copied to clipboard");
  };

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
  ];

  return (
    <>
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
              onClick={copyAllChatConversation}
            >
              <Copy />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="[&_svg]:size-5"
              onClick={() => {
                const url = `${window.location.origin}/chat/${flow.id}`;
                navigator.clipboard.writeText(url);
                toast.success("Flow URL copied to clipboard");
              }}
            >
              <Share2 />
            </Button>

            {/* // ===== DROPDOWN MENU ===== */}
            <DropdownMenu
              items={dropdownItems}
              trigger={<MoreVertical className="h-4 w-4" />}
              triggerClassName="p-2 hover:bg-muted rounded-md"
            />
          </div>
        </div>
        <div className="flex items-center text-sm text-muted-foreground gap-4 mt-2">
          <span>
            <span className="font-medium">Date:</span>{" "}
            {flow?.created_at
              ? format(new Date(flow.created_at), "dd/MM/yyyy")
              : "-"}
          </span>
          <span>
            <span className="font-medium">Expiry:</span>{" "}
            {flow?.expires_at
              ? format(new Date(flow.expires_at), "dd/MM/yyyy")
              : "-"}
          </span>
        </div>
      </Card>

      {/* // ===== RENAME MODAL ===== */}
      <RenameFlowModal
        flow={flow}
        isOpen={isRenameOpen}
        setIsOpen={setIsRenameOpen}
      />
    </>
  );
};

export default Flows;
