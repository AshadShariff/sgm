"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Lock, Upload, FileText, CreditCard, Loader2, X } from "lucide-react"
import Footer from "./footer"

const DEFAULT_SCRIPT = `Hi, I'm [Your Name]. Please read clearly at a steady pace:

"Hello, my name is [Your Name]. I hope you're having a great day. I'm excited to share this message with you. Thank you for watching."

(Record in a quiet room. 1–2 takes is fine. Keep camera at eye level.)`

const PACKAGES = [
  { id: "multiple-ai", name: "Multiple AI Content Avatar", amount: 499 },
  { id: "plug-play", name: "Plug & Play System", amount: 999 },
]

export default function AiCloneFlow() {
  const [currentStep, setCurrentStep] = useState(1)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [submissionId, setSubmissionId] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "paid" | "failed">("pending")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [scriptText, setScriptText] = useState(DEFAULT_SCRIPT)
  const [greenScreen, setGreenScreen] = useState(false)
  const [customPrompt, setCustomPrompt] = useState("")

  // Upload state
  const [files, setFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])

  // Check for session_id in URL (return from Stripe)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sessionId = params.get("session_id")

    if (sessionId && !orderId) {
      checkPaymentStatus(sessionId)
    }
  }, [])

  const checkPaymentStatus = async (sessionId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/v1/orders/confirm?session_id=${sessionId}`)
      const data = await response.json()

      if (data.orderId) {
        setOrderId(data.orderId)
        setPaymentStatus(data.paymentStatus)

        if (data.paymentStatus === "paid") {
          setCurrentStep(2)
        } else {
          // Poll if still pending
          setTimeout(() => checkPaymentStatus(sessionId), 2000)
        }
      }
    } catch (err) {
      console.error("Payment check error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckout = async (packageId: string, amount: number) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/v1/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId,
          amount,
          currency: "usd",
          buyer: {
            email: email || "customer@example.com", // Will be collected in Stripe
            phone: phone || "+1234567890",
          },
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || "Failed to create checkout session")
      }
    } catch (err: any) {
      setError(err.message || "Failed to start checkout")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSubmission = async () => {
    if (!email || !phone || scriptText.length < 10) {
      setError("Please fill all required fields and ensure script is at least 10 characters")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/v1/orders/${orderId}/submission`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scriptText,
          greenScreen,
          email,
          phone,
        }),
      })

      const data = await response.json()

      if (data.submissionId) {
        setSubmissionId(data.submissionId)
        setCurrentStep(3)
      } else {
        setError(data.error || "Failed to save submission")
      }
    } catch (err: any) {
      setError(err.message || "Failed to save submission")
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const validFiles = selectedFiles.filter((file) => {
      const ext = file.name.toLowerCase().match(/\.[^.]+$/)
      const allowedTypes = [".mp4", ".mov"]
      if (!ext || !allowedTypes.includes(ext[0])) {
        alert(`Invalid file type: ${file.name}. Only .mp4 and .mov are allowed.`)
        return false
      }
      if (file.size > 2 * 1024 * 1024 * 1024) {
        alert(`File too large: ${file.name}. Maximum size is 2GB.`)
        return false
      }
      return true
    })

    setFiles((prev) => [...prev, ...validFiles])
  }

  const handleUpload = async () => {
    if (files.length === 0 || !submissionId) {
      setError("Please select at least one file")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const uploadedFilesData: any[] = []

      for (const file of files) {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", "unsigned_preset") // You'll need to create this in Cloudinary
        formData.append("folder", `submissions/${submissionId}`)

        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "your_cloud_name"
        const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
          method: "POST",
          body: formData,
        })

        const uploadData = await uploadResponse.json()

        if (uploadData.secure_url) {
          uploadedFilesData.push({
            url: uploadData.secure_url,
            filename: file.name,
            size: file.size,
          })
        }
      }

      // Call callback endpoint
      const callbackResponse = await fetch("/api/v1/uploads/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId,
          files: uploadedFilesData,
        }),
      })

      const callbackData = await callbackResponse.json()

      if (callbackData.success) {
        setUploadedFiles(files.map((f) => f.name))
        setFiles([])
      } else {
        setError(callbackData.error || "Failed to complete upload")
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload files")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveCustomPrompt = async () => {
    if (!submissionId) return

    try {
      await fetch(`/api/v1/submissions/${submissionId}/custom-prompt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customPrompt }),
      })
    } catch (err) {
      console.error("Failed to save custom prompt:", err)
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <main className="bg-[#F5E6D3] min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
          Create Your AI Digital Clone
        </h1>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-12">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                    currentStep > step
                      ? "bg-green-500 text-white"
                      : currentStep === step
                        ? "bg-[#B45309] text-white"
                        : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {currentStep > step ? <Check size={24} /> : step}
                </div>
                <div className="mt-2 text-sm font-medium text-gray-700 text-center">
                  {step === 1 && "Purchase"}
                  {step === 2 && "Contact & Script"}
                  {step === 3 && "Upload"}
                </div>
              </div>
              {step < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    currentStep > step ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>
        )}

        {/* Step 1: Purchase */}
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl p-8 shadow-lg"
            >
              <div className="text-center mb-8">
                <CreditCard className="mx-auto mb-4 text-[#B45309]" size={48} />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 1 — Purchase</h2>
                <p className="text-gray-600">Select a package and complete payment to continue</p>
              </div>

              <div className="space-y-4">
                {PACKAGES.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="border-2 border-gray-200 rounded-lg p-6 hover:border-[#B45309] transition-colors"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
                      <span className="text-2xl font-bold text-[#B45309]">${pkg.amount}</span>
                    </div>
                    <button
                      onClick={() => handleCheckout(pkg.id, pkg.amount)}
                      disabled={loading}
                      className="w-full py-3 bg-[#B45309] text-white rounded-lg font-semibold hover:bg-[#92400E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="animate-spin" size={20} />
                          Processing...
                        </span>
                      ) : (
                        "Pay & Unlock"
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {paymentStatus === "pending" && orderId && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                  <p className="text-yellow-800">Waiting for payment confirmation...</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 2: Contact & Script */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl p-8 shadow-lg"
            >
              <div className="text-center mb-8">
                <FileText className="mx-auto mb-4 text-[#B45309]" size={48} />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 2 — Contact & Script</h2>
                <p className="text-gray-600">Payment confirmed — please fill your contact details and script</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B45309]"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone (with country code) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B45309]"
                    placeholder="+1234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Script <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={scriptText}
                    onChange={(e) => setScriptText(e.target.value)}
                    required
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B45309]"
                    placeholder={DEFAULT_SCRIPT}
                  />
                  <p className="mt-2 text-sm text-gray-500">Minimum 10 characters</p>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="greenScreen"
                    checked={greenScreen}
                    onChange={(e) => setGreenScreen(e.target.checked)}
                    className="w-4 h-4 text-[#B45309] border-gray-300 rounded focus:ring-[#B45309]"
                  />
                  <label htmlFor="greenScreen" className="ml-2 text-sm text-gray-700">
                    Green-screen used (optional)
                  </label>
                </div>

                <button
                  onClick={handleSaveSubmission}
                  disabled={loading || !email || !phone || scriptText.length < 10}
                  className="w-full py-3 bg-[#B45309] text-white rounded-lg font-semibold hover:bg-[#92400E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={20} />
                      Saving...
                    </span>
                  ) : (
                    "Save & Go to Upload"
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Upload */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl p-8 shadow-lg"
            >
              <div className="text-center mb-8">
                <Upload className="mx-auto mb-4 text-[#B45309]" size={48} />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 3 — Upload</h2>
                <p className="text-gray-600">Form saved — proceed to upload your raw footage</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload Video Files (.mp4 or .mov)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#B45309] transition-colors">
                    <input
                      type="file"
                      accept=".mp4,.mov"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Upload size={32} className="text-gray-400" />
                      <span className="text-gray-600">Drag & drop or click to select</span>
                      <span className="text-sm text-gray-500">Max 2GB per file</span>
                    </label>
                  </div>
                </div>

                {files.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-700">Selected Files:</h3>
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {uploadedFiles.length > 0 && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-semibold mb-2">Upload received!</p>
                    <p className="text-green-700 text-sm">
                      Our team will edit and send your final video manually to the email/phone you provided.
                    </p>
                  </div>
                )}

                <button
                  onClick={handleUpload}
                  disabled={loading || files.length === 0}
                  className="w-full py-3 bg-[#B45309] text-white rounded-lg font-semibold hover:bg-[#92400E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={20} />
                      Uploading...
                    </span>
                  ) : (
                    "Upload Files"
                  )}
                </button>

                <div className="mt-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Optional: Custom Prompt
                  </label>
                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    onBlur={handleSaveCustomPrompt}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B45309]"
                    placeholder="Add any specific instructions or prompts..."
                  />
                  <p className="mt-2 text-sm text-gray-500">This will be saved automatically</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Locked Steps Message */}
        {currentStep === 1 && paymentStatus === "pending" && (
          <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded-lg text-center">
            <Lock className="mx-auto mb-2 text-gray-400" size={24} />
            <p className="text-gray-600">Please complete payment to unlock the form.</p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}

