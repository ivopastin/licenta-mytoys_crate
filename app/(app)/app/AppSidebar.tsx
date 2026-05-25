"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Home,
  Wand2,
  BookMarked,
  GraduationCap,
  Settings,
  CreditCard,
  LogOut,
  ChevronUp,
  Bell,
} from "lucide-react";
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
import NotificationsPanel from "./components/NotificationsPanel";
import tutorialsData from "@/content/tutorials.json";

const NAV_ITEMS = [
  { label: "Home", href: "/app", icon: Home },
  { label: "Studio", href: "/app/studio", icon: Wand2 },
  { label: "My Patterns", href: "/app/my-patterns", icon: BookMarked },
  { label: "Tutorials", href: "/app/tutorials", icon: GraduationCap },
];

const PREVIEW_TUTORIALS = tutorialsData.slice(0, 3);
const supabase = createClient();

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const initials = userEmail
    ? userEmail.slice(0, 2).toUpperCase()
    : "?";

  return (
    <Sidebar collapsible="icon" className="border-none bg-white">
      {/* Logo */}
      <SidebarHeader className="border-none group-data-[collapsible=icon]:p-0">
        <Link
          href="/app"
          className="flex items-center gap-3 px-4 py-5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-5"
        >
          <div className="shrink-0 w-9 h-9 flex items-center justify-center">
            <Image
              src="/images/logos/logo-black.png"
              alt="MyToys Crate"
              width={36}
              height={36}
              className="object-contain"
            />
          </div>
          <span className="font-bold text-[16px] text-[var(--color-ink)] group-data-[collapsible=icon]:hidden">
            MyToys Crate
          </span>
        </Link>
      </SidebarHeader>

      {/* Nav items */}
      <SidebarContent className="border-none">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-[5px]">
              {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
                const isActive =
                  href === "/app"
                    ? pathname === "/app"
                    : pathname.startsWith(href);
                return (
                  <React.Fragment key={label}>
                    <SidebarMenuItem>
                      <Link
                        href={href}
                        className={`flex flex-row items-center gap-3 w-full px-3 py-2.5 rounded-[12px] font-semibold text-[14px] transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:size-9 group-data-[collapsible=icon]:mx-auto ${
                          isActive
                            ? "bg-[var(--color-brand)] text-white"
                            : "text-[var(--color-warm)] hover:bg-[var(--color-brand)]/10 hover:text-[var(--color-brand)]"
                        }`}
                      >
                        <Icon size={18} className="shrink-0" />
                        <span className="group-data-[collapsible=icon]:hidden">
                          {label}
                        </span>
                      </Link>

                      {/* Sidebar preview items — only in expanded mode */}
                      {label === "My Patterns" && (
                        <div className="pl-9 pb-1 flex flex-col gap-0.5 group-data-[collapsible=icon]:hidden">
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              className="h-3 rounded-[6px] bg-[var(--color-warm)]/15 animate-pulse my-1"
                              style={{ width: i === 0 ? "70%" : i === 1 ? "55%" : "65%" }}
                            />
                          ))}
                        </div>
                      )}

                      {label === "Tutorials" && (
                        <div className="pl-9 pb-1 flex flex-col gap-0.5 group-data-[collapsible=icon]:hidden">
                          {PREVIEW_TUTORIALS.map((t) => (
                            <Link
                              key={t.slug}
                              href={`/app/tutorials/${t.slug}`}
                              className="text-[12px] text-[var(--color-warm)] hover:text-[var(--color-brand)] truncate py-1 transition-colors"
                            >
                              {t.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </SidebarMenuItem>

                    {(label === "Studio" || label === "My Patterns") && (
                      <div
                        key={`divider-${label}`}
                        className="mx-3 my-1 h-px bg-[var(--color-border-soft)] group-data-[collapsible=icon]:mx-1"
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User account with dropdown */}
      <SidebarFooter className="px-3 py-4 border-none">
        <div ref={dropdownRef} className="relative">
          {/* Notifications panel */}
          {notificationsOpen && (
            <NotificationsPanel
              onBack={() => { setNotificationsOpen(false); setDropdownOpen(true); }}
              onClose={() => setNotificationsOpen(false)}
            />
          )}

          {/* User dropdown menu */}
          {dropdownOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-[12px] border border-[var(--color-border-soft)] shadow-lg overflow-hidden py-1 z-50">
              <button
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-[var(--color-warm)] hover:bg-[var(--color-brand)]/10 hover:text-[var(--color-brand)] transition-colors cursor-pointer"
                onClick={() => {
                  setDropdownOpen(false);
                  setNotificationsOpen(true);
                }}
              >
                <Bell size={15} />
                <span>Notifications</span>
              </button>
              <Link
                href="/app/settings"
                className="flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-[var(--color-warm)] hover:bg-[var(--color-brand)]/10 hover:text-[var(--color-brand)] transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <Settings size={15} />
                <span>Settings</span>
              </Link>
              <Link
                href="/app/billing"
                className="flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-[var(--color-warm)] hover:bg-[var(--color-brand)]/10 hover:text-[var(--color-brand)] transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <CreditCard size={15} />
                <span>Billing</span>
              </Link>
              <button
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-[var(--color-warm)] hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut size={15} />
                <span className="group-data-[collapsible=icon]:hidden">
                  Log out
                </span>
              </button>
            </div>
          )}

          {/* User card button */}
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-[12px] hover:bg-[var(--color-brand)]/10 transition-colors cursor-pointer group-data-[collapsible=icon]:justify-center"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--color-brand)] flex items-center justify-center shrink-0">
              <span className="text-white text-[12px] font-bold">{initials}</span>
            </div>
            <div className="flex flex-col min-w-0 text-left group-data-[collapsible=icon]:hidden flex-1">
              <span className="text-[11px] text-[var(--color-warm)] truncate">
                {userEmail ?? "Loading..."}
              </span>
            </div>
            <ChevronUp
              size={14}
              className={`text-[var(--color-warm)] shrink-0 transition-transform group-data-[collapsible=icon]:hidden ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
