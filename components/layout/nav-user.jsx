import { LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Avatar from "./avatar";
import LogoutButton from "../auth/logout/logout";
import { getServerUser } from "@/utils/supabase/supabaseServer";

const NavUser = async () => {
  // ====== GET USER DATA ======
  const user = await getServerUser();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          {/* // ===== TRIGGER ===== */}
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground md:h-8 md:p-0"
            >
              <Avatar name={user.name} className="h-8 w-8 rounded-lg" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          {/* // ===== CONTENT ===== */}
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side="right"
            align="end"
            sideOffset={4}
          >
            <LogoutButton>
              <DropdownMenuItem>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </LogoutButton>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default NavUser;
