"use client"

import React, { useState, useEffect, useMemo } from "react"
import { createClient } from "@supabase/supabase-js"
import { format, subMonths, startOfMonth, endOfMonth, parseISO, differenceInMonths } from "date-fns"
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
  AreaChart,
  Area,
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
  Award,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Target,
} from "lucide-react"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
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
const MEMBER_COLORS = {
  Member: "#098F8F",
  Visitor: "#F59E0B",
  Guest: "#60A5FA",
  Other: "#8B5CF6",
}

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
  const [previousPeriodData, setPreviousPeriodData] = useState([])
  const [yearlyData, setYearlyData] = useState([])

  // Refs for chart components
  const overviewRef = React.useRef(null)
  const trendChartRef = React.useRef(null)
  const pieChartRef = React.useRef(null)
  const memberTypeChartRef = React.useRef(null)
  const weekdayChartRef = React.useRef(null)
  const yearlyTrendChartRef = React.useRef(null)
  const memberTableRef = React.useRef(null)
  const eventTableRef = React.useRef(null)
  const topContributorsRef = React.useRef(null)

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      try {
        // Calculate previous period for comparison
        const currentStartDate = new Date(dateRange.startDate)
        const currentEndDate = new Date(dateRange.endDate)
        const monthDiff = differenceInMonths(currentEndDate, currentStartDate)
        const previousStartDate = format(subMonths(currentStartDate, monthDiff), "yyyy-MM-dd")
        const previousEndDate = format(subMonths(currentEndDate, monthDiff), "yyyy-MM-dd")

        // Fetch tithes data within date range
        const { data: tithes, error: tithesError } = await supabase
          .from("tithes_offering")
          .select("*")
          .gte("date_paid", dateRange.startDate)
          .lte("date_paid", dateRange.endDate)

        if (tithesError) throw tithesError

        // Fetch previous period data for comparison
        const { data: previousTithes, error: previousTithesError } = await supabase
          .from("tithes_offering")
          .select("*")
          .gte("date_paid", previousStartDate)
          .lte("date_paid", previousEndDate)

        if (previousTithesError) throw previousTithesError

        // Fetch yearly data for trends (last 12 months)
        const yearlyStartDate = format(subMonths(new Date(), 11), "yyyy-MM-dd")
        const { data: yearlyTithes, error: yearlyTithesError } = await supabase
          .from("tithes_offering")
          .select("*")
          .gte("date_paid", yearlyStartDate)
          .lte("date_paid", format(new Date(), "yyyy-MM-dd"))

        if (yearlyTithesError) throw yearlyTithesError

        // Fetch members data
        const { data: members, error: membersError } = await supabase
          .from(process.env.REACT_APP_MEMBERVIS_TABLE)
          .select("*")

        if (membersError) throw membersError

        // Fetch events data
        const { data: events, error: eventsError } = await supabase.from("events").select("*")

        if (eventsError) throw eventsError

        setTithesData(tithes || [])
        setPreviousPeriodData(previousTithes || [])
        setYearlyData(yearlyTithes || [])
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

    // Previous period metrics for comparison
    const previousTotalAmount = previousPeriodData.reduce((sum, tithe) => sum + (Number(tithe.amount) || 0), 0)
    const previousUniqueMembers = new Set(previousPeriodData.map((tithe) => tithe.member_id)).size
    const previousUniqueEvents = new Set(previousPeriodData.map((tithe) => tithe.event_id)).size
    const previousAverageContribution = previousPeriodData.length ? previousTotalAmount / previousPeriodData.length : 0

    // Calculate growth percentages
    const amountGrowth = previousTotalAmount ? ((totalAmount - previousTotalAmount) / previousTotalAmount) * 100 : 0
    const memberGrowth = previousUniqueMembers
      ? ((uniqueMembers - previousUniqueMembers) / previousUniqueMembers) * 100
      : 0
    const eventGrowth = previousUniqueEvents ? ((uniqueEvents - previousUniqueEvents) / previousUniqueEvents) * 100 : 0
    const averageGrowth = previousAverageContribution
      ? ((averageContribution - previousAverageContribution) / previousAverageContribution) * 100
      : 0

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

    // Group by weekday for pattern analysis
    const weekdayData = [0, 0, 0, 0, 0, 0, 0] // Sun, Mon, Tue, Wed, Thu, Fri, Sat
    const weekdayCount = [0, 0, 0, 0, 0, 0, 0]
    tithesData.forEach((tithe) => {
      try {
        const date = new Date(tithe.date_paid)
        const weekday = date.getDay() // 0 = Sunday, 6 = Saturday
        weekdayData[weekday] += Number(tithe.amount) || 0
        weekdayCount[weekday]++
      } catch (e) {
        console.error("Error processing date:", tithe.date_paid, e)
      }
    })

    const weekdayAvg = weekdayData.map((total, i) => ({
      day: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][i],
      total,
      count: weekdayCount[i],
      average: weekdayCount[i] ? total / weekdayCount[i] : 0,
    }))

    // Group by member type
    const memberTypeData = {}
    tithesData.forEach((tithe) => {
      const member = membersData.find((m) => m.id === tithe.member_id)
      const type = member ? member.type || "Other" : "Other"
      if (!memberTypeData[type]) {
        memberTypeData[type] = 0
      }
      memberTypeData[type] += Number(tithe.amount) || 0
    })

    const memberTypeChartData = Object.entries(memberTypeData).map(([type, amount]) => ({
      name: type,
      value: amount,
    }))

    // Calculate yearly trend data
    const yearlyTrendData = []
    const now = new Date()
    for (let i = 11; i >= 0; i--) {
      const month = subMonths(now, i)
      const monthStr = format(month, "yyyy-MM")
      const monthName = format(month, "MMM yyyy")

      // Filter tithes for this month
      const monthTithes = yearlyData.filter((tithe) => tithe.date_paid && tithe.date_paid.startsWith(monthStr))

      const total = monthTithes.reduce((sum, tithe) => sum + (Number(tithe.amount) || 0), 0)
      const count = monthTithes.length

      yearlyTrendData.push({
        month: monthName,
        total,
        count,
        average: count > 0 ? total / count : 0,
      })
    }

    return {
      totalAmount,
      uniqueMembers,
      uniqueEvents,
      averageContribution,
      previousTotalAmount,
      previousUniqueMembers,
      previousUniqueEvents,
      previousAverageContribution,
      amountGrowth,
      memberGrowth,
      eventGrowth,
      averageGrowth,
      trendData,
      weekdayAvg,
      memberTypeChartData,
      yearlyTrendData,
    }
  }, [tithesData, previousPeriodData, yearlyData, membersData])

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

        // Calculate frequency (contributions per month)
        let frequency = 0
        if (contributionCount > 0 && lastContribution) {
          const firstContribution = memberContributions.sort((a, b) => new Date(a.date_paid) - new Date(b.date_paid))[0]
          const months = differenceInMonths(new Date(lastContribution.date_paid), new Date(firstContribution.date_paid))
          frequency = months > 0 ? contributionCount / months : contributionCount
        }

        return {
          member,
          totalContribution,
          contributionCount,
          averageContribution,
          lastContribution,
          frequency,
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

    try {
      // If it's already a Date object
      if (dateString instanceof Date) {
        return format(dateString, "MMM d, yyyy")
      }

      // If it's a string, parse it
      if (typeof dateString === "string") {
        return format(parseISO(dateString), "MMM d, yyyy")
      }

      // If it's neither, return empty string
      return ""
    } catch (error) {
      console.error("Error formatting date:", dateString, error)
      return ""
    }
  }

  // Format percentage
  const formatPercentage = (value) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`
  }

  // Generate PDF report
  const generatePDF = async () => {
    if (!summaryMetrics) return

    setPdfGenerating(true)

    try {
      // Create a new PDF document
      const doc = new jsPDF("portrait", "pt", "a4")
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 40
      const contentWidth = pageWidth - margin * 2

      // Helper function to add page number
      const addPageNumber = (pageNum, totalPages) => {
        doc.setFontSize(10)
        doc.setTextColor(150, 150, 150)
        doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin - 60, pageHeight - 20)
      }

      // ===== COVER PAGE =====
      doc.setFillColor(9, 143, 143) // #098F8F
      doc.rect(0, 0, pageWidth, 120, "F")

      // Add title
      doc.setFontSize(32)
      doc.setTextColor(255, 255, 255)
      doc.text("Tithes & Offerings", margin, 80)

      doc.setFontSize(24)
      doc.text("Financial Report", margin, 115)

      // Add date range
      doc.setFontSize(16)
      doc.setTextColor(80, 80, 80)
      doc.text(`Reporting Period: ${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`, margin, 180)

      // Add organization name (placeholder)
      doc.setFontSize(14)
      doc.setTextColor(100, 100, 100)
      doc.text("Your Organization Name", margin, 210)

      // Add report generation date
      doc.setFontSize(12)
      doc.text(`Generated on: ${formatDate(new Date())}`, margin, 240)

      // Add decorative element
      doc.setDrawColor(9, 143, 143)
      doc.setLineWidth(3)
      doc.line(margin, 260, pageWidth - margin, 260)

      // Add image placeholder for logo
      doc.setFillColor(240, 240, 240)
      doc.roundedRect(pageWidth - margin - 150, 180, 120, 60, 5, 5, "F")
      doc.setFontSize(12)
      doc.setTextColor(150, 150, 150)
      doc.text("Organization Logo", pageWidth - margin - 115, 215)

      // Add page number
      addPageNumber(1, "___") // Will be replaced later

      // ===== TABLE OF CONTENTS =====
      doc.addPage()

      doc.setFontSize(24)
      doc.setTextColor(9, 143, 143)
      doc.text("Table of Contents", margin, margin + 20)

      doc.setDrawColor(9, 143, 143)
      doc.setLineWidth(1)
      doc.line(margin, margin + 30, pageWidth - margin, margin + 30)

      const tocItems = [
        { title: "Executive Summary", page: 3 },
        { title: "Financial Overview", page: 4 },
        { title: "Contribution Trends", page: 5 },
        { title: "Member Analysis", page: 6 },
        { title: "Event Analysis", page: 7 },
        { title: "Top Contributors", page: 8 },
        { title: "Detailed Reports", page: 9 },
      ]

      doc.setFontSize(14)
      doc.setTextColor(80, 80, 80)

      tocItems.forEach((item, index) => {
        doc.text(item.title, margin, margin + 70 + index * 30)
        doc.text(item.page.toString(), pageWidth - margin - 20, margin + 70 + index * 30)
        doc.setDrawColor(200, 200, 200)
        doc.setLineWidth(0.5)
        doc.line(margin, margin + 75 + index * 30, pageWidth - margin, margin + 75 + index * 30)
      })

      // Add page number
      addPageNumber(2, "___")

      // ===== EXECUTIVE SUMMARY =====
      doc.addPage()

      doc.setFontSize(24)
      doc.setTextColor(9, 143, 143)
      doc.text("Executive Summary", margin, margin + 20)

      doc.setDrawColor(9, 143, 143)
      doc.setLineWidth(1)
      doc.line(margin, margin + 30, pageWidth - margin, margin + 30)

      doc.setFontSize(12)
      doc.setTextColor(80, 80, 80)
      doc.text(
        "This report provides a comprehensive analysis of tithes and offerings collected during the specified period. " +
          "The data presented offers insights into contribution patterns, member participation, and event performance.",
        margin,
        margin + 60,
        { maxWidth: contentWidth },
      )

      doc.text("Key findings from this reporting period include:", margin, margin + 100)

      // Key metrics with comparison to previous period
      const keyMetrics = [
        {
          title: "Total Contributions",
          current: formatCurrency(summaryMetrics.totalAmount),
          previous: formatCurrency(summaryMetrics.previousTotalAmount),
          growth: formatPercentage(summaryMetrics.amountGrowth),
          positive: summaryMetrics.amountGrowth >= 0,
        },
        {
          title: "Contributing Members",
          current: summaryMetrics.uniqueMembers.toString(),
          previous: summaryMetrics.previousUniqueMembers.toString(),
          growth: formatPercentage(summaryMetrics.memberGrowth),
          positive: summaryMetrics.memberGrowth >= 0,
        },
        {
          title: "Average Contribution",
          current: formatCurrency(summaryMetrics.averageContribution),
          previous: formatCurrency(summaryMetrics.previousAverageContribution),
          growth: formatPercentage(summaryMetrics.averageGrowth),
          positive: summaryMetrics.averageGrowth >= 0,
        },
      ]

      // Create a table for key metrics
      const keyMetricsData = keyMetrics.map((metric) => [
        metric.title,
        metric.current,
        metric.previous,
        metric.growth,
        metric.positive ? "Increase" : "Decrease",
      ])

      autoTable(doc, {
        startY: margin + 120,
        head: [["Metric", "Current Period", "Previous Period", "Change", "Trend"]],
        body: keyMetricsData,
        theme: "grid",
        headStyles: {
          fillColor: [9, 143, 143],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        styles: {
          cellPadding: 8,
        },
        columnStyles: {
          0: { fontStyle: "bold" },
          3: {
            cellWidth: 60,
            halign: "right",
          },
          4: {
            cellWidth: 70,
            halign: "center",
          },
        },
        didDrawCell: (data) => {
          // Add trend icons to the last column
          if (data.column.index === 4 && data.row.index > 0) {
            const metric = keyMetrics[data.row.index - 1]
            const x = data.cell.x + data.cell.width / 2 - 5
            const y = data.cell.y + data.cell.height / 2 + 3

            // Draw arrow icon
            doc.setDrawColor(metric.positive ? 0 : 255, metric.positive ? 128 : 0, 0)
            doc.setLineWidth(1.5)

            if (metric.positive) {
              // Up arrow
              doc.line(x, y + 5, x, y - 5)
              doc.line(x, y - 5, x - 3, y - 2)
              doc.line(x, y - 5, x + 3, y - 2)
            } else {
              // Down arrow
              doc.line(x, y - 5, x, y + 5)
              doc.line(x, y + 5, x - 3, y + 2)
              doc.line(x, y + 5, x + 3, y + 2)
            }
          }
        },
      })

      // Add insights based on data
      doc.setFontSize(14)
      doc.setTextColor(9, 143, 143)
      doc.text("Key Insights", margin, doc.lastAutoTable.finalY + 40)

      doc.setFontSize(12)
      doc.setTextColor(80, 80, 80)

      const insights = [
        summaryMetrics.amountGrowth >= 0
          ? `Total contributions have increased by ${formatPercentage(summaryMetrics.amountGrowth)} compared to the previous period.`
          : `Total contributions have decreased by ${formatPercentage(Math.abs(summaryMetrics.amountGrowth))} compared to the previous period.`,

        memberSummary.length > 0
          ? `Top contributor: ${memberSummary[0].member.first_name} ${memberSummary[0].member.last_name} (${formatCurrency(memberSummary[0].totalContribution)})`
          : "No member contribution data available for this period.",

        eventSummary.length > 0
          ? `Most successful event: ${eventSummary[0].event.event_type || `Event ${eventSummary[0].event.event_id}`} (${formatCurrency(eventSummary[0].totalContribution)})`
          : "No event contribution data available for this period.",
      ]

      insights.forEach((insight, index) => {
        doc.text(`• ${insight}`, margin, doc.lastAutoTable.finalY + 70 + index * 20, { maxWidth: contentWidth })
      })

      // Add page number
      addPageNumber(3, "___")

      // ===== FINANCIAL OVERVIEW =====
      doc.addPage()

      doc.setFontSize(24)
      doc.setTextColor(9, 143, 143)
      doc.text("Financial Overview", margin, margin + 20)

      doc.setDrawColor(9, 143, 143)
      doc.setLineWidth(1)
      doc.line(margin, margin + 30, pageWidth - margin, margin + 30)

      // Summary cards as a table
      const summaryData = [
        ["Total Contributions", formatCurrency(summaryMetrics.totalAmount)],
        ["Contributing Members", summaryMetrics.uniqueMembers.toString()],
        ["Events", summaryMetrics.uniqueEvents.toString()],
        ["Average Contribution", formatCurrency(summaryMetrics.averageContribution)],
      ]

      autoTable(doc, {
        startY: margin + 50,
        head: [["Metric", "Value"]],
        body: summaryData,
        theme: "grid",
        headStyles: {
          fillColor: [9, 143, 143],
          textColor: [255, 255, 255],
        },
        styles: {
          cellPadding: 8,
        },
        columnStyles: {
          0: { fontStyle: "bold" },
        },
      })

      // Member type distribution
      doc.setFontSize(16)
      doc.setTextColor(9, 143, 143)
      doc.text("Contribution by Member Type", margin, doc.lastAutoTable.finalY + 40)

      // Create a table for member type distribution
      const memberTypeData = summaryMetrics.memberTypeChartData.map((item) => [
        item.name,
        formatCurrency(item.value),
        ((item.value / summaryMetrics.totalAmount) * 100).toFixed(1) + "%",
      ])

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 50,
        head: [["Member Type", "Amount", "Percentage"]],
        body: memberTypeData,
        theme: "grid",
        headStyles: {
          fillColor: [9, 143, 143],
          textColor: [255, 255, 255],
        },
        styles: {
          cellPadding: 8,
        },
        columnStyles: {
          0: { fontStyle: "bold" },
          2: { halign: "right" },
        },
      })

      // Try to capture member type chart
      try {
        if (memberTypeChartRef.current) {
          const memberTypeChartDataUrl = await toPng(memberTypeChartRef.current, { quality: 0.95 })
          doc.addImage(memberTypeChartDataUrl, "PNG", margin, doc.lastAutoTable.finalY + 30, contentWidth / 2 - 20, 180)
        }
      } catch (chartError) {
        console.error("Error capturing member type chart:", chartError)
      }

      // Try to capture pie chart
      try {
        if (pieChartRef.current) {
          const pieChartDataUrl = await toPng(pieChartRef.current, { quality: 0.95 })
          doc.addImage(
            pieChartDataUrl,
            "PNG",
            margin + contentWidth / 2,
            doc.lastAutoTable.finalY + 30,
            contentWidth / 2,
            180,
          )
        }
      } catch (chartError) {
        console.error("Error capturing pie chart:", chartError)
      }

      // Add page number
      addPageNumber(4, "___")

      // ===== CONTRIBUTION TRENDS =====
      doc.addPage()

      doc.setFontSize(24)
      doc.setTextColor(9, 143, 143)
      doc.text("Contribution Trends", margin, margin + 20)

      doc.setDrawColor(9, 143, 143)
      doc.setLineWidth(1)
      doc.line(margin, margin + 30, pageWidth - margin, margin + 30)

      // Monthly trend
      doc.setFontSize(16)
      doc.setTextColor(9, 143, 143)
      doc.text("Monthly Contribution Trend", margin, margin + 60)

      // Try to capture trend chart
      try {
        if (trendChartRef.current) {
          const trendChartDataUrl = await toPng(trendChartRef.current, { quality: 0.95 })
          doc.addImage(trendChartDataUrl, "PNG", margin, margin + 70, contentWidth, 180)
        }
      } catch (chartError) {
        console.error("Error capturing trend chart:", chartError)
      }

      // Yearly trend
      doc.setFontSize(16)
      doc.setTextColor(9, 143, 143)
      doc.text("12-Month Contribution History", margin, margin + 280)

      // Try to capture yearly trend chart
      try {
        if (yearlyTrendChartRef.current) {
          const yearlyTrendChartDataUrl = await toPng(yearlyTrendChartRef.current, { quality: 0.95 })
          doc.addImage(yearlyTrendChartDataUrl, "PNG", margin, margin + 290, contentWidth, 180)
        }
      } catch (chartError) {
        console.error("Error capturing yearly trend chart:", chartError)
      }

      // Weekday pattern
      doc.setFontSize(16)
      doc.setTextColor(9, 143, 143)
      doc.text("Contribution Pattern by Day of Week", margin, margin + 500)

      // Try to capture weekday chart
      try {
        if (weekdayChartRef.current) {
          const weekdayChartDataUrl = await toPng(weekdayChartRef.current, { quality: 0.95 })
          doc.addImage(weekdayChartDataUrl, "PNG", margin, margin + 510, contentWidth, 180)
        }
      } catch (chartError) {
        console.error("Error capturing weekday chart:", chartError)

        // Fallback: Create a table for weekday data
        const weekdayTableData = summaryMetrics.weekdayAvg.map((day) => [
          day.day,
          formatCurrency(day.total),
          day.count.toString(),
          formatCurrency(day.average),
        ])

        autoTable(doc, {
          startY: margin + 510,
          head: [["Day", "Total Amount", "Count", "Average"]],
          body: weekdayTableData,
          theme: "grid",
          headStyles: {
            fillColor: [9, 143, 143],
            textColor: [255, 255, 255],
          },
          styles: {
            cellPadding: 8,
          },
          columnStyles: {
            0: { fontStyle: "bold" },
          },
        })
      }

      // Add page number
      addPageNumber(5, "___")

      // ===== MEMBER ANALYSIS =====
      doc.addPage()

      doc.setFontSize(24)
      doc.setTextColor(9, 143, 143)
      doc.text("Member Analysis", margin, margin + 20)

      doc.setDrawColor(9, 143, 143)
      doc.setLineWidth(1)
      doc.line(margin, margin + 30, pageWidth - margin, margin + 30)

      // Member statistics
      doc.setFontSize(16)
      doc.setTextColor(9, 143, 143)
      doc.text("Member Statistics", margin, margin + 60)

      const memberStats = [
        ["Total Contributing Members", summaryMetrics.uniqueMembers.toString()],
        ["Average Contribution per Member", formatCurrency(summaryMetrics.totalAmount / summaryMetrics.uniqueMembers)],
        ["Member Participation Rate", ((summaryMetrics.uniqueMembers / membersData.length) * 100).toFixed(1) + "%"],
        ["New Contributors", "N/A"], // Would need historical data to calculate
      ]

      autoTable(doc, {
        startY: margin + 70,
        body: memberStats,
        theme: "grid",
        styles: {
          cellPadding: 8,
        },
        columnStyles: {
          0: { fontStyle: "bold" },
        },
      })

      // Top members table
      doc.setFontSize(16)
      doc.setTextColor(9, 143, 143)
      doc.text("Top Contributing Members", margin, doc.lastAutoTable.finalY + 40)

      const topMembersData = memberSummary
        .slice(0, 10)
        .map((item, index) => [
          (index + 1).toString(),
          `${item.member.first_name} ${item.member.last_name}`,
          item.member.type || "-",
          formatCurrency(item.totalContribution),
          item.contributionCount.toString(),
          formatCurrency(item.averageContribution),
        ])

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 50,
        head: [["Rank", "Member", "Type", "Total", "# Contributions", "Average"]],
        body: topMembersData,
        theme: "grid",
        headStyles: {
          fillColor: [9, 143, 143],
          textColor: [255, 255, 255],
        },
        styles: {
          cellPadding: 8,
        },
        columnStyles: {
          0: { halign: "center" },
          3: { halign: "right" },
          5: { halign: "right" },
        },
      })

      // Member frequency analysis
      doc.setFontSize(16)
      doc.setTextColor(9, 143, 143)
      doc.text("Member Contribution Frequency", margin, doc.lastAutoTable.finalY + 40)

      // Group members by frequency
      const frequencyGroups = {
        "Weekly (4+ per month)": 0,
        "Bi-weekly (2-3 per month)": 0,
        "Monthly (1 per month)": 0,
        "Quarterly (3-4 per year)": 0,
        "Occasional (1-2 per year)": 0,
        "One-time": 0,
      }

      memberSummary.forEach((item) => {
        if (item.frequency >= 4) {
          frequencyGroups["Weekly (4+ per month)"]++
        } else if (item.frequency >= 2) {
          frequencyGroups["Bi-weekly (2-3 per month)"]++
        } else if (item.frequency >= 1) {
          frequencyGroups["Monthly (1 per month)"]++
        } else if (item.frequency >= 0.25) {
          frequencyGroups["Quarterly (3-4 per year)"]++
        } else if (item.frequency > 0.08) {
          frequencyGroups["Occasional (1-2 per year)"]++
        } else {
          frequencyGroups["One-time"]++
        }
      })

      const frequencyData = Object.entries(frequencyGroups).map(([category, count]) => [
        category,
        count.toString(),
        ((count / memberSummary.length) * 100).toFixed(1) + "%",
      ])

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 50,
        head: [["Frequency", "Count", "Percentage"]],
        body: frequencyData,
        theme: "grid",
        headStyles: {
          fillColor: [9, 143, 143],
          textColor: [255, 255, 255],
        },
        styles: {
          cellPadding: 8,
        },
        columnStyles: {
          0: { fontStyle: "bold" },
          2: { halign: "right" },
        },
      })

      // Add page number
      addPageNumber(6, "___")

      // ===== EVENT ANALYSIS =====
      doc.addPage()

      doc.setFontSize(24)
      doc.setTextColor(9, 143, 143)
      doc.text("Event Analysis", margin, margin + 20)

      doc.setDrawColor(9, 143, 143)
      doc.setLineWidth(1)
      doc.line(margin, margin + 30, pageWidth - margin, margin + 30)

      // Event statistics
      doc.setFontSize(16)
      doc.setTextColor(9, 143, 143)
      doc.text("Event Statistics", margin, margin + 60)

      const eventStats = [
        ["Total Events with Contributions", summaryMetrics.uniqueEvents.toString()],
        ["Average Contribution per Event", formatCurrency(summaryMetrics.totalAmount / summaryMetrics.uniqueEvents)],
        ["Average Contributors per Event", (memberSummary.length / summaryMetrics.uniqueEvents).toFixed(1)],
      ]

      autoTable(doc, {
        startY: margin + 70,
        body: eventStats,
        theme: "grid",
        styles: {
          cellPadding: 8,
        },
        columnStyles: {
          0: { fontStyle: "bold" },
        },
      })

      // Top events table
      doc.setFontSize(16)
      doc.setTextColor(9, 143, 143)
      doc.text("Top Performing Events", margin, doc.lastAutoTable.finalY + 40)

      const topEventsData = eventSummary
        .slice(0, 10)
        .map((item, index) => [
          (index + 1).toString(),
          item.event.event_type || `Event ${item.event.event_id}`,
          item.event.start_date ? formatDate(item.event.start_date) : "-",
          formatCurrency(item.totalContribution),
          item.contributorCount.toString(),
          formatCurrency(item.averageContribution),
        ])

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 50,
        head: [["Rank", "Event", "Date", "Total", "# Contributors", "Average"]],
        body: topEventsData,
        theme: "grid",
        headStyles: {
          fillColor: [9, 143, 143],
          textColor: [255, 255, 255],
        },
        styles: {
          cellPadding: 8,
        },
        columnStyles: {
          0: { halign: "center" },
          3: { halign: "right" },
          5: { halign: "right" },
        },
      })

      // Event pie chart
      doc.setFontSize(16)
      doc.setTextColor(9, 143, 143)
      doc.text("Contribution Distribution by Event", margin, doc.lastAutoTable.finalY + 40)

      // Try to capture event pie chart
      try {
        if (pieChartRef.current) {
          const eventPieChartDataUrl = await toPng(pieChartRef.current, { quality: 0.95 })
          doc.addImage(
            eventPieChartDataUrl,
            "PNG",
            margin + contentWidth / 4,
            doc.lastAutoTable.finalY + 50,
            contentWidth / 2,
            180,
          )
        }
      } catch (chartError) {
        console.error("Error capturing event pie chart:", chartError)
      }

      // Add page number
      addPageNumber(7, "___")

      // ===== TOP CONTRIBUTORS =====
      doc.addPage()

      doc.setFontSize(24)
      doc.setTextColor(9, 143, 143)
      doc.text("Top Contributors", margin, margin + 20)

      doc.setDrawColor(9, 143, 143)
      doc.setLineWidth(1)
      doc.line(margin, margin + 30, pageWidth - margin, margin + 30)

      // Top 5 contributors with profile cards
      const top5Members = memberSummary.slice(0, 5)

      if (top5Members.length > 0) {
        let yPos = margin + 60

        top5Members.forEach((item, index) => {
          // Profile card
          doc.setFillColor(250, 250, 250)
          doc.roundedRect(margin, yPos, contentWidth, 120, 5, 5, "F")

          // Rank badge
          doc.setFillColor(9, 143, 143)
          doc.circle(margin + 30, yPos + 30, 15, "F")
          doc.setFontSize(14)
          doc.setTextColor(255, 255, 255)
          doc.text((index + 1).toString(), margin + 30, yPos + 35, { align: "center" })

          // Member name
          doc.setFontSize(16)
          doc.setTextColor(60, 60, 60)
          doc.text(`${item.member.first_name} ${item.member.last_name}`, margin + 60, yPos + 30)

          // Member type
          doc.setFontSize(12)
          doc.setTextColor(100, 100, 100)
          doc.text(item.member.type || "Member", margin + 60, yPos + 50)

          // Contribution stats
          doc.setFontSize(14)
          doc.setTextColor(9, 143, 143)
          doc.text(formatCurrency(item.totalContribution), margin + 60, yPos + 80)

          doc.setFontSize(12)
          doc.setTextColor(100, 100, 100)
          doc.text(
            `${item.contributionCount} contributions | Avg: ${formatCurrency(item.averageContribution)}`,
            margin + 60,
            yPos + 100,
          )

          // Contribution percentage
          const percentage = ((item.totalContribution / summaryMetrics.totalAmount) * 100).toFixed(1)
          doc.setFontSize(16)
          doc.setTextColor(9, 143, 143)
          doc.text(`${percentage}%`, margin + contentWidth - 60, yPos + 60, { align: "center" })

          doc.setFontSize(12)
          doc.setTextColor(100, 100, 100)
          doc.text("of total", margin + contentWidth - 60, yPos + 80, { align: "center" })

          yPos += 140
        })
      } else {
        doc.setFontSize(14)
        doc.setTextColor(100, 100, 100)
        doc.text("No contributor data available for this period.", margin, margin + 70)
      }

      // Add page number
      addPageNumber(8, "___")

      // ===== DETAILED REPORTS =====
      doc.addPage()

      doc.setFontSize(24)
      doc.setTextColor(9, 143, 143)
      doc.text("Detailed Reports", margin, margin + 20)

      doc.setDrawColor(9, 143, 143)
      doc.setLineWidth(1)
      doc.line(margin, margin + 30, pageWidth - margin, margin + 30)

      // Member table
      doc.setFontSize(16)
      doc.setTextColor(9, 143, 143)
      doc.text("Member Contribution Details", margin, margin + 60)

      // Create a table with all member data
      const memberTableData = memberSummary
        .slice(0, 20) // Limit to 20 to fit on page
        .map((item) => [
          `${item.member.first_name} ${item.member.last_name}`,
          item.member.type || "-",
          formatCurrency(item.totalContribution),
          item.contributionCount.toString(),
          formatCurrency(item.averageContribution),
          item.lastContribution ? formatDate(item.lastContribution.date_paid) : "-",
        ])

      autoTable(doc, {
        startY: margin + 70,
        head: [["Member", "Type", "Total", "Count", "Average", "Last Contribution"]],
        body: memberTableData,
        theme: "grid",
        headStyles: {
          fillColor: [9, 143, 143],
          textColor: [255, 255, 255],
        },
        styles: {
          cellPadding: 6,
          fontSize: 10,
        },
        columnStyles: {
          2: { halign: "right" },
          3: { halign: "center" },
          4: { halign: "right" },
        },
      })

      // Event table
      doc.setFontSize(16)
      doc.setTextColor(9, 143, 143)
      doc.text("Event Contribution Details", margin, doc.lastAutoTable.finalY + 40)

      // Create a table with all event data
      const eventTableData = eventSummary
        .slice(0, 15) // Limit to 15 to fit on page
        .map((item) => [
          item.event.event_type || `Event ${item.event.event_id}`,
          item.event.start_date ? formatDate(item.event.start_date) : "-",
          formatCurrency(item.totalContribution),
          item.contributorCount.toString(),
          formatCurrency(item.averageContribution),
        ])

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 50,
        head: [["Event", "Date", "Total", "Contributors", "Average"]],
        body: eventTableData,
        theme: "grid",
        headStyles: {
          fillColor: [9, 143, 143],
          textColor: [255, 255, 255],
        },
        styles: {
          cellPadding: 6,
          fontSize: 10,
        },
        columnStyles: {
          2: { halign: "right" },
          3: { halign: "center" },
          4: { halign: "right" },
        },
      })

      // Add page number
      addPageNumber(9, "___")

      // ===== BACK COVER =====
      doc.addPage()

      doc.setFillColor(9, 143, 143) // #098F8F
      doc.rect(0, pageHeight - 120, pageWidth, 120, "F")

      // Thank you message
      doc.setFontSize(24)
      doc.setTextColor(9, 143, 143)
      doc.text("Thank You", margin, pageHeight / 2 - 40, { align: "center" })

      doc.setFontSize(14)
      doc.setTextColor(80, 80, 80)
      doc.text(
        "This report was generated to provide insights into the tithes and offerings collected during the specified period.",
        pageWidth / 2,
        pageHeight / 2,
        { align: "center", maxWidth: contentWidth },
      )

      doc.text(
        "For questions or additional information, please contact the finance department.",
        pageWidth / 2,
        pageHeight / 2 + 40,
        { align: "center", maxWidth: contentWidth },
      )

      // Footer
      doc.setFontSize(12)
      doc.setTextColor(255, 255, 255)
      doc.text("Tithes & Offerings Financial Report", margin, pageHeight - 60)

      doc.setFontSize(10)
      doc.text(`Generated on ${formatDate(new Date())}`, margin, pageHeight - 40)

      doc.setFontSize(10)
      doc.text("CONFIDENTIAL - FOR INTERNAL USE ONLY", pageWidth - margin, pageHeight - 40, { align: "right" })

      // Add page number
      addPageNumber(10, "___")

      // Update all page numbers with total
      const totalPages = doc.internal.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i)
        doc.setFontSize(10)
        doc.setTextColor(150, 150, 150)
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 60, pageHeight - 20)
      }

      // Save and download the PDF
      doc.save(`tithes-report-${format(new Date(), "yyyy-MM-dd")}.pdf`)
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
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-1 w-full bg-blue-500"></div>
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
                    {summaryMetrics.amountGrowth !== 0 && (
                      <div className="mt-2 flex items-center text-sm">
                        {summaryMetrics.amountGrowth > 0 ? (
                          <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span className={summaryMetrics.amountGrowth > 0 ? "text-green-600" : "text-red-600"}>
                          {formatPercentage(summaryMetrics.amountGrowth)} from previous period
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-1 w-full bg-green-500"></div>
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                        <Users className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Contributing Members</p>
                        <h4 className="text-2xl font-bold text-gray-900">{summaryMetrics.uniqueMembers}</h4>
                      </div>
                    </div>
                    {summaryMetrics.memberGrowth !== 0 && (
                      <div className="mt-2 flex items-center text-sm">
                        {summaryMetrics.memberGrowth > 0 ? (
                          <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span className={summaryMetrics.memberGrowth > 0 ? "text-green-600" : "text-red-600"}>
                          {formatPercentage(summaryMetrics.memberGrowth)} from previous period
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-1 w-full bg-purple-500"></div>
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Events</p>
                        <h4 className="text-2xl font-bold text-gray-900">{summaryMetrics.uniqueEvents}</h4>
                      </div>
                    </div>
                    {summaryMetrics.eventGrowth !== 0 && (
                      <div className="mt-2 flex items-center text-sm">
                        {summaryMetrics.eventGrowth > 0 ? (
                          <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span className={summaryMetrics.eventGrowth > 0 ? "text-green-600" : "text-red-600"}>
                          {formatPercentage(summaryMetrics.eventGrowth)} from previous period
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-1 w-full bg-yellow-500"></div>
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
                    {summaryMetrics.averageGrowth !== 0 && (
                      <div className="mt-2 flex items-center text-sm">
                        {summaryMetrics.averageGrowth > 0 ? (
                          <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span className={summaryMetrics.averageGrowth > 0 ? "text-green-600" : "text-red-600"}>
                          {formatPercentage(summaryMetrics.averageGrowth)} from previous period
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Top Contributors */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8" ref={topContributorsRef}>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Award className="h-5 w-5 text-[#098F8F] mr-2" />
                    Top Contributors
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {memberSummary.slice(0, 3).map((item, index) => (
                      <div key={item.member.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100 relative">
                        <div className="absolute top-3 right-3 bg-[#098F8F] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <div className="flex items-center mb-3">
                          <div className="h-12 w-12 rounded-full bg-[#098F8F] flex items-center justify-center text-white text-lg font-bold">
                            {item.member.first_name?.[0]}
                            {item.member.last_name?.[0]}
                          </div>
                          <div className="ml-3">
                            <h4 className="font-medium text-gray-900">
                              {item.member.first_name} {item.member.last_name}
                            </h4>
                            <p className="text-sm text-gray-500">{item.member.type || "Member"}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-500">Total Contribution</p>
                            <p className="text-lg font-bold text-[#098F8F]">{formatCurrency(item.totalContribution)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Contributions</p>
                            <p className="text-lg font-bold text-gray-700">{item.contributionCount}</p>
                          </div>
                        </div>
                      </div>
                    ))}
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

                  {/* Member Type Distribution Chart */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm" ref={memberTypeChartRef}>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Contribution by Member Type</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={summaryMetrics.memberTypeChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          >
                            {summaryMetrics.memberTypeChartData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={MEMBER_COLORS[entry.name] || COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => formatCurrency(value)} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Additional Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Yearly Trend Chart */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm" ref={yearlyTrendChartRef}>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">12-Month Contribution History</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={summaryMetrics.yearlyTrendData}
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
                          <Area
                            type="monotone"
                            dataKey="total"
                            stroke="#098F8F"
                            fill="#098F8F"
                            fillOpacity={0.2}
                            name="Total"
                          />
                          <Area
                            type="monotone"
                            dataKey="average"
                            stroke="#F59E0B"
                            fill="#F59E0B"
                            fillOpacity={0.2}
                            name="Average"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Weekday Pattern Chart */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm" ref={weekdayChartRef}>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Contribution Pattern by Day of Week</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={summaryMetrics.weekdayAvg}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis yAxisId="left" orientation="left" stroke="#098F8F" />
                          <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="#F59E0B"
                            tickFormatter={(value) => {
                              if (value >= 1000) {
                                return `$${(value / 1000).toFixed(1)}k`
                              }
                              return `$${value}`
                            }}
                          />
                          <Tooltip
                            formatter={(value, name) => {
                              if (name === "Count") return value
                              return formatCurrency(value)
                            }}
                          />
                          <Legend />
                          <Bar yAxisId="left" dataKey="count" fill="#098F8F" name="Count" />
                          <Bar yAxisId="right" dataKey="total" fill="#F59E0B" name="Total Amount" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Quick Insights */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Target className="h-5 w-5 text-[#098F8F] mr-2" />
                    Key Insights & Recommendations
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Insights</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2 mt-0.5">
                            <Clock className="h-3 w-3" />
                          </div>
                          <span className="text-gray-600">
                            {summaryMetrics.weekdayAvg.sort((a, b) => b.total - a.total)[0].day} has the highest
                            contribution total.
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-2 mt-0.5">
                            <Users className="h-3 w-3" />
                          </div>
                          <span className="text-gray-600">
                            {((summaryMetrics.uniqueMembers / membersData.length) * 100).toFixed(1)}% of members
                            contributed during this period.
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-2 mt-0.5">
                            <TrendingUp className="h-3 w-3" />
                          </div>
                          <span className="text-gray-600">
                            {summaryMetrics.trendData.length > 1 &&
                              (summaryMetrics.trendData[summaryMetrics.trendData.length - 1].amount >
                              summaryMetrics.trendData[0].amount
                                ? "Contributions are trending upward over the period."
                                : "Contributions are trending downward over the period.")}
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Recommendations</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mr-2 mt-0.5">
                            <Award className="h-3 w-3" />
                          </div>
                          <span className="text-gray-600">
                            Consider recognizing top contributors through a special appreciation event.
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-2 mt-0.5">
                            <Calendar className="h-3 w-3" />
                          </div>
                          <span className="text-gray-600">
                            Schedule important events on{" "}
                            {summaryMetrics.weekdayAvg.sort((a, b) => b.total - a.total)[0].day}s when contribution
                            activity is highest.
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-2 mt-0.5">
                            <TrendingUp className="h-3 w-3" />
                          </div>
                          <span className="text-gray-600">
                            {summaryMetrics.memberGrowth < 0
                              ? "Focus on member engagement to increase participation rates."
                              : "Continue current engagement strategies which are showing positive results."}
                          </span>
                        </li>
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
