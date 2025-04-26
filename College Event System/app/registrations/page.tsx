"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layouts/main-layout"
import { type Registration, type Event, getUserRegistrations } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, CheckCircle, XCircle, Clock3 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import QRCode from "react-qr-code"

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<(Registration & { event: Event })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRegistrations() {
      try {
        const data = await getUserRegistrations("user1") // Hardcoded user ID for demo
        setRegistrations(data)
      } catch (error) {
        console.error("Failed to load registrations:", error)
      } finally {
        setLoading(false)
      }
    }

    loadRegistrations()
  }, [])

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">My Registrations</h1>

          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <Skeleton className="h-40 w-full md:w-48 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="h-8 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <div className="flex gap-4">
                      <Skeleton className="h-10 w-24" />
                      <Skeleton className="h-10 w-24" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MainLayout>
    )
  }

  const approvedRegistrations = registrations.filter((reg) => reg.status === "approved" || reg.status === "attended")
  const pendingRegistrations = registrations.filter((reg) => reg.status === "pending")

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Registrations</h1>

        {registrations.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">No Registrations Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">You haven't registered for any events yet.</p>
            <Button asChild>
              <a href="/events">Browse Events</a>
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All ({registrations.length})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({approvedRegistrations.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingRegistrations.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {registrations.map((registration) => (
                <RegistrationCard key={registration.id} registration={registration} />
              ))}
            </TabsContent>

            <TabsContent value="approved" className="space-y-6">
              {approvedRegistrations.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                  <p>No approved registrations</p>
                </div>
              ) : (
                approvedRegistrations.map((registration) => (
                  <RegistrationCard key={registration.id} registration={registration} />
                ))
              )}
            </TabsContent>

            <TabsContent value="pending" className="space-y-6">
              {pendingRegistrations.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                  <p>No pending registrations</p>
                </div>
              ) : (
                pendingRegistrations.map((registration) => (
                  <RegistrationCard key={registration.id} registration={registration} />
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </MainLayout>
  )
}

function RegistrationCard({ registration }: { registration: Registration & { event: Event } }) {
  const [showQR, setShowQR] = useState(false)

  const qrValue = JSON.stringify({
    eventId: registration.event.id,
    eventTitle: registration.event.title,
    registrationId: registration.id,
    userId: registration.userId,
    date: registration.event.date,
    time: registration.event.time,
    location: registration.event.location,
  })

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-48 flex-shrink-0">
            <img
              src={registration.event.image || "/placeholder.svg"}
              alt={registration.event.title}
              className="w-full h-40 object-cover rounded-lg"
            />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <h2 className="text-xl font-semibold">{registration.event.title}</h2>
              <StatusBadge status={registration.status} />
            </div>

            <div className="flex flex-wrap gap-4 mb-4 text-gray-600 dark:text-gray-400 text-sm">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formatDate(registration.event.date)}</span>
              </div>

              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{registration.event.time}</span>
              </div>

              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{registration.event.location}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant={showQR ? "secondary" : "default"} onClick={() => setShowQR(!showQR)}>
                {showQR ? "Hide QR Code" : "Show QR Code"}
              </Button>

              <Button variant="outline" asChild>
                <a href={`/events/${registration.event.id}`}>View Event</a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showQR && (
        <div className="bg-gray-50 dark:bg-gray-900 p-6 flex flex-col items-center border-t dark:border-gray-700">
          <div className="bg-white p-4 rounded-lg">
            <QRCode value={qrValue} size={180} />
          </div>
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Present this QR code at the event entrance for check-in
          </p>
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "approved":
      return (
        <Badge className="bg-green-500 hover:bg-green-600">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      )
    case "pending":
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-600">
          <Clock3 className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      )
    case "rejected":
      return (
        <Badge className="bg-red-500 hover:bg-red-600">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      )
    case "attended":
      return (
        <Badge className="bg-blue-500 hover:bg-blue-600">
          <CheckCircle className="h-3 w-3 mr-1" />
          Attended
        </Badge>
      )
    default:
      return <Badge>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  }
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
