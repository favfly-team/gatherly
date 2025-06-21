"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import loginWithPasswordAction from "./actions/login-with-password-action";
import Form from "@/components/layout/form-fields/form";
import Link from "next/link";

const LoginWithPasswordForm = () => {
  // ======= INITIALIZE FORM FIELDS ========
  const fields = [
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
      label: (
        <div className="flex justify-between">
          <span>Password</span>
          <Link href="/forgot-password">Forgot Password?</Link>
        </div>
      ),
      type: "password",
      placeholder: "Enter your password",
      resetPassword: true,
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
    defaultValues: fields.reduce((acc, field) => {
      acc[field.name] = "";
      return acc;
    }, {}),
  });

  // ======= FORM SUBMISSION ========
  const onSubmit = async (values) => {
    try {
      const res = await loginWithPasswordAction(values);

      if (res?.error) {
        // Handle Firebase authentication errors
        const errorMessage =
          res.error.message || "Login failed. Please try again.";
        toast.error(errorMessage);
        return;
      }

      const slug = res?.workspaces?.[0]?.slug;

      if (!slug) {
        toast.error(
          "No workspace found after sign-in. Please contact support."
        );
        return;
      }

      // Show success message before redirect
      toast.success("Login successful! Redirecting...");

      // Redirect to workspace
      window.location.href = `/${slug}`;
    } catch (error) {
      console.error("Login error:", error);

      // Handle different types of errors
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    }
  };

  return (
    <Form form={form} onSubmit={onSubmit} fields={fields} submitLabel="Login" />
  );
};

export default LoginWithPasswordForm;
