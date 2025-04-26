"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Bell, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void
}

export function Header({ setSidebarOpen }: HeaderProps) {
  const { setTheme } = useTheme()
  const pathname = usePathname()
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const isAdmin = pathname.includes("/admin")
  const pageTitle = getPageTitle(pathname)

  return (
    <header className="fixed top-0 z-10 w-full bg-white dark:bg-gray-800 border-b dark:border-gray-700 h-16">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open sidebar</span>
          </Button>
          <h1 className="ml-2 lg:ml-0 text-xl font-semibold text-gray-800 dark:text-white">{pageTitle}</h1>
        </div>

        <div className="flex items-center space-x-2">
          {isAdmin ? (
            <Link href="/">
              <Button variant="outline" size="sm">
                Exit Admin
              </Button>
            </Link>
          ) : (
            <Link href="/admin">
              <Button variant="outline" size="sm">
                Admin Panel
              </Button>
            </Link>
          )}

          <Button variant="ghost" size="icon" onClick={() => setNotificationsOpen(!notificationsOpen)}>
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

function getPageTitle(pathname: string): string {
  if (pathname === "/") return "Dashboard"
  if (pathname === "/events") return "Events"
  if (pathname.startsWith("/events/")) return "Event Details"
  if (pathname === "/registrations") return "My Registrations"
  if (pathname === "/notifications") return "Notifications"
  if (pathname === "/admin") return "Admin Dashboard"
  if (pathname === "/admin/events") return "Manage Events"
  if (pathname.startsWith("/admin/events/")) return "Edit Event"
  if (pathname === "/admin/participants") return "Participants"
  if (pathname === "/admin/settings") return "Settings"

  return "College Events"
}
