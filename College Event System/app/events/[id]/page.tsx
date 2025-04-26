"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layouts/main-layout"
import { type Event, getEvent, registerForEvent } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Users, Share2, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import QRCode from "react-qr-code"

export default function EventDetailsPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [showQRDialog, setShowQRDialog] = useState(false)
  const [qrValue, setQrValue] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function loadEvent() {
      try {
        const data = await getEvent(params.id)
        if (data) {
          setEvent(data)
        } else {
          router.push("/events")
        }
      } catch (error) {
        console.error("Failed to load event:", error)
      } finally {
        setLoading(false)
      }
    }

    loadEvent()
  }, [params.id, router])

  const handleRegister = async () => {
    if (!event) return

    setRegistering(true)
    try {
      const registration = await registerForEvent(event.id, "user1") // Hardcoded user ID for demo

      toast({
        title: "Registration Successful",
        description: "You have successfully registered for this event.",
      })

      // Generate QR code with registration data
      setQrValue(
        JSON.stringify({
          eventId: event.id,
          eventTitle: event.title,
          registrationId: registration.id,
          userId: "user1",
          date: event.date,
          time: event.time,
          location: event.location,
        }),
      )

      setShowQRDialog(true)
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "There was an error registering for this event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setRegistering(false)
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-8 w-48 ml-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-64 w-full rounded-lg mb-6" />
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-6" />

              <Skeleton className="h-6 w-1/4 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
            </div>

            <div>
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!event) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
          <p className="mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push("/events")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
        </div>
      </MainLayout>
    )
  }

  const isFullyBooked = event.registered >= event.capacity
  const registrationPercentage = Math.min(100, Math.round((event.registered / event.capacity) * 100))

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6" onClick={() => router.push("/events")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <img
              src={event.image || "/placeholder.svg"}
              alt={event.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h1 className="text-3xl font-bold mr-3">{event.title}</h1>
              <Badge className={cn(getCategoryColor(event.category))}>{formatCategory(event.category)}</Badge>
            </div>

            <div className="flex flex-wrap gap-6 mb-6 text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{formatDate(event.date)}</span>
              </div>

              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>{event.time}</span>
              </div>

              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{event.location}</span>
              </div>

              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                <span>
                  {event.registered}/{event.capacity} Registered
                </span>
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-3">About This Event</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 whitespace-pre-line">{event.description}</p>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-medium mb-1">Organized by</h3>
                <p>{event.organizer}</p>
              </div>

              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-medium mb-1">Department</h3>
                <p>{formatDepartment(event.department)}</p>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md sticky top-20">
              <h2 className="text-xl font-semibold mb-4">Registration</h2>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Capacity</span>
                  <span>{registrationPercentage}% Full</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={cn(
                      "h-2 rounded-full",
                      registrationPercentage < 60
                        ? "bg-green-500"
                        : registrationPercentage < 85
                          ? "bg-yellow-500"
                          : "bg-red-500",
                    )}
                    style={{ width: `${registrationPercentage}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {event.capacity - event.registered} spots left
                </div>
              </div>

              {!event.isRegistrationOpen ? (
                <Button disabled className="w-full mb-4">
                  Registration Closed
                </Button>
              ) : isFullyBooked ? (
                <Button disabled className="w-full mb-4">
                  Fully Booked
                </Button>
              ) : (
                <Button className="w-full mb-4" onClick={handleRegister} disabled={registering}>
                  {registering ? "Registering..." : "Register Now"}
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  navigator
                    .share({
                      title: event.title,
                      text: `Check out this event: ${event.title}`,
                      url: window.location.href,
                    })
                    .catch(() => {
                      navigator.clipboard.writeText(window.location.href)
                      toast({
                        title: "Link Copied",
                        description: "Event link copied to clipboard",
                      })
                    })
                }}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share Event
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your Registration QR Code</DialogTitle>
            <DialogDescription>Present this QR code at the event entrance for check-in.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center p-4">
            <div className="bg-white p-4 rounded-lg">
              <QRCode value={qrValue} size={200} />
            </div>
            <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              Event: {event.title}
              <br />
              Date: {formatDate(event.date)}
              <br />
              Time: {event.time}
            </p>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="sm:w-auto w-full" onClick={() => setShowQRDialog(false)}>
              Close
            </Button>
            <Button
              className="sm:w-auto w-full"
              onClick={() => {
                router.push("/registrations")
              }}
            >
              View My Registrations
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  )
}

function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }
  return new Date(dateString).toLocaleDateString("en-US", options)
}

function formatCategory(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1)
}

function formatDepartment(department: string): string {
  if (department === "all") return "Campus-wide"

  return department
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
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
    default:
      return "bg-gray-500 hover:bg-gray-600"
  }
}
