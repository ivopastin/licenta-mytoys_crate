"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Layers, Newspaper, Star, LogOut } from "lucide-react";
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
    <Sidebar>
      <SidebarHeader className="px-4 py-5">
        <div className="flex flex-col gap-0.5">
          <span className="text-[15px] font-bold text-ink">MyToys Crate</span>
          <span className="text-[11px] text-warm font-medium">Admin Panel</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(href + "/");
                return (
                  <SidebarMenuItem key={href}>
                    <Link
                      href={href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-[10px] text-[13px] font-medium transition-colors ${
                        active
                          ? "bg-deep/10 text-deep font-semibold"
                          : "text-warm hover:bg-black/5 hover:text-ink"
                      }`}
                    >
                      <Icon size={16} />
                      {label}
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-4 py-4 border-t border-border-soft">
        <div className="flex items-center justify-between">
          <Link href="/app" className="text-[12px] text-warm hover:text-ink transition-colors">
            ← Back to App
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-[12px] text-warm hover:text-ink transition-colors cursor-pointer"
          >
            <LogOut size={13} />
            Sign out
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
