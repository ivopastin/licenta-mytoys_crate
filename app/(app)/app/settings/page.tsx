import { createClient } from "@/lib/supabase/server";
import TabNav from "./TabNav";
import ProfileSection from "./ProfileSection";
import AccountSection from "./AccountSection";
import BillingSection from "./BillingSection";
import { Suspense } from "react";

type Tab = "profile" | "account" | "billing";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const activeTab: Tab =
    tab === "account" || tab === "billing" ? tab : "profile";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile: {
    display_name: string | null;
    avatar_color: string | null;
    experience_level: string | null;
  } | null = null;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("display_name, avatar_color, experience_level")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <div className="relative h-full w-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-8 py-10 flex flex-col gap-8">
        {/* Header */}
        <h1 className="text-[28px] font-bold text-white leading-tight">Settings</h1>

        {/* Two-column layout */}
        <div className="flex gap-8 items-start">
          {/* Left: Tab nav */}
          <Suspense>
            <TabNav />
          </Suspense>

          {/* Right: Active section */}
          <div className="flex-1 bg-white rounded-[16px] p-6">
            {activeTab === "profile" && user && (
              <ProfileSection
                userId={user.id}
                initialDisplayName={profile?.display_name ?? null}
                initialAvatarColor={profile?.avatar_color ?? null}
                initialExperienceLevel={profile?.experience_level ?? null}
              />
            )}
            {activeTab === "account" && <AccountSection />}
            {activeTab === "billing" && (
              <BillingSection displayName={profile?.display_name ?? null} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
