"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Calendar,
  Home,
  Users,
  Bell,
  Settings,
  LogOut,
  X,
  BarChart,
  Star,
  PlusCircle,
  FileText,
  Archive,
  Tag,
  Layout,
  CheckSquare,
  ClipboardList,
  UserCircle,
  CalendarDays,
  BarChart2,
  FileBarChart,
  ClipboardCheck,
  DollarSign,
  Briefcase,
  MapPin,
  Mic,
  Award,
  Megaphone,
  MessageSquare,
  Mail,
  ChevronDown,
  ChevronRight,
  Clock,
  Heart,
  Ticket,
  QrCode,
  HelpCircle,
  Zap,
  Palette,
  Smartphone,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
  current?: boolean
  badge?: number | string
  children?: NavItem[]
}

export function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname()
  const isAdmin = pathname.includes("/admin")
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    events: true,
    registrations: false,
    organization: false,
    communication: false,
  })

  // Toggle a collapsible group
  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }))
  }

  // Check if a path is active or one of its children is active
  const isActive = (href: string, children?: NavItem[]) => {
    if (pathname === href) return true
    if (children?.some((child) => pathname === child.href)) return true
    return pathname.startsWith(href + "/")
  }

  // User navigation
  const userNavigation: Record<string, NavItem[]> = {
    main: [{ name: "Dashboard", href: "/", icon: Home, current: pathname === "/" }],
    events: [
      {
        name: "All Events",
        href: "/events",
        icon: Calendar,
        current: pathname === "/events",
      },
      {
        name: "Featured Events",
        href: "/events/featured",
        icon: Star,
        current: pathname === "/events/featured",
      },
      {
        name: "My Calendar",
        href: "/events/calendar",
        icon: CalendarDays,
        current: pathname === "/events/calendar",
      },
      {
        name: "Saved Events",
        href: "/events/saved",
        icon: Heart,
        current: pathname === "/events/saved",
        badge: 3,
      },
      {
        name: "Event Categories",
        href: "/events/categories",
        icon: Tag,
        current: pathname === "/events/categories",
      },
    ],
    registrations: [
      {
        name: "My Registrations",
        href: "/registrations",
        icon: CheckSquare,
        current: pathname === "/registrations",
      },
      {
        name: "Tickets",
        href: "/registrations/tickets",
        icon: Ticket,
        current: pathname === "/registrations/tickets",
      },
      {
        name: "Check-in QR",
        href: "/registrations/qr",
        icon: QrCode,
        current: pathname === "/registrations/qr",
      },
      {
        name: "Past Events",
        href: "/registrations/past",
        icon: Clock,
        current: pathname === "/registrations/past",
      },
    ],
    user: [
      {
        name: "Notifications",
        href: "/notifications",
        icon: Bell,
        current: pathname === "/notifications",
        badge: 5,
      },
      {
        name: "Profile Settings",
        href: "/profile",
        icon: UserCircle,
        current: pathname === "/profile",
      },
      {
        name: "Help & Support",
        href: "/help",
        icon: HelpCircle,
        current: pathname === "/help",
      },
    ],
  }

  // Admin navigation
  const adminNavigation: Record<string, NavItem[]> = {
    main: [{ name: "Admin Dashboard", href: "/admin", icon: BarChart, current: pathname === "/admin" }],
    events: [
      {
        name: "Manage Events",
        href: "/admin/events",
        icon: Calendar,
        current: pathname === "/admin/events",
      },
      {
        name: "Create Event",
        href: "/admin/events/create",
        icon: PlusCircle,
        current: pathname === "/admin/events/create",
      },
      {
        name: "Event Drafts",
        href: "/admin/events/drafts",
        icon: FileText,
        current: pathname === "/admin/events/drafts",
        badge: 2,
      },
      {
        name: "Archived Events",
        href: "/admin/events/archived",
        icon: Archive,
        current: pathname === "/admin/events/archived",
      },
      {
        name: "Event Templates",
        href: "/admin/events/templates",
        icon: Layout,
        current: pathname === "/admin/events/templates",
      },
    ],
    registrations: [
      {
        name: "Participants",
        href: "/admin/participants",
        icon: Users,
        current: pathname === "/admin/participants",
      },
      {
        name: "Pending Approvals",
        href: "/admin/participants/pending",
        icon: Clock,
        current: pathname === "/admin/participants/pending",
        badge: 8,
      },
      {
        name: "Check-in System",
        href: "/admin/participants/checkin",
        icon: QrCode,
        current: pathname === "/admin/participants/checkin",
      },
      {
        name: "Attendance Reports",
        href: "/admin/participants/reports",
        icon: ClipboardList,
        current: pathname === "/admin/participants/reports",
      },
    ],
    organization: [
      {
        name: "Event Planning",
        href: "/admin/organization/planning",
        icon: ClipboardCheck,
        current: pathname === "/admin/organization/planning",
      },
      {
        name: "Budget Tracking",
        href: "/admin/organization/budget",
        icon: DollarSign,
        current: pathname === "/admin/organization/budget",
      },
      {
        name: "Resource Management",
        href: "/admin/organization/resources",
        icon: Briefcase,
        current: pathname === "/admin/organization/resources",
      },
      {
        name: "Venue Management",
        href: "/admin/organization/venues",
        icon: MapPin,
        current: pathname === "/admin/organization/venues",
      },
      {
        name: "Speaker Management",
        href: "/admin/organization/speakers",
        icon: Mic,
        current: pathname === "/admin/organization/speakers",
      },
      {
        name: "Sponsor Management",
        href: "/admin/organization/sponsors",
        icon: Award,
        current: pathname === "/admin/organization/sponsors",
      },
    ],
    communication: [
      {
        name: "Announcements",
        href: "/admin/communication/announcements",
        icon: Megaphone,
        current: pathname === "/admin/communication/announcements",
      },
      {
        name: "Feedback & Surveys",
        href: "/admin/communication/feedback",
        icon: MessageSquare,
        current: pathname === "/admin/communication/feedback",
      },
      {
        name: "Email Templates",
        href: "/admin/communication/emails",
        icon: Mail,
        current: pathname === "/admin/communication/emails",
      },
    ],
    analytics: [
      {
        name: "Analytics Dashboard",
        href: "/admin/analytics",
        icon: BarChart2,
        current: pathname === "/admin/analytics",
      },
      {
        name: "Reports",
        href: "/admin/analytics/reports",
        icon: FileBarChart,
        current: pathname === "/admin/analytics/reports",
      },
    ],
    settings: [
      {
        name: "General Settings",
        href: "/admin/settings",
        icon: Settings,
        current: pathname === "/admin/settings",
      },
      {
        name: "Appearance",
        href: "/admin/settings/appearance",
        icon: Palette,
        current: pathname === "/admin/settings/appearance",
      },
      {
        name: "Integrations",
        href: "/admin/settings/integrations",
        icon: Zap,
        current: pathname === "/admin/settings/integrations",
      },
      {
        name: "Mobile App",
        href: "/admin/settings/mobile",
        icon: Smartphone,
        current: pathname === "/admin/settings/mobile",
      },
    ],
  }

  // Select the appropriate navigation based on path
  const navigation = isAdmin ? adminNavigation : userNavigation

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar for mobile */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
          <Link href="/" className="flex items-center">
            <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2" />
            <span className="text-xl font-bold text-gray-800 dark:text-white">Campus Events</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="lg:hidden">
            <X className="h-6 w-6" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>

        <div className="flex flex-col justify-between h-[calc(100%-4rem)] overflow-y-auto">
          <nav className="px-2 py-4 space-y-1">
            {/* Main navigation */}
            {navigation.main.map((item) => (
              <NavLink key={item.name} item={item} onClick={() => setOpen(false)} />
            ))}

            {/* Events section */}
            <SidebarSection
              title="Events"
              expanded={expandedGroups.events}
              onToggle={() => toggleGroup("events")}
              items={navigation.events}
              onItemClick={() => setOpen(false)}
            />

            {/* Registrations section */}
            <SidebarSection
              title="Registrations"
              expanded={expandedGroups.registrations}
              onToggle={() => toggleGroup("registrations")}
              items={navigation.registrations}
              onItemClick={() => setOpen(false)}
            />

            {/* Organization section (admin only) */}
            {isAdmin && (
              <SidebarSection
                title="Organization"
                expanded={expandedGroups.organization}
                onToggle={() => toggleGroup("organization")}
                items={navigation.organization}
                onItemClick={() => setOpen(false)}
              />
            )}

            {/* Communication section (admin only) */}
            {isAdmin && (
              <SidebarSection
                title="Communication"
                expanded={expandedGroups.communication}
                onToggle={() => toggleGroup("communication")}
                items={navigation.communication}
                onItemClick={() => setOpen(false)}
              />
            )}

            {/* Analytics section (admin only) */}
            {isAdmin &&
              navigation.analytics.map((item) => (
                <NavLink key={item.name} item={item} onClick={() => setOpen(false)} />
              ))}

            {/* User section (non-admin only) */}
            {!isAdmin &&
              navigation.user.map((item) => <NavLink key={item.name} item={item} onClick={() => setOpen(false)} />)}

            {/* Settings section (admin only) */}
            {isAdmin &&
              navigation.settings.map((item) => <NavLink key={item.name} item={item} onClick={() => setOpen(false)} />)}
          </nav>

          <div className="p-4 border-t dark:border-gray-700">
            <div className="flex items-center">
              <Avatar>
                <AvatarImage
                  src={
                    isAdmin
                      ? "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=761&q=80"
                      : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                  }
                  alt="User"
                />
                <AvatarFallback>{isAdmin ? "AR" : "AJ"}</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {isAdmin ? "Dr. Emily Rodriguez" : "Alex Johnson"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {isAdmin ? "admin@college.edu" : "student@college.edu"}
                </p>
              </div>
            </div>
            <Button variant="ghost" className="mt-4 w-full justify-start text-gray-600 dark:text-gray-300">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

interface NavLinkProps {
  item: NavItem
  onClick?: () => void
}

function NavLink({ item, onClick }: NavLinkProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={item.href}
            className={cn(
              "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors relative",
              item.current
                ? "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
            )}
            onClick={onClick}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
            {item.badge && (
              <Badge
                className="ml-auto bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900"
                variant="secondary"
              >
                {item.badge}
              </Badge>
            )}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{item.name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface SidebarSectionProps {
  title: string
  expanded: boolean
  onToggle: () => void
  items: NavItem[]
  onItemClick?: () => void
}

function SidebarSection({ title, expanded, onToggle, items, onItemClick }: SidebarSectionProps) {
  return (
    <Collapsible open={expanded} onOpenChange={onToggle} className="space-y-1">
      <CollapsibleTrigger className="flex w-full items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
        {expanded ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
        {title}
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1 pl-4">
        {items.map((item) => (
          <NavLink key={item.name} item={item} onClick={onItemClick} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}
