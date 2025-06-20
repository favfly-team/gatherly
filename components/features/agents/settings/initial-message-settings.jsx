"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Form from "@/components/layout/form-fields/form";
import agentStore from "@/storage/agent-store";
import { loadSingleDataAction } from "@/components/actions/data-actions";

export default function InitialMessageSettings({ agent_id }) {
  // ===== AGENT STORE =====
  const { updateAgent } = agentStore();

  // ===== LOCAL STATES =====
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // ===== FORM FIELDS CONFIGURATION =====
  const fields = [
    {
      name: "initial_message",
      type: "textarea",
      rows: 10,
      placeholder:
        "Enter the initial message users will see (e.g., 'Hello! How can I help you today?')",
      validation: z
        .string()
        .max(500, "Initial message must be less than 500 characters")
        .optional(),
    },
  ];

  // ===== FORM SCHEMA =====
  const formSchema = z.object(
    fields.reduce((acc, field) => {
      acc[field.name] = field.validation;
      return acc;
    }, {})
  );

  // ===== INITIALIZE FORM =====
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initial_message: "",
    },
  });

  // ===== LOAD AGENT DATA =====
  useEffect(() => {
    const loadAgentData = async () => {
      if (!agent_id) return;

      try {
        setIsLoading(true);
        const agent = await loadSingleDataAction({
          table_name: "bots",
          id: agent_id,
        });

        if (agent?.error) {
          throw new Error(agent.error);
        }

        // ===== SET FORM VALUES =====
        form.reset({
          initial_message: agent?.initial_message || "",
        });
      } catch (error) {
        console.error("Error loading agent data:", error);
        toast.error("Failed to load agent settings");
      } finally {
        setIsLoading(false);
      }
    };

    loadAgentData();
  }, [agent_id, form]);

  // ===== FORM SUBMISSION =====
  const onSubmit = async (values) => {
    if (!agent_id) return;

    try {
      setIsUpdating(true);

      await updateAgent(agent_id, {
        initial_message: values.initial_message?.trim() || "",
        updated_at: Date.now(),
      });

      toast.success("Initial message updated successfully!");
    } catch (error) {
      console.error("Error updating initial message:", error);
      toast.error("Failed to update initial message");
    } finally {
      setIsUpdating(false);
    }
  };

  // ===== LOADING STATE =====
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Initial Message Configuration</CardTitle>
        <CardDescription>
          Set the first message that users will see when they start a new
          conversation with your agent. This message will be automatically added
          to every new flow.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Form
          form={form}
          onSubmit={onSubmit}
          fields={fields}
          submitLabel="Save Changes"
          submitIcon="Save"
          isSubmitting={isUpdating}
          submitClassName="w-32"
        />

        <p className="text-xs text-muted-foreground mt-2">
          Leave empty if you don't want an initial message. Maximum 500
          characters.
        </p>
      </CardContent>
    </Card>
  );
}
