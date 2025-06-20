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
  Trash2,
} from "lucide-react";
import CreateFlowModal from "./create-flow-modal";
import RenameFlowModal from "./rename-flow-modal";
import DeleteFlowModal from "./delete-flow-modal";
import DropdownMenu from "@/components/layout/dropdown-menu";
import flowStore from "@/storage/flow-store";
import SyncLoading from "@/components/layout/loading/sync-loading";
import { toast } from "sonner";
import { format } from "date-fns";
import { downloadChatPDF } from "@/lib/pdf-generator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { handleShareAgent } from "../agents";

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
        <ScrollArea className="h-[calc(100vh-10rem)]">
          <div className="space-y-4 mt-4">
            {flows.map((flow) => (
              <FlowCardItem key={flow.id} flow={flow} />
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex justify-center items-center h-32 text-muted-foreground">
          No flows found.
        </div>
      )}
    </div>
  );
};

const FlowsHeader = () => {
  // ======= INITIALIZE PARAMS ========
  const { agent_id } = useParams();

  return (
    <div className="flex items-center justify-between pb-4 bg-white">
      <h3 className="text-2xl font-bold">Flows</h3>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShareAgent(agent_id)}
        >
          <Share2 /> Share Bot
        </Button>

        <CreateFlowModal />
      </div>
    </div>
  );
};

const FlowCardItem = ({ flow }) => {
  // ======= INITIALIZE STATES ========
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // ===== COPY ALL CONVERSATION =====
  const copyAllChatConversation = () => {
    const messages = flow.messages;

    const conversation = messages.map((message) => {
      return `${message.role}: ${message.content}`;
    });

    navigator.clipboard.writeText(conversation.join("\n\n"));

    toast.success("Conversation copied to clipboard");
  };

  // ===== DOWNLOAD PDF =====
  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);

      // Make sure we have messages to download
      if (!flow.messages || flow.messages.length === 0) {
        toast.error("No messages to download");
        return;
      }

      // Clean messages to remove any GATHERLY_DONE markers
      const messages = flow.messages;

      await downloadChatPDF(messages, `gatherly-chat-${flow.id}`);
      toast.success("Chat downloaded as PDF");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download PDF");
    } finally {
      setIsDownloading(false);
    }
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
              title="Copy conversation"
            >
              <Copy />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="[&_svg]:size-5"
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              title="Download as PDF"
            >
              <FileDown />
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
              title="Share flow"
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

      {/* // ===== DELETE MODAL ===== */}
      <DeleteFlowModal
        flow={flow}
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
      />
    </>
  );
};

export default Flows;
