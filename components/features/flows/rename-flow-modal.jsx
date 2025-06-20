"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import Dialog from "@/components/layout/dialog/dialog";
import Form from "@/components/layout/form-fields/form";
import flowStore from "@/storage/flow-store";

const RenameFlowModal = ({ flow, isOpen, setIsOpen }) => {
  // ======= INITIALIZE PARAMS ========
  const { agent_id } = useParams();

  // ======= INITIALIZE STORE ========
  const { updateFlow, loadFlows } = flowStore();

  // ======= FORM FIELDS ========
  const fields = [
    {
      name: "name",
      type: "text",
      placeholder: "Enter flow name",
      validation: z
        .string()
        .nonempty("Flow name is required")
        .min(2, "Flow name must be at least 2 characters")
        .max(50, "Flow name must be less than 50 characters"),
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
      name: flow?.name || "",
    },
  });

  // ======= FORM SUBMISSION ========
  const onSubmit = async (values) => {
    try {
      await updateFlow(flow.id, {
        name: values.name,
        updated_at: Date.now(),
      });

      // Reload flows to reflect changes
      await loadFlows(agent_id);

      setIsOpen(false);
      form.reset();
      toast.success("Flow renamed successfully!");
    } catch (error) {
      console.error("Error renaming flow:", error.message);
      toast.error(error.message || "Failed to rename flow");
    }
  };

  // ======= UPDATE FORM WHEN FLOW CHANGES ========
  React.useEffect(() => {
    if (flow?.name) {
      form.setValue("name", flow.name);
    }
  }, [flow?.name, form]);

  if (!flow) return null;

  return (
    <Dialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Flow Name"
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

export default RenameFlowModal;
