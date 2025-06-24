"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import Dialog from "@/components/layout/dialog/dialog";
import Form from "@/components/layout/form-fields/form";
import { loadAllDataAction } from "@/components/actions/data-actions";
import { setCookie } from "@/components/actions/set-cookies";
import workspaceStore from "@/storage/workspace-store";
import userStore from "@/storage/user-store";
import memberStore from "@/storage/member-store";

const CreateWorkspaceModal = ({ isOpen, setIsOpen }) => {
  // ===== INITIALIZE HOOKS =====
  const router = useRouter();
  const { createWorkspace } = workspaceStore();
  const { addMemberToWorkspace } = memberStore();

  const { user } = userStore();

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
      placeholder: "Enter workspace name",
      validation: z
        .string()
        .nonempty("Workspace name is required")
        .min(2, "Workspace name must be at least 2 characters")
        .max(50, "Workspace name must be less than 50 characters")
        .refine(
          async (value) => {
            const slug = createSlug(value);
            const existingWorkspaces = await loadAllDataAction({
              table_name: "workspaces",
              query: {
                where: {
                  slug: slug,
                },
              },
            });

            return !existingWorkspaces || existingWorkspaces.length === 0;
          },
          {
            message: `A workspace with this name already exists`,
          }
        ),
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
    mode: "onChange",
    defaultValues: fields.reduce((acc, field) => {
      acc[field.name] = "";
      return acc;
    }, {}),
  });

  // ======= FORM SUBMISSION ========
  const onSubmit = async (values) => {
    if (!user?.id) {
      toast.error("Please log in to create a workspace");
      return;
    }

    try {
      const slug = createSlug(values.name);

      const workspaceData = {
        name: values.name,
        slug: slug,
      };

      const newWorkspace = await createWorkspace(workspaceData, user.id);

      if (newWorkspace) {
        const newMember = await addMemberToWorkspace(
          newWorkspace.id,
          user.id,
          "owner"
        );

        setIsOpen(false);
        form.reset();
        toast.success("Workspace created successfully!");

        // ===== SET COOKIE =====
        setCookie("workspace_id", slug);

        // ===== REDIRECT TO NEW WORKSPACE =====
        router.push(`/${slug}/agents`);
      }
    } catch (error) {
      console.error("Error creating workspace:", error.message);
      toast.error(error.message || "Failed to create workspace");
    }
  };

  return (
    <Dialog isOpen={isOpen} setIsOpen={setIsOpen} title="Create New Workspace">
      <Form
        form={form}
        onSubmit={onSubmit}
        fields={fields}
        submitLabel="Create Workspace"
      />
    </Dialog>
  );
};

export default CreateWorkspaceModal;
