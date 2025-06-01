"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Form from "@/components/layout/form-fields/form";
import { createClient } from "@/utils/supabase/client";

const ResetPasswordWithPasswordForm = () => {
  // ======= INITIALIZE FORM FIELDS ========
  const fields = [
    {
      name: "password",
      label: "New Password",
      type: "password",
      placeholder: "Enter your new password",
      validation: z
        .string()
        .min(8, "Password must be at least 8 characters long"),
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      placeholder: "Confirm your new password",
      validation: z
        .string()
        .min(8, "Password must be at least 8 characters long"),
    },
  ];

  // ======= INITIALIZE FORM SCHEMA ========
  const formSchema = z
    .object({
      password: fields[0].validation,
      confirmPassword: fields[1].validation,
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  // ======= INITIALIZE FORM ========
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // ======= FORM SUBMISSION ========
  const onSubmit = async (values) => {
    try {
      // Initialize Supabase client
      const supabase = await createClient();

      // ====== RESET PASSWORD ======
      const { data, error } = await supabase.auth.updateUser({
        password: values.password,
      });

      // ====== ERROR HANDLING ======
      if (error) {
        throw error;
      }

      toast.success("Password reset successfully");
      location.href = "/login";
    } catch (error) {
      console.error("Reset password error:", error.message);
      toast.error(error.message);
    }
  };

  return (
    <Form
      form={form}
      onSubmit={onSubmit}
      fields={fields}
      submitLabel="Reset Password"
    />
  );
};

export default ResetPasswordWithPasswordForm;
