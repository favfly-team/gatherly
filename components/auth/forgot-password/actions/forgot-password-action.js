"use server";
import { createClient } from "@/utils/supabase/server";
import { errorHandler } from "@/hooks/error";

const forgotPasswordAction = async (values) => {
  try {
    // Initialize Supabase client
    const supabase = await createClient();

    // ====== RESET PASSWORD ======
    const { data, error } = await supabase.auth.resetPasswordForEmail(
      values.email,
      {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
      }
    );

    // ====== ERROR HANDLING ======
    if (error) {
      throw error;
    }

    return { success: true, message: "Password reset email sent successfully" };
  } catch (error) {
    console.error("Reset password error:", error.message);
    return errorHandler(error);
  }
};

export default forgotPasswordAction;
