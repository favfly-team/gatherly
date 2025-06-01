import AuthLayout from "@/components/auth/layout/auth-layout";
import AuthCard from "@/components/auth/layout/components/auth-card";
import RegisterWithPasswordForm from "@/components/auth/register/register-with-password-form";

const RegisterPage = () => {
  // ====== CARD DATA ======
  const cardData = {
    headerTitle: "Create an account",
    headerDescription: "Enter your email and password to create an account",
    footerText: "Already have an account?",
    footerLinkText: "Login",
    footerLinkHref: "/login",
  };

  return (
    <AuthLayout>
      {/* // ====== AUTH CARD ====== */}
      <AuthCard {...cardData}>
        {/* // ====== REGISTER WITH PASSWORD FORM ====== */}
        <RegisterWithPasswordForm />
      </AuthCard>
    </AuthLayout>
  );
};

export default RegisterPage;
