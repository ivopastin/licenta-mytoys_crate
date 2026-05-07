"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Home,
  Wand2,
  BookMarked,
  Settings,
  LogOut,
  ChevronUp,
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

const NAV_ITEMS = [
  { label: "Home", href: "/app", icon: Home },
  { label: "Studio", href: "/app/studio", icon: Wand2 },
  { label: "My Patterns", href: "/app/my-patterns", icon: BookMarked },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          <span className="font-bold text-[16px] text-[#1a1a1a] group-data-[collapsible=icon]:hidden">
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
                  <SidebarMenuItem key={label}>
                    <Link
                      href={href}
                      className={`flex flex-row items-center gap-3 w-full px-3 py-2.5 rounded-[12px] font-semibold text-[14px] transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:size-9 group-data-[collapsible=icon]:mx-auto ${
                        isActive
                          ? "bg-[#417c9c] text-white"
                          : "text-[#716458] hover:bg-[#417c9c]/10 hover:text-[#417c9c]"
                      }`}
                    >
                      <Icon size={18} className="shrink-0" />
                      <span className="group-data-[collapsible=icon]:hidden">
                        {label}
                      </span>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User account with dropdown */}
      <SidebarFooter className="px-3 py-4 border-none">
        <div ref={dropdownRef} className="relative">
          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-[12px] border border-[#e0d9d5] shadow-lg overflow-hidden py-1 z-50">
              <Link
                href="/app/settings"
                className="flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-[#716458] hover:bg-[#417c9c]/10 hover:text-[#417c9c] transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <Settings size={15} />
                <span className="group-data-[collapsible=icon]:hidden">
                  Settings
                </span>
              </Link>
              <button
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-[#716458] hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
                onClick={() => setDropdownOpen(false)}
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
            className="w-full flex items-center gap-3 px-2 py-2 rounded-[12px] hover:bg-[#417c9c]/10 transition-colors cursor-pointer group-data-[collapsible=icon]:justify-center"
          >
            <div className="w-8 h-8 rounded-full bg-[#417c9c] flex items-center justify-center shrink-0">
              <span className="text-white text-[12px] font-bold">MP</span>
            </div>
            <div className="flex flex-col min-w-0 text-left group-data-[collapsible=icon]:hidden flex-1">
              <span className="text-[13px] font-semibold text-[#1a1a1a] truncate">
                Maria Pastin
              </span>
              <span className="text-[11px] text-[#716458] truncate">
                ivo.pastin@gmail.com
              </span>
            </div>
            <ChevronUp
              size={14}
              className={`text-[#716458] shrink-0 transition-transform group-data-[collapsible=icon]:hidden ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
