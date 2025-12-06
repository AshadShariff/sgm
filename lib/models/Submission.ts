import mongoose, { Schema, Document, Model } from "mongoose"

export interface IVideo {
  url: string
  publicId: string
  filename: string
  size: number
  uploadedAt: Date
}

export interface IActivityLog {
  action: "upload" | "delete" | "download" | "error"
  videoUrl?: string
  videoFilename?: string
  publicId?: string
  status: "success" | "failed"
  message: string
  response?: any
  error?: string
  timestamp: Date
  performedBy?: string
}

export interface ISubmission extends Document {
  orderId: mongoose.Types.ObjectId
  scriptText: string
  customPrompt?: string
  greenScreen: boolean
  videos: IVideo[]
  status: "awaiting_upload" | "uploaded" | "processing" | "ready" | "delivered" | "failed"
  adminNotes?: string
  processedVideoUrl?: string
  activityLogs?: IActivityLog[]
  createdAt: Date
  updatedAt: Date
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    scriptText: { type: String, required: true, minlength: 10 },
    customPrompt: { type: String },
    greenScreen: { type: Boolean, default: false },
    videos: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        filename: { type: String, required: true },
        size: { type: Number, required: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ["awaiting_upload", "uploaded", "processing", "ready", "delivered", "failed"],
      default: "awaiting_upload",
    },
    adminNotes: { type: String },
    processedVideoUrl: { type: String },
    activityLogs: [
      {
        action: { type: String, enum: ["upload", "delete", "download", "error"], required: true },
        videoUrl: { type: String },
        videoFilename: { type: String },
        publicId: { type: String },
        status: { type: String, enum: ["success", "failed"], required: true },
        message: { type: String, required: true },
        response: { type: mongoose.Schema.Types.Mixed },
        error: { type: String },
        timestamp: { type: Date, default: Date.now },
        performedBy: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
)

const Submission: Model<ISubmission> =
  mongoose.models.Submission || mongoose.model<ISubmission>("Submission", SubmissionSchema)

export default Submission

