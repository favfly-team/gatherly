"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Share2,
  Workchat,
  FileDown,
  Copy,
  MoreVertical,
  Pen,
  Trash2,
} from "lucide-react";
import CreateChatModal from "./create-chat-modal";
import RenameChatModal from "./rename-chat-modal";
import DeleteChatModal from "./delete-chat-modal";
import DropdownMenu from "@/components/layout/dropdown-menu";
import chatStore from "@/storage/chat-store";
import SyncLoading from "@/components/layout/loading/sync-loading";
import { toast } from "sonner";
import { format } from "date-fns";
import { downloadChatPDF } from "@/lib/pdf-generator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { handleShareAgent } from "../agents";

const Chats = () => {
  const { agent_id } = useParams();
  const { chats, isLoading, loadChats } = chatStore();

  useEffect(() => {
    if (agent_id) loadChats(agent_id);
  }, [agent_id, loadChats]);

  if (isLoading) {
    return <SyncLoading className="h-full" />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {chats.length > 0 ? (
        <ScrollArea className="h-[calc(100vh-10rem)]">
          <div className="space-y-4 mt-4">
            {chats.map((chat) => (
              <ChatCardItem key={chat.id} chat={chat} />
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex justify-center items-center h-32 text-muted-foreground">
          No chats found.
        </div>
      )}
    </div>
  );
};

const ChatCardItem = ({ chat }) => {
  // ======= INITIALIZE STATES ========
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // ===== COPY ALL CONVERSATION =====
  const copyAllChatConversation = () => {
    const messages = chat.messages;

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
      if (!chat.messages || chat.messages.length === 0) {
        toast.error("No messages to download");
        return;
      }

      // Clean messages to remove any GATHERLY_DONE markers
      const messages = chat.messages;

      await downloadChatPDF(messages, `gatherly-chat-${chat.id}`);
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
              <Workchat />
            </i>
            <span className="font-semibold text-lg">{chat.name}</span>
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
                const url = `${window.location.origin}/chat/${chat.id}`;
                navigator.clipboard.writeText(url);
                toast.success("Chat URL copied to clipboard");
              }}
              title="Share chat"
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
            {chat?.created_at
              ? format(new Date(chat.created_at), "dd/MM/yyyy")
              : "-"}
          </span>
          <span>
            <span className="font-medium">Expiry:</span>{" "}
            {chat?.expires_at
              ? format(new Date(chat.expires_at), "dd/MM/yyyy")
              : "-"}
          </span>
        </div>
      </Card>

      {/* // ===== RENAME MODAL ===== */}
      <RenameChatModal
        chat={chat}
        isOpen={isRenameOpen}
        setIsOpen={setIsRenameOpen}
      />

      {/* // ===== DELETE MODAL ===== */}
      <DeleteChatModal
        chat={chat}
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
      />
    </>
  );
};

export default Chats;
