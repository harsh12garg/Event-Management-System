import { MainLayout } from "@/components/layouts/main-layout"
import { EventsGrid } from "@/components/events/events-grid"
import { EventFilters } from "@/components/events/event-filters"

export default function EventsPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">All Events</h1>
        <EventFilters />
        <EventsGrid />
      </div>
    </MainLayout>
  )
}
