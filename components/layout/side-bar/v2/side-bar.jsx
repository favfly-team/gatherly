"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const SideBar = ({ children, navItems }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="bg-white h-full w-[300px] p-4 border-r space-y-2">
        {navItems?.map((item) => (
          <NavItem key={item.title} item={item} />
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const NavItem = ({ item }) => {
  const pathname = usePathname();

  return (
    <Button
      asChild
      variant="ghost"
      className={cn("w-full justify-start", {
        "bg-accent": pathname.includes(item.url),
      })}
    >
      <Link
        href={item.url}
        className={cn(item?.coming_soon && "pointer-events-none")}
      >
        {item?.icon}
        <span>{item.title}</span>
        {item?.coming_soon && (
          <Badge variant="outline" className="text-[10px] px-1 leading-3">
            Coming Soon
          </Badge>
        )}
      </Link>
    </Button>
  );
};

export default SideBar;
