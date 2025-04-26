"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layouts/main-layout"
import { EventCard } from "@/components/events/event-card"
import { getSavedEvents, toggleSavedEvent, getCurrentUser, type Event } from "@/lib/data"
import { Skeleton } from "@/components/ui/skeleton"
import { Heart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function SavedEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string>("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const user = await getCurrentUser()
        setUserId(user.id)
        const savedEvents = await getSavedEvents(user.id)
        setEvents(savedEvents)
      } catch (error) {
        console.error("Failed to load saved events:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleToggleSave = async (eventId: string) => {
    if (!userId) return

    try {
      await toggleSavedEvent(userId, eventId)
      setEvents(events.filter((event) => event.id !== eventId))

      toast({
        title: "Event removed",
        description: "The event has been removed from your saved list",
      })
    } catch (error) {
      console.error("Failed to toggle saved event:", error)
      toast({
        title: "Error",
        description: "Failed to remove the event. Please try again.",
        variant: "destructive",
      })
    }
  }

  const confirmRemoveAll = () => {
    setIsDialogOpen(true)
  }

  const handleRemoveAll = async () => {
    if (!userId) return

    setLoading(true)
    try {
      // Remove all events one by one
      await Promise.all(events.map((event) => toggleSavedEvent(userId, event.id)))
      setEvents([])

      toast({
        title: "All events removed",
        description: "All events have been removed from your saved list",
      })
    } catch (error) {
      console.error("Failed to remove all saved events:", error)
      toast({
        title: "Error",
        description: "Failed to remove all events. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setIsDialogOpen(false)
    }
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Heart className="h-6 w-6 text-red-500 mr-2 fill-red-500" />
            <h1 className="text-3xl font-bold">Saved Events</h1>
          </div>

          {events.length > 0 && (
            <Button
              variant="outline"
              onClick={confirmRemoveAll}
              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-800 dark:hover:bg-red-950 dark:text-red-400"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove All
            </Button>
          )}
        </div>

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
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <Heart className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600" />
                <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400 mt-4">No saved events</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-500 mb-6">
                  You haven't saved any events yet. Browse events and click the heart icon to save them.
                </p>
                <Button asChild>
                  <a href="/events">Browse Events</a>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} isSaved={true} onToggleSave={handleToggleSave} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove all saved events?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all events from your saved list. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveAll} className="bg-red-500 hover:bg-red-600">
              Remove All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  )
}
