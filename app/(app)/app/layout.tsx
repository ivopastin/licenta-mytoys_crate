import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 flex bg-white">
      <SidebarProvider>
        <AppSidebar />

        {/* Content area — only this side has margin + rounded corners */}
        <main className="flex-1 overflow-hidden p-2">
          <div className="relative h-full rounded-[16px] overflow-hidden">
            {/* Collapse trigger — top left corner of content */}
            <div className="absolute top-3 left-3 z-20">
              <SidebarTrigger className="text-[#716458] hover:text-[#417c9c] hover:bg-[#417c9c]/10 rounded-[8px]" />
            </div>
            {children}
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}
