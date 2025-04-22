import React, { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { format } from "date-fns"
import clsx from "clsx"
import { twMerge } from "tailwind-merge"

// Utility function
function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Icons (simplified versions)
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
    <line x1="16" x2="16" y1="2" y2="6"></line>
    <line x1="8" x2="8" y1="2" y2="6"></line>
    <line x1="3" x2="21" y1="10" y2="10"></line>
  </svg>
)

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.3-4.3"></path>
  </svg>
)

const DollarSignIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" x2="12" y1="2" y2="22"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
)

const SaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    <polyline points="17 21 17 13 7 13 7 21"></polyline>
    <polyline points="7 3 7 8 15 8"></polyline>
  </svg>
)

const FileTextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" x2="8" y1="13" y2="13"></line>
    <line x1="16" x2="8" y1="17" y2="17"></line>
    <line x1="10" x2="8" y1="9" y2="9"></line>
  </svg>
)

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
)

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"></path>
  </svg>
)

// UI Components
const Button = React.forwardRef(({ className, variant = "default", size = "default", children, ...props }, ref) => {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  }

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  }

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})
Button.displayName = "Button"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

const Card = ({ className, ...props }) => (
  <div
    className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
    {...props}
  />
)
Card.displayName = "Card"

const CardHeader = ({ className, ...props }) => (
  <div
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
)
CardHeader.displayName = "CardHeader"

const CardTitle = ({ className, ...props }) => (
  <h3
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props}
  />
)
CardTitle.displayName = "CardTitle"

const CardContent = ({ className, ...props }) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
)
CardContent.displayName = "CardContent"

const Badge = ({ children, variant = "default", className }) => {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground border border-input hover:bg-accent hover:text-accent-foreground",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
Badge.displayName = "Badge"

const TabsContext = React.createContext(null)

const Tabs = ({ value, onValueChange, children, defaultValue, className }) => {
  const [selectedTab, setSelectedTab] = useState(value || defaultValue)

  useEffect(() => {
    if (value !== undefined) {
      setSelectedTab(value)
    }
  }, [value])

  const handleValueChange = (newValue) => {
    setSelectedTab(newValue)
    if (onValueChange) {
      onValueChange(newValue)
    }
  }

  return (
    <TabsContext.Provider value={{ selectedTab, handleValueChange }}>
      <div className={cn("flex flex-col gap-2", className)}>{children}</div>
    </TabsContext.Provider>
  )
}
Tabs.displayName = "Tabs"

const TabsList = ({ className, children }) => {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        className
      )}
    >
      {children}
    </div>
  )
}
TabsList.displayName = "TabsList"

const TabsTrigger = ({ className, value, children }) => {
  const { selectedTab, handleValueChange } = React.useContext(TabsContext)
  const isSelected = selectedTab === value

  return (
    <button
      role="tab"
      aria-selected={isSelected}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isSelected ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:bg-muted/50",
        className
      )}
      onClick={() => handleValueChange(value)}
    >
      {children}
    </button>
  )
}
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = ({ className, value, children }) => {
  const { selectedTab } = React.useContext(TabsContext)
  const isSelected = selectedTab === value

  if (!isSelected) return null

  return (
    <div
      role="tabpanel"
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
    >
      {children}
    </div>
  )
}
TabsContent.displayName = "TabsContent"

const PopoverContext = React.createContext(null)

const Popover = ({ children }) => {
  const [open, setOpen] = useState(false)
  return <PopoverContext.Provider value={{ open, setOpen }}>{children}</PopoverContext.Provider>
}
Popover.displayName = "Popover"

const PopoverTrigger = ({ children, asChild = false }) => {
  const { open, setOpen } = React.useContext(PopoverContext)
  
  const handleClick = (e) => {
    e.preventDefault()
    setOpen(!open)
  }

  if (asChild) {
    return React.cloneElement(children, { onClick: handleClick })
  }

  return <div onClick={handleClick}>{children}</div>
}
PopoverTrigger.displayName = "PopoverTrigger"

const PopoverContent = ({ children, className }) => {
  const { open } = React.useContext(PopoverContext)
  
  if (!open) return null
  
  return (
    <div 
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
    >
      {children}
    </div>
  )
}
PopoverContent.displayName = "PopoverContent"

const Calendar = ({ selected, onSelect, mode = "single", className, ...props }) => {
  const [month, setMonth] = useState(selected ? new Date(selected) : new Date())
  
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }
  
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }
  
  const handleDateClick = (date) => {
    if (onSelect) {
      onSelect(date)
    }
  }
  
  const renderCalendar = () => {
    const year = month.getFullYear()
    const monthIndex = month.getMonth()
    const daysInMonth = getDaysInMonth(year, monthIndex)
    const firstDay = getFirstDayOfMonth(year, monthIndex)
    
    const days = []
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-9 w-9"></div>)
    }
    
    // Cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthIndex, day)
      const isSelected = selected && new Date(selected).toDateString() === date.toDateString()
      
      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(date)}
          className={cn(
            "h-9 w-9 rounded-md p-0 font-normal aria-selected:opacity-100",
            isSelected && "bg-primary text-primary-foreground",
            !isSelected && "hover:bg-accent hover:text-accent-foreground"
          )}
        >
          {day}
        </button>
      )
    }
    
    return days
  }
  
  return (
    <div className={cn("p-3", className)} {...props}>
      <div className="flex justify-between mb-2">
        <button 
          onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
          className="p-1 rounded-md hover:bg-accent"
        >
          &lt;
        </button>
        <div>
          {month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
        <button 
          onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
          className="p-1 rounded-md hover:bg-accent"
        >
          &gt;
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        <div className="h-9 w-9 text-xs">Su</div>
        <div className="h-9 w-9 text-xs">Mo</div>
        <div className="h-9 w-9 text-xs">Tu</div>
        <div className="h-9 w-9 text-xs">We</div>
        <div className="h-9 w-9 text-xs">Th</div>
        <div className="h-9 w-9 text-xs">Fr</div>
        <div className="h-9 w-9 text-xs">Sa</div>
        {renderCalendar()}
      </div>
    </div>
  )
}
Calendar.displayName = "Calendar"

const Avatar = ({ className, children, ...props }) => {
  return (
    <div
      className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    >
      {children}
    </div>
  )
}
Avatar.displayName = "Avatar"

const AvatarFallback = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
AvatarFallback.displayName = "AvatarFallback"

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}
Skeleton.displayName = "Skeleton"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

const Select = React.forwardRef(({ className, children, value, onValueChange, ...props }, ref) => {
  const handleChange = (event) => {
    if (onValueChange) {
      onValueChange(event.target.value)
    }
  }

  return (
    <div className="relative">
      <select
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
          className
        )}
        ref={ref}
        value={value}
        onChange={handleChange}
        {...props}
      >
        {children}
      </select>
      <div className="absolute right-3 top-3 pointer-events-none">
        <ChevronDownIcon />
      </div>
    </div>
  )
})
Select.displayName = "Select"

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <ChevronDownIcon />
  </div>
))
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = React.forwardRef(({ className, ...props }, ref) => (
  <span ref={ref} className={cn("flex-grow text-sm truncate", className)} {...props} />
))
SelectValue.displayName = "SelectValue"

const SelectContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80",
      className
    )}
    {...props}
  >
    <div className="w-full p-1">{children}</div>
  </div>
))
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef(({ className, children, value, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <CheckIcon />
    </span>
    <span className="truncate">{children}</span>
  </div>
))
SelectItem.displayName = "SelectItem"

// Main Component
export default function TithesOfferings() {
  // Initialize Supabase client
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || ""
  const supabaseKey = process.env.REACT_APP_SUPABASE_KEY || ""
  const supabase = createClient(supabaseUrl, supabaseKey)

  const [members, setMembers] = useState([])
  const [tithesOfferings, setTithesOfferings] = useState([])
  const [events, setEvents] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("Everyone")
  const [loading, setLoading] = useState(true)
  const [sortField, setSortField] = useState("first_name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)
  const [totalMembers, setTotalMembers] = useState(0)
  const [summaryData, setSummaryData] = useState({
    totalTithes: 0,
    totalOfferings: 0,
    totalCollected: 0,
    outstandingBalance: 0,
  })

  // Fetch data on component mount and when dependencies change
  useEffect(() => {
    async function fetchData() {
      setLoading(true)

      // Fetch members with pagination
      const {
        data: memberData,
        count,
        error: memberError,
      } = await supabase
        .from(process.env.REACT_APP_MEMBERVIS_TABLE)
        .select("*", { count: "exact" })
        .order(sortField, { ascending: sortOrder === "asc" })
        .range((page - 1) * pageSize, page * pageSize - 1)

      if (memberError) {
        console.error("Error fetching members:", memberError)
      } else {
        setTotalMembers(count || 0)
        setMembers(memberData || [])
      }

      // Fetch tithes and offerings
      const { data: tithesData, error: tithesError } = await supabase.from("tithes_offering").select("*")

      if (tithesError) {
        console.error("Error fetching tithes and offerings:", tithesError)
      } else {
        setTithesOfferings(tithesData || [])

        // Calculate summary data
        const totalTithes = tithesData?.reduce((sum, item) => sum + (Number(item.amount) || 0), 0) || 0
        const totalOfferings = 2000 // This is hardcoded in the original code

        setSummaryData({
          totalTithes,
          totalOfferings,
          totalCollected: totalTithes + totalOfferings,
          outstandingBalance: 0, // This is hardcoded in the original code
        })
      }

      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase.from("events").select("*")

      if (eventsError) {
        console.error("Error fetching events:", eventsError)
      } else {
        setEvents(eventsData || [])
      }

      setLoading(false)
    }

    fetchData()
  }, [sortField, sortOrder, page, pageSize, activeTab])

  // Handle tithe/offering change
  const handleTitheChange = (memberId, field, value, existingTithe = {}) => {
    setTithesOfferings((prevTithes) => {
      const newTithes = [...prevTithes]
      const titheIndex = newTithes.findIndex((t) => t.id === existingTithe.id)

      if (titheIndex > -1) {
        newTithes[titheIndex] = { ...newTithes[titheIndex], [field]: value }
      } else {
        // Create a new tithe entry
        newTithes.push({
          member_id: memberId,
          date_paid: new Date().toISOString().split("T")[0],
          amount: 0,
          event_id: events.length > 0 ? events[0].event_id : null,
          notes: "",
          ...existingTithe,
          [field]: value,
        })
      }

      return newTithes
    })
  }

  // Save tithes and offerings to database
  const handleSave = async () => {
    try {
      for (const tithe of tithesOfferings) {
        // Skip entries without required fields
        if (!tithe.member_id || !tithe.event_id || !tithe.date_paid) continue

        const { id, created_at, updated_at, ...titheData } = tithe

        if (id) {
          // Update existing record
          await supabase
            .from("tithes_offering")
            .update({
              ...titheData,
              updated_at: new Date().toISOString(),
            })
            .eq("id", id)
        } else {
          // Insert new record
          await supabase.from("tithes_offering").insert({
            ...titheData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
        }
      }
      alert("Tithes and offerings saved successfully")
    } catch (error) {
      console.error("Error saving tithes and offerings:", error)
      alert("Error saving tithes and offerings")
    }
  }

  // Filter members based on search query and active tab
  const filteredMembers = members.filter((member) => {
    return (
      (activeTab === "Everyone" || member.type === activeTab) &&
      (member.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.last_name?.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })

  // Get tithe/offering for a specific member
  const getMemberTithe = (memberId) => {
    return tithesOfferings.find((t) => t.member_id === memberId) || {}
  }

  // Format currency
  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount || 0)
  }

  // Get initials from name
  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase()
  }

  // Custom pagination component
  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = []
    const maxVisiblePages = 5

    // Create array of page numbers to display
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      // Calculate start and end of visible pages
      let start = Math.max(2, currentPage - 1)
      const end = Math.min(start + maxVisiblePages - 3, totalPages - 1)

      // Adjust start if end is maxed out
      start = Math.max(2, end - (maxVisiblePages - 3))

      // Add ellipsis if needed
      if (start > 2) {
        pages.push("...")
      }

      // Add visible pages
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push("...")
      }

      // Always show last page
      pages.push(totalPages)
    }

    return (
      <div className="flex items-center justify-center mt-6 gap-1">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onPageChange(currentPage - 1)} 
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        {pages.map((pageNum, index) => (
          <React.Fragment key={index}>
            {pageNum === "..." ? (
              <span className="px-3 py-2">...</span>
            ) : (
              <Button
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </Button>
            )}
          </React.Fragment>
        ))}

        <Button
          variant="outline" 
          size="sm" 
          onClick={() => onPageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tithes</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summaryData.totalTithes, "USD")}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Offerings</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summaryData.totalOfferings, "USD")}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Collected</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summaryData.totalCollected, "USD")}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding Balance</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summaryData.outstandingBalance, "USD")}</div>
          </CardContent>
        </Card>
      </div>

      {/* Header and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Tithes and Offerings</h1>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-10 w-full md:w-[300px]"
            placeholder="Search members"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs and Member Cards */}
      <Tabs defaultValue="Everyone" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="Everyone">Everyone</TabsTrigger>
          <TabsTrigger value="Member">Members</TabsTrigger>
          <TabsTrigger value="Visitor">Visitors</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array(pageSize)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[150px]" />
                          <Skeleton className="h-3 w-[100px]" />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMembers.map((member) => {
                  const tithe = getMemberTithe(member.id)

                  return (
                    <Card key={member.id} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <Avatar>
                            <AvatarFallback
                              style={{
                                background: `linear-gradient(135deg, #92A1C6, #146A7C)`,
                              }}
                            >
                              {getInitials(member.first_name, member.last_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">
                              {member.first_name} {member.last_name}
                            </h3>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                        </div>

                        <div className="flex justify-between mb-4">
                          <Badge variant={member.type === "Member" ? "default" : "outline"}>{member.type}</Badge>
                          <Badge variant={member.status === "Active" ? "default" : "outline"}>{member.status}</Badge>
                        </div>

                        <div className="space-y-4">
                          {/* Event Selection */}
                          <div className="grid grid-cols-1 gap-2">
                            <label className="text-sm font-medium">Event</label>
                            <Select
                              value={tithe.event_id?.toString() || ""}
                              onValueChange={(value) =>
                                handleTitheChange(member.id, "event_id", Number.parseInt(value), tithe)
                              }
                            >
                              {events.map((event) => (
                                <option key={event.event_id} value={event.event_id.toString()}>
                                  {event.name || `Event ${event.event_id}`}
                                </option>
                              ))}
                            </Select>
                          </div>

                          {/* Date Picker */}
                          <div className="grid grid-cols-1 gap-2">
                            <label className="text-sm font-medium">Date Paid</label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal">
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {tithe.date_paid ? format(new Date(tithe.date_paid), "PPP") : "Select date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={tithe.date_paid ? new Date(tithe.date_paid) : undefined}
                                  onSelect={(date) =>
                                    handleTitheChange(
                                      member.id,
                                      "date_paid",
                                      date ? date.toISOString().split("T")[0] : "",
                                      tithe,
                                    )
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>

                          {/* Amount */}
                          <div className="grid grid-cols-1 gap-2">
                            <label className="text-sm font-medium">Amount</label>
                            <div className="relative">
                              <DollarSignIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="number"
                                step="0.01"
                                className="pl-10"
                                placeholder="0.00"
                                value={tithe.amount || ""}
                                onChange={(e) => handleTitheChange(member.id, "amount", e.target.value, tithe)}
                              />
                            </div>
                          </div>

                          {/* Notes */}
                          <div className="grid grid-cols-1 gap-2">
                            <label className="text-sm font-medium">Notes</label>
                            <div className="relative">
                              <FileTextIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Textarea
                                className="pl-10 min-h-[80px]"
                                placeholder="Add notes here..."
                                value={tithe.notes || ""}
                                onChange={(e) => handleTitheChange(member.id, "notes", e.target.value, tithe)}
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Custom Pagination */}
              <Pagination currentPage={page} totalPages={Math.ceil(totalMembers / pageSize)} onPageChange={setPage} />
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-[#098F8F] hover:bg-[#076e6e] text-white">
          <SaveIcon className="mr-2 h-4 w-4" />
          Save
        </Button>
      </div>
    </div>
  )
}