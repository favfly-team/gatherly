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
import flowStore from "@/storage/flow-store";
import { forwardRef } from "react";

const CreateFlowModal = () => {
  // ======= INITIALIZE STATES ========
  const [isOpen, setIsOpen] = useState(false);

  // ======= GET AGENT ID ========
  const { agent_id } = useParams();

  // ======= INITIALIZE STORE ========
  const { createFlow } = flowStore();

  // ======= INITIALIZE FORM FIELDS ========
  const fields = [
    {
      name: "name",
      label: "Flow Name",
      type: "text",
      placeholder: "Enter flow name",
      validation: z.string().nonempty("Flow name is required"),
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
      await createFlow({
        ...values,
        bot_id: agent_id,
      });

      setIsOpen(false);
      form.reset();
      toast.success("Flow created successfully!");
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
      title="Create New Flow"
    >
      <Form
        form={form}
        onSubmit={onSubmit}
        fields={fields}
        submitLabel="Create Flow"
      />
    </Dialog>
  );
};

// ===== TRIGGER BUTTON =====
const TriggerButton = forwardRef((props, ref) => {
  return (
    <Button ref={ref} size="sm" {...props}>
      <Plus /> Create Flow
    </Button>
  );
});

export default CreateFlowModal;
