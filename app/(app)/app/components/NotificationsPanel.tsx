import { ChevronLeft } from "lucide-react";

interface Notification {
  id: string;
  message: string;
  time: string;
  read: boolean;
}

const PLACEHOLDER_NOTIFICATIONS: Notification[] = [
  { id: "1", message: "New fox pattern is now available", time: "2 hours ago", read: false },
  { id: "2", message: "Your starter kit pattern was updated", time: "3 days ago", read: false },
  { id: "3", message: "Spring Bunny Limited Edition dropping soon", time: "1 week ago", read: true },
];

interface Props {
  onBack: () => void;
  onClose: () => void;
}

export default function NotificationsPanel({ onBack, onClose }: Props) {
  const notifications = PLACEHOLDER_NOTIFICATIONS;

  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-[12px] border border-[var(--color-border-soft)] shadow-lg overflow-hidden z-50">
      {/* Header */}
      <div className="flex items-center gap-1 px-2 py-2 border-b border-[var(--color-border-soft)]">
        <button
          onClick={onBack}
          className="p-1 rounded-[8px] text-[var(--color-warm)] hover:bg-[var(--color-brand)]/10 hover:text-[var(--color-brand)] transition-colors cursor-pointer"
          aria-label="Back"
        >
          <ChevronLeft size={15} />
        </button>
        <span className="flex-1 text-[13px] font-semibold text-[var(--color-ink)]">Notifications</span>
        <button className="text-[11px] text-[var(--color-warm)] hover:text-[var(--color-brand)] transition-colors cursor-pointer px-1">
          Mark all read
        </button>
      </div>

      {/* Notification list */}
      {notifications.length === 0 ? (
        <p className="text-[12px] text-[var(--color-warm)] text-center py-4">No notifications yet</p>
      ) : (
        <div className="py-1">
          {notifications.map((n) => (
            <button
              key={n.id}
              onClick={onClose}
              className="w-full flex items-start gap-2.5 px-3 py-2.5 hover:bg-[var(--color-brand)]/10 transition-colors text-left cursor-pointer"
            >
              <span
                className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${n.read ? "bg-[var(--color-border-soft)]" : "bg-[var(--color-brand)]"}`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-[var(--color-ink)] font-medium leading-snug">{n.message}</p>
                <p className="text-[11px] text-[var(--color-warm)] mt-0.5">{n.time}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
