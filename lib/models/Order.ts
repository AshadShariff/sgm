import mongoose, { Schema, Document, Model } from "mongoose"

export interface IOrder extends Document {
  packageId: string
  amount: number
  currency: string
  stripeSessionId?: string
  paymentStatus: "pending" | "paid" | "failed"
  buyer: {
    email: string
    phone: string
    name?: string
  }
  createdAt: Date
}

const OrderSchema = new Schema<IOrder>(
  {
    packageId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: "usd" },
    stripeSessionId: { type: String },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    buyer: {
      email: { type: String, required: true },
      phone: { type: String, required: true },
      name: { type: String },
    },
  },
  {
    timestamps: true,
  }
)

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema)

export default Order

