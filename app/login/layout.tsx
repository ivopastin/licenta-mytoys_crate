export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-2.5 bg-white z-100 pointer-events-none" />
      <div className="fixed bottom-0 left-0 right-0 h-2.5 bg-white z-100 pointer-events-none" />
      <div className="fixed top-0 left-0 bottom-0 w-2.5 bg-white z-100 pointer-events-none" />
      <div className="fixed top-0 right-0 bottom-0 w-2.5 bg-white z-100 pointer-events-none" />
      <div className="fixed inset-2.5 overflow-hidden rounded-[16px]">
        {children}
      </div>
    </>
  );
}
