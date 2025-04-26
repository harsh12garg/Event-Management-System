export type EventCategory =
  | "academic"
  | "cultural"
  | "sports"
  | "workshop"
  | "seminar"
  | "competition"
  | "hackathon"
  | "conference"
  | "social"
  | "career"
  | "other"

export type Department = "computer-science" | "engineering" | "business" | "arts" | "science" | "medicine" | "all"

export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  category: EventCategory
  department: Department
  organizer: string
  capacity: number
  registered: number
  image: string
  isRegistrationOpen: boolean
  isFeatured?: boolean
  tags?: string[]
  venue?: {
    name: string
    address: string
    mapUrl?: string
  }
  contactEmail?: string
  website?: string
  speakers?: {
    name: string
    role: string
    bio?: string
    image?: string
  }[]
  sponsors?: {
    name: string
    logo?: string
    website?: string
  }[]
  createdAt: string
  updatedAt: string
}

export interface Registration {
  id: string
  eventId: string
  userId: string
  registrationDate: string
  status: "pending" | "approved" | "rejected" | "attended"
  qrCode: string
  checkInTime?: string
  feedback?: {
    rating: number
    comment: string
    submittedAt: string
  }
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  date: string
  read: boolean
  type: "registration" | "reminder" | "update" | "approval" | "feedback" | "cancellation"
  eventId?: string
}

export interface User {
  id: string
  name: string
  email: string
  role: "student" | "admin" | "organizer"
  department?: Department
  avatar?: string
  savedEvents: string[]
}

// Mock data for events with real Unsplash images
export const events: Event[] = [
  {
    id: "1",
    title: "Annual Tech Symposium",
    description:
      "Join us for a day of tech talks, workshops, and networking opportunities with industry professionals. This year's symposium focuses on emerging technologies in AI, blockchain, and quantum computing. Speakers from leading tech companies will share insights on the latest trends and future directions in technology.\n\nThe event includes panel discussions, hands-on workshops, and a networking lunch. Students will have the opportunity to present their projects and research to industry professionals.",
    date: "2024-06-15",
    time: "09:00 AM - 05:00 PM",
    location: "Main Auditorium",
    category: "conference",
    department: "computer-science",
    organizer: "Computer Science Department",
    capacity: 200,
    registered: 145,
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    isRegistrationOpen: true,
    isFeatured: true,
    tags: ["technology", "networking", "professional development"],
    venue: {
      name: "Main Auditorium",
      address: "123 University Ave, Campus Center",
      mapUrl: "https://maps.google.com/?q=University+Main+Auditorium",
    },
    contactEmail: "techsymposium@university.edu",
    website: "https://university.edu/tech-symposium",
    speakers: [
      {
        name: "Dr. Sarah Chen",
        role: "AI Research Lead, TechCorp",
        bio: "Leading researcher in artificial intelligence with over 15 years of experience",
        image:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80",
      },
      {
        name: "Mark Johnson",
        role: "CTO, Blockchain Innovations",
        bio: "Pioneer in blockchain technology and decentralized systems",
        image:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      },
    ],
    sponsors: [
      {
        name: "TechCorp",
        logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        website: "https://techcorp.com",
      },
    ],
    createdAt: "2024-05-01T10:00:00Z",
    updatedAt: "2024-05-10T14:30:00Z",
  },
  {
    id: "2",
    title: "Business Case Competition",
    description:
      "Showcase your problem-solving skills and business acumen in this annual case competition. Teams will be presented with real-world business challenges and will have limited time to develop and present their solutions. This is an excellent opportunity to apply classroom knowledge to practical scenarios and impress potential employers.\n\nPrizes will be awarded to the top three teams, and all participants will receive certificates. Refreshments will be provided throughout the day.",
    date: "2024-06-20",
    time: "10:00 AM - 04:00 PM",
    location: "Business School, Room 101",
    category: "competition",
    department: "business",
    organizer: "Business Student Association",
    capacity: 100,
    registered: 78,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    isRegistrationOpen: true,
    tags: ["business", "competition", "teamwork"],
    venue: {
      name: "Business School",
      address: "456 College Blvd, Room 101",
      mapUrl: "https://maps.google.com/?q=University+Business+School",
    },
    contactEmail: "bsa@university.edu",
    sponsors: [
      {
        name: "Global Consulting Group",
        website: "https://gcg.com",
      },
      {
        name: "Finance Partners",
        website: "https://financepartners.com",
      },
    ],
    createdAt: "2024-05-05T09:15:00Z",
    updatedAt: "2024-05-15T11:20:00Z",
  },
  {
    id: "3",
    title: "Summer Music Festival",
    description:
      "A celebration of music featuring performances by student bands and local artists. This outdoor festival will showcase a variety of musical genres, from classical to contemporary. Bring your friends, a blanket, and enjoy an evening of amazing performances under the stars.\n\nFood trucks and refreshment stands will be available. In case of rain, the event will be moved to the Indoor Arena.",
    date: "2024-07-05",
    time: "03:00 PM - 10:00 PM",
    location: "Campus Green",
    category: "cultural",
    department: "arts",
    organizer: "Student Activities Board",
    capacity: 500,
    registered: 320,
    image:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    isRegistrationOpen: true,
    isFeatured: true,
    tags: ["music", "entertainment", "outdoor"],
    venue: {
      name: "Campus Green",
      address: "Central Campus Area",
      mapUrl: "https://maps.google.com/?q=University+Campus+Green",
    },
    contactEmail: "musicfest@university.edu",
    website: "https://university.edu/music-festival",
    createdAt: "2024-05-10T14:00:00Z",
    updatedAt: "2024-05-20T16:45:00Z",
  },
  {
    id: "4",
    title: "Robotics Workshop",
    description:
      "Learn the basics of robotics and build your own simple robot in this hands-on workshop. No prior experience is required, and all materials will be provided. This workshop is perfect for beginners interested in robotics and engineering.\n\nParticipants will work in small groups and will be guided by experienced robotics club members. Each group will get to keep their robot after the workshop.",
    date: "2024-06-25",
    time: "01:00 PM - 05:00 PM",
    location: "Engineering Building, Lab 3",
    category: "workshop",
    department: "engineering",
    organizer: "Robotics Club",
    capacity: 30,
    registered: 30,
    image:
      "https://images.unsplash.com/photo-1581092921461-7031e4bfb83a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    isRegistrationOpen: false,
    tags: ["robotics", "engineering", "hands-on"],
    venue: {
      name: "Engineering Building",
      address: "789 Innovation Drive, Lab 3",
      mapUrl: "https://maps.google.com/?q=University+Engineering+Building",
    },
    contactEmail: "robotics@university.edu",
    createdAt: "2024-05-12T11:30:00Z",
    updatedAt: "2024-05-22T09:15:00Z",
  },
  {
    id: "5",
    title: "Research Symposium",
    description:
      "Undergraduate and graduate students present their research projects. This is an excellent opportunity to learn about the cutting-edge research happening on campus and to network with faculty and fellow researchers.\n\nThe symposium will include poster presentations, short talks, and a keynote address by a distinguished researcher. Refreshments will be served during the networking breaks.",
    date: "2024-07-10",
    time: "10:00 AM - 03:00 PM",
    location: "Science Center",
    category: "academic",
    department: "science",
    organizer: "Office of Research",
    capacity: 150,
    registered: 95,
    image:
      "https://images.unsplash.com/photo-1576669801775-ff43c5ab079d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    isRegistrationOpen: true,
    tags: ["research", "academic", "science"],
    venue: {
      name: "Science Center",
      address: "321 Research Way",
      mapUrl: "https://maps.google.com/?q=University+Science+Center",
    },
    contactEmail: "research@university.edu",
    website: "https://university.edu/research-symposium",
    speakers: [
      {
        name: "Dr. Emily Rodriguez",
        role: "Distinguished Professor of Biology",
        bio: "Award-winning researcher in molecular biology",
        image:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80",
      },
    ],
    createdAt: "2024-05-15T13:45:00Z",
    updatedAt: "2024-05-25T10:30:00Z",
  },
  {
    id: "6",
    title: "Intramural Basketball Tournament",
    description:
      "Form a team and compete in the annual intramural basketball tournament. Teams must have at least 5 players and can have up to 8. All skill levels are welcome, and teams will be divided into competitive and recreational divisions.\n\nGames will be played throughout the day, with the finals scheduled for the evening. Trophies will be awarded to the winners of each division.",
    date: "2024-07-15",
    time: "02:00 PM - 08:00 PM",
    location: "Sports Complex",
    category: "sports",
    department: "all",
    organizer: "Campus Recreation",
    capacity: 120,
    registered: 80,
    image:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1090&q=80",
    isRegistrationOpen: true,
    tags: ["sports", "basketball", "competition"],
    venue: {
      name: "Sports Complex",
      address: "555 Athletic Drive",
      mapUrl: "https://maps.google.com/?q=University+Sports+Complex",
    },
    contactEmail: "recreation@university.edu",
    createdAt: "2024-05-18T15:20:00Z",
    updatedAt: "2024-05-28T12:10:00Z",
  },
  {
    id: "7",
    title: "Hackathon 2024",
    description:
      "A 48-hour coding marathon where students collaborate to build innovative software solutions. Form teams of up to 4 people and tackle real-world challenges provided by our industry sponsors. Mentors will be available throughout the event to provide guidance and support.\n\nPrizes will be awarded in multiple categories, including Best Overall Project, Most Innovative Solution, and Best UI/UX. Food and drinks will be provided, and participants are welcome to stay overnight.",
    date: "2024-07-20",
    time: "09:00 AM (Sat) - 09:00 AM (Mon)",
    location: "Innovation Hub",
    category: "hackathon",
    department: "computer-science",
    organizer: "Tech Club",
    capacity: 100,
    registered: 85,
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    isRegistrationOpen: true,
    isFeatured: true,
    tags: ["coding", "technology", "teamwork", "innovation"],
    venue: {
      name: "Innovation Hub",
      address: "100 Tech Lane",
      mapUrl: "https://maps.google.com/?q=University+Innovation+Hub",
    },
    contactEmail: "hackathon@university.edu",
    website: "https://university.edu/hackathon",
    sponsors: [
      {
        name: "TechStart",
        website: "https://techstart.com",
      },
      {
        name: "DevTools Inc.",
        website: "https://devtools.com",
      },
    ],
    createdAt: "2024-05-20T09:00:00Z",
    updatedAt: "2024-05-30T14:25:00Z",
  },
  {
    id: "8",
    title: "Career Fair",
    description:
      "Connect with potential employers from various industries at our annual career fair. Over 50 companies will be present, offering full-time positions, internships, and networking opportunities. Bring multiple copies of your resume and dress professionally.\n\nThere will also be resume review stations, mock interview sessions, and professional headshot photography available for all attendees.",
    date: "2024-08-05",
    time: "10:00 AM - 04:00 PM",
    location: "Student Union Ballroom",
    category: "career",
    department: "all",
    organizer: "Career Services",
    capacity: 300,
    registered: 210,
    image:
      "https://images.unsplash.com/photo-1560523159-4a9692d222f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    isRegistrationOpen: true,
    tags: ["career", "networking", "professional development"],
    venue: {
      name: "Student Union",
      address: "200 Union Square",
      mapUrl: "https://maps.google.com/?q=University+Student+Union",
    },
    contactEmail: "careers@university.edu",
    website: "https://university.edu/career-fair",
    sponsors: [
      {
        name: "Global Industries",
        website: "https://globalindustries.com",
      },
      {
        name: "Tech Innovations",
        website: "https://techinnovations.com",
      },
      {
        name: "Finance Group",
        website: "https://financegroup.com",
      },
    ],
    createdAt: "2024-05-25T11:15:00Z",
    updatedAt: "2024-06-05T16:40:00Z",
  },
  {
    id: "9",
    title: "Art Exhibition: Student Showcase",
    description:
      "Celebrating the artistic talents of our students, this exhibition features works in various media including painting, sculpture, photography, and digital art. The exhibition is open to all students, faculty, staff, and the general public.\n\nAn opening reception will be held on the first day, where you can meet the artists and enjoy light refreshments. Selected works will be available for purchase.",
    date: "2024-08-10",
    time: "11:00 AM - 07:00 PM",
    location: "Art Gallery",
    category: "cultural",
    department: "arts",
    organizer: "Department of Fine Arts",
    capacity: 200,
    registered: 120,
    image:
      "https://images.unsplash.com/photo-1594794312433-05a69a98b7a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    isRegistrationOpen: true,
    tags: ["art", "exhibition", "culture"],
    venue: {
      name: "University Art Gallery",
      address: "300 Arts Avenue",
      mapUrl: "https://maps.google.com/?q=University+Art+Gallery",
    },
    contactEmail: "artgallery@university.edu",
    website: "https://university.edu/art-exhibition",
    createdAt: "2024-05-28T14:30:00Z",
    updatedAt: "2024-06-08T10:15:00Z",
  },
  {
    id: "10",
    title: "Entrepreneurship Workshop Series",
    description:
      "A three-part workshop series designed to help aspiring entrepreneurs develop their business ideas and learn essential startup skills. Each session focuses on a different aspect of entrepreneurship, from ideation to pitching to investors.\n\nParticipants are encouraged to attend all three sessions, but each workshop can also be attended individually. Networking opportunities will be available after each session.",
    date: "2024-08-15",
    time: "05:00 PM - 07:00 PM",
    location: "Business Innovation Center",
    category: "workshop",
    department: "business",
    organizer: "Entrepreneurship Club",
    capacity: 50,
    registered: 35,
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80",
    isRegistrationOpen: true,
    tags: ["entrepreneurship", "business", "startup"],
    venue: {
      name: "Business Innovation Center",
      address: "400 Enterprise Road",
      mapUrl: "https://maps.google.com/?q=University+Business+Innovation+Center",
    },
    contactEmail: "entrepreneurship@university.edu",
    speakers: [
      {
        name: "Alex Thompson",
        role: "Founder & CEO, StartUp Success",
        bio: "Serial entrepreneur with 3 successful exits",
        image:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      },
    ],
    createdAt: "2024-06-01T10:45:00Z",
    updatedAt: "2024-06-10T13:20:00Z",
  },
]

// Mock data for registrations
export const registrations: Registration[] = [
  {
    id: "reg1",
    eventId: "1",
    userId: "user1",
    registrationDate: "2024-06-01",
    status: "approved",
    qrCode: "qr-code-data-1",
    checkInTime: "2024-06-15T09:15:00Z",
    feedback: {
      rating: 4,
      comment: "Great event! Learned a lot from the speakers.",
      submittedAt: "2024-06-15T17:30:00Z",
    },
  },
  {
    id: "reg2",
    eventId: "3",
    userId: "user1",
    registrationDate: "2024-06-05",
    status: "pending",
    qrCode: "qr-code-data-2",
  },
  {
    id: "reg3",
    eventId: "7",
    userId: "user1",
    registrationDate: "2024-06-10",
    status: "approved",
    qrCode: "qr-code-data-3",
  },
  {
    id: "reg4",
    eventId: "2",
    userId: "user2",
    registrationDate: "2024-06-02",
    status: "approved",
    qrCode: "qr-code-data-4",
  },
  {
    id: "reg5",
    eventId: "5",
    userId: "user2",
    registrationDate: "2024-06-07",
    status: "rejected",
    qrCode: "qr-code-data-5",
  },
  {
    id: "reg6",
    eventId: "8",
    userId: "user3",
    registrationDate: "2024-06-12",
    status: "approved",
    qrCode: "qr-code-data-6",
  },
  {
    id: "reg7",
    eventId: "4",
    userId: "user3",
    registrationDate: "2024-06-03",
    status: "attended",
    qrCode: "qr-code-data-7",
    checkInTime: "2024-06-25T13:05:00Z",
    feedback: {
      rating: 5,
      comment: "Excellent workshop! The hands-on experience was invaluable.",
      submittedAt: "2024-06-25T17:15:00Z",
    },
  },
]

// Mock data for notifications
export const notifications: Notification[] = [
  {
    id: "notif1",
    userId: "user1",
    title: "Registration Confirmed",
    message: "Your registration for Annual Tech Symposium has been approved.",
    date: "2024-06-02",
    read: false,
    type: "approval",
    eventId: "1",
  },
  {
    id: "notif2",
    userId: "user1",
    title: "Event Reminder",
    message: "The Annual Tech Symposium is tomorrow. Don't forget to attend!",
    date: "2024-06-14",
    read: true,
    type: "reminder",
    eventId: "1",
  },
  {
    id: "notif3",
    userId: "user1",
    title: "New Event Added",
    message: "A new event 'AI Workshop' has been added that might interest you.",
    date: "2024-06-10",
    read: false,
    type: "update",
  },
  {
    id: "notif4",
    userId: "user1",
    title: "Feedback Request",
    message: "Please share your feedback on the Annual Tech Symposium you attended.",
    date: "2024-06-16",
    read: false,
    type: "feedback",
    eventId: "1",
  },
  {
    id: "notif5",
    userId: "user1",
    title: "Registration Pending",
    message: "Your registration for Summer Music Festival is pending approval.",
    date: "2024-06-05",
    read: true,
    type: "registration",
    eventId: "3",
  },
  {
    id: "notif6",
    userId: "user1",
    title: "Event Update",
    message: "The location for Hackathon 2024 has been changed to Innovation Hub.",
    date: "2024-06-12",
    read: false,
    type: "update",
    eventId: "7",
  },
]

// Mock data for users
export const users: User[] = [
  {
    id: "user1",
    name: "Alex Johnson",
    email: "alex.johnson@university.edu",
    role: "student",
    department: "computer-science",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    savedEvents: ["1", "7", "8"],
  },
  {
    id: "user2",
    name: "Samantha Lee",
    email: "samantha.lee@university.edu",
    role: "student",
    department: "business",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80",
    savedEvents: ["2", "10"],
  },
  {
    id: "user3",
    name: "Michael Chen",
    email: "michael.chen@university.edu",
    role: "student",
    department: "engineering",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    savedEvents: ["4", "6"],
  },
  {
    id: "admin1",
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@university.edu",
    role: "admin",
    department: "science",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=761&q=80",
    savedEvents: [],
  },
  {
    id: "organizer1",
    name: "Professor James Wilson",
    email: "james.wilson@university.edu",
    role: "organizer",
    department: "computer-science",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    savedEvents: [],
  },
]

// Helper functions to simulate API calls
export async function getEvents(filters?: {
  category?: EventCategory
  department?: Department
  date?: string
  search?: string
  featured?: boolean
}): Promise<Event[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  if (!filters) return events

  return events.filter((event) => {
    if (filters.category && filters.category !== "all" && event.category !== filters.category) return false
    if (filters.department && filters.department !== "all" && event.department !== filters.department) return false
    if (filters.date && event.date !== filters.date) return false
    if (filters.featured && !event.isFeatured) return false
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      return (
        event.title.toLowerCase().includes(searchTerm) ||
        event.description.toLowerCase().includes(searchTerm) ||
        event.organizer.toLowerCase().includes(searchTerm) ||
        (event.tags && event.tags.some((tag) => tag.toLowerCase().includes(searchTerm)))
      )
    }
    return true
  })
}

export async function getEvent(id: string): Promise<Event | undefined> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return events.find((event) => event.id === id)
}

export async function createEvent(eventData: Omit<Event, "id" | "createdAt" | "updatedAt">): Promise<Event> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  const newEvent: Event = {
    ...eventData,
    id: `event${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // In a real app, this would be saved to a database
  events.push(newEvent)

  return newEvent
}

export async function updateEvent(id: string, eventData: Partial<Event>): Promise<Event> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600))

  const eventIndex = events.findIndex((e) => e.id === id)
  if (eventIndex === -1) {
    throw new Error("Event not found")
  }

  const updatedEvent = {
    ...events[eventIndex],
    ...eventData,
    updatedAt: new Date().toISOString(),
  }

  // In a real app, this would update the database
  events[eventIndex] = updatedEvent

  return updatedEvent
}

export async function deleteEvent(id: string): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const eventIndex = events.findIndex((e) => e.id === id)
  if (eventIndex === -1) {
    throw new Error("Event not found")
  }

  // In a real app, this would delete from the database
  events.splice(eventIndex, 1)
}

export async function getUserRegistrations(userId: string): Promise<(Registration & { event: Event })[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400))

  return registrations
    .filter((reg) => reg.userId === userId)
    .map((reg) => {
      const event = events.find((e) => e.id === reg.eventId)!
      return { ...reg, event }
    })
}

export async function registerForEvent(eventId: string, userId: string): Promise<Registration> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600))

  const newRegistration: Registration = {
    id: `reg${Date.now()}`,
    eventId,
    userId,
    registrationDate: new Date().toISOString().split("T")[0],
    status: "pending",
    qrCode: `qr-code-data-${Date.now()}`,
  }

  // In a real app, this would be saved to a database
  registrations.push(newRegistration)

  return newRegistration
}

export async function updateRegistrationStatus(
  registrationId: string,
  status: "approved" | "rejected" | "attended",
): Promise<Registration> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400))

  const registrationIndex = registrations.findIndex((r) => r.id === registrationId)
  if (registrationIndex === -1) {
    throw new Error("Registration not found")
  }

  const updatedRegistration = {
    ...registrations[registrationIndex],
    status,
    ...(status === "attended" ? { checkInTime: new Date().toISOString() } : {}),
  }

  // In a real app, this would update the database
  registrations[registrationIndex] = updatedRegistration

  return updatedRegistration
}

export async function submitFeedback(registrationId: string, rating: number, comment: string): Promise<Registration> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const registrationIndex = registrations.findIndex((r) => r.id === registrationId)
  if (registrationIndex === -1) {
    throw new Error("Registration not found")
  }

  const updatedRegistration = {
    ...registrations[registrationIndex],
    feedback: {
      rating,
      comment,
      submittedAt: new Date().toISOString(),
    },
  }

  // In a real app, this would update the database
  registrations[registrationIndex] = updatedRegistration

  return updatedRegistration
}

export async function getUserNotifications(userId: string): Promise<Notification[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return notifications.filter((notif) => notif.userId === userId)
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  const notification = notifications.find((n) => n.id === notificationId)
  if (notification) {
    notification.read = true
  }
}

export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  notifications.forEach((notification) => {
    if (notification.userId === userId) {
      notification.read = true
    }
  })
}

export async function getCurrentUser(): Promise<User> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // For demo purposes, always return the first user
  return users[0]
}

export async function toggleSavedEvent(userId: string, eventId: string): Promise<User> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400))

  const userIndex = users.findIndex((u) => u.id === userId)
  if (userIndex === -1) {
    throw new Error("User not found")
  }

  const user = users[userIndex]
  const savedEventIndex = user.savedEvents.indexOf(eventId)

  if (savedEventIndex === -1) {
    // Add to saved events
    user.savedEvents.push(eventId)
  } else {
    // Remove from saved events
    user.savedEvents.splice(savedEventIndex, 1)
  }

  // In a real app, this would update the database
  users[userIndex] = user

  return user
}

export async function getSavedEvents(userId: string): Promise<Event[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const user = users.find((u) => u.id === userId)
  if (!user) {
    throw new Error("User not found")
  }

  return events.filter((event) => user.savedEvents.includes(event.id))
}
