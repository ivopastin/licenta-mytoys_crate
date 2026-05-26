"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Home,
  Wand2,
  BookMarked,
  GraduationCap,
  Settings,
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
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { label: "Home", href: "/app", icon: Home },
  { label: "Studio", href: "/app/studio", icon: Wand2 },
  { label: "My Patterns", href: "/app/my-patterns", icon: BookMarked },
  { label: "Tutorials", href: "/app/tutorials", icon: GraduationCap },
];

const PREVIEW_TUTORIALS = tutorialsData.slice(0, 3);
const supabase = createClient();

function getInitials(displayName: string | null, email: string | null): string {
  if (displayName?.trim()) {
    return displayName
      .trim()
      .split(/\s+/)
      .map((w) => w[0].toUpperCase())
      .slice(0, 2)
      .join("");
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return "?";
}

interface AppSidebarProps {
  displayName: string | null;
  avatarColor: string | null;
  email: string | null;
  recentPatterns: { id: string; name: string; animal: string }[];
}

export default function AppSidebar({ displayName, avatarColor, email, recentPatterns }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const initials = getInitials(displayName, email);
  const color = avatarColor ?? "#417c9c";
  const label = displayName?.trim() || email || "Your account";

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
          <span className="font-bold text-[16px] text-ink group-data-[collapsible=icon]:hidden">
            MyToys Crate
          </span>
        </Link>
      </SidebarHeader>

      {/* Nav items */}
      <SidebarContent className="border-none">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.25">
              {NAV_ITEMS.map(({ label: navLabel, href, icon: Icon }) => {
                const isActive =
                  href === "/app"
                    ? pathname === "/app"
                    : pathname.startsWith(href);
                return (
                  <React.Fragment key={navLabel}>
                    <SidebarMenuItem>
                      <Link
                        href={href}
                        className={`flex flex-row items-center gap-3 w-full px-3 py-2.5 rounded-[12px] font-semibold text-[14px] transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:size-9 group-data-[collapsible=icon]:mx-auto ${
                          isActive
                            ? "bg-brand text-white"
                            : "text-warm hover:bg-brand/10 hover:text-brand"
                        }`}
                      >
                        <Icon size={18} className="shrink-0" />
                        <span className="group-data-[collapsible=icon]:hidden">
                          {navLabel}
                        </span>
                      </Link>

                      {navLabel === "My Patterns" && (
                        <div className="pl-9 pb-1 flex flex-col gap-0.5 group-data-[collapsible=icon]:hidden">
                          {recentPatterns.length === 0 ? (
                            [0, 1, 2].map((i) => (
                              <div
                                key={i}
                                className="h-3 rounded-[6px] bg-warm/15 animate-pulse my-1"
                                style={{ width: i === 0 ? "70%" : i === 1 ? "55%" : "65%" }}
                              />
                            ))
                          ) : (
                            recentPatterns.map((p) => (
                              <Link
                                key={p.id}
                                href="/app/my-patterns"
                                className="text-[12px] text-warm hover:text-brand truncate py-1 transition-colors"
                              >
                                {p.name} the {p.animal.charAt(0).toUpperCase() + p.animal.slice(1)}
                              </Link>
                            ))
                          )}
                        </div>
                      )}

                      {navLabel === "Tutorials" && (
                        <div className="pl-9 pb-1 flex flex-col gap-0.5 group-data-[collapsible=icon]:hidden">
                          {PREVIEW_TUTORIALS.map((t) => (
                            <Link
                              key={t.slug}
                              href={`/app/tutorials/${t.slug}`}
                              className="text-[12px] text-warm hover:text-brand truncate py-1 transition-colors"
                            >
                              {t.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </SidebarMenuItem>

                    {(navLabel === "Studio" || navLabel === "My Patterns") && (
                      <div
                        key={`divider-${navLabel}`}
                        className="mx-3 my-1 h-px bg-border-soft group-data-[collapsible=icon]:mx-1"
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
          {notificationsOpen && (
            <NotificationsPanel
              onBack={() => { setNotificationsOpen(false); setDropdownOpen(true); }}
              onClose={() => setNotificationsOpen(false)}
            />
          )}

          {dropdownOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-[12px] border border-border-soft shadow-lg overflow-hidden py-1 z-50">
              <button
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-warm hover:bg-brand/10 hover:text-brand transition-colors cursor-pointer"
                onClick={() => { setDropdownOpen(false); setNotificationsOpen(true); }}
              >
                <Bell size={15} />
                <span>Notifications</span>
              </button>
              <Link
                href="/app/settings"
                className="flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-warm hover:bg-brand/10 hover:text-brand transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <Settings size={15} />
                <span>Settings</span>
              </Link>
              <button
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-warm hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut size={15} />
                <span className="group-data-[collapsible=icon]:hidden">Log out</span>
              </button>
            </div>
          )}

          {/* User card button */}
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-[12px] hover:bg-brand/10 transition-colors cursor-pointer group-data-[collapsible=icon]:justify-center"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: color }}
            >
              <span className="text-white text-[12px] font-bold">{initials}</span>
            </div>
            <div className="flex flex-col min-w-0 text-left group-data-[collapsible=icon]:hidden flex-1">
              <span className="text-[13px] font-semibold text-ink truncate">
                {label}
              </span>
              {displayName && (
                <span className="text-[11px] text-warm truncate">{email}</span>
              )}
            </div>
            <ChevronUp
              size={14}
              className={`text-warm shrink-0 transition-transform group-data-[collapsible=icon]:hidden ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
