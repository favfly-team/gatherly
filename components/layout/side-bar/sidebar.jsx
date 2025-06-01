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
      <SidebarHeader>
        <div className="flex items-center p-1">
          <img
            src="https://images.prismic.io/favfly2/Z44AIJbqstJ99n2k_FINALLOGOFILE-01-01.png?auto=format,compress"
            alt=""
            className="w-auto h-10"
          />
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
