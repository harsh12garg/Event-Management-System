"use client"

import type React from "react"
import { MainLayout } from "@/components/layouts/main-layout"
import { events, registrations } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, TrendingUp, CheckCircle, BarChart, PieChart } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminDashboardPage() {
  // Calculate statistics
  const totalEvents = events.length
  const upcomingEvents = events.filter((event) => new Date(event.date) > new Date()).length
  const totalRegistrations = registrations.length
  const approvedRegistrations = registrations.filter((reg) => reg.status === "approved").length

  // Calculate capacity utilization
  const totalCapacity = events.reduce((sum, event) => sum + event.capacity, 0)
  const totalRegistered = events.reduce((sum, event) => sum + event.registered, 0)
  const utilizationPercentage = Math.round((totalRegistered / totalCapacity) * 100)

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Events"
            value={totalEvents.toString()}
            icon={<Calendar className="h-8 w-8 text-blue-500" />}
            description="Events created"
          />

          <StatCard
            title="Upcoming Events"
            value={upcomingEvents.toString()}
            icon={<TrendingUp className="h-8 w-8 text-green-500" />}
            description="Events scheduled"
          />

          <StatCard
            title="Registrations"
            value={totalRegistrations.toString()}
            icon={<Users className="h-8 w-8 text-purple-500" />}
            description={`${approvedRegistrations} approved`}
          />

          <StatCard
            title="Capacity Utilization"
            value={`${utilizationPercentage}%`}
            icon={<CheckCircle className="h-8 w-8 text-yellow-500" />}
            description={`${totalRegistered}/${totalCapacity} spots filled`}
          />
        </div>

        <Tabs defaultValue="events">
          <TabsList className="mb-6">
            <TabsTrigger value="events">Events Analysis</TabsTrigger>
            <TabsTrigger value="registrations">Registration Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="mr-2 h-5 w-5" />
                    Events by Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EventsByCategoryChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="mr-2 h-5 w-5" />
                    Events by Department
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EventsByDepartmentChart />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="registrations">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="mr-2 h-5 w-5" />
                    Registration Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RegistrationStatusChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Popular Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PopularEventsChart />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}

function StatCard({
  title,
  value,
  icon,
  description,
}: {
  title: string
  value: string
  icon: React.ReactNode
  description: string
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400">{title}</h3>
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-3xl font-bold">{value}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function EventsByCategoryChart() {
  // Count events by category
  const categoryCounts: Record<string, number> = {}
  events.forEach((event) => {
    categoryCounts[event.category] = (categoryCounts[event.category] || 0) + 1
  })

  // Sort by count
  const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])

  return (
    <div className="space-y-4">
      {sortedCategories.map(([category, count]) => (
        <div key={category}>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium capitalize">{category}</span>
            <span className="text-sm text-gray-500">{count}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${(count / events.length) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  )
}

function EventsByDepartmentChart() {
  // Count events by department
  const departmentCounts: Record<string, number> = {}
  events.forEach((event) => {
    departmentCounts[event.department] = (departmentCounts[event.department] || 0) + 1
  })

  // Sort by count
  const sortedDepartments = Object.entries(departmentCounts).sort((a, b) => b[1] - a[1])

  return (
    <div className="space-y-4">
      {sortedDepartments.map(([department, count]) => (
        <div key={department}>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">
              {department === "all" ? "Campus-wide" : department.replace(/-/g, " ")}
            </span>
            <span className="text-sm text-gray-500">{count}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-purple-600 h-2.5 rounded-full"
              style={{ width: `${(count / events.length) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  )
}

function RegistrationStatusChart() {
  // Count registrations by status
  const statusCounts: Record<string, number> = {
    pending: 0,
    approved: 0,
    rejected: 0,
    attended: 0,
  }

  registrations.forEach((reg) => {
    statusCounts[reg.status] = (statusCounts[reg.status] || 0) + 1
  })

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500",
    approved: "bg-green-500",
    rejected: "bg-red-500",
    attended: "bg-blue-500",
  }

  return (
    <div className="space-y-4">
      {Object.entries(statusCounts).map(([status, count]) => (
        <div key={status}>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium capitalize">{status}</span>
            <span className="text-sm text-gray-500">{count}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className={`${statusColors[status]} h-2.5 rounded-full`}
              style={{ width: `${(count / registrations.length) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  )
}

function PopularEventsChart() {
  // Get events with registration counts
  const eventPopularity = events
    .map((event) => ({
      id: event.id,
      title: event.title,
      registered: event.registered,
      capacity: event.capacity,
      percentage: Math.round((event.registered / event.capacity) * 100),
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5)

  return (
    <div className="space-y-4">
      {eventPopularity.map((event) => (
        <div key={event.id}>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium truncate" title={event.title}>
              {event.title.length > 25 ? `${event.title.substring(0, 25)}...` : event.title}
            </span>
            <span className="text-sm text-gray-500">{event.percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${
                event.percentage < 60 ? "bg-green-500" : event.percentage < 85 ? "bg-yellow-500" : "bg-red-500"
              }`}
              style={{ width: `${event.percentage}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {event.registered}/{event.capacity} registered
          </div>
        </div>
      ))}
    </div>
  )
}
