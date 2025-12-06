import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Submission from "@/lib/models/Submission"
import Order from "@/lib/models/Order"
import { verifyAdminAuth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!verifyAdminAuth(authHeader)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const search = searchParams.get("search") // Search by email, phone, or name
    const limit = parseInt(searchParams.get("limit") || "50")
    const skip = parseInt(searchParams.get("skip") || "0")
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")

    // Build query
    const query: any = {}

    // Status filter
    if (status && status !== "all") {
      query.status = status
    }

    // Date range filter
    if (dateFrom || dateTo) {
      query.createdAt = {}
      if (dateFrom) {
        query.createdAt.$gte = new Date(dateFrom)
      }
      if (dateTo) {
        query.createdAt.$lte = new Date(dateTo)
      }
    }

    // Search filter (email, phone, name)
    if (search) {
      // First find orders matching the search
      const matchingOrders = await Order.find({
        $or: [
          { "buyer.email": { $regex: search, $options: "i" } },
          { "buyer.phone": { $regex: search, $options: "i" } },
          { "buyer.name": { $regex: search, $options: "i" } },
        ],
      }).select("_id")

      const orderIds = matchingOrders.map((o) => o._id)
      if (orderIds.length > 0) {
        query.orderId = { $in: orderIds }
      } else {
        // No matching orders, return empty result
        return NextResponse.json({
          submissions: [],
          total: 0,
          limit,
          skip,
        })
      }
    }

    const submissions = await Submission.find(query)
      .populate({
        path: "orderId",
        select: "buyer createdAt",
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)

    const total = await Submission.countDocuments(query)

    return NextResponse.json({
      submissions,
      total,
      limit,
      skip,
    })
  } catch (error: any) {
    console.error("Admin submissions list error:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch submissions" }, { status: 500 })
  }
}

