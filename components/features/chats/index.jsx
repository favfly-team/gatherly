"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  MoreVertical,
  Pen,
  Trash2,
  MessageCircle,
  FileText,
} from "lucide-react";
import RenameChatModal from "./rename-chat-modal";
import DeleteChatModal from "./delete-chat-modal";
import DropdownMenu from "@/components/layout/dropdown-menu";
import chatStore from "@/storage/chat-store";
import SyncLoading from "@/components/layout/loading/sync-loading";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { downloadChatPDF } from "@/lib/pdf-generator";
import { ScrollArea } from "@/components/ui/scroll-area";

const Chats = () => {
  const { agent_id } = useParams();
  const { chats, isLoading, loadChats } = chatStore();

  useEffect(() => {
    if (agent_id) loadChats(agent_id);
  }, [agent_id, loadChats]);

  if (isLoading) {
    return <SyncLoading className="h-full bg-accent" />;
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
      <Card className="flex flex-col gap-2 p-4 shadow-none rounded-lg border border-muted bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="p-2 rounded-full bg-muted-foreground/10 text-black/80">
              <MessageCircle />
            </i>
            <span className="font-semibold text-lg">{chat.name}</span>
          </div>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="[&_svg]:size-5"
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              title="Download as PDF"
            >
              <FileText />
            </Button>

            {/* // ===== DROPDOWN MENU ===== */}
            <DropdownMenu
              items={dropdownItems}
              trigger={<MoreVertical className="h-4 w-4" />}
              triggerClassName="p-2 hover:bg-muted rounded-md"
            />
          </div>
        </div>
        <div className="flex justify-end items-center text-xs text-muted-foreground gap-4 mt-2">
          {chat?.created_at
            ? formatDistanceToNow(new Date(chat.created_at), {
                addSuffix: true,
              })
            : "-"}
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
