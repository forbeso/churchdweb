"use client"

import React, { useState, useEffect, useMemo } from "react"
import { createClient } from "@supabase/supabase-js"
import { format, subMonths, startOfMonth, endOfMonth, parseISO } from "date-fns"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  Download,
  Filter,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Printer,
  FileText,
} from "lucide-react"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import { toPng } from "html-to-image"

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || ""
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

// Utility function for class names
function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}

// Color palette for charts
const COLORS = ["#098F8F", "#34D399", "#60A5FA", "#F59E0B", "#EC4899", "#8B5CF6", "#EC4899", "#F97316"]

const TithesReportGenerator = () => {
  // State for date range filter
  const [dateRange, setDateRange] = useState({
    startDate: format(startOfMonth(subMonths(new Date(), 3)), "yyyy-MM-dd"),
    endDate: format(endOfMonth(new Date()), "yyyy-MM-dd"),
  })

  // State for data
  const [tithesData, setTithesData] = useState([])
  const [membersData, setMembersData] = useState([])
  const [eventsData, setEventsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [memberFilter, setMemberFilter] = useState("all")
  const [eventFilter, setEventFilter] = useState("all")
  const [expandedMembers, setExpandedMembers] = useState({})
  const [expandedEvents, setExpandedEvents] = useState({})
  const [pdfGenerating, setPdfGenerating] = useState(false)

  // Refs for chart components
  const overviewRef = React.useRef(null)
  const trendChartRef = React.useRef(null)
  const pieChartRef = React.useRef(null)
  const memberTableRef = React.useRef(null)
  const eventTableRef = React.useRef(null)

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      try {
        // Fetch tithes data within date range
        const { data: tithes, error: tithesError } = await supabase
          .from("tithes_offering")
          .select("*")
          .gte("date_paid", dateRange.startDate)
          .lte("date_paid", dateRange.endDate)

        if (tithesError) throw tithesError

        // Fetch members data
        const { data: members, error: membersError } = await supabase
          .from(process.env.REACT_APP_MEMBERVIS_TABLE)
          .select("*")

        if (membersError) throw membersError

        // Fetch events data
        const { data: events, error: eventsError } = await supabase.from("events").select("*")

        if (eventsError) throw eventsError

        setTithesData(tithes || [])
        setMembersData(members || [])
        setEventsData(events || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [dateRange])

  // Toggle member expansion
  const toggleMemberExpansion = (memberId) => {
    setExpandedMembers((prev) => ({
      ...prev,
      [memberId]: !prev[memberId],
    }))
  }

  // Toggle event expansion
  const toggleEventExpansion = (eventId) => {
    setExpandedEvents((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }))
  }

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    if (!tithesData.length) return null

    const totalAmount = tithesData.reduce((sum, tithe) => sum + (Number(tithe.amount) || 0), 0)
    const uniqueMembers = new Set(tithesData.map((tithe) => tithe.member_id)).size
    const uniqueEvents = new Set(tithesData.map((tithe) => tithe.event_id)).size
    const averageContribution = totalAmount / tithesData.length

    // Group by month for trend analysis
    const monthlyData = {}
    tithesData.forEach((tithe) => {
      const month = tithe.date_paid.substring(0, 7) // YYYY-MM format
      if (!monthlyData[month]) {
        monthlyData[month] = 0
      }
      monthlyData[month] += Number(tithe.amount) || 0
    })

    const trendData = Object.entries(monthlyData)
      .map(([month, amount]) => ({
        month: format(new Date(month + "-01"), "MMM yyyy"),
        amount,
      }))
      .sort((a, b) => new Date(a.month) - new Date(b.month))

    return {
      totalAmount,
      uniqueMembers,
      uniqueEvents,
      averageContribution,
      trendData,
    }
  }, [tithesData])

  // Calculate member summary
  const memberSummary = useMemo(() => {
    if (!tithesData.length || !membersData.length) return []

    // Group tithes by member
    const memberTithes = {}
    tithesData.forEach((tithe) => {
      if (!memberTithes[tithe.member_id]) {
        memberTithes[tithe.member_id] = []
      }
      memberTithes[tithe.member_id].push(tithe)
    })

    // Create summary for each member
    return membersData
      .filter((member) => {
        if (memberFilter === "all") return true
        return member.type === memberFilter
      })
      .map((member) => {
        const memberContributions = memberTithes[member.id] || []
        const totalContribution = memberContributions.reduce((sum, tithe) => sum + (Number(tithe.amount) || 0), 0)
        const contributionCount = memberContributions.length
        const averageContribution = contributionCount > 0 ? totalContribution / contributionCount : 0
        const lastContribution = memberContributions.length
          ? memberContributions.sort((a, b) => new Date(b.date_paid) - new Date(a.date_paid))[0]
          : null

        return {
          member,
          totalContribution,
          contributionCount,
          averageContribution,
          lastContribution,
          contributions: memberContributions,
        }
      })
      .sort((a, b) => b.totalContribution - a.totalContribution)
  }, [tithesData, membersData, memberFilter])

  // Calculate event summary
  const eventSummary = useMemo(() => {
    if (!tithesData.length || !eventsData.length) return []

    // Group tithes by event
    const eventTithes = {}
    tithesData.forEach((tithe) => {
      if (!eventTithes[tithe.event_id]) {
        eventTithes[tithe.event_id] = []
      }
      eventTithes[tithe.event_id].push(tithe)
    })

    // Create summary for each event
    return eventsData
      .filter((event) => {
        if (eventFilter === "all") return true
        // You can add more filtering logic here if needed
        return true
      })
      .map((event) => {
        const eventContributions = eventTithes[event.event_id] || []
        const totalContribution = eventContributions.reduce((sum, tithe) => sum + (Number(tithe.amount) || 0), 0)
        const contributorCount = new Set(eventContributions.map((tithe) => tithe.member_id)).size
        const averageContribution = contributorCount > 0 ? totalContribution / contributorCount : 0

        return {
          event,
          totalContribution,
          contributorCount,
          averageContribution,
          contributions: eventContributions,
        }
      })
      .sort((a, b) => b.totalContribution - a.totalContribution)
  }, [tithesData, eventsData, eventFilter])

  // Prepare data for pie chart
  const memberPieData = useMemo(() => {
    return memberSummary
      .slice(0, 5) // Top 5 contributors
      .map((item) => ({
        name: `${item.member.first_name} ${item.member.last_name}`,
        value: item.totalContribution,
      }))
  }, [memberSummary])

  // Prepare data for event pie chart
  const eventPieData = useMemo(() => {
    return eventSummary
      .slice(0, 5) // Top 5 events
      .map((item) => ({
        name: item.event.event_type || `Event ${item.event.event_id}`,
        value: item.totalContribution,
      }))
  }, [eventSummary])

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount || 0)
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return ""
    return format(parseISO(dateString), "MMM d, yyyy")
  }

  // Generate PDF report
  const generatePDF = async () => {
    if (!summaryMetrics) return

    setPdfGenerating(true)

    try {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create()

      // Add pages
      const page1 = pdfDoc.addPage([842, 595]) // A4 landscape
      const page2 = pdfDoc.addPage([842, 595])
      const page3 = pdfDoc.addPage([842, 595])

      // Load fonts
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
      const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman)

      // Define colors
      const primaryColor = rgb(0.035, 0.561, 0.561) // #098F8F
      const secondaryColor = rgb(0.2, 0.831, 0.6) // #34D399
      const textColor = rgb(0.2, 0.2, 0.2)
      const lightGray = rgb(0.9, 0.9, 0.9)

      // Page 1: Cover and Overview
      // Header
      page1.drawRectangle({
        x: 0,
        y: 495,
        width: 842,
        height: 100,
        color: primaryColor,
      })

      page1.drawText("TITHES & OFFERINGS REPORT", {
        x: 50,
        y: 540,
        size: 28,
        font: helveticaBold,
        color: rgb(1, 1, 1),
      })

      page1.drawText(`${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`, {
        x: 50,
        y: 510,
        size: 14,
        font: helvetica,
        color: rgb(1, 1, 1),
      })

      // Summary metrics
      page1.drawText("SUMMARY", {
        x: 50,
        y: 450,
        size: 18,
        font: helveticaBold,
        color: primaryColor,
      })

      // Total Contributions box
      page1.drawRectangle({
        x: 50,
        y: 350,
        width: 170,
        height: 80,
        color: lightGray,
        borderColor: primaryColor,
        borderWidth: 2,
        borderRadius: 4,
      })

      page1.drawText("Total Contributions", {
        x: 70,
        y: 410,
        size: 12,
        font: helveticaBold,
        color: textColor,
      })

      page1.drawText(formatCurrency(summaryMetrics.totalAmount), {
        x: 70,
        y: 380,
        size: 16,
        font: helveticaBold,
        color: primaryColor,
      })

      // Contributing Members box
      page1.drawRectangle({
        x: 240,
        y: 350,
        width: 170,
        height: 80,
        color: lightGray,
        borderColor: secondaryColor,
        borderWidth: 2,
        borderRadius: 4,
      })

      page1.drawText("Contributing Members", {
        x: 260,
        y: 410,
        size: 12,
        font: helveticaBold,
        color: textColor,
      })

      page1.drawText(summaryMetrics.uniqueMembers.toString(), {
        x: 260,
        y: 380,
        size: 16,
        font: helveticaBold,
        color: secondaryColor,
      })

      // Events box
      page1.drawRectangle({
        x: 430,
        y: 350,
        width: 170,
        height: 80,
        color: lightGray,
        borderColor: rgb(0.376, 0.647, 0.98), // #60A5FA
        borderWidth: 2,
        borderRadius: 4,
      })

      page1.drawText("Events", {
        x: 450,
        y: 410,
        size: 12,
        font: helveticaBold,
        color: textColor,
      })

      page1.drawText(summaryMetrics.uniqueEvents.toString(), {
        x: 450,
        y: 380,
        size: 16,
        font: helveticaBold,
        color: rgb(0.376, 0.647, 0.98), // #60A5FA
      })

      // Average Contribution box
      page1.drawRectangle({
        x: 620,
        y: 350,
        width: 170,
        height: 80,
        color: lightGray,
        borderColor: rgb(0.961, 0.62, 0.043), // #F59E0B
        borderWidth: 2,
        borderRadius: 4,
      })

      page1.drawText("Average Contribution", {
        x: 640,
        y: 410,
        size: 12,
        font: helveticaBold,
        color: textColor,
      })

      page1.drawText(formatCurrency(summaryMetrics.averageContribution), {
        x: 640,
        y: 380,
        size: 16,
        font: helveticaBold,
        color: rgb(0.961, 0.62, 0.043), // #F59E0B
      })

      // Convert charts to images
      let trendChartImage = null
      let pieChartImage = null

      if (trendChartRef.current) {
        const trendChartDataUrl = await toPng(trendChartRef.current)
        const trendChartBytes = await fetch(trendChartDataUrl).then((res) => res.arrayBuffer())
        trendChartImage = await pdfDoc.embedPng(trendChartBytes)
      }

      if (pieChartRef.current) {
        const pieChartDataUrl = await toPng(pieChartRef.current)
        const pieChartBytes = await fetch(pieChartDataUrl).then((res) => res.arrayBuffer())
        pieChartImage = await pdfDoc.embedPng(pieChartBytes)
      }

      // Add charts to page 1
      if (trendChartImage) {
        const trendDims = trendChartImage.scale(0.5)
        page1.drawImage(trendChartImage, {
          x: 50,
          y: 50,
          width: trendDims.width,
          height: trendDims.height,
        })
      }

      if (pieChartImage) {
        const pieDims = pieChartImage.scale(0.5)
        page1.drawImage(pieChartImage, {
          x: 450,
          y: 50,
          width: pieDims.width,
          height: pieDims.height,
        })
      }

      // Page 2: Member Summary
      page2.drawRectangle({
        x: 0,
        y: 545,
        width: 842,
        height: 50,
        color: primaryColor,
      })

      page2.drawText("MEMBER SUMMARY", {
        x: 50,
        y: 565,
        size: 18,
        font: helveticaBold,
        color: rgb(1, 1, 1),
      })

      // Table header
      page2.drawRectangle({
        x: 50,
        y: 525,
        width: 742,
        height: 30,
        color: lightGray,
      })

      page2.drawText("Member", {
        x: 60,
        y: 540,
        size: 10,
        font: helveticaBold,
        color: textColor,
      })

      page2.drawText("Type", {
        x: 250,
        y: 540,
        size: 10,
        font: helveticaBold,
        color: textColor,
      })

      page2.drawText("Total Contribution", {
        x: 350,
        y: 540,
        size: 10,
        font: helveticaBold,
        color: textColor,
      })

      page2.drawText("# of Contributions", {
        x: 500,
        y: 540,
        size: 10,
        font: helveticaBold,
        color: textColor,
      })

      page2.drawText("Average", {
        x: 650,
        y: 540,
        size: 10,
        font: helveticaBold,
        color: textColor,
      })

      // Table rows
      const rowHeight = 25
      const maxRows = 18
      const topMembers = memberSummary.slice(0, maxRows)

      topMembers.forEach((item, index) => {
        const y = 525 - (index + 1) * rowHeight

        // Alternate row background
        if (index % 2 === 0) {
          page2.drawRectangle({
            x: 50,
            y,
            width: 742,
            height: rowHeight,
            color: rgb(0.97, 0.97, 0.97),
          })
        }

        page2.drawText(`${item.member.first_name} ${item.member.last_name}`, {
          x: 60,
          y: y + 10,
          size: 10,
          font: helvetica,
          color: textColor,
        })

        page2.drawText(item.member.type || "-", {
          x: 250,
          y: y + 10,
          size: 10,
          font: helvetica,
          color: textColor,
        })

        page2.drawText(formatCurrency(item.totalContribution), {
          x: 350,
          y: y + 10,
          size: 10,
          font: helvetica,
          color: textColor,
        })

        page2.drawText(item.contributionCount.toString(), {
          x: 500,
          y: y + 10,
          size: 10,
          font: helvetica,
          color: textColor,
        })

        page2.drawText(formatCurrency(item.averageContribution), {
          x: 650,
          y: y + 10,
          size: 10,
          font: helvetica,
          color: textColor,
        })
      })

      // Page 3: Event Summary
      page3.drawRectangle({
        x: 0,
        y: 545,
        width: 842,
        height: 50,
        color: secondaryColor,
      })

      page3.drawText("EVENT SUMMARY", {
        x: 50,
        y: 565,
        size: 18,
        font: helveticaBold,
        color: rgb(1, 1, 1),
      })

      // Table header
      page3.drawRectangle({
        x: 50,
        y: 525,
        width: 742,
        height: 30,
        color: lightGray,
      })

      page3.drawText("Event", {
        x: 60,
        y: 540,
        size: 10,
        font: helveticaBold,
        color: textColor,
      })

      page3.drawText("Date", {
        x: 250,
        y: 540,
        size: 10,
        font: helveticaBold,
        color: textColor,
      })

      page3.drawText("Total Contributions", {
        x: 350,
        y: 540,
        size: 10,
        font: helveticaBold,
        color: textColor,
      })

      page3.drawText("# of Contributors", {
        x: 500,
        y: 540,
        size: 10,
        font: helveticaBold,
        color: textColor,
      })

      page3.drawText("Average Contribution", {
        x: 650,
        y: 540,
        size: 10,
        font: helveticaBold,
        color: textColor,
      })

      // Table rows
      const topEvents = eventSummary.slice(0, maxRows)

      topEvents.forEach((item, index) => {
        const y = 525 - (index + 1) * rowHeight

        // Alternate row background
        if (index % 2 === 0) {
          page3.drawRectangle({
            x: 50,
            y,
            width: 742,
            height: rowHeight,
            color: rgb(0.97, 0.97, 0.97),
          })
        }

        page3.drawText(item.event.event_type || `Event ${item.event.event_id}`, {
          x: 60,
          y: y + 10,
          size: 10,
          font: helvetica,
          color: textColor,
        })

        page3.drawText(item.event.start_date ? formatDate(item.event.start_date) : "-", {
          x: 250,
          y: y + 10,
          size: 10,
          font: helvetica,
          color: textColor,
        })

        page3.drawText(formatCurrency(item.totalContribution), {
          x: 350,
          y: y + 10,
          size: 10,
          font: helvetica,
          color: textColor,
        })

        page3.drawText(item.contributorCount.toString(), {
          x: 500,
          y: y + 10,
          size: 10,
          font: helvetica,
          color: textColor,
        })

        page3.drawText(formatCurrency(item.averageContribution), {
          x: 650,
          y: y + 10,
          size: 10,
          font: helvetica,
          color: textColor,
        })
      })

      // Footer on all pages
      const pages = [page1, page2, page3]
      pages.forEach((page, i) => {
        page.drawText(`Tithes & Offerings Report | ${formatDate(new Date())} | Page ${i + 1} of 3`, {
          x: 50,
          y: 20,
          size: 8,
          font: helvetica,
          color: rgb(0.5, 0.5, 0.5),
        })

        // Church logo/name
        page.drawText("CHURCH NAME", {
          x: 700,
          y: 20,
          size: 10,
          font: helveticaBold,
          color: primaryColor,
        })
      })

      // Save and download the PDF
      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `tithes-report-${format(new Date(), "yyyy-MM-dd")}.pdf`
      link.click()
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("There was an error generating the PDF report. Please try again.")
    } finally {
      setPdfGenerating(false)
    }
  }

  // Export data to CSV
  const exportToCSV = (data, filename) => {
    let csvContent = ""

    // Handle different export types
    if (filename === "member-summary.csv") {
      // Header
      csvContent =
        "Member ID,First Name,Last Name,Email,Type,Total Contribution,Contribution Count,Average Contribution\n"

      // Data rows
      data.forEach((item) => {
        csvContent += `${item.member.id},${item.member.first_name},${item.member.last_name},${item.member.email},${
          item.member.type
        },${item.totalContribution},${item.contributionCount},${item.averageContribution.toFixed(2)}\n`
      })
    } else if (filename === "event-summary.csv") {
      // Header
      csvContent = "Event ID,Event Type,Date,Total Contribution,Contributor Count,Average Contribution\n"

      // Data rows
      data.forEach((item) => {
        csvContent += `${item.event.event_id},${item.event.event_type || ""},${item.event.start_date || ""},${
          item.totalContribution
        },${item.contributorCount},${item.averageContribution.toFixed(2)}\n`
      })
    } else if (filename === "all-tithes.csv") {
      // Header
      csvContent = "ID,Member ID,Event ID,Date Paid,Amount,Notes\n"

      // Data rows
      data.forEach((tithe) => {
        csvContent += `${tithe.id},${tithe.member_id},${tithe.event_id},${tithe.date_paid},${tithe.amount},${
          tithe.notes || ""
        }\n`
      })
    }

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Print report
  const printReport = () => {
    window.print()
  }

  // Refresh data
  const refreshData = async () => {
    setLoading(true)

    try {
      // Fetch tithes data within date range
      const { data: tithes, error: tithesError } = await supabase
        .from("tithes_offering")
        .select("*")
        .gte("date_paid", dateRange.startDate)
        .lte("date_paid", dateRange.endDate)

      if (tithesError) throw tithesError

      setTithesData(tithes || [])
    } catch (error) {
      console.error("Error refreshing data:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 print:shadow-none">
      {/* Report Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 print:mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Tithes & Offerings Report</h2>
          <p className="text-gray-500">
            {formatDate(dateRange.startDate)} - {formatDate(dateRange.endDate)}
          </p>
        </div>

        {/* Controls - hidden when printing */}
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0 print:hidden">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">From:</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#098F8F]"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">To:</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#098F8F]"
            />
          </div>
          <button
            onClick={refreshData}
            className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            disabled={loading}
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            <span>Refresh</span>
          </button>
          <button
            onClick={printReport}
            className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            <Printer className="w-4 h-4 mr-1" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#098F8F]"></div>
        </div>
      ) : (
        <>
          {/* Report Tabs - hidden when printing */}
          <div className="border-b border-gray-200 mb-6 print:hidden">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("overview")}
                className={cn(
                  "py-4 px-1 border-b-2 font-medium text-sm",
                  activeTab === "overview"
                    ? "border-[#098F8F] text-[#098F8F]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                )}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("members")}
                className={cn(
                  "py-4 px-1 border-b-2 font-medium text-sm",
                  activeTab === "members"
                    ? "border-[#098F8F] text-[#098F8F]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                )}
              >
                Member Summary
              </button>
              <button
                onClick={() => setActiveTab("events")}
                className={cn(
                  "py-4 px-1 border-b-2 font-medium text-sm",
                  activeTab === "events"
                    ? "border-[#098F8F] text-[#098F8F]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                )}
              >
                Event Summary
              </button>
            </nav>
          </div>

          {/* Overview Tab */}
          <div className={activeTab === "overview" ? "block" : "hidden print:block"} ref={overviewRef}>
            {summaryMetrics ? (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                        <DollarSign className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Contributions</p>
                        <h4 className="text-2xl font-bold text-gray-900">
                          {formatCurrency(summaryMetrics.totalAmount)}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                        <Users className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Contributing Members</p>
                        <h4 className="text-2xl font-bold text-gray-900">{summaryMetrics.uniqueMembers}</h4>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Events</p>
                        <h4 className="text-2xl font-bold text-gray-900">{summaryMetrics.uniqueEvents}</h4>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                        <TrendingUp className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Average Contribution</p>
                        <h4 className="text-2xl font-bold text-gray-900">
                          {formatCurrency(summaryMetrics.averageContribution)}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Monthly Trend Chart */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm" ref={trendChartRef}>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Contribution Trend</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={summaryMetrics.trendData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis
                            tickFormatter={(value) => {
                              if (value >= 1000) {
                                return `$${(value / 1000).toFixed(1)}k`
                              }
                              return `$${value}`
                            }}
                          />
                          <Tooltip
                            formatter={(value) => [`${formatCurrency(value)}`, "Amount"]}
                            labelFormatter={(label) => `Month: ${label}`}
                          />
                          <Legend />
                          <Bar dataKey="amount" fill="#098F8F" name="Contributions" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Top Contributors Pie Chart */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm" ref={pieChartRef}>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Top Contributors</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={memberPieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          >
                            {memberPieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => formatCurrency(value)} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Quick Insights */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Insights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Top Contributors</h4>
                      <ul className="space-y-2">
                        {memberSummary.slice(0, 5).map((item) => (
                          <li key={item.member.id} className="flex justify-between items-center">
                            <span className="text-gray-600">
                              {item.member.first_name} {item.member.last_name}
                            </span>
                            <span className="font-medium">{formatCurrency(item.totalContribution)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Top Events</h4>
                      <ul className="space-y-2">
                        {eventSummary.slice(0, 5).map((item) => (
                          <li key={item.event.event_id} className="flex justify-between items-center">
                            <span className="text-gray-600">
                              {item.event.event_type || `Event ${item.event.event_id}`}
                            </span>
                            <span className="font-medium">{formatCurrency(item.totalContribution)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Export Options - hidden when printing */}
                <div className="flex justify-end space-x-4 print:hidden">
                  <button
                    onClick={generatePDF}
                    disabled={pdfGenerating}
                    className="flex items-center px-4 py-2 bg-[#098F8F] text-white rounded-md hover:bg-[#076e6e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {pdfGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        <span>Generating PDF...</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        <span>Export Beautiful Report</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No data available for the selected date range.</p>
              </div>
            )}
          </div>

          {/* Member Summary Tab */}
          <div className={activeTab === "members" ? "block" : "hidden print:block print:mt-8"} ref={memberTableRef}>
            {/* Member Filter - hidden when printing */}
            <div className="flex justify-between items-center mb-6 print:hidden">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={memberFilter}
                  onChange={(e) => setMemberFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#098F8F]"
                >
                  <option value="all">All Members</option>
                  <option value="Member">Members Only</option>
                  <option value="Visitor">Visitors Only</option>
                </select>
              </div>
              <button
                onClick={() => exportToCSV(memberSummary, "member-summary.csv")}
                className="flex items-center px-4 py-2 bg-[#098F8F] text-white rounded-md hover:bg-[#076e6e] transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                <span>Export Member Summary</span>
              </button>
            </div>

            {/* Print-only header */}
            <div className="hidden print:block print:mb-4">
              <h3 className="text-xl font-bold text-gray-800">Member Summary</h3>
            </div>

            {/* Member Summary Table */}
            {memberSummary.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Member
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Total Contribution
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        # of Contributions
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Average
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Last Contribution
                      </th>
                      <th scope="col" className="relative px-6 py-3 print:hidden">
                        <span className="sr-only">Details</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {memberSummary.map((item) => (
                      <React.Fragment key={item.member.id}>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#098F8F] flex items-center justify-center text-white">
                                {item.member.first_name?.[0]}
                                {item.member.last_name?.[0]}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {item.member.first_name} {item.member.last_name}
                                </div>
                                <div className="text-sm text-gray-500">{item.member.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                item.member.type === "Member"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {item.member.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {formatCurrency(item.totalContribution)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.contributionCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(item.averageContribution)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.lastContribution ? formatDate(item.lastContribution.date_paid) : "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium print:hidden">
                            <button
                              onClick={() => toggleMemberExpansion(item.member.id)}
                              className="text-[#098F8F] hover:text-[#076e6e]"
                            >
                              {expandedMembers[item.member.id] ? (
                                <ChevronUp className="h-5 w-5" />
                              ) : (
                                <ChevronDown className="h-5 w-5" />
                              )}
                            </button>
                          </td>
                        </tr>
                        {expandedMembers[item.member.id] && (
                          <tr className="bg-gray-50">
                            <td colSpan={7} className="px-6 py-4">
                              <div className="text-sm text-gray-900 font-medium mb-2">Contribution History</div>
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-100">
                                    <tr>
                                      <th
                                        scope="col"
                                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                      >
                                        Date
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                      >
                                        Event
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                      >
                                        Amount
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                      >
                                        Notes
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {item.contributions
                                      .sort((a, b) => new Date(b.date_paid) - new Date(a.date_paid))
                                      .map((contribution) => {
                                        const event = eventsData.find((e) => e.event_id === contribution.event_id)
                                        return (
                                          <tr key={contribution.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">
                                              {formatDate(contribution.date_paid)}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">
                                              {event
                                                ? event.event_type || `Event ${event.event_id}`
                                                : `Event ${contribution.event_id}`}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900 font-medium">
                                              {formatCurrency(contribution.amount)}
                                            </td>
                                            <td className="px-4 py-2 text-xs text-gray-500 max-w-xs truncate">
                                              {contribution.notes || "-"}
                                            </td>
                                          </tr>
                                        )
                                      })}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No member data available for the selected filters.</p>
              </div>
            )}
          </div>

          {/* Event Summary Tab */}
          <div className={activeTab === "events" ? "block" : "hidden print:block print:mt-8"} ref={eventTableRef}>
            {/* Event Filter - hidden when printing */}
            <div className="flex justify-between items-center mb-6 print:hidden">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={eventFilter}
                  onChange={(e) => setEventFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#098F8F]"
                >
                  <option value="all">All Events</option>
                  {/* Add more event type filters if needed */}
                </select>
              </div>
              <button
                onClick={() => exportToCSV(eventSummary, "event-summary.csv")}
                className="flex items-center px-4 py-2 bg-[#098F8F] text-white rounded-md hover:bg-[#076e6e] transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                <span>Export Event Summary</span>
              </button>
            </div>

            {/* Print-only header */}
            <div className="hidden print:block print:mb-4">
              <h3 className="text-xl font-bold text-gray-800">Event Summary</h3>
            </div>

            {/* Event Summary Table */}
            {eventSummary.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Event
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Total Contributions
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        # of Contributors
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Average Contribution
                      </th>
                      <th scope="col" className="relative px-6 py-3 print:hidden">
                        <span className="sr-only">Details</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {eventSummary.map((item) => (
                      <React.Fragment key={item.event.event_id}>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {item.event.event_type || `Event ${item.event.event_id}`}
                            </div>
                            <div className="text-xs text-gray-500">{item.event.location || "-"}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.event.start_date ? formatDate(item.event.start_date) : "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {formatCurrency(item.totalContribution)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.contributorCount}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(item.averageContribution)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium print:hidden">
                            <button
                              onClick={() => toggleEventExpansion(item.event.event_id)}
                              className="text-[#098F8F] hover:text-[#076e6e]"
                            >
                              {expandedEvents[item.event.event_id] ? (
                                <ChevronUp className="h-5 w-5" />
                              ) : (
                                <ChevronDown className="h-5 w-5" />
                              )}
                            </button>
                          </td>
                        </tr>
                        {expandedEvents[item.event.event_id] && (
                          <tr className="bg-gray-50">
                            <td colSpan={6} className="px-6 py-4">
                              <div className="text-sm text-gray-900 font-medium mb-2">Contributor Details</div>
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-100">
                                    <tr>
                                      <th
                                        scope="col"
                                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                      >
                                        Member
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                      >
                                        Type
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                      >
                                        Date
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                      >
                                        Amount
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                      >
                                        Notes
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {item.contributions
                                      .sort((a, b) => new Date(b.date_paid) - new Date(a.date_paid))
                                      .map((contribution) => {
                                        const member = membersData.find((m) => m.id === contribution.member_id)
                                        return (
                                          <tr key={contribution.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900">
                                              {member
                                                ? `${member.first_name} ${member.last_name}`
                                                : `Member ${contribution.member_id}`}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">
                                              {member ? member.type : "-"}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">
                                              {formatDate(contribution.date_paid)}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900 font-medium">
                                              {formatCurrency(contribution.amount)}
                                            </td>
                                            <td className="px-4 py-2 text-xs text-gray-500 max-w-xs truncate">
                                              {contribution.notes || "-"}
                                            </td>
                                          </tr>
                                        )
                                      })}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No event data available for the selected filters.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default TithesReportGenerator
