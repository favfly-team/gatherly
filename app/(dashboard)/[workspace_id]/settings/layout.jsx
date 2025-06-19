import { UserPlus, UserRound, LayoutDashboard } from "lucide-react";
import SideBar from "@/components/layout/side-bar/v2/side-bar";

const SettingsLayout = ({ children, params }) => {
  const { workspace_id } = params;

  const navItems = [
    // {
    //   title: "Account",
    //   url: `/${workspace_id}/settings/account`,
    //   icon: <UserRound />,
    // },
    {
      title: "Organization",
      url: `/${workspace_id}/settings/workspace`,
      icon: <LayoutDashboard />,
    },
    {
      title: "Manage Team",
      url: `/${workspace_id}/settings/team`,
      icon: <UserPlus />,
    },
  ];

  return <SideBar navItems={navItems}>{children}</SideBar>;
};

export default SettingsLayout;
