"use client"

import { cn } from "@/lib/utils"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layouts/main-layout"
import { getUserRegistrations } from "@/lib/data"
import { Ticket, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import QRCode from "react-qr-code"

type RegistrationWithEvent = Awaited<ReturnType<typeof getUserRegistrations>>[0]

export default function TicketsPage() {
  const [registrations, setRegistrations] = useState<RegistrationWithEvent[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const data = await getUserRegistrations("user1")
        setRegistrations(data)
      } catch (error) {
        console.error("Failed to load tickets:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const upcomingTickets = registrations.filter(
    (reg) => new Date(reg.event.date) >= new Date() && (reg.status === "approved" || reg.status === "pending"),
  )

  const pastTickets = registrations.filter((reg) => new Date(reg.event.date) < new Date() || reg.status === "rejected")

  const handleDownload = (registration: RegistrationWithEvent) => {
    toast({
      title: "Ticket downloaded",
      description: `Your ticket for ${registration.event.title} has been downloaded.`,
    })
  }

  const handleShare = (registration: RegistrationWithEvent) => {
    if (navigator.share) {
      navigator
        .share({
          title: `Ticket for ${registration.event.title}`,
          text: `Check out my ticket for ${registration.event.title} on ${formatDate(registration.event.date)}!`,
          url: window.location.href,
        })
        .catch((err) => {
          console.error("Error sharing:", err)
        })
    } else {
      toast({
        title: "Share link copied",
        description: "The ticket link has been copied to your clipboard.",
      })
    }
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Ticket className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2" />
          <h1 className="text-3xl font-bold">My Tickets</h1>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
        ) : (
          <>
            {registrations.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                <Ticket className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600" />
                <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400 mt-4">No tickets found</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-500 mb-6">You haven't registered for any events yet.</p>
                <Button asChild>
                  <a href="/events">Browse Events</a>
                </Button>
              </div>
            ) : (
              <Tabs defaultValue="upcoming">
                <TabsList className="mb-6">
                  <TabsTrigger value="upcoming">Upcoming ({upcomingTickets.length})</TabsTrigger>
                  <TabsTrigger value="past">Past ({pastTickets.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="space-y-6">
                  {upcomingTickets.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                      <p className="text-gray-600 dark:text-gray-400">No upcoming tickets</p>
                    </div>
                  ) : (
                    upcomingTickets.map((registration) => (
                      <TicketCard
                        key={registration.id}
                        registration={registration}
                        onDownload={() => handleDownload(registration)}
                        onShare={() => handleShare(registration)}
                      />
                    ))
                  )}
                </TabsContent>

                <TabsContent value="past" className="space-y-6">
                  {pastTickets.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                      <p className="text-gray-600 dark:text-gray-400">No past tickets</p>
                    </div>
                  ) : (
                    pastTickets.map((registration) => (
                      <TicketCard
                        key={registration.id}
                        registration={registration}
                        isPast
                        onDownload={() => handleDownload(registration)}
                        onShare={() => handleShare(registration)}
                      />
                    ))
                  )}
                </TabsContent>
              </Tabs>
            )}
          </>
        )}
      </div>
    </MainLayout>
  )
}

interface TicketCardProps {
  registration: RegistrationWithEvent
  isPast?: boolean
  onDownload: () => void
  onShare: () => void
}

function TicketCard({ registration, isPast = false, onDownload, onShare }: TicketCardProps) {
  const { event, status } = registration

  const qrValue = JSON.stringify({
    eventId: event.id,
    eventTitle: event.title,
    registrationId: registration.id,
    userId: registration.userId,
    date: event.date,
    time: event.time,
    location: event.location,
  })

  return (
    <div className={cn("bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden", isPast && "opacity-75")}>
      <div className="relative">
        {/* Ticket header with event image */}
        <div className="h-32 bg-cover bg-center relative" style={{ backgroundImage: `url(${event.image})` }}>
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="absolute inset-0 p-4 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <h3 className="text-white text-xl font-bold">{event.title}</h3>
              <div
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium",
                  status === "approved"
                    ? "bg-green-500 text-white"
                    : status === "pending"
                      ? "bg-yellow-500 text-white"
                      : "bg-red-500 text-white",
                )}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </div>
            </div>
            <div className="text-white/90 text-sm">
              {formatDate(event.date)} • {event.time}
            </div>
          </div>
        </div>

        {/* Ticket body */}
        <div className="p-4 flex flex-col md:flex-row gap-6">
          {/* QR Code */}
          <div className="flex-shrink-0 flex items-center justify-center bg-white p-4 rounded-lg">
            <QRCode value={qrValue} size={150} />
          </div>

          {/* Ticket details */}
          <div className="flex-1">
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Location</div>
                <div className="font-medium">{event.location}</div>
              </div>

              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Organizer</div>
                <div className="font-medium">{event.organizer}</div>
              </div>

              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Registration Date</div>
                <div className="font-medium">{formatDate(registration.registrationDate)}</div>
              </div>

              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Ticket ID</div>
                <div className="font-medium">{registration.id}</div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="outline" size="sm" onClick={onDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm" onClick={onShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button size="sm" asChild>
                <a href={`/events/${event.id}`}>View Event</a>
              </Button>
            </div>
          </div>
        </div>

        {/* Ticket footer with decorative elements */}
        <div className="border-t border-dashed border-gray-200 dark:border-gray-700 relative">
          <div className="absolute -top-2.5 -left-2.5 h-5 w-5 rounded-full bg-gray-100 dark:bg-gray-900"></div>
          <div className="absolute -top-2.5 -right-2.5 h-5 w-5 rounded-full bg-gray-100 dark:bg-gray-900"></div>
        </div>

        <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Present this ticket at the event entrance for check-in
        </div>
      </div>
    </div>
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
