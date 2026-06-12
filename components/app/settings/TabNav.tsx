"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { User, Lock, CreditCard } from "lucide-react";

const TABS = [
  { key: "profile", label: "Profile", icon: User },
  { key: "account", label: "Account", icon: Lock },
  { key: "billing", label: "Billing", icon: CreditCard },
];

export default function TabNav() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "profile";

  return (
    <nav className="flex flex-col gap-1 w-[180px] shrink-0">
      {TABS.map(({ key, label, icon: Icon }) => {
        const isActive = activeTab === key;
        return (
          <Link
            key={key}
            href={`/app/settings?tab=${key}`}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[14px] font-semibold transition-colors ${
              isActive
                ? "bg-white/20 text-white"
                : "text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon size={16} className="shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
