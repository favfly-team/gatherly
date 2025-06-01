import LayoutComponent from "@/components/layout/layout/v1";
import AuthGuard from "@/components/auth/auth-guard";

const Layout = ({ children }) => {
  return (
    <AuthGuard>
      <LayoutComponent>{children}</LayoutComponent>
    </AuthGuard>
  );
};

export default Layout;
