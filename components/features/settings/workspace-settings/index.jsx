"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

import Form from "@/components/layout/form-fields/form";
import { Card } from "@/components/ui/card";
import workspaceStore from "@/storage/workspace-store";
import { loadAllDataAction } from "@/components/actions/data-actions";

const WorkspaceSettingsForm = () => {
  // ===== GET WORKSPACE SLUG =====
  const { workspace_id } = useParams(); // This is actually the workspace slug

  // ===== STATE =====
  const [isLoading, setIsLoading] = useState(true);
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [slugWarning, setSlugWarning] = useState("");

  // ===== WORKSPACE STORE =====
  const { updateWorkspace } = workspaceStore();

  // ===== FETCH WORKSPACE =====
  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        setIsLoading(true);

        // Find workspace by slug
        const workspaces = await loadAllDataAction({
          table_name: "workspaces",
          query: {
            where: {
              slug: workspace_id,
            },
          },
        });

        if (workspaces && workspaces.length > 0) {
          const workspace = workspaces[0];
          setCurrentWorkspace(workspace);

          form.reset({
            name: workspace?.name || "",
            slug: workspace?.slug || "",
          });
        }
      } catch (error) {
        console.error("Error fetching workspace:", error);
        toast.error("Failed to load workspace settings");
      } finally {
        setIsLoading(false);
      }
    };

    if (workspace_id) {
      fetchWorkspace();
    }
  }, [workspace_id]);

  // ===== HELPER FUNCTION TO CREATE SLUG =====
  const createSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  };

  // ======= INITIALIZE FORM FIELDS ========
  const fields = [
    {
      name: "name",
      label: "Workspace Name",
      type: "text",
      placeholder: "Enter your workspace name",
      validation: z
        .string()
        .nonempty("Workspace name is required")
        .min(2, "Workspace name must be at least 2 characters")
        .max(100, "Workspace name must be less than 100 characters"),
    },
    {
      name: "slug",
      label: "Workspace URL",
      type: "text",
      placeholder: "workspace-url",
      validation: z
        .string()
        .nonempty("Workspace URL is required")
        .min(2, "Workspace URL must be at least 2 characters")
        .max(50, "Workspace URL must be less than 50 characters")
        .regex(
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
          "URL must contain only lowercase letters, numbers, and hyphens (no spaces or special characters)"
        ),
      description: "This is your workspace's unique URL identifier",
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
      acc[field.name] = field?.defaultValue || "";
      return acc;
    }, {}),
  });

  // ===== WATCH SLUG CHANGES TO CHECK AVAILABILITY =====
  const watchedSlug = form.watch("slug");
  useEffect(() => {
    const checkSlugAvailability = async () => {
      if (watchedSlug && currentWorkspace) {
        // Skip validation if this is the current workspace slug
        if (watchedSlug === currentWorkspace?.slug) {
          setSlugWarning("");
          return;
        }

        // Validate slug format first
        const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
        if (!slugRegex.test(watchedSlug)) {
          setSlugWarning(
            `⚠️ URL must contain only lowercase letters, numbers, and hyphens (no spaces or special characters)`
          );
          return;
        }

        // Check if slug already exists
        try {
          const existingWorkspaces = await loadAllDataAction({
            table_name: "workspaces",
            query: {
              where: {
                slug: watchedSlug,
              },
            },
          });

          if (existingWorkspaces && existingWorkspaces.length > 0) {
            setSlugWarning(
              `⚠️ A workspace with URL "${watchedSlug}" already exists. Please choose a different URL.`
            );
          } else {
            setSlugWarning("");
          }
        } catch (error) {
          console.error("Error checking slug availability:", error);
          setSlugWarning("");
        }
      }
    };

    // Debounce the check to avoid too many API calls
    const timeoutId = setTimeout(checkSlugAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [watchedSlug, currentWorkspace]);

  // ======= FORM SUBMISSION ========
  const onSubmit = async (values) => {
    if (!currentWorkspace) {
      toast.error("Workspace not found");
      return;
    }

    // Prevent submission if there's a slug warning
    if (slugWarning) {
      toast.error("Please resolve the workspace URL conflict before saving");
      return;
    }

    try {
      const updateData = {
        name: values.name,
      };

      // Only update slug if slug changed
      if (values.slug !== currentWorkspace.slug) {
        updateData.slug = values.slug;
      }

      await updateWorkspace(currentWorkspace.id, updateData);

      // Update local state
      setCurrentWorkspace((prev) => ({ ...prev, ...updateData }));

      toast.success("Workspace settings updated successfully");

      // If slug changed, redirect to new URL
      if (updateData.slug && updateData.slug !== currentWorkspace.slug) {
        window.location.href = `/${updateData.slug}/settings/workspace`;
      }
    } catch (error) {
      console.error("Update error:", error.message);
      toast.error(error.message || "Failed to update workspace settings");
    }
  };

  return (
    <Card className="p-6">
      {isLoading ? (
        <div className="flex justify-center items-center h-[600px]">
          <Loader2
            size={32}
            className="animate-spin duration-300 text-muted-foreground"
          />
        </div>
      ) : (
        <div className="max-w-[400px]">
          <Form
            form={form}
            onSubmit={onSubmit}
            fields={fields}
            submitLabel="Save Changes"
            className="space-y-6"
            submitButtonClassName="w-fit col-span-12"
          />

          {/* Warning Message */}
          {slugWarning && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">{slugWarning}</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default WorkspaceSettingsForm;
