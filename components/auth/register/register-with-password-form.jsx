"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import createUserAction from "./actions/create-user-action";
import Form from "@/components/layout/form-fields/form";
import {
  findFirstDataAction,
  findUniqueDataAction,
} from "@/components/actions/data-actions";
import { slugify } from "@/hooks/custom/use-formatters";

const RegisterWithPasswordForm = () => {
  const router = useRouter();

  // ======= INITIALIZE FORM FIELDS ========
  const fields = [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Enter your name",
      validation: z.string().nonempty("Name is required"),
    },
    {
      name: "company_name",
      label: "Company Name",
      type: "text",
      placeholder: "Enter your company name",
      validation: z
        .string()
        .nonempty("Company name is required")
        .refine(
          async (value) => {
            const workspaceName = slugify(value);
            const isExists = await findFirstDataAction({
              table_name: "workspaces",
              query: {
                where: {
                  slug: workspaceName,
                },
              },
            });

            return !isExists;
          },
          {
            message: "Company name already exists",
          }
        ),
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter your email",
      validation: z
        .string()
        .email("Invalid email address")
        .nonempty("Email is required"),
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter your password",
      validation: z
        .string()
        .min(6, "Password must be at least 6 characters long"),
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
    try {
      const res = await createUserAction(values);

      if (res.error) {
        // Handle Firebase authentication errors
        const errorMessage =
          res.error.message || "Registration failed. Please try again.";
        toast.error(errorMessage);
        return;
      }

      // Check if we have a valid user and workspace
      if (!res.user || !res.workspace?.id) {
        toast.error("Registration failed. Please try again.");
        return;
      }

      // Show success message
      toast.success("Registration successful! Redirecting...");

      // Redirect to workspace
      router.push(`/${res.workspace.slug}`);
    } catch (error) {
      console.error("Registration error:", error);

      // Handle unexpected errors
      let errorMessage = "Registration failed. Please try again.";

      if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    }
  };

  return (
    <Form
      form={form}
      onSubmit={onSubmit}
      fields={fields}
      submitLabel="Register"
    />
  );
};

export default RegisterWithPasswordForm;
