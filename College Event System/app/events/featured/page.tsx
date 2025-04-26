"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layouts/main-layout"
import { EventsGrid } from "@/components/events/events-grid"
import { EventFilters } from "@/components/events/event-filters"
import { getEvents, type Event } from "@/lib/data"
import { Skeleton } from "@/components/ui/skeleton"
import { Star } from "lucide-react"

export default function FeaturedEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadEvents() {
      setLoading(true)
      try {
        const data = await getEvents({ featured: true })
        setEvents(data)
      } catch (error) {
        console.error("Failed to load featured events:", error)
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Star className="h-6 w-6 text-yellow-500 mr-2" />
          <h1 className="text-3xl font-bold">Featured Events</h1>
        </div>

        <EventFilters />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {[...Array(3)].map((_, i) => (
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
        ) : (
          <>
            {events.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400">No featured events found</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-500">Check back later for new featured events</p>
              </div>
            ) : (
              <EventsGrid events={events} />
            )}
          </>
        )}
      </div>
    </MainLayout>
  )
}
