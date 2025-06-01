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
import { forwardRef } from "react";

const CreateAgentModal = () => {
  // ======= INITIALIZE STATES ========
  const [isOpen, setIsOpen] = useState(false);

  // ======= INITIALIZE PARAMS ========
  const { workspace_id } = useParams();

  // ======= INITIALIZE STORE ========
  const { createAgent } = agentStore();

  // ======= INITIALIZE FORM FIELDS ========
  const fields = [
    {
      name: "name",
      label: "Agent Name",
      type: "text",
      placeholder: "Enter agent name",
      validation: z.string().nonempty("Agent Name is required"),
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
      await createAgent({
        ...values,
        workspace_id,
      });

      setIsOpen(false);
      form.reset();
      toast.success("Agent created successfully!");
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      button={<TriggerButton />}
      title="Create New Agent"
    >
      <Form
        form={form}
        onSubmit={onSubmit}
        fields={fields}
        submitLabel="Create Agent"
      />
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

export default CreateAgentModal;
