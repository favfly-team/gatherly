"use client";

import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import SideBarMenu from "./components/side-bar-menu";
import OrgSwitcher from "./components/org-switcher";
import { Settings, House, Brain } from "lucide-react";
import workspaceStore from "@/storage/workspace-store";
import userStore from "@/storage/user-store";
import { useEffect } from "react";
import { useParams } from "next/navigation";

const Sidebar = () => {
  // ===== WORKSPACE ID =====
  const { workspace_id } = useParams();

  // ===== INITIALIZE STORES =====
  const { workspaces, isLoading, loadWorkspaces } = workspaceStore();
  const { user } = userStore();

  // ====== NAV ITEMS ======
  const navItemsHeader = [
    {
      title: "Dashboard",
      // url: `/${workspace_id}/dashboard`,
      url: `#`,
      icon: <House />,
    },
    { title: "Agents", icon: <Brain />, url: `/${workspace_id}/agents` },
  ];

  const navItemsFooter = [
    {
      title: "Settings",
      url: `/${workspace_id}/settings/workspace`,
      icon: <Settings />,
    },
  ];

  // ===== LOAD WORKSPACES =====
  useEffect(() => {
    if (user?.id) {
      loadWorkspaces(user.id);
    }
  }, [user?.id, loadWorkspaces]);

  return (
    <SidebarComponent
      collapsible="icon-offcanvas"
      wrapperClassName="!w-[calc(var(--sidebar-width-icon)_+_1px)]"
      className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
    >
      {/* // ===== HEADER ===== */}
      <SidebarHeader>
        <OrgSwitcher
          workspaces={workspaces}
          workspace_id={workspace_id}
          isLoading={isLoading}
        />
      </SidebarHeader>

      {/* // ===== CONTENT ===== */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="px-1.5 md:px-0">
            <SideBarMenu navItems={navItemsHeader} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* // ===== FOOTER ===== */}
      <SidebarFooter>
        <SideBarMenu navItems={navItemsFooter} />
        {/* <NavUser /> */}
      </SidebarFooter>
    </SidebarComponent>
  );
};

export default Sidebar;
