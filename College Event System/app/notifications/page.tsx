"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layouts/main-layout"
import { type Notification, getUserNotifications, markNotificationAsRead } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Bell, Calendar, Info, CheckCircle, AlertTriangle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadNotifications() {
      try {
        const data = await getUserNotifications("user1") // Hardcoded user ID for demo
        setNotifications(data)
      } catch (error) {
        console.error("Failed to load notifications:", error)
      } finally {
        setLoading(false)
      }
    }

    loadNotifications()
  }, [])

  const markAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id)
      setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await Promise.all(notifications.filter((notif) => !notif.read).map((notif) => markNotificationAsRead(notif.id)))

      setNotifications(notifications.map((notif) => ({ ...notif, read: true })))
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error)
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Notifications</h1>
            <Skeleton className="h-10 w-32" />
          </div>

          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <div className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MainLayout>
    )
  }

  const unreadCount = notifications.filter((notif) => !notif.read).length

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              Mark All as Read
            </Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <Bell className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Notifications</h2>
            <p className="text-gray-600 dark:text-gray-400">You don't have any notifications yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-colors",
                  !notification.read && "border-l-4 border-blue-500",
                )}
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center",
                        getNotificationIconBackground(notification.type),
                      )}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap justify-between gap-2 mb-1">
                      <h3 className={cn("font-medium", !notification.read && "font-semibold")}>{notification.title}</h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(notification.date)}</span>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mb-2">{notification.message}</p>

                    <div className="flex justify-between items-center">
                      {notification.eventId && (
                        <Button variant="link" className="p-0 h-auto" asChild>
                          <a href={`/events/${notification.eventId}`}>View Event</a>
                        </Button>
                      )}

                      {!notification.read && (
                        <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                          Mark as Read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}

function getNotificationIcon(type: string) {
  switch (type) {
    case "registration":
      return <Calendar className="h-5 w-5 text-white" />
    case "reminder":
      return <Bell className="h-5 w-5 text-white" />
    case "update":
      return <Info className="h-5 w-5 text-white" />
    case "approval":
      return <CheckCircle className="h-5 w-5 text-white" />
    default:
      return <AlertTriangle className="h-5 w-5 text-white" />
  }
}

function getNotificationIconBackground(type: string) {
  switch (type) {
    case "registration":
      return "bg-purple-500"
    case "reminder":
      return "bg-yellow-500"
    case "update":
      return "bg-blue-500"
    case "approval":
      return "bg-green-500"
    default:
      return "bg-gray-500"
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return "Today"
  } else if (diffDays === 1) {
    return "Yesterday"
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }
}
