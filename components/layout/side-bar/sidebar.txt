"use client";

import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Brain } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const Sidebar = ({ ...props }) => {
  // ===== PATHNAME =====
  const pathname = usePathname();
  const { workspace_id } = useParams();

  // ===== SIDEBAR MENU =====
  const data = [
    {
      title: "Agents",
      icon: Brain,
      url: `/${workspace_id}/agents`,
    },
  ];

  return (
    <SidebarComponent {...props}>
      <SidebarHeader className="border-b">
        <div className="flex items-end py-2 px-4">
          <div className="flex items-center gap-2">
            <img
              src="https://images.prismic.io/favfly2/aD00h7h8WN-LVdrA_GatherlyLogo.png?auto=format,compress"
              alt="Gatherly Logo"
              fetchPriority="high"
              className="w-auto h-10"
            />
            <h4 className="text-xl font-bold">Gatherly</h4>
          </div>
          <sub className="bottom-[.05em] text-gray-500 dark:text-gray-400">
            by FavFly
          </sub>
        </div>
      </SidebarHeader>
      <SidebarContent className="mt-4">
        <SidebarGroup>
          <SidebarMenu>
            {data.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  isActive={pathname === item.url}
                  asChild
                  className="text-base font-medium [&>svg]:size-5 h-10"
                >
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </SidebarComponent>
  );
};

export default Sidebar;
