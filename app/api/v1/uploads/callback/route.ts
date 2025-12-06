import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Submission from "@/lib/models/Submission"

export async function POST(request: NextRequest) {
  let submissionId: string | null = null
  
  try {
    await connectDB()

    const body = await request.json()
    submissionId = body.submissionId
    const { files } = body

    console.log("Upload callback received:", {
      submissionId,
      filesCount: files?.length || 0,
      files: files?.map((f: any) => ({ filename: f.filename, hasUrl: !!f.url, hasPublicId: !!f.publicId })),
    })

    if (!submissionId || !files || !Array.isArray(files)) {
      console.error("Missing required fields:", { submissionId, files: !!files, isArray: Array.isArray(files) })
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (files.length === 0) {
      console.warn("Empty files array received in callback")
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    const submission = await Submission.findById(submissionId)
    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    // Validate file types and sizes
    const allowedTypes = [".mp4", ".mov"]
    const maxSize = 2 * 1024 * 1024 * 1024 // 2GB

    for (const file of files) {
      const ext = file.filename?.toLowerCase().match(/\.[^.]+$/)
      if (!ext || !allowedTypes.includes(ext[0])) {
        return NextResponse.json({ error: `Invalid file type: ${file.filename}` }, { status: 400 })
      }
      if (file.size > maxSize) {
        return NextResponse.json({ error: `File too large: ${file.filename}` }, { status: 400 })
      }
    }

    // Update submission with uploaded videos (append to existing videos)
    const newVideos = files.map((file: any) => ({
      url: file.url,
      publicId: file.publicId || "",
      filename: file.filename || `video-${Date.now()}.mp4`,
      size: file.size || 0,
      uploadedAt: new Date(),
    }))

    // Append new videos to existing ones
    submission.videos = [...(submission.videos || []), ...newVideos]

    // Add activity logs for each uploaded video
    const uploadLogs = files.map((file: any) => ({
      action: "upload" as const,
      videoUrl: file.url,
      videoFilename: file.filename || `video-${Date.now()}.mp4`,
      publicId: file.publicId || "",
      status: "success" as const,
      message: `Video uploaded successfully: ${file.filename}`,
      response: {
        url: file.url,
        publicId: file.publicId,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      },
      timestamp: new Date(),
    }))

    submission.activityLogs = [...(submission.activityLogs || []), ...uploadLogs]
    submission.status = "uploaded"
    await submission.save()

    console.log("Submission updated with videos:", {
      submissionId: submission._id,
      videoCount: submission.videos.length,
      videos: submission.videos,
      logsAdded: uploadLogs.length,
    })

    return NextResponse.json({
      success: true,
      submissionId: submission._id.toString(),
      status: submission.status,
    })
  } catch (error: any) {
    console.error("Upload callback error:", error)
    
    // Log error if we have submissionId
    try {
      const body = await request.json().catch(() => ({}))
      const errorSubmissionId = (body as any).submissionId || submissionId
      
      if (errorSubmissionId) {
        const errorSubmission = await Submission.findById(errorSubmissionId)
        if (errorSubmission) {
          errorSubmission.activityLogs = [
            ...(errorSubmission.activityLogs || []),
            {
              action: "error" as const,
              status: "failed" as const,
              message: `Upload callback failed: ${error.message}`,
              error: error.message,
              timestamp: new Date(),
            },
          ]
          await errorSubmission.save()
        }
      }
    } catch (logError) {
      console.error("Failed to log error:", logError)
    }
    
    return NextResponse.json({ error: error.message || "Failed to process upload" }, { status: 500 })
  }
}

