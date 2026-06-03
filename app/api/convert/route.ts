import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 })
    }

    const SERVICE_URL = process.env.MARKITDOWN_SERVICE_URL
    const SERVICE_KEY = process.env.MARKITDOWN_API_KEY

    if (!SERVICE_URL) {
      return NextResponse.json(
        {
          error: "Microsoft MarkItDown file conversion is only supported via a deployed microservice. " +
                 "Please configure the 'MARKITDOWN_SERVICE_URL' and 'MARKITDOWN_API_KEY' environment variables!"
        },
        { status: 503 }
      )
    }

    const apiFormData = new FormData()
    apiFormData.append("file", file)

    const response = await fetch(`${SERVICE_URL.replace(/\/$/, "")}/convert`, {
      method: "POST",
      headers: {
        "X-API-Key": SERVICE_KEY || "",
      },
      body: apiFormData,
    })

    if (!response.ok) {
      const errText = await response.text()
      let errMsg = "Service conversion failed."
      try {
        const errJson = JSON.parse(errText)
        errMsg = errJson.error || errMsg
      } catch (e) {
        errMsg = errText || errMsg
      }
      return NextResponse.json(
        { error: `Microservice conversion failed with status ${response.status}: ${errMsg}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json({ markdown: data.markdown })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

