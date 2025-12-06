"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Download, Trash2, LogOut, Eye, Lock, Search, Filter } from "lucide-react"
import Header from "../components/header"

interface Submission {
  _id: string
  orderId: {
    buyer: {
      email: string
      phone: string
      name?: string
    }
  }
  scriptText: string
  customPrompt?: string
  greenScreen: boolean
  videos: Array<{
    url: string
    publicId: string
    filename: string
    size: number
    uploadedAt: string
  }>
  status: string
  processedVideoUrl?: string
  adminNotes?: string
  activityLogs?: Array<{
    action: "upload" | "delete" | "download" | "error"
    videoUrl?: string
    videoFilename?: string
    publicId?: string
    status: "success" | "failed"
    message: string
    response?: any
    error?: string
    timestamp: string
    performedBy?: string
  }>
  createdAt: string
  updatedAt: string
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  // Check if already authenticated
  useEffect(() => {
    const authToken = localStorage.getItem("admin_auth_token")
    if (authToken === "admin_authenticated") {
      setIsAuthenticated(true)
      fetchSubmissions()
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (username === "admin" && password === "admin123") {
      localStorage.setItem("admin_auth_token", "admin_authenticated")
      setIsAuthenticated(true)
      fetchSubmissions()
    } else {
      setError("Invalid username or password")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_auth_token")
    setIsAuthenticated(false)
    setSubmissions([])
    setSelectedSubmission(null)
  }

  const fetchSubmissions = async () => {
    setIsLoadingSubmissions(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== "all") {
        params.append("status", statusFilter)
      }
      if (searchQuery) {
        params.append("search", searchQuery)
      }
      if (dateFrom) {
        params.append("dateFrom", dateFrom)
      }
      if (dateTo) {
        params.append("dateTo", dateTo)
      }

      const response = await fetch(`/api/v1/admin/submissions?${params.toString()}`, {
        headers: {
          Authorization: "Bearer admin_token",
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Fetched submissions:", data.submissions?.length, "submissions")
        console.log("Sample submission videos:", data.submissions?.[0]?.videos)
        setSubmissions(data.submissions || [])
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error("Failed to fetch submissions:", errorData)
      }
    } catch (err) {
      console.error("Error fetching submissions:", err)
    } finally {
      setIsLoadingSubmissions(false)
    }
  }

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        fetchSubmissions()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery, statusFilter, dateFrom, dateTo, isAuthenticated])

  const handleDeleteVideo = async (submissionId: string, videoUrl: string) => {
    if (!confirm("Are you sure you want to delete this video?")) {
      return
    }

    try {
      const response = await fetch(`/api/v1/admin/submissions/${submissionId}/delete-video`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer admin_token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoUrl }),
      })

      if (response.ok) {
        // Refresh submissions list
        await fetchSubmissions()
        
        // Update selected submission if it's the one being edited
        if (selectedSubmission?._id === submissionId) {
          // Fetch updated submission
          const updatedResponse = await fetch(`/api/v1/admin/submissions/${submissionId}`, {
            headers: {
              Authorization: "Bearer admin_token",
            },
          })
          if (updatedResponse.ok) {
            const updatedData = await updatedResponse.json()
            setSelectedSubmission(updatedData)
          } else {
            setSelectedSubmission(null)
          }
        }
        alert("Video deleted successfully")
      } else {
        const data = await response.json()
        alert(`Failed to delete video: ${data.error}`)
      }
    } catch (err) {
      console.error("Error deleting video:", err)
      alert("Failed to delete video")
    }
  }

  const handleDownloadVideo = async (submissionId: string, videoUrl: string, filename: string) => {
    try {
      const response = await fetch(
        `/api/v1/admin/submissions/${submissionId}/download-video?url=${encodeURIComponent(videoUrl)}`,
        {
          headers: {
            Authorization: "Bearer admin_token",
          },
        }
      )

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = filename || "video.mp4"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } else {
        const data = await response.json()
        alert(`Failed to download video: ${data.error}`)
      }
    } catch (err) {
      console.error("Error downloading video:", err)
      alert("Failed to download video")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
  }

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <main className="bg-[#F5E6D3] min-h-screen pt-24 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-8 shadow-lg max-w-md w-full"
          >
            <div className="text-center mb-8">
              <Lock className="mx-auto mb-4 text-[#B45309]" size={48} />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
              <p className="text-gray-600">Sign in to access the admin dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B45309]"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B45309]"
                  placeholder="Enter password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#B45309] text-white rounded-lg font-semibold hover:bg-[#92400E] transition-colors disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </motion.div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="bg-[#F5E6D3] min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage user submissions and videos</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="text-2xl font-bold text-gray-900">{submissions.length}</div>
              <div className="text-sm text-gray-600">Total Submissions</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="text-2xl font-bold text-green-600">
                {submissions.filter((s) => s.status === "uploaded").length}
              </div>
              <div className="text-sm text-gray-600">Uploaded</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="text-2xl font-bold text-blue-600">
                {submissions.filter((s) => s.status === "ready").length}
              </div>
              <div className="text-sm text-gray-600">Ready</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="text-2xl font-bold text-orange-600">
                {submissions.filter((s) => s.status === "awaiting_upload").length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Search</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by email, phone, or name..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B45309] text-black placeholder-gray-400"
                />
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B45309] text-black bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="awaiting_upload">Awaiting Upload</option>
                  <option value="uploaded">Uploaded</option>
                  <option value="processing">Processing</option>
                  <option value="ready">Ready</option>
                  <option value="delivered">Delivered</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              {/* Date From */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Date From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B45309] text-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Date To */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Date To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B45309] text-black"
                />
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchQuery("")
                    setStatusFilter("all")
                    setDateFrom("")
                    setDateTo("")
                  }}
                  className="w-full px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Submissions Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-black">Submissions</h2>
              <button
                onClick={fetchSubmissions}
                className="px-4 py-2 bg-[#B45309] text-white rounded-lg hover:bg-[#92400E] transition-colors"
              >
                Refresh
              </button>
            </div>

            {isLoadingSubmissions ? (
              <div className="p-8 text-center text-black">Loading submissions...</div>
            ) : submissions.length === 0 ? (
              <div className="p-8 text-center text-black">No submissions found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        User Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Videos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {submissions.map((submission) => (
                      <tr key={submission._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-black">
                            {submission.orderId.buyer.name || "N/A"}
                          </div>
                          <div className="text-sm text-gray-700">{submission.orderId.buyer.email}</div>
                          <div className="text-sm text-gray-700">{submission.orderId.buyer.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-black">{formatDate(submission.createdAt)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              submission.status === "uploaded"
                                ? "bg-green-100 text-green-800"
                                : submission.status === "ready"
                                  ? "bg-blue-100 text-blue-800"
                                  : submission.status === "awaiting_upload"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {submission.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-black">
                            {submission.videos && Array.isArray(submission.videos)
                              ? submission.videos.length
                              : 0}{" "}
                            video(s)
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={async () => {
                              // Fetch fresh submission data
                              try {
                                const response = await fetch(`/api/v1/admin/submissions/${submission._id}`, {
                                  headers: {
                                    Authorization: "Bearer admin_token",
                                  },
                                })
                                if (response.ok) {
                                  const data = await response.json()
                                  setSelectedSubmission(data)
                                } else {
                                  setSelectedSubmission(submission)
                                }
                              } catch (err) {
                                console.error("Error fetching submission details:", err)
                                setSelectedSubmission(submission)
                              }
                            }}
                            className="text-[#B45309] hover:text-[#92400E] mr-4"
                            title="View Details"
                          >
                            <Eye size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Detail Modal */}
        {selectedSubmission && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                <h2 className="text-2xl font-bold text-black">Submission Details</h2>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={async () => {
                      // Refresh submission data
                      try {
                        const response = await fetch(`/api/v1/admin/submissions/${selectedSubmission._id}`, {
                          headers: {
                            Authorization: "Bearer admin_token",
                          },
                        })
                        if (response.ok) {
                          const data = await response.json()
                          setSelectedSubmission(data)
                        }
                      } catch (err) {
                        console.error("Error refreshing submission:", err)
                      }
                    }}
                    className="px-3 py-1 text-sm bg-[#B45309] text-white rounded hover:bg-[#92400E] transition-colors"
                    title="Refresh"
                  >
                    Refresh
                  </button>
                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl leading-none w-8 h-8 flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* User Info */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-3">User Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="text-black">
                      <span className="font-medium text-black">Name:</span>{" "}
                      <span className="text-gray-800">{selectedSubmission.orderId.buyer.name || "N/A"}</span>
                    </div>
                    <div className="text-black">
                      <span className="font-medium text-black">Email:</span>{" "}
                      <span className="text-gray-800">{selectedSubmission.orderId.buyer.email}</span>
                    </div>
                    <div className="text-black">
                      <span className="font-medium text-black">Phone:</span>{" "}
                      <span className="text-gray-800">{selectedSubmission.orderId.buyer.phone}</span>
                    </div>
                    <div className="text-black">
                      <span className="font-medium text-black">Submitted:</span>{" "}
                      <span className="text-gray-800">{formatDate(selectedSubmission.createdAt)}</span>
                    </div>
                    <div className="text-black">
                      <span className="font-medium text-black">Last Updated:</span>{" "}
                      <span className="text-gray-800">{formatDate(selectedSubmission.updatedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Script */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-3">Script</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-black whitespace-pre-wrap">{selectedSubmission.scriptText}</p>
                  </div>
                </div>

                {/* Custom Prompt */}
                {selectedSubmission.customPrompt && (
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-3">Custom Prompt</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-black">{selectedSubmission.customPrompt}</p>
                    </div>
                  </div>
                )}

                {/* Videos */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-3">Videos</h3>
                  <div className="space-y-4">
                    {selectedSubmission.videos && selectedSubmission.videos.length > 0 ? (
                      selectedSubmission.videos.map((video: any, index: number) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="font-medium text-black">{video.filename || `Video ${index + 1}`}</div>
                              <div className="text-sm text-gray-600">
                                {video.size ? formatFileSize(video.size) : "Size unknown"} • Uploaded:{" "}
                                {video.uploadedAt ? formatDate(video.uploadedAt) : "Unknown"}
                              </div>
                              <div className="text-xs text-gray-500 mt-1 break-all">{video.url}</div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  handleDownloadVideo(selectedSubmission._id, video.url, video.filename || `video-${index + 1}.mp4`)
                                }
                                className="p-2 bg-[#B45309] text-white rounded-lg hover:bg-[#92400E] transition-colors"
                                title="Download"
                              >
                                <Download size={20} />
                              </button>
                              <button
                                onClick={() => handleDeleteVideo(selectedSubmission._id, video.url)}
                                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                          </div>
                          {video.url ? (
                            <div className="mt-3">
                              <video
                                src={video.url}
                                controls
                                className="w-full rounded-lg max-h-96 bg-black"
                                preload="metadata"
                                onError={(e) => {
                                  console.error("Video load error:", e)
                                  const target = e.target as HTMLVideoElement
                                  target.style.display = "none"
                                }}
                              >
                                Your browser does not support the video tag.
                              </video>
                              <a
                                href={video.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-block text-sm text-[#B45309] hover:underline"
                              >
                                Open video in new tab
                              </a>
                            </div>
                          ) : (
                            <div className="text-red-600 text-sm mt-2">Video URL missing</div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-black text-center py-8 bg-gray-50 rounded-lg">
                        No videos uploaded yet
                      </div>
                    )}
                  </div>
                </div>

                {/* Processed Video */}
                {selectedSubmission.processedVideoUrl && (
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-3">Processed Video</h3>
                    <div className="border border-gray-200 rounded-lg p-4 bg-white">
                      <video
                        src={selectedSubmission.processedVideoUrl}
                        controls
                        className="w-full rounded-lg max-h-96 bg-black"
                        preload="metadata"
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                )}

                {/* Admin Notes */}
                {selectedSubmission.adminNotes && (
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-3">Admin Notes</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-black">{selectedSubmission.adminNotes}</p>
                    </div>
                  </div>
                )}

                {/* Activity Logs */}
                {selectedSubmission.activityLogs && selectedSubmission.activityLogs.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-3">Activity Logs</h3>
                    <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <div className="space-y-3">
                        {selectedSubmission.activityLogs
                          .slice()
                          .reverse()
                          .map((log: any, index: number) => (
                            <div
                              key={index}
                              className={`border-l-4 p-3 rounded ${
                                log.status === "success"
                                  ? "border-green-500 bg-green-50"
                                  : "border-red-500 bg-red-50"
                              }`}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`px-2 py-1 text-xs font-semibold rounded ${
                                      log.action === "upload"
                                        ? "bg-blue-100 text-blue-800"
                                        : log.action === "delete"
                                          ? "bg-red-100 text-red-800"
                                          : log.action === "download"
                                            ? "bg-purple-100 text-purple-800"
                                            : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {log.action.toUpperCase()}
                                  </span>
                                  <span
                                    className={`px-2 py-1 text-xs font-semibold rounded ${
                                      log.status === "success"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {log.status.toUpperCase()}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-600">
                                  {formatDate(log.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm text-black font-medium mb-1">{log.message}</p>
                              {log.videoFilename && (
                                <p className="text-xs text-gray-600">File: {log.videoFilename}</p>
                              )}
                              {log.error && (
                                <p className="text-xs text-red-600 mt-1">Error: {log.error}</p>
                              )}
                              {log.response && (
                                <details className="mt-2">
                                  <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-800">
                                    View Response
                                  </summary>
                                  <pre className="text-xs bg-white p-2 rounded mt-1 overflow-x-auto">
                                    {JSON.stringify(log.response, null, 2)}
                                  </pre>
                                </details>
                              )}
                              {log.performedBy && (
                                <p className="text-xs text-gray-500 mt-1">By: {log.performedBy}</p>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </>
  )
}

