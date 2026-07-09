"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  BellIcon,
  InboxIcon,
  SendIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightLeftIcon,
  Loader2Icon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type NotificationType =
  | "BIRTH_SUBMITTED"
  | "BIRTH_PENDING_APPROVAL"
  | "BIRTH_APPROVED"
  | "BIRTH_DECLINED"
  | "TRANSFER_REQUESTED"
  | "TRANSFER_APPROVED"

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  link: string | null
  read: boolean
  createdAt: string
}

const TYPE_ICON: Record<NotificationType, React.ElementType> = {
  BIRTH_SUBMITTED: InboxIcon,
  BIRTH_PENDING_APPROVAL: SendIcon,
  BIRTH_APPROVED: CheckCircleIcon,
  BIRTH_DECLINED: XCircleIcon,
  TRANSFER_REQUESTED: ArrowRightLeftIcon,
  TRANSFER_APPROVED: ArrowRightLeftIcon,
}

const POLL_INTERVAL_MS = 30_000

function timeAgo(iso: string): string {
  const diffSec = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000)
  if (diffSec < 60) return "à l'instant"
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `il y a ${diffMin} min`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `il y a ${diffH} h`
  const diffD = Math.floor(diffH / 24)
  return `il y a ${diffD} j`
}

export function NotificationBell() {
  const router = useRouter()
  const [notifications, setNotifications] = React.useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  const [open, setOpen] = React.useState(false)

  const fetchNotifications = React.useCallback(async () => {
    try {
      const res = await fetch("/api/notifications")
      if (!res.ok) return
      const data = await res.json()
      setNotifications(data.notifications ?? [])
      setUnreadCount(data.unreadCount ?? 0)
    } catch {
      // silencieux — nouvelle tentative au prochain intervalle
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  async function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    setUnreadCount((c) => Math.max(0, c - 1))
    await fetch("/api/notifications/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).catch(() => {})
  }

  async function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
    await fetch("/api/notifications/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    }).catch(() => {})
  }

  function onSelectNotification(n: Notification) {
    setOpen(false)
    if (!n.read) markRead(n.id)
    if (n.link) router.push(n.link)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <BellIcon className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold flex items-center justify-center leading-none">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 max-w-[90vw] p-0">
        <div className="flex items-center justify-between px-3 py-2.5 border-b">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Notifications
          </span>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="text-[11px] font-medium text-primary hover:underline cursor-pointer"
            >
              Tout marquer comme lu
            </button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center px-4">
              <BellIcon className="mb-1.5 size-5 text-muted-foreground/40" />
              <p className="text-xs text-muted-foreground">Aucune notification pour le moment.</p>
            </div>
          ) : (
            <ul className="py-1">
              {notifications.map((n) => {
                const Icon = TYPE_ICON[n.type] ?? BellIcon
                const content = (
                  <div className="flex items-start gap-2.5">
                    {!n.read && (
                      <span className="mt-1.5 size-1.5 rounded-full bg-primary shrink-0" />
                    )}
                    <Icon className={cn("size-4 shrink-0 mt-0.5", n.read ? "text-muted-foreground" : "text-primary")} />
                    <div className="min-w-0 flex-1">
                      <p className={cn("text-xs truncate", n.read ? "font-medium" : "font-semibold")}>
                        {n.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground/70 mt-0.5">{timeAgo(n.createdAt)}</p>
                    </div>
                  </div>
                )
                return (
                  <li key={n.id}>
                    {n.link ? (
                      <Link
                        href={n.link}
                        onClick={() => onSelectNotification(n)}
                        className={cn(
                          "block px-3 py-2.5 hover:bg-muted transition-colors",
                          !n.read && "bg-primary/5"
                        )}
                      >
                        {content}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onSelectNotification(n)}
                        className={cn(
                          "block w-full text-left px-3 py-2.5 hover:bg-muted transition-colors cursor-pointer",
                          !n.read && "bg-primary/5"
                        )}
                      >
                        {content}
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
