"use client"

import Link from "next/link"
import { Calendar, MapPin, Users, Clock, Heart } from "lucide-react"
import type { Event } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EventCardProps {
  event: Event
  isSaved?: boolean
  onToggleSave?: (eventId: string) => void
  showActions?: boolean
}

export function EventCard({ event, isSaved = false, onToggleSave, showActions = true }: EventCardProps) {
  const isFullyBooked = event.registered >= event.capacity
  const registrationPercentage = Math.min(100, Math.round((event.registered / event.capacity) * 100))
  const isUpcoming = new Date(event.date) > new Date()

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-full flex flex-col transition-transform hover:translate-y-[-4px] hover:shadow-lg group">
      <Link href={`/events/${event.id}`} className="block relative">
        <div className="relative overflow-hidden">
          <img
            src={event.image || "/placeholder.svg"}
            alt={event.title}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {event.isFeatured && (
            <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              Featured
            </div>
          )}

          <Badge className={cn("absolute top-3 right-3", getCategoryColor(event.category))}>
            {formatCategory(event.category)}
          </Badge>
        </div>
      </Link>

      <div className="p-4 flex-1 flex flex-col">
        <Link href={`/events/${event.id}`}>
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {event.title}
          </h3>
        </Link>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
          <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="truncate">{formatDate(event.date)}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
          <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="truncate">{event.time}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{event.description}</p>

        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {event.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto">
          <div className="flex items-center justify-between text-sm mb-1">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Users className="h-4 w-4 mr-1" />
              <span>
                {event.registered}/{event.capacity}
              </span>
            </div>
            <span className="text-gray-600 dark:text-gray-400">{registrationPercentage}% Full</span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div
              className={cn(
                "h-1.5 rounded-full",
                registrationPercentage < 60
                  ? "bg-green-500"
                  : registrationPercentage < 85
                    ? "bg-yellow-500"
                    : "bg-red-500",
              )}
              style={{ width: `${registrationPercentage}%` }}
            ></div>
          </div>

          {showActions && (
            <div className="mt-4 flex gap-2">
              {!isUpcoming ? (
                <span className="block text-center py-2 flex-grow bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md font-medium">
                  Past Event
                </span>
              ) : !event.isRegistrationOpen ? (
                <span className="block text-center py-2 flex-grow bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md font-medium">
                  Registration Closed
                </span>
              ) : isFullyBooked ? (
                <span className="block text-center py-2 flex-grow bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md font-medium">
                  Fully Booked
                </span>
              ) : (
                <Link href={`/events/${event.id}`} className="flex-grow">
                  <span className="block text-center py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md font-medium">
                    Register Now
                  </span>
                </Link>
              )}

              {onToggleSave && (
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    "flex-shrink-0",
                    isSaved && "text-red-500 dark:text-red-400 border-red-200 dark:border-red-800",
                  )}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onToggleSave(event.id)
                  }}
                >
                  <Heart className={cn("h-4 w-4", isSaved && "fill-red-500 dark:fill-red-400")} />
                  <span className="sr-only">{isSaved ? "Unsave" : "Save"} event</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  }
  return new Date(dateString).toLocaleDateString("en-US", options)
}

function formatCategory(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1)
}

function getCategoryColor(category: string): string {
  switch (category) {
    case "academic":
      return "bg-blue-500 hover:bg-blue-600"
    case "cultural":
      return "bg-purple-500 hover:bg-purple-600"
    case "sports":
      return "bg-green-500 hover:bg-green-600"
    case "workshop":
      return "bg-yellow-500 hover:bg-yellow-600"
    case "seminar":
      return "bg-indigo-500 hover:bg-indigo-600"
    case "competition":
      return "bg-red-500 hover:bg-red-600"
    case "hackathon":
      return "bg-teal-500 hover:bg-teal-600"
    case "conference":
      return "bg-sky-500 hover:bg-sky-600"
    case "social":
      return "bg-pink-500 hover:bg-pink-600"
    case "career":
      return "bg-orange-500 hover:bg-orange-600"
    default:
      return "bg-gray-500 hover:bg-gray-600"
  }
}
