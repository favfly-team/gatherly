"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import Dialog from "@/components/layout/dialog/dialog";
import Form from "@/components/layout/form-fields/form";
import chatStore from "@/storage/chat-store";

const RenameChatModal = ({ chat, isOpen, setIsOpen }) => {
  // ======= INITIALIZE PARAMS ========
  const { agent_id } = useParams();

  // ======= INITIALIZE STORE ========
  const { updateChat, loadChats } = chatStore();

  // ======= FORM FIELDS ========
  const fields = [
    {
      name: "name",
      type: "text",
      placeholder: "Enter chat name",
      validation: z
        .string()
        .nonempty("Chat name is required")
        .min(2, "Chat name must be at least 2 characters")
        .max(50, "Chat name must be less than 50 characters"),
    },
  ];

  // ======= FORM SCHEMA ========
  const formSchema = z.object(
    fields.reduce((acc, field) => {
      acc[field.name] = field.validation;
      return acc;
    }, {})
  );

  // ======= INITIALIZE FORM ========
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: chat?.name || "",
    },
  });

  // ======= FORM SUBMISSION ========
  const onSubmit = async (values) => {
    try {
      await updateChat(chat.id, {
        name: values.name,
        updated_at: Date.now(),
      });

      // Reload chats to reflect changes
      await loadChats(agent_id);

      setIsOpen(false);
      form.reset();
      toast.success("Chat renamed successfully!");
    } catch (error) {
      console.error("Error renaming chat:", error.message);
      toast.error(error.message || "Failed to rename chat");
    }
  };

  // ======= UPDATE FORM WHEN CHAT CHANGES ========
  React.useEffect(() => {
    if (chat?.name) {
      form.setValue("name", chat.name);
    }
  }, [chat?.name, form]);

  if (!chat) return null;

  return (
    <Dialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Chat Name"
      className="sm:max-w-[400px]"
    >
      <Form
        form={form}
        onSubmit={onSubmit}
        fields={fields}
        submitLabel="Update"
      />
    </Dialog>
  );
};

export default RenameChatModal;
