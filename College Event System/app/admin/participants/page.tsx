"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layouts/main-layout"
import { registrations, events } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Search, MoreHorizontal, CheckCircle, XCircle, Clock, Mail, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function AdminParticipantsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  // Combine registrations with event data
  const participantData = registrations.map((reg) => {
    const event = events.find((e) => e.id === reg.eventId)!
    return { ...reg, event }
  })

  const filteredParticipants = participantData.filter(
    (participant) =>
      participant.event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleApprove = (id: string) => {
    toast({
      title: "Registration Approved",
      description: "The participant has been approved and notified.",
    })
  }

  const handleReject = (id: string) => {
    toast({
      title: "Registration Rejected",
      description: "The participant has been rejected and notified.",
    })
  }

  const handleSendReminder = (id: string) => {
    toast({
      title: "Reminder Sent",
      description: "A reminder email has been sent to the participant.",
    })
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">Participants</h1>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search participants..."
              className="pl-9 w-full md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParticipants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">No participants found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredParticipants.map((participant) => (
                    <TableRow key={participant.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={participant.event.image || "/placeholder.svg"}
                            alt={participant.event.title}
                            className="h-10 w-10 rounded object-cover"
                          />
                          <div>
                            <div className="font-medium line-clamp-1">{participant.event.title}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(participant.event.date)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(participant.registrationDate)}</TableCell>
                      <TableCell className="text-center">
                        <StatusBadge status={participant.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/events/${participant.eventId}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Event
                              </Link>
                            </DropdownMenuItem>

                            {participant.status === "pending" && (
                              <>
                                <DropdownMenuItem onClick={() => handleApprove(participant.id)}>
                                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleReject(participant.id)}>
                                  <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}

                            {participant.status === "approved" && (
                              <DropdownMenuItem onClick={() => handleSendReminder(participant.id)}>
                                <Mail className="mr-2 h-4 w-4" />
                                Send Reminder
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </MainLayout>
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
          <Clock className="h-3 w-3 mr-1" />
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
    month: "short",
    day: "numeric",
    year: "numeric",
  }
  return new Date(dateString).toLocaleDateString("en-US", options)
}
