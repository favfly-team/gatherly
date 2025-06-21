"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { useParams } from "next/navigation";

import Dialog from "@/components/layout/dialog/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Form from "@/components/layout/form-fields/form";
import agentStore from "@/storage/agent-store";
import workspaceStore from "@/storage/workspace-store";
import userStore from "@/storage/user-store";
import { forwardRef } from "react";

const CreateAgentModal = () => {
  // ======= INITIALIZE STATES ========
  const [isOpen, setIsOpen] = useState(false);

  // ======= INITIALIZE PARAMS ========
  const { workspace_id } = useParams(); // This is actually the workspace slug

  // ======= INITIALIZE STORES ========
  const { createAgent } = agentStore();
  const { getWorkspaceBySlug } = workspaceStore();
  const { user } = userStore();

  // ======= INITIALIZE FORM FIELDS ========
  const fields = [
    {
      name: "name",
      label: "Agent Name",
      type: "text",
      placeholder: "Enter agent name",
      validation: z
        .string()
        .min(1, "Agent name is required")
        .min(2, "Agent name must be at least 2 characters")
        .max(50, "Agent name must be less than 50 characters"),
    },
    {
      name: "system_prompt",
      label: "System Prompt (Optional)",
      type: "textarea",
      rows: 6,
      placeholder:
        "Enter instructions that define how your agent should behave and respond to users...",
      validation: z
        .string()
        .max(2000, "System prompt must be less than 2000 characters")
        .optional(),
    },
    {
      name: "initial_message",
      label: "Initial Message (Optional)",
      type: "textarea",
      rows: 3,
      placeholder: "Hello! How can I help you today?",
      validation: z
        .string()
        .max(500, "Initial message must be less than 500 characters")
        .optional(),
    },
  ];

  // ======= INITIALIZE FORM SCHEMA ========
  const formSchema = z.object(
    fields.reduce((acc, field) => {
      acc[field.name] = field.validation;
      return acc;
    }, {})
  );

  // ======= INITIALIZE FORM ========
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: fields.reduce((acc, field) => {
      acc[field.name] = "";
      return acc;
    }, {}),
  });

  // ======= FORM SUBMISSION ========
  const onSubmit = async (values) => {
    try {
      // Validate user is authenticated
      if (!user?.id) {
        toast.error("Please log in to create an agent");
        return;
      }

      // Convert workspace slug to workspace ID
      const workspace = await getWorkspaceBySlug(workspace_id);
      if (!workspace) {
        toast.error("Workspace not found");
        return;
      }

      // Create agent with correct IDs
      await createAgent({
        name: values.name,
        workspace_id: workspace.id, // Use actual workspace ID, not slug
        system_prompt: values.system_prompt || "",
        initial_message:
          values.initial_message || "Hello! How can I help you today?",
        created_by_id: user.id, // Use actual user ID from users table
      });

      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error(error.message);
      toast.error(error.message || "Failed to create agent");
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      button={<TriggerButton />}
      title="Create New Agent"
      className="sm:max-w-[600px]"
    >
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p>
            Create a new AI agent with custom behavior and initial greeting.
          </p>
        </div>

        <Form
          form={form}
          onSubmit={onSubmit}
          fields={fields}
          submitLabel="Create Agent"
        />

        <div className="text-xs text-muted-foreground space-y-1">
          <p>
            <strong>System Prompt:</strong> Defines your agent's personality and
            behavior
          </p>
          <p>
            <strong>Initial Message:</strong> The first message users see when
            starting a conversation
          </p>
        </div>
      </div>
    </Dialog>
  );
};

// ===== TRIGGER BUTTON =====
const TriggerButton = forwardRef((props, ref) => {
  return (
    <Button ref={ref} size="sm" {...props}>
      <Plus /> Create Agent
    </Button>
  );
});

TriggerButton.displayName = "TriggerButton";

export default CreateAgentModal;
