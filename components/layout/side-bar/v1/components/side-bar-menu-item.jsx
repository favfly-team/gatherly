"use client";

import {
  SidebarMenuButton,
  SidebarMenuItem as SidebarMenuItemComponent,
} from "@/components/ui/sidebar";

import { usePathname } from "next/navigation";

const SidebarMenuItem = ({ data, children }) => {
  // ======= GET PATHNAME ========
  const pathname = usePathname();

  return (
    <SidebarMenuItemComponent>
      <SidebarMenuButton
        tooltip={{
          children: data.title,
          hidden: false,
        }}
        asChild
        className={`px-2.5 md:px-2 rounded-full hover:bg-gray-200 ${
          pathname.startsWith(data.url) ? "bg-gray-200" : ""
        }`}
      >
        {children}
      </SidebarMenuButton>
    </SidebarMenuItemComponent>
  );
};

export default SidebarMenuItem;
