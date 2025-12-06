import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Order from "@/lib/models/Order"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const searchParams = request.nextUrl.searchParams
    const sessionId = searchParams.get("session_id")

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 })
    }

    const order = await Order.findOne({ stripeSessionId: sessionId })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({
      orderId: order._id.toString(),
      paymentStatus: order.paymentStatus,
      buyer: order.buyer,
    })
  } catch (error: any) {
    console.error("Order confirmation error:", error)
    return NextResponse.json({ error: error.message || "Failed to confirm order" }, { status: 500 })
  }
}

