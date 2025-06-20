"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Dialog from "@/components/layout/dialog/dialog";
import Form from "@/components/layout/form-fields/form";
import flowStore from "@/storage/flow-store";

const DeleteFlowModal = ({ flow, isOpen, setIsOpen }) => {
  // ======= INITIALIZE STORE ========
  const { deleteFlow } = flowStore();

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
      await deleteFlow(flow.id);
      setIsOpen(false);
      form.reset();
      toast.success("Flow deleted permanently!");
    } catch (error) {
      console.error("Error deleting flow:", error.message);
      toast.error(error.message || "Failed to delete flow");
    }
  };

  // ======= RESET FORM WHEN MODAL CLOSES ========
  React.useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  if (!flow) return null;

  return (
    <Dialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Delete Flow"
      className="sm:max-w-[500px]"
    >
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-destructive mb-2">⚠️ Warning</p>
          <p>
            This action will permanently delete the flow{" "}
            <strong>"{flow.name}"</strong> and all its messages. This cannot be
            undone.
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

export default DeleteFlowModal;
