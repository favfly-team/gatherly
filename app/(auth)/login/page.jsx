import AuthLayout from "@/components/auth/layout/auth-layout";
import AuthCard from "@/components/auth/layout/components/auth-card";
import LoginWithPasswordForm from "@/components/auth/login/login-with-password-form";

const LoginPage = () => {
  // ====== CARD DATA ======
  const cardData = {
    headerTitle: "Login to your account",
    headerDescription:
      "Enter your email and password to login to your account.",
    footerText: "Don't have an account?",
    footerLinkText: "Create an account",
    footerLinkHref: "/register",
  };

  return (
    <AuthLayout>
      {/* // ====== AUTH CARD ====== */}
      <AuthCard {...cardData}>
        {/* // ====== LOGIN WITH PASSWORD FORM ====== */}
        <LoginWithPasswordForm />
      </AuthCard>
    </AuthLayout>
  );
};

export default LoginPage;
