import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Submission from "@/lib/models/Submission"

export async function POST(request: NextRequest, { params }: { params: Promise<{ submissionId: string }> }) {
  try {
    await connectDB()

    const { submissionId } = await params
    const body = await request.json()
    const { customPrompt } = body

    const submission = await Submission.findById(submissionId)
    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    submission.customPrompt = customPrompt || ""
    await submission.save()

    return NextResponse.json({
      success: true,
      submissionId: submission._id.toString(),
      customPrompt: submission.customPrompt,
    })
  } catch (error: any) {
    console.error("Custom prompt error:", error)
    return NextResponse.json({ error: error.message || "Failed to save custom prompt" }, { status: 500 })
  }
}

