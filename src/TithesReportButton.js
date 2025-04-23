"use client"

import { useState } from "react"
import { FileText } from "lucide-react"

// Import the TithesReportGenerator component
import TithesReportGenerator from "./TithesReportGenerator"

const TithesReportButton = () => {
  const [isReportOpen, setIsReportOpen] = useState(false)

  const toggleReport = () => {
    setIsReportOpen(!isReportOpen)
  }

  return (
    <>
      <button
        onClick={toggleReport}
        className="flex items-center px-4 py-2 bg-[#098F8F] hover:bg-[#076e6e] text-white rounded-md transition-colors shadow-sm"
      >
        <FileText className="w-4 h-4 mr-2" />
        <span>{isReportOpen ? "Close Report" : "Generate Report"}</span>
      </button>

      {isReportOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Tithes & Offerings Report</h2>
              <button onClick={toggleReport} className="text-gray-500 hover:text-gray-700" aria-label="Close">
                ✕
              </button>
            </div>
            <div className="p-4">
              <TithesReportGenerator />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TithesReportButton
