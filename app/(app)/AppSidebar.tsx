"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Wand2, BookMarked, Settings, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const NAV_ITEMS = [
  { label: "Home", href: "/app", icon: Home },
  { label: "Studio", href: "/app/studio", icon: Wand2 },
  { label: "My Patterns", href: "/app/my-patterns", icon: BookMarked },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      {/* Logo */}
      <SidebarHeader className="px-4 py-5">
        <Link href="/app" className="flex items-center gap-3">
          <Image
            src="/images/logos/logo-black.png"
            alt="MyToys Crate"
            width={36}
            height={36}
            className="object-contain shrink-0"
          />
          <span className="font-bold text-[16px] text-[#1a1a1a] group-data-[collapsible=icon]:hidden">
            MyToys Crate
          </span>
        </Link>
      </SidebarHeader>

      {/* Nav items */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
                const isActive =
                  href === "/app"
                    ? pathname === "/app"
                    : pathname.startsWith(href);
                return (
                  <SidebarMenuItem key={label}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`rounded-[12px] font-semibold text-[14px] ${
                        isActive
                          ? "bg-[#417c9c] text-white hover:bg-[#417c9c] hover:text-white"
                          : "text-[#716458] hover:bg-[#417c9c]/10 hover:text-[#417c9c]"
                      }`}
                    >
                      <Link href={href}>
                        <Icon size={18} />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User account + actions */}
      <SidebarFooter className="px-3 py-4 border-t border-[#e0d9d5]">
        {/* User card */}
        <div className="flex items-center gap-3 px-2 py-2 group-data-[collapsible=icon]:justify-center">
          <div className="w-8 h-8 rounded-full bg-[#417c9c] flex items-center justify-center shrink-0">
            <span className="text-white text-[12px] font-bold">MP</span>
          </div>
          <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="text-[13px] font-semibold text-[#1a1a1a] truncate">
              Maria Pastin
            </span>
            <span className="text-[11px] text-[#716458] truncate">
              ivo.pastin@gmail.com
            </span>
          </div>
        </div>

        {/* Settings + logout */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="rounded-[12px] text-[13px] font-medium text-[#716458] hover:bg-[#417c9c]/10 hover:text-[#417c9c]"
            >
              <Link href="/app/settings">
                <Settings size={16} />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="rounded-[12px] text-[13px] font-medium text-[#716458] hover:bg-red-50 hover:text-red-500 cursor-pointer">
              <LogOut size={16} />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Collapse toggle */}
        <SidebarTrigger className="mt-2 w-full justify-center text-[#716458] hover:text-[#417c9c]" />
      </SidebarFooter>
    </Sidebar>
  );
}
