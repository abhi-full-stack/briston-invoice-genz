import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalAmount: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    overdueInvoices: 0,
    recentInvoices: [],
    upcomingDueDates: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("/api/invoices")
        const invoices = response.data

        // Calculate statistics
        const totalAmount = invoices.reduce(
          (sum, inv) => sum + (inv.total || 0),
          0
        )
        const paidInvoices = invoices.filter(
          (inv) => inv.status === "paid"
        ).length
        const pendingInvoices = invoices.filter(
          (inv) => inv.status === "sent" || inv.status === "draft"
        ).length
        const overdueInvoices = invoices.filter(
          (inv) => inv.status === "overdue"
        ).length

        // Get recent invoices (last 5)
        const recentInvoices = [...invoices]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5)

        // Get upcoming due dates (next 7 days)
        const today = new Date()
        today.setHours(0, 0, 0, 0) // Reset time to start of day
        const nextWeek = new Date(today)
        nextWeek.setDate(today.getDate() + 7)

        const upcomingDueDates = invoices
          .filter((inv) => {
            if (
              !inv.dueDate ||
              inv.status === "paid" ||
              inv.status === "cancelled"
            ) {
              return false
            }
            const dueDate = new Date(inv.dueDate)
            dueDate.setHours(0, 0, 0, 0)
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const nextWeek = new Date(today)
            nextWeek.setDate(today.getDate() + 7)

            // Show if overdue or due in the next 7 days
            return dueDate <= nextWeek
          })
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))

        setStats({
          totalInvoices: invoices.length,
          totalAmount,
          paidInvoices,
          pendingInvoices,
          overdueInvoices,
          recentInvoices,
          upcomingDueDates,
        })
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch dashboard data")
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return "No date"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return null
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(dueDate)
    due.setHours(0, 0, 0, 0)
    const diffTime = due - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Total Invoices</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">
            {stats.totalInvoices}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Total amount: ₹{stats.totalAmount.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Paid Invoices</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {stats.paidInvoices}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            {((stats.paidInvoices / stats.totalInvoices) * 100).toFixed(1)}% of
            total
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">
            Pending Invoices
          </h3>
          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {stats.pendingInvoices}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            {((stats.pendingInvoices / stats.totalInvoices) * 100).toFixed(1)}%
            of total
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">
            Overdue Invoices
          </h3>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {stats.overdueInvoices}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            {((stats.overdueInvoices / stats.totalInvoices) * 100).toFixed(1)}%
            of total
          </p>
        </div>
      </div>

      {/* Recent Invoices and Upcoming Due Dates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Recent Invoices
            </h3>
          </div>
          <div className="p-6">
            {stats.recentInvoices.length === 0 ? (
              <p className="text-gray-500 text-center">No recent invoices</p>
            ) : (
              <div className="space-y-4">
                {stats.recentInvoices.map((invoice) => (
                  <div
                    key={invoice._id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {invoice.invoiceNumber}
                      </p>
                      <p className="text-sm text-gray-500">
                        {invoice.client?.clientName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ₹{invoice.total?.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(invoice.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 text-center">
              <Link
                to="/invoices"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                View all invoices →
              </Link>
            </div>
          </div>
        </div>

        {/* Upcoming Due Dates */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Upcoming Due Dates
            </h3>
          </div>
          <div className="p-6">
            {stats.upcomingDueDates.length === 0 ? (
              <p className="text-gray-500 text-center">
                No upcoming due dates in the next 7 days
              </p>
            ) : (
              <div className="space-y-4">
                {stats.upcomingDueDates.map((invoice) => {
                  const daysUntilDue = getDaysUntilDue(invoice.dueDate)
                  const isUrgent = daysUntilDue <= 3

                  return (
                    <div
                      key={invoice._id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {invoice.invoiceNumber}
                        </p>
                        <p className="text-sm text-gray-500">
                          {invoice.client?.clientName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          ₹{invoice.total?.toLocaleString()}
                        </p>
                        <p
                          className={`text-sm ${
                            isUrgent ? "text-red-600" : "text-gray-500"
                          }`}
                        >
                          Due{" "}
                          {daysUntilDue === 0
                            ? "today"
                            : `in ${daysUntilDue} days`}
                          <br />
                          <span className="text-xs">
                            ({formatDate(invoice.dueDate)})
                          </span>
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            <div className="mt-4 text-center">
              <Link
                to="/invoices"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                View all invoices →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
