import { NextRequest, NextResponse } from "next/server"
import { MarkItDown } from "markitdown-ts"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const markitdown = new MarkItDown()
    const ext = file.name.substring(file.name.lastIndexOf("."))
    const result = await markitdown.convertBuffer(buffer, {
      file_extension: ext,
    })

    if (!result) {
      return NextResponse.json({ error: "Conversion returned empty result." }, { status: 500 })
    }

    return NextResponse.json({ markdown: result.markdown })
  } catch (error: any) {
    console.error("Local MarkItDown conversion error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

