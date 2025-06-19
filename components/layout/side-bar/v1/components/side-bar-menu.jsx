"use client";

import { SidebarMenu as SidebarMenuComponent } from "@/components/ui/sidebar";
import SidebarMenuItem from "./side-bar-menu-item";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SideBarMenu = ({ navItems }) => {
  // ====== GET PATHNAME ======
  const pathname = usePathname();

  return (
    <SidebarMenuComponent>
      {navItems.map((item) => (
        <SidebarMenuItem
          key={item.title}
          data={{ title: item.title, url: item.url }}
          active={pathname.includes(item.url)}
        >
          <Link href={item.url}>
            {item.icon}
            <span>{item.title}</span>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenuComponent>
  );
};

export default SideBarMenu;
