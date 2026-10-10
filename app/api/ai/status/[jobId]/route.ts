import { NextRequest, NextResponse } from "next/server"
import { getAiJob } from "@/lib/ai/ai-job-store"

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await context.params

    if (!jobId) {
      return NextResponse.json(
        { error: "Missing required jobId parameter." },
        { status: 400 }
      )
    }

    const job = getAiJob(jobId)

    if (!job) {
      return NextResponse.json(
        { error: `Job with ID '${jobId}' not found.` },
        { status: 404 }
      )
    }

    return NextResponse.json(job)
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Internal server error retrieving job status." },
      { status: 500 }
    )
  }
}
