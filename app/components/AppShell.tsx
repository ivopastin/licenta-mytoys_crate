import Navbar from "./Navbar";
import BottomBlur from "./BottomBlur";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Fixed white frame that sits on top of all scrolling content */}
      <div className="fixed top-0 left-0 right-0 h-2.5 bg-white z-100 pointer-events-none" />
      <div className="fixed bottom-0 left-0 right-0 h-2.5 bg-white z-100 pointer-events-none" />
      <div className="fixed top-0 left-0 bottom-0 w-2.5 bg-white z-100 pointer-events-none" />
      <div className="fixed top-0 right-0 bottom-0 w-2.5 bg-white z-100 pointer-events-none" />

      <div className="fixed inset-2.5 text-font-primary overflow-hidden rounded-[16px]">
        <div className="h-full overflow-y-auto">
          <Navbar />
          {children}
        </div>
        <BottomBlur />
      </div>
    </>
  );
}
