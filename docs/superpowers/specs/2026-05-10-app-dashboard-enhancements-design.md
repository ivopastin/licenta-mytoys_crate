# App Dashboard Enhancements — Design Spec

**Date:** 2026-05-10
**Status:** Approved

## Overview

Four UI enhancements to the `/app` dashboard and sidebar:

1. A floating **Help button** (bottom-right of content area) with a popover of support links
2. **News card expand** — clicking a card opens it in a centered dialog with a dark backdrop
3. **Sidebar preview items** — first 3 tutorials (real) and 3 skeleton placeholders under My Patterns shown below their nav links
4. **Notifications popover** in the user account dropdown

---

## 1. Help Button

**File:** `app/(app)/app/components/HelpButton.tsx`

**Placement:** Rendered inside `<main>` in `app/(app)/app/layout.tsx`, positioned `absolute bottom-5 right-5 z-30`.

**Trigger:** A circular `?` button (~36px), styled `bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm border border-white/20`.

**Popover:** Appears above the button when clicked, toggled via `useState`. Dismissed by clicking outside (via `useRef` + `mousedown` listener — same pattern as the sidebar dropdown).

**Popover contents (all placeholder links for now):**
- Documentation (`href="#"`)
- Contact Support (`href="#"`)
- Keyboard Shortcuts (`href="#"`)
- What's New (`href="#"`)

**Popover style:** `bg-white rounded-[12px] border border-[#e0d9d5] shadow-lg py-1 w-48`. Each row: `flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-[#716458] hover:bg-[#417c9c]/10 hover:text-[#417c9c]` — matches the existing sidebar dropdown item style.

---

## 2. News Card Expand

**Files:**
- `app/(app)/app/components/NewsCard.tsx` — new component
- `app/(app)/app/page.tsx` — replace inline card markup with `<NewsCard>` usage

**Grid behavior:** Cards render identically to current layout. Added: `cursor-pointer hover:scale-[1.02] hover:bg-white/15 transition-transform duration-200`.

**On click:** Opens a dialog. State lives in `NewsCard` itself (`useState<boolean>`).

**Dialog implementation:** Rendered via `ReactDOM.createPortal` into `document.body` to avoid clipping from the scrollable content container.

**Dialog structure:**
- Backdrop: `fixed inset-0 bg-black/60 z-50 flex items-center justify-center` — clicking backdrop closes dialog
- Card: `bg-white/15 backdrop-blur-md border border-white/20 rounded-[20px] max-w-lg w-full mx-4 overflow-hidden` — click stops propagation
- Full-width image at top (`aspect-4/3`)
- Content: tag pill, title (`text-[18px] font-bold text-white`), full summary (no `line-clamp`), date
- `×` close button: `absolute top-3 right-3`, `bg-white/20 hover:bg-white/30 text-white rounded-full w-7 h-7`

---

## 3. Sidebar Preview Items

**File:** `app/(app)/app/AppSidebar.tsx`

**Placement:** Directly below the "My Patterns" and "Tutorials" nav items, indented `pl-9` to align with nav label text. Hidden in icon-collapsed mode via `group-data-[collapsible=icon]:hidden`.

### Tutorials preview
- Source: first 3 items from `content/tutorials.json` (imported statically)
- Each row: `<Link href={/app/tutorials/${slug}}>` with title in `text-[12px] text-[#716458] hover:text-[#417c9c] truncate py-1`

### My Patterns preview
- 3 skeleton rows: `rounded-[6px] bg-[#716458]/15 animate-pulse h-3 w-[70%] my-1.5`
- No interactivity — purely decorative placeholders

Both preview blocks are wrapped in a `div` with `px-3 pb-1 flex flex-col gap-0.5` to keep them tight under their nav item.

---

## 4. Notifications Panel

**Files:**
- `app/(app)/app/components/NotificationsPanel.tsx` — new component
- `app/(app)/app/AppSidebar.tsx` — add Bell nav item to dropdown, wire up panel

**Dropdown change:** Add a "Notifications" row above "Settings" in the user dropdown, using `Bell` icon from lucide-react. Clicking this row closes the user dropdown and opens the notifications popover.

**Notifications popover state:** Managed in `AppSidebar` alongside `dropdownOpen` with a second `notificationsOpen` boolean. The same `dropdownRef` + outside-click logic dismisses it.

**Popover placement:** Same absolute position as the user dropdown (`absolute bottom-full left-0 right-0 mb-2`), so it appears above the user card.

**Popover structure:**
- Header: `"Notifications"` label (`text-[13px] font-semibold text-[#1a1a1a]`) + `"Mark all read"` button (`text-[11px] text-[#716458] hover:text-[#417c9c]`) — no action yet
- Divider (`border-t border-[#e0d9d5] my-1`)
- 3 static placeholder notification rows, each with:
  - Colored dot indicator (`w-2 h-2 rounded-full bg-[#417c9c]`)
  - Message text (`text-[12px] text-[#1a1a1a] font-medium`)
  - Relative time (`text-[11px] text-[#716458]`)
- Empty state fallback: centered `"No notifications yet"` in `text-[12px] text-[#716458]` (shown when list is empty)

**Panel style:** Matches user dropdown: `bg-white rounded-[12px] border border-[#e0d9d5] shadow-lg overflow-hidden py-1 z-50`.

---

## Component Map

| Component | File | Consumed by |
|---|---|---|
| `HelpButton` | `app/(app)/app/components/HelpButton.tsx` | `layout.tsx` |
| `NewsCard` | `app/(app)/app/components/NewsCard.tsx` | `page.tsx` |
| `NotificationsPanel` | `app/(app)/app/components/NotificationsPanel.tsx` | `AppSidebar.tsx` |
| Sidebar preview items | inline in `AppSidebar.tsx` | — |

---

## Out of Scope

- Real notifications data or API
- Real help documentation pages
- My Patterns data (patterns not implemented yet)
- Animations beyond simple CSS transitions
