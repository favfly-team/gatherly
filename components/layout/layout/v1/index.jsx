import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "../../side-bar/v1/side-bar";

const Layout = ({ children }) => {
  return (
    <SidebarProvider>
      <Sidebar />
      <div className="w-full h-screen">{children}</div>
    </SidebarProvider>
  );
};

export default Layout;
