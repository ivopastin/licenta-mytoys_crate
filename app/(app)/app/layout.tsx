import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 flex bg-white">
      <SidebarProvider>
        <AppSidebar />

        {/* Content area — only this side has margin + rounded corners */}
        <main className="flex-1 overflow-hidden p-2">
          <div className="relative h-full rounded-[16px] overflow-hidden bg-[#2a3f4f]">
            <div className="absolute top-4.5 left-3 z-20">
              <SidebarTrigger className="text-white/70 hover:text-white hover:bg-white/15 rounded-[8px]" />
            </div>
            {children}
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}
