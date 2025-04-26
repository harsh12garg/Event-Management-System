"use client"

import { useState, useEffect } from "react"
import { EventCard } from "@/components/events/event-card"
import { type Event, getEvents } from "@/lib/data"
import { useSearchParams } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

export function EventsGrid() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()

  const category = searchParams.get("category") as any
  const department = searchParams.get("department") as any
  const date = searchParams.get("date") as string

  useEffect(() => {
    async function loadEvents() {
      setLoading(true)
      try {
        const filters: any = {}
        if (category) filters.category = category
        if (department) filters.department = department
        if (date) filters.date = date

        const data = await getEvents(Object.keys(filters).length ? filters : undefined)
        setEvents(data)
      } catch (error) {
        console.error("Failed to load events:", error)
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [category, department, date])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400">No events found matching your criteria</h3>
        <p className="mt-2 text-gray-500 dark:text-gray-500">
          Try adjusting your filters or check back later for new events
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}
