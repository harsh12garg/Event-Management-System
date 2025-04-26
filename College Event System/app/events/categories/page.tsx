"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layouts/main-layout"
import { getEvents, type Event, type EventCategory } from "@/lib/data"
import { Tag, ChevronRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface CategoryData {
  name: EventCategory
  count: number
  image: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const allEvents = await getEvents()

        // Count events by category
        const categoryCounts: Record<string, { count: number; events: Event[] }> = {}

        allEvents.forEach((event) => {
          if (!categoryCounts[event.category]) {
            categoryCounts[event.category] = { count: 0, events: [] }
          }
          categoryCounts[event.category].count += 1
          categoryCounts[event.category].events.push(event)
        })

        // Create category data with images
        const categoryData: CategoryData[] = Object.entries(categoryCounts).map(([name, data]) => ({
          name: name as EventCategory,
          count: data.count,
          // Use the first event image for the category, or a default
          image: data.events[0]?.image || "/placeholder.svg",
        }))

        // Sort by count (most popular first)
        categoryData.sort((a, b) => b.count - a.count)

        setCategories(categoryData)
      } catch (error) {
        console.error("Failed to load categories:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case "academic":
        return "from-blue-500 to-blue-600"
      case "cultural":
        return "from-purple-500 to-purple-600"
      case "sports":
        return "from-green-500 to-green-600"
      case "workshop":
        return "from-yellow-500 to-yellow-600"
      case "seminar":
        return "from-indigo-500 to-indigo-600"
      case "competition":
        return "from-red-500 to-red-600"
      case "hackathon":
        return "from-teal-500 to-teal-600"
      case "conference":
        return "from-sky-500 to-sky-600"
      case "social":
        return "from-pink-500 to-pink-600"
      case "career":
        return "from-orange-500 to-orange-600"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Tag className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2" />
          <h1 className="text-3xl font-bold">Event Categories</h1>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category.name} href={`/events?category=${category.name}`} className="group block">
                <div className="relative h-48 rounded-lg overflow-hidden shadow-md transition-transform group-hover:scale-[1.02]">
                  {/* Background image with overlay */}
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${category.image})` }}
                  />
                  <div
                    className={cn("absolute inset-0 bg-gradient-to-br opacity-90", getCategoryColor(category.name))}
                  />

                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                    <div>
                      <h2 className="text-2xl font-bold capitalize">{category.name}</h2>
                      <p className="mt-2 text-white/90">
                        {category.count} {category.count === 1 ? "event" : "events"} available
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Browse events</span>
                      <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
