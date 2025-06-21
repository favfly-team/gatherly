"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Loader2, Save, Eye, EyeOff } from "lucide-react";
import Form from "@/components/layout/form-fields/form";
import agentStore from "@/storage/agent-store";
import userStore from "@/storage/user-store";

export default function AgentSettings() {
  // ===== GET AGENT ID =====
  const { agent_id } = useParams();

  // ===== STORES =====
  const {
    loadAgentWithVersion,
    updateAgentSettings,
    publishAgentVersion,
    getCurrentVersion,
    isUpdating,
  } = agentStore();
  const { user } = userStore();

  // ===== LOCAL STATES =====
  const [isLoading, setIsLoading] = useState(true);
  const [agentData, setAgentData] = useState(null);
  const [currentVersion, setCurrentVersion] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // ===== FORM FIELDS CONFIGURATION =====
  const fields = [
    {
      name: "system_prompt",
      label: "System Prompt",
      type: "textarea",
      rows: 8,
      placeholder:
        "Enter the system prompt that defines how your agent should behave and respond...",
      validation: z
        .string()
        .max(2000, "System prompt must be less than 2000 characters")
        .optional(),
    },
    {
      name: "initial_message",
      label: "Initial Message",
      type: "textarea",
      rows: 4,
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
      system_prompt: "",
      initial_message: "",
    },
  });

  // ===== LOAD AGENT DATA =====
  useEffect(() => {
    const loadData = async () => {
      if (!agent_id) return;

      try {
        setIsLoading(true);
        const data = await loadAgentWithVersion(agent_id);

        setAgentData(data);
        setCurrentVersion(data.currentVersion);

        // ===== SET FORM VALUES =====
        form.reset({
          system_prompt: data.settings?.system_prompt || "",
          initial_message: data.settings?.initial_message || "",
        });
      } catch (error) {
        console.error("Error loading agent data:", error);
        toast.error("Failed to load agent settings");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [agent_id, form, loadAgentWithVersion]);

  // ===== FORM SUBMISSION =====
  const onSubmit = async (values) => {
    if (!agent_id || !user?.id) return;

    try {
      const newVersion = await updateAgentSettings(agent_id, values, user.id);
      setCurrentVersion(newVersion);

      // The success message is now handled in the store based on whether
      // it's updating existing draft or creating new draft
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    }
  };

  // ===== PUBLISH VERSION =====
  const handlePublish = async () => {
    if (!agent_id || !currentVersion?.id) return;

    try {
      setIsPublishing(true);
      await publishAgentVersion(agent_id, currentVersion.id);

      // Update local state
      setCurrentVersion((prev) => ({
        ...prev,
        status: "published",
        published_at: Date.now(),
      }));

      toast.success("Version published successfully!");
    } catch (error) {
      console.error("Error publishing version:", error);
      toast.error("Failed to publish version");
    } finally {
      setIsPublishing(false);
    }
  };

  // ===== GET STATUS BADGE =====
  const getStatusBadge = (status) => {
    const variants = {
      draft: "secondary",
      published: "default",
      archived: "outline",
    };

    const colors = {
      draft: "bg-yellow-100 text-yellow-800",
      published: "bg-green-100 text-green-800",
      archived: "bg-gray-100 text-gray-800",
    };

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // ===== LOADING STATE =====
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!agentData || !currentVersion) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-muted-foreground">
                Failed to load agent settings
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Agent Settings</h2>
          <p className="text-muted-foreground">
            Configure your agent's behavior and default responses
          </p>
        </div>

        {/* Version Status */}
        <div className="flex items-center gap-3">
          {getStatusBadge(currentVersion.status)}
          {currentVersion.status === "draft" && (
            <Button
              onClick={handlePublish}
              disabled={isPublishing || isUpdating}
              size="sm"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Publishing...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Publish Version
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Version Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current Version</CardTitle>
          <CardDescription>
            Version created on{" "}
            {new Date(currentVersion.created_at).toLocaleDateString()}
            {currentVersion.published_at && (
              <span className="ml-2">
                • Published on{" "}
                {new Date(currentVersion.published_at).toLocaleDateString()}
              </span>
            )}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Settings Form */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Configuration</CardTitle>
          <CardDescription>
            Modify your agent's system prompt and initial message. Changes will
            create a new draft version.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Form
            form={form}
            onSubmit={onSubmit}
            fields={fields}
            submitLabel="Save Changes"
            submitIcon={Save}
            isSubmitting={isUpdating}
            submitClassName="w-auto"
          />

          {/* Help Text */}
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>System Prompt:</strong> Defines how your agent behaves and
              responds to users. This is like giving personality and
              instructions to your agent.
            </p>
            <p>
              <strong>Initial Message:</strong> The first message users see when
              they start a conversation with your agent.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
