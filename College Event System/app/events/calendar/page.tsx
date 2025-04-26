"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layouts/main-layout"
import { getUserRegistrations, getEvents, type Event } from "@/lib/data"
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import Link from "next/link"

type CalendarEvent = Event & {
  registrationStatus?: "pending" | "approved" | "rejected" | "attended"
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedDateEvents, setSelectedDateEvents] = useState<CalendarEvent[]>([])

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        // Get all events
        const allEvents = await getEvents()

        // Get user registrations
        const userRegistrations = await getUserRegistrations("user1")

        // Map registrations to events
        const eventsWithRegistration = allEvents.map((event) => {
          const registration = userRegistrations.find((reg) => reg.eventId === event.id)
          return {
            ...event,
            registrationStatus: registration?.status,
          }
        })

        setEvents(eventsWithRegistration)
      } catch (error) {
        console.error("Failed to load calendar data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    if (selectedDate && events.length > 0) {
      // Filter events for the selected date
      const dateEvents = events.filter((event) => {
        const eventDate = new Date(event.date)
        return (
          eventDate.getDate() === selectedDate.getDate() &&
          eventDate.getMonth() === selectedDate.getMonth() &&
          eventDate.getFullYear() === selectedDate.getFullYear()
        )
      })
      setSelectedDateEvents(dateEvents)
    } else {
      setSelectedDateEvents([])
    }
  }, [selectedDate, events])

  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11)
        setCurrentYear(currentYear - 1)
      } else {
        setCurrentMonth(currentMonth - 1)
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0)
        setCurrentYear(currentYear + 1)
      } else {
        setCurrentMonth(currentMonth + 1)
      }
    }
  }

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth)
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth)
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 border border-gray-200 dark:border-gray-700"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day)
      const isToday =
        date.getDate() === new Date().getDate() &&
        date.getMonth() === new Date().getMonth() &&
        date.getFullYear() === new Date().getFullYear()

      const isSelected =
        selectedDate &&
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear()

      // Check if there are events on this day
      const dateEvents = events.filter((event) => {
        const eventDate = new Date(event.date)
        return (
          eventDate.getDate() === day &&
          eventDate.getMonth() === currentMonth &&
          eventDate.getFullYear() === currentYear
        )
      })

      days.push(
        <div
          key={day}
          className={cn(
            "h-24 border border-gray-200 dark:border-gray-700 p-1 transition-colors cursor-pointer",
            isToday && "bg-blue-50 dark:bg-blue-900/20",
            isSelected && "ring-2 ring-purple-500 dark:ring-purple-400",
            dateEvents.length > 0 && "hover:bg-gray-50 dark:hover:bg-gray-800",
          )}
          onClick={() => setSelectedDate(date)}
        >
          <div className="flex justify-between items-start">
            <span
              className={cn(
                "inline-block w-6 h-6 text-center text-sm",
                isToday && "bg-blue-500 text-white rounded-full",
              )}
            >
              {day}
            </span>
            {dateEvents.length > 0 && <Badge className="bg-purple-500">{dateEvents.length}</Badge>}
          </div>
          <div className="mt-1 space-y-1 overflow-hidden max-h-16">
            {dateEvents.slice(0, 2).map((event, idx) => (
              <div
                key={idx}
                className="text-xs truncate px-1 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
              >
                {event.title}
              </div>
            ))}
            {dateEvents.length > 2 && (
              <div className="text-xs text-gray-500 dark:text-gray-400 pl-1">+{dateEvents.length - 2} more</div>
            )}
          </div>
        </div>,
      )
    }

    return days
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <CalendarIcon className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2" />
            <h1 className="text-3xl font-bold">My Calendar</h1>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => setSelectedDate(new Date())}>
              Today
            </Button>
            <div className="flex items-center space-x-1">
              <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-96 w-full" />
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold">
                {monthNames[currentMonth]} {currentYear}
              </h2>
            </div>

            <div className="grid grid-cols-7 text-center py-2 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              {dayNames.map((day) => (
                <div key={day} className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">{renderCalendar()}</div>
          </div>
        )}

        {selectedDate && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">
              Events for{" "}
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </h2>

            {selectedDateEvents.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">No events scheduled for this day</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDateEvents.map((event) => (
                  <div key={event.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-48 h-32 md:h-auto">
                        <img
                          src={event.image || "/placeholder.svg"}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">{event.title}</h3>
                          {event.registrationStatus && (
                            <Badge
                              className={cn(
                                event.registrationStatus === "approved" && "bg-green-500",
                                event.registrationStatus === "pending" && "bg-yellow-500",
                                event.registrationStatus === "rejected" && "bg-red-500",
                                event.registrationStatus === "attended" && "bg-blue-500",
                              )}
                            >
                              {event.registrationStatus.charAt(0).toUpperCase() + event.registrationStatus.slice(1)}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{event.time}</span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{event.location}</span>
                        </div>

                        <div className="mt-4">
                          <Link href={`/events/${event.id}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
