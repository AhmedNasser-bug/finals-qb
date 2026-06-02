import { NextRequest, NextResponse } from "next/server"
import { spawn } from "child_process"
import { writeFile, unlink } from "fs/promises"
import { join } from "path"
import { tmpdir } from "os"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const tempFilePath = join(tmpdir(), `upload-${Date.now()}-${file.name}`)
    await writeFile(tempFilePath, buffer)

    // Spawn python to convert
    const scriptPath = join(process.cwd(), "scripts", "convert_material.py")
    const pythonProcess = spawn("python", [scriptPath, tempFilePath])

    let stdoutData = ""
    let stderrData = ""

    pythonProcess.stdout.on("data", (data) => {
      stdoutData += data.toString("utf-8")
    })

    pythonProcess.stderr.on("data", (data) => {
      stderrData += data.toString("utf-8")
    })

    const exitCode = await new Promise<number>((resolve) => {
      pythonProcess.on("close", (code) => {
        resolve(code ?? 0)
      })
    })

    // Clean up temp file
    try {
      await unlink(tempFilePath)
    } catch (e) {
      console.error("Error unlinking temp file:", e)
    }

    if (exitCode !== 0) {
      return NextResponse.json(
        { error: `Python converter failed with code ${exitCode}: ${stderrData}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ markdown: stdoutData })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
