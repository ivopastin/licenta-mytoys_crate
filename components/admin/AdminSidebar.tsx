"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Layers, Newspaper, Star, LogOut, ArrowLeft } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Templates", href: "/admin/templates", icon: Layers },
  { label: "News", href: "/admin/news", icon: Newspaper },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <Sidebar collapsible="icon" className="border-none bg-white">
      <SidebarHeader className="border-none group-data-[collapsible=icon]:p-0">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-3 px-4 py-5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-5"
        >
          <div className="shrink-0 w-9 h-9 flex items-center justify-center">
            <Image
              src="/images/logos/logo-black.webp"
              alt="MyToys Crate"
              width={36}
              height={36}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-[15px] text-ink leading-tight">MyToys Crate</span>
            <span className="text-[11px] text-warm font-medium">Admin Panel</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="border-none">
        <SidebarGroup className="px-3">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(href + "/");
                return (
                  <SidebarMenuItem key={href}>
                    <Link
                      href={href}
                      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-[12px] font-semibold text-[14px] transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:size-9 group-data-[collapsible=icon]:mx-auto ${
                        active
                          ? "bg-brand text-white"
                          : "text-warm hover:bg-brand/10 hover:text-brand"
                      }`}
                    >
                      <Icon size={18} className="shrink-0" />
                      <span className="group-data-[collapsible=icon]:hidden">{label}</span>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 py-4 border-t border-border-soft">
        <div className="flex flex-col gap-1">
          <Link
            href="/app"
            className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[14px] font-semibold text-warm hover:bg-brand/10 hover:text-brand transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:size-9 group-data-[collapsible=icon]:mx-auto"
          >
            <ArrowLeft size={18} className="shrink-0" />
            <span className="group-data-[collapsible=icon]:hidden">Back to App</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[14px] font-semibold text-warm hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:size-9 group-data-[collapsible=icon]:mx-auto"
          >
            <LogOut size={18} className="shrink-0" />
            <span className="group-data-[collapsible=icon]:hidden">Sign out</span>
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
