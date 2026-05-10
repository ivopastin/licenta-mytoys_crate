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
  onClose: () => void;
}

export default function NotificationsPanel({ onClose }: Props) {
  const notifications = PLACEHOLDER_NOTIFICATIONS;

  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-[12px] border border-[#e0d9d5] shadow-lg overflow-hidden z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#e0d9d5]">
        <span className="text-[13px] font-semibold text-[#1a1a1a]">Notifications</span>
        <button className="text-[11px] text-[#716458] hover:text-[#417c9c] transition-colors cursor-pointer">
          Mark all read
        </button>
      </div>

      {/* Notification list */}
      {notifications.length === 0 ? (
        <p className="text-[12px] text-[#716458] text-center py-4">No notifications yet</p>
      ) : (
        <div className="py-1">
          {notifications.map((n) => (
            <button
              key={n.id}
              onClick={onClose}
              className="w-full flex items-start gap-2.5 px-3 py-2.5 hover:bg-[#417c9c]/10 transition-colors text-left cursor-pointer"
            >
              <span
                className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${n.read ? "bg-[#e0d9d5]" : "bg-[#417c9c]"}`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-[#1a1a1a] font-medium leading-snug">{n.message}</p>
                <p className="text-[11px] text-[#716458] mt-0.5">{n.time}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
