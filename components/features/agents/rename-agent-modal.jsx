"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import Dialog from "@/components/layout/dialog/dialog";
import Form from "@/components/layout/form-fields/form";
import agentStore from "@/storage/agent-store";

const RenameAgentModal = ({ agent, isOpen, setIsOpen }) => {
  // ======= INITIALIZE PARAMS ========
  const { workspace_id } = useParams();

  // ======= INITIALIZE STORE ========
  const { updateAgent, loadAgents } = agentStore();

  // ======= FORM FIELDS ========
  const fields = [
    {
      name: "name",
      type: "text",
      placeholder: "Enter agent name",
      validation: z
        .string()
        .nonempty("Agent name is required")
        .min(2, "Agent name must be at least 2 characters")
        .max(50, "Agent name must be less than 50 characters"),
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
      name: agent?.name || "",
    },
  });

  // ======= FORM SUBMISSION ========
  const onSubmit = async (values) => {
    try {
      await updateAgent(agent.id, {
        name: values.name,
        updated_at: Date.now(),
      });

      // Reload agents to reflect changes
      await loadAgents(workspace_id);

      setIsOpen(false);
      form.reset();
      toast.success("Agent renamed successfully!");
    } catch (error) {
      console.error("Error renaming agent:", error.message);
      toast.error(error.message || "Failed to rename agent");
    }
  };

  // ======= UPDATE FORM WHEN AGENT CHANGES ========
  React.useEffect(() => {
    if (agent?.name) {
      form.setValue("name", agent.name);
    }
  }, [agent?.name, form]);

  if (!agent) return null;

  return (
    <Dialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Agent Name"
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

export default RenameAgentModal;
