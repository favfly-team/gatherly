"use client";

import { Building, CircleCheck, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useState } from "react";
import { LayoutGrid } from "lucide-react";
import { setCookie } from "@/components/actions/set-cookies";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import CreateWorkspaceModal from "./create-workspace-modal";

const OrgSwitcher = ({ workspaces, workspace_id, isLoading }) => {
  const { isMobile } = useSidebar();

  const [isOpen, setIsOpen] = useState(false);

  const activeWorkspace = workspaces?.find(
    (item) => item.slug === workspace_id
  );

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="icon"
                variant="ghost"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground p-1 aspect-square"
              >
                {activeWorkspace?.logo ? (
                  <img
                    className="w-full h-full"
                    src={activeWorkspace.logo}
                    alt={activeWorkspace.name}
                  />
                ) : (
                  <div className="flex size-6 items-center justify-center rounded-md p-1 border bg-primary text-white">
                    <LayoutGrid className="size-6" />
                  </div>
                )}
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Workspaces
              </DropdownMenuLabel>

              {isLoading ? (
                <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
              ) : (
                workspaces?.map((item, index) => (
                  <WorkspaceSwitcherItem
                    key={index}
                    data={item}
                    workspace_id={workspace_id}
                  />
                ))
              )}

              <DropdownMenuSeparator />

              {/* // ===== Add Button ===== */}
              <AddButton onClick={() => setIsOpen(true)} />
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* // ===== Create Workspace Dialog ===== */}
      <CreateWorkspaceModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

const WorkspaceSwitcherItem = ({ data, workspace_id }) => {
  // ===== INITIALIZE HOOKS =====
  const pathname = usePathname(); // e.g., /test/leads
  const searchParams = useSearchParams(); // query params
  const router = useRouter();

  // ===== HANDLE CHANGE WORKSPACE =====
  const switchWorkspace = (workspace_id) => {
    const parts = pathname.split("/");
    parts[1] = workspace_id; // Replace workspace slug
    const newPath = parts.join("/");

    const finalUrl = searchParams.toString()
      ? `${newPath}?${searchParams.toString()}`
      : newPath;

    router.push(finalUrl);
  };

  return (
    <DropdownMenuItem
      key={data.id}
      onClick={() => {
        setCookie("workspace_id", data.slug);
        switchWorkspace(data.slug);
      }}
      className="gap-1 p-1"
    >
      <div
        className={`flex size-6 items-center justify-center rounded-sm p-1 ${
          data.logo ? "" : "bg-transparent text-muted-foreground"
        }`}
      >
        {data.logo ? (
          <img className="w-full h-full" src={data.logo} alt={data.name} />
        ) : (
          <Building className="size-6" />
        )}
      </div>
      {data.name}

      {data.slug === workspace_id && (
        <CircleCheck className="size-4 text-muted-foreground" />
      )}
    </DropdownMenuItem>
  );
};

const AddButton = ({ onClick }) => {
  return (
    <DropdownMenuItem className="gap-2 p-2" onClick={onClick}>
      <div className="flex size-6 items-center justify-center rounded-md border bg-background">
        <Plus className="size-4" />
      </div>
      <div className="font-medium text-muted-foreground">Add Workspace</div>
    </DropdownMenuItem>
  );
};

export default OrgSwitcher;
