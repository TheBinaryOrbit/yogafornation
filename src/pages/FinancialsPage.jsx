"use client"

import { useState } from "react"
import { DollarSign, TrendingUp, Download, CreditCard, QrCode, Check, X, Eye, Clock } from "lucide-react"

export default function FinancialsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly")
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedQRPayment, setSelectedQRPayment] = useState(null)

  const monthlyData = [
    { month: "Jan", donations: 2100, subscriptions: 2800, total: 4900 },
    { month: "Feb", donations: 1950, subscriptions: 3100, total: 5050 },
    { month: "Mar", donations: 2300, subscriptions: 3200, total: 5500 },
    { month: "Apr", donations: 2150, subscriptions: 3400, total: 5550 },
    { month: "May", donations: 2400, subscriptions: 3600, total: 6000 },
    { month: "Jun", donations: 2200, subscriptions: 3800, total: 6000 },
  ]

  const recentTransactions = [
    { id: 1, type: "Subscription", user: "Sarah Johnson", amount: 29.99, date: "2024-01-15", status: "Completed" },
    { id: 2, type: "Donation", user: "Mike Chen", amount: 50.0, date: "2024-01-15", status: "Completed" },
    { id: 3, type: "Subscription", user: "Lisa Rodriguez", amount: 19.99, date: "2024-01-14", status: "Completed" },
    { id: 4, type: "Donation", user: "Anonymous", amount: 25.0, date: "2024-01-14", status: "Completed" },
    { id: 5, type: "Subscription", user: "David Kim", amount: 29.99, date: "2024-01-13", status: "Failed" },
  ]

  const pendingQRPayments = [
    {
      id: 1,
      user: "Rahul Sharma",
      amount: 500,
      date: "2024-01-15",
      time: "14:30",
      transactionId: "QR123456789",
      screenshot: "/generic-payment-screenshot.png",
      status: "pending",
    },
    {
      id: 2,
      user: "Priya Patel",
      amount: 1000,
      date: "2024-01-15",
      time: "12:15",
      transactionId: "QR987654321",
      screenshot: "/generic-payment-screenshot.png",
      status: "pending",
    },
    {
      id: 3,
      user: "Anonymous",
      amount: 250,
      date: "2024-01-14",
      time: "18:45",
      transactionId: "QR456789123",
      screenshot: "/generic-payment-screenshot.png",
      status: "pending",
    },
  ]

  const handleQRPaymentAction = (paymentId, action) => {
    console.log(`${action} payment ${paymentId}`)
    alert(`Payment ${action}d successfully!`)
  }

  const financialData = {
    totalRevenue: 45680,
    donations: 12340,
    subscriptions: 33340,
    monthlyGrowth: 12.5,
    activeSubscribers: 1247,
    averageDonation: 25.5,
    pendingQRPayments: pendingQRPayments.length,
  }

  const generateReport = () => {
    const reportData = {
      period: selectedPeriod,
      totalRevenue: financialData.totalRevenue,
      donations: financialData.donations,
      subscriptions: financialData.subscriptions,
      transactions: recentTransactions,
    }

    const dataStr = JSON.stringify(reportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `financial-report-${selectedPeriod}-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
          <div className="flex items-center gap-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <button
              onClick={generateReport}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Generate Report
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("qr-donations")}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === "qr-donations"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <QrCode className="h-4 w-4" />
              QR Donations
              {financialData.pendingQRPayments > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {financialData.pendingQRPayments}
                </span>
              )}
            </button>
          </nav>
        </div>

        {activeTab === "overview" && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${financialData.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{financialData.monthlyGrowth}% from last month</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Donations</p>
                    <p className="text-2xl font-bold text-gray-900">${financialData.donations.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg: ${financialData.averageDonation}</span>
                  <div className="text-xs text-gray-500">
                    <div>QR: 60% | Razorpay: 40%</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Subscriptions</p>
                    <p className="text-2xl font-bold text-gray-900">${financialData.subscriptions.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <CreditCard className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-gray-600">{financialData.activeSubscribers} active subscribers</span>
                </div>
              </div>

              {/* Pending QR Payments Metric */}
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending QR Payments</p>
                    <p className="text-2xl font-bold text-orange-600">{financialData.pendingQRPayments}</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-gray-600">Awaiting approval</span>
                </div>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h2 className="text-lg font-semibold mb-4">Monthly Revenue Breakdown</h2>
              <div className="space-y-4">
                {monthlyData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-4 w-20">
                      <span className="text-sm font-medium text-gray-700">{data.month}</span>
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="flex h-8 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-500 flex items-center justify-center text-xs text-white font-medium"
                          style={{ width: `${(data.donations / data.total) * 100}%` }}
                        >
                          {data.donations > 0 && `$${data.donations}`}
                        </div>
                        <div
                          className="bg-green-500 flex items-center justify-center text-xs text-white font-medium"
                          style={{ width: `${(data.subscriptions / data.total) * 100}%` }}
                        >
                          {data.subscriptions > 0 && `$${data.subscriptions}`}
                        </div>
                      </div>
                    </div>
                    <div className="w-20 text-right">
                      <span className="text-sm font-semibold text-gray-900">${data.total}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Donations</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Subscriptions</span>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-lg shadow-md border overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Recent Transactions</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {transaction.type === "Donation" ? (
                              <TrendingUp className="h-4 w-4 text-blue-500" />
                            ) : (
                              <CreditCard className="h-4 w-4 text-green-500" />
                            )}
                            <span className="text-sm font-medium text-gray-900">{transaction.type}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.user}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          ${transaction.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              transaction.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* QR Donations Tab Content */}
        {activeTab === "qr-donations" && (
          <div className="space-y-6">
            {/* Donation Methods Info */}
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h2 className="text-lg font-semibold mb-4">Donation Methods</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                  <QrCode className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">QR Code Payments</h3>
                    <p className="text-sm text-gray-600">Manual verification required</p>
                    <p className="text-xs text-gray-500">Users upload payment screenshots</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                  <CreditCard className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">Razorpay</h3>
                    <p className="text-sm text-gray-600">Automatic processing</p>
                    <p className="text-xs text-gray-500">Instant confirmation</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pending QR Payments */}
            <div className="bg-white rounded-lg shadow-md border overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Pending QR Payments</h2>
                <p className="text-sm text-gray-600">Review and approve/reject QR code payments</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Screenshot
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingQRPayments.map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {payment.user}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                          ₹{payment.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>
                            <div>{payment.date}</div>
                            <div className="text-xs text-gray-400">{payment.time}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                          {payment.transactionId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedQRPayment(payment)}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleQRPaymentAction(payment.id, "approve")}
                              className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 flex items-center gap-1"
                            >
                              <Check className="h-4 w-4" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleQRPaymentAction(payment.id, "reject")}
                              className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 flex items-center gap-1"
                            >
                              <X className="h-4 w-4" />
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Screenshot Modal */}
        {selectedQRPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Payment Screenshot</h3>
                <button onClick={() => setSelectedQRPayment(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">
                    User: <span className="font-medium">{selectedQRPayment.user}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Amount: <span className="font-medium text-green-600">₹{selectedQRPayment.amount}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Transaction ID: <span className="font-mono text-xs">{selectedQRPayment.transactionId}</span>
                  </p>
                </div>
                <div>
                  <img
                    src={selectedQRPayment.screenshot || "/placeholder.svg"}
                    alt="Payment Screenshot"
                    className="w-full h-64 object-cover rounded-lg border"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      handleQRPaymentAction(selectedQRPayment.id, "approve")
                      setSelectedQRPayment(null)
                    }}
                    className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      handleQRPaymentAction(selectedQRPayment.id, "reject")
                      setSelectedQRPayment(null)
                    }}
                    className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 flex items-center justify-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    
  )
}
