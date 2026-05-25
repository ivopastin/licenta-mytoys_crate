import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import HelpButton from "./components/HelpButton";
import OnboardingModal from "./components/OnboardingModal";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile: {
    display_name: string | null;
    avatar_color: string | null;
    experience_level: string | null;
    onboarding_completed: boolean;
  } | null = null;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("display_name, avatar_color, experience_level, onboarding_completed")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  const showOnboarding = profile !== null && !profile.onboarding_completed;

  return (
    <div className="fixed inset-0 flex bg-white">
      <SidebarProvider>
        <AppSidebar
          displayName={profile?.display_name ?? null}
          avatarColor={profile?.avatar_color ?? null}
          email={user?.email ?? null}
        />

        <main className="flex-1 overflow-hidden p-2">
          <div className="relative h-full rounded-[16px] overflow-hidden bg-[#2a3f4f]">
            <div className="absolute top-4.5 left-3 z-20">
              <SidebarTrigger className="text-white/70 hover:text-white hover:bg-white/15 rounded-[8px]" />
            </div>
            {children}
            <HelpButton />
          </div>
        </main>
      </SidebarProvider>

      {showOnboarding && <OnboardingModal />}
    </div>
  );
}
