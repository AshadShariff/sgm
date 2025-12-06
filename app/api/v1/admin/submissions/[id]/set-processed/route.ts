import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Submission from "@/lib/models/Submission"
import { verifyAdminAuth } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!verifyAdminAuth(authHeader)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { id } = await params
    const body = await request.json()
    const { processedVideoUrl, adminNotes } = body

    const submission = await Submission.findById(id)

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    if (processedVideoUrl) {
      submission.processedVideoUrl = processedVideoUrl
      submission.status = "ready"
    }

    if (adminNotes) {
      submission.adminNotes = adminNotes
    }

    await submission.save()

    return NextResponse.json({
      success: true,
      submission: {
        id: submission._id.toString(),
        status: submission.status,
        processedVideoUrl: submission.processedVideoUrl,
        adminNotes: submission.adminNotes,
      },
    })
  } catch (error: any) {
    console.error("Set processed error:", error)
    return NextResponse.json({ error: error.message || "Failed to update submission" }, { status: 500 })
  }
}

