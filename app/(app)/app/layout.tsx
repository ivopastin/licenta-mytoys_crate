import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* White frame strips */}
      <div className="fixed top-0 left-0 right-0 h-2.5 bg-white z-[100] pointer-events-none" />
      <div className="fixed bottom-0 left-0 right-0 h-2.5 bg-white z-[100] pointer-events-none" />
      <div className="fixed top-0 left-0 bottom-0 w-2.5 bg-white z-[100] pointer-events-none" />
      <div className="fixed top-0 right-0 bottom-0 w-2.5 bg-white z-[100] pointer-events-none" />

      {/* Main container */}
      <div className="fixed inset-2.5 rounded-[16px] overflow-hidden bg-white flex">
        <SidebarProvider>
          <AppSidebar />

          {/* Content area */}
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
    </>
  );
}
