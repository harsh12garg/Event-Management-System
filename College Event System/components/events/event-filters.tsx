"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Calendar, Filter, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function EventFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [category, setCategory] = useState(searchParams.get("category") || "")
  const [department, setDepartment] = useState(searchParams.get("department") || "")
  const [date, setDate] = useState(searchParams.get("date") || "")
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [featured, setFeatured] = useState(searchParams.get("featured") === "true")
  const [isOpen, setIsOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  useEffect(() => {
    const filters = []
    if (category) filters.push(`Category: ${formatCategory(category)}`)
    if (department) filters.push(`Department: ${formatDepartment(department)}`)
    if (date) filters.push(`Date: ${formatDate(date)}`)
    if (search) filters.push(`Search: ${search}`)
    if (featured) filters.push("Featured Only")
    setActiveFilters(filters)
  }, [category, department, date, search, featured])

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (category) params.set("category", category)
    if (department) params.set("department", department)
    if (date) params.set("date", date)
    if (search) params.set("search", search)
    if (featured) params.set("featured", "true")

    router.push(`/events?${params.toString()}`)
    setIsOpen(false)
  }

  const resetFilters = () => {
    setCategory("")
    setDepartment("")
    setDate("")
    setSearch("")
    setFeatured(false)
    router.push("/events")
    setIsOpen(false)
  }

  const removeFilter = (filter: string) => {
    if (filter.startsWith("Category:")) {
      setCategory("")
    } else if (filter.startsWith("Department:")) {
      setDepartment("")
    } else if (filter.startsWith("Date:")) {
      setDate("")
    } else if (filter.startsWith("Search:")) {
      setSearch("")
    } else if (filter === "Featured Only") {
      setFeatured(false)
    }

    // Apply the updated filters
    const params = new URLSearchParams()
    if (filter.startsWith("Category:") ? "" : category) params.set("category", category)
    if (filter.startsWith("Department:") ? "" : department) params.set("department", department)
    if (filter.startsWith("Date:") ? "" : date) params.set("date", date)
    if (filter.startsWith("Search:") ? "" : search) params.set("search", search)
    if (filter === "Featured Only" ? false : featured) params.set("featured", "true")

    router.push(`/events?${params.toString()}`)
  }

  // For larger screens
  const DesktopFilters = () => (
    <div className="hidden md:block">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search events..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="academic">Academic</SelectItem>
            <SelectItem value="cultural">Cultural</SelectItem>
            <SelectItem value="sports">Sports</SelectItem>
            <SelectItem value="workshop">Workshop</SelectItem>
            <SelectItem value="seminar">Seminar</SelectItem>
            <SelectItem value="competition">Competition</SelectItem>
            <SelectItem value="hackathon">Hackathon</SelectItem>
            <SelectItem value="conference">Conference</SelectItem>
            <SelectItem value="social">Social</SelectItem>
            <SelectItem value="career">Career</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="computer-science">Computer Science</SelectItem>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="arts">Arts</SelectItem>
            <SelectItem value="science">Science</SelectItem>
            <SelectItem value="medicine">Medicine</SelectItem>
            <SelectItem value="all">Campus-wide</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4 text-gray-500" />
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-[180px]" />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="featured" checked={featured} onCheckedChange={(checked) => setFeatured(checked === true)} />
          <Label htmlFor="featured">Featured Only</Label>
        </div>

        <Button onClick={applyFilters} className="ml-2">
          Apply Filters
        </Button>

        {activeFilters.length > 0 && (
          <Button variant="ghost" onClick={resetFilters}>
            Reset
          </Button>
        )}
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="px-3 py-1">
              {filter}
              <X className="ml-2 h-3 w-3 cursor-pointer" onClick={() => removeFilter(filter)} />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )

  // For mobile screens
  const MobileFilters = () => (
    <div className="md:hidden mb-6">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search events..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex-1">
                <Filter className="mr-2 h-4 w-4" />
                Filter Events
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <SheetHeader>
                <SheetTitle>Filter Events</SheetTitle>
              </SheetHeader>

              <div className="py-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="cultural">Cultural</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="seminar">Seminar</SelectItem>
                      <SelectItem value="competition">Competition</SelectItem>
                      <SelectItem value="hackathon">Hackathon</SelectItem>
                      <SelectItem value="conference">Conference</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                      <SelectItem value="career">Career</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Department</label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="computer-science">Computer Science</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="arts">Arts</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="medicine">Medicine</SelectItem>
                      <SelectItem value="all">Campus-wide</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured-mobile"
                    checked={featured}
                    onCheckedChange={(checked) => setFeatured(checked === true)}
                  />
                  <Label htmlFor="featured-mobile">Featured Events Only</Label>
                </div>
              </div>

              <SheetFooter className="flex-row gap-3 sm:justify-start">
                <Button onClick={applyFilters} className="flex-1">
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={resetFilters} className="flex-1">
                  Reset
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <Button onClick={applyFilters} className="flex-1">
            Apply
          </Button>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="px-3 py-1">
              {filter}
              <X className="ml-2 h-3 w-3 cursor-pointer" onClick={() => removeFilter(filter)} />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <>
      <DesktopFilters />
      <MobileFilters />
    </>
  )
}

function formatCategory(category: string): string {
  if (!category) return ""
  return category.charAt(0).toUpperCase() + category.slice(1)
}

function formatDepartment(department: string): string {
  if (!department) return ""
  if (department === "all") return "Campus-wide"

  return department
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function formatDate(dateString: string): string {
  if (!dateString) return ""
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}
