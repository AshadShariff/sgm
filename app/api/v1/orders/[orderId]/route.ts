import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Order from "@/lib/models/Order"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    await connectDB()

    const { orderId } = await params
    const body = await request.json()
    const { buyer } = body

    // Validate order exists
    const order = await Order.findById(orderId)
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Update buyer information if provided
    if (buyer) {
      if (buyer.email) {
        order.buyer.email = buyer.email
      }
      if (buyer.phone) {
        order.buyer.phone = buyer.phone
      }
      if (buyer.name) {
        order.buyer.name = buyer.name
      }
      await order.save()
    }

    return NextResponse.json({
      success: true,
      order: {
        orderId: order._id.toString(),
        buyer: order.buyer,
      },
    })
  } catch (error: any) {
    console.error("Order update error:", error)
    return NextResponse.json({ error: error.message || "Failed to update order" }, { status: 500 })
  }
}

