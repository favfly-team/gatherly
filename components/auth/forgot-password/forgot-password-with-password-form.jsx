"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import Form from "@/components/layout/form-fields/form";
import forgotPasswordAction from "./actions/forgot-password-action";

const ForgotPasswordWithPasswordForm = () => {
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
      const res = await forgotPasswordAction(values);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.error.message);
      }
    } catch (error) {
      console.error("Forgot password error:", error.message);
      toast.error(error.error.message);
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

export default ForgotPasswordWithPasswordForm;
