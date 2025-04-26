import { MainLayout } from "@/components/layouts/main-layout"
import { EventsGrid } from "@/components/events/events-grid"
import { EventFilters } from "@/components/events/event-filters"
import { HeroSection } from "@/components/hero-section"

export default function Home() {
  return (
    <MainLayout>
      <HeroSection />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Upcoming Events</h2>
        <EventFilters />
        <EventsGrid />
      </div>
    </MainLayout>
  )
}
