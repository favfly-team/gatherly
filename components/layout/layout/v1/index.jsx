import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "../../side-bar/sidebar";

const Layout = ({ children }) => {
  return (
    <SidebarProvider>
      <Sidebar />
      {children}
    </SidebarProvider>
  );
};

export default Layout;
