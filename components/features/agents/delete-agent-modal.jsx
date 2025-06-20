"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Dialog from "@/components/layout/dialog/dialog";
import Form from "@/components/layout/form-fields/form";
import agentStore from "@/storage/agent-store";

const DeleteAgentModal = ({ agent, isOpen, setIsOpen }) => {
  // ======= INITIALIZE STORE ========
  const { deleteAgent } = agentStore();

  // ======= FORM FIELDS ========
  const fields = [
    {
      name: "confirmation",
      type: "text",
      placeholder: "Type DELETE to confirm",
      validation: z.string().refine((value) => value === "DELETE", {
        message: "You must type DELETE exactly to confirm",
      }),
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
      confirmation: "",
    },
  });

  // ======= FORM SUBMISSION ========
  const onSubmit = async () => {
    try {
      await deleteAgent(agent.id);
      setIsOpen(false);
      form.reset();
      toast.success("Agent deleted permanently!");
    } catch (error) {
      console.error("Error deleting agent:", error.message);
      toast.error(error.message || "Failed to delete agent");
    }
  };

  // ======= RESET FORM WHEN MODAL CLOSES ========
  React.useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  if (!agent) return null;

  return (
    <Dialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Delete Agent"
      className="sm:max-w-[500px]"
    >
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-destructive mb-2">⚠️ Warning</p>
          <p>
            This action will permanently delete the agent{" "}
            <strong>"{agent.name}"</strong> and all its flows and messages. This
            cannot be undone.
          </p>
          <p className="mt-2">
            Type <strong>DELETE</strong> in the field below to confirm.
          </p>
        </div>

        <Form
          form={form}
          onSubmit={onSubmit}
          fields={fields}
          submitLabel="Delete Permanently"
          submitVariant="destructive"
        />
      </div>
    </Dialog>
  );
};

export default DeleteAgentModal;
