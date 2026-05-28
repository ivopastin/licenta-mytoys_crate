export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-10 w-10 rounded-full border-[3px] border-[var(--color-border-soft)] border-t-[var(--color-brand)] animate-spin"
        />
        <p className="text-sm text-[var(--color-warm)] font-medium">Loading…</p>
      </div>
    </div>
  );
}
