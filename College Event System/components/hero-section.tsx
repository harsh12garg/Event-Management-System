"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Calendar, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [backgroundIndex, setBackgroundIndex] = useState(0)

  const backgrounds = [
    "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundIndex((prevIndex) => (prevIndex + 1) % backgrounds.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [backgrounds.length])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/events?search=${encodeURIComponent(searchTerm)}`)
    }
  }

  return (
    <div className="relative bg-gradient-to-r from-purple-600 to-blue-500 text-white overflow-hidden">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-1000 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgrounds[backgroundIndex]})`,
          opacity: 0.3,
        }}
      />

      <div className="relative container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Campus Events</h1>
          <p className="text-xl mb-8 opacity-90">
            Find and register for the latest events, workshops, and activities happening around your campus.
          </p>

          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for events..."
                  className="pl-10 h-12 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/70 focus-visible:ring-white/30"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button type="submit" className="h-12 px-6 bg-white text-purple-600 hover:bg-gray-100">
                Search
              </Button>
            </div>
          </form>

          <div className="flex flex-wrap gap-4">
            <a
              href="/events"
              className="bg-white text-purple-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Browse Events
            </a>
            <a
              href="/events?featured=true"
              className="bg-transparent border border-white hover:bg-white/10 px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
            >
              <MapPin className="mr-2 h-5 w-5" />
              Featured Events
            </a>
          </div>
        </div>
      </div>

      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
    </div>
  )
}
