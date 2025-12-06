import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Submission from "@/lib/models/Submission"
import { verifyAdminAuth } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!verifyAdminAuth(authHeader)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { id } = await params
    const submission = await Submission.findById(id).populate({
      path: "orderId",
      select: "buyer createdAt",
    })

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    console.log("Submission fetched:", {
      id: submission._id,
      videosCount: submission.videos?.length || 0,
      videos: submission.videos,
    })

    return NextResponse.json(submission)
  } catch (error: any) {
    console.error("Admin submission fetch error:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch submission" }, { status: 500 })
  }
}

