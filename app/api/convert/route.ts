import { NextRequest, NextResponse } from "next/server"
import { spawn } from "child_process"
import { writeFile, unlink } from "fs/promises"
import { join } from "path"
import { tmpdir } from "os"
import { existsSync } from "fs"

export async function POST(req: NextRequest) {
  let tempFilePath = ""
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    tempFilePath = join(tmpdir(), `upload-${Date.now()}-${file.name}`)
    await writeFile(tempFilePath, buffer)

    // Detect Python virtual environment (.venv) or fallback to system python
    const localVenvWin = join(process.cwd(), ".venv", "Scripts", "python.exe")
    const localVenvUnix = join(process.cwd(), ".venv", "bin", "python")
    
    let pythonExecutable = "python"
    if (existsSync(localVenvWin)) {
      pythonExecutable = localVenvWin
    } else if (existsSync(localVenvUnix)) {
      pythonExecutable = localVenvUnix
    } else if (process.platform !== "win32") {
      pythonExecutable = "python3"
    }

    // Spawn python to convert
    const scriptPath = join(process.cwd(), "scripts", "convert_material.py")
    const pythonProcess = spawn(pythonExecutable, [scriptPath, tempFilePath])

    let stdoutData = ""
    let stderrData = ""

    pythonProcess.stdout.on("data", (data) => {
      stdoutData += data.toString("utf-8")
    })

    pythonProcess.stderr.on("data", (data) => {
      stderrData += data.toString("utf-8")
    })

    const exitCode = await new Promise<number>((resolve, reject) => {
      pythonProcess.on("error", (err) => {
        reject(err)
      })
      pythonProcess.on("close", (code) => {
        resolve(code ?? 0)
      })
    })

    // Clean up temp file
    try {
      await unlink(tempFilePath)
      tempFilePath = ""
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
    // Clean up temp file if it was created and not yet unlinked
    if (tempFilePath) {
      try {
        await unlink(tempFilePath)
      } catch (e) {
        // ignore cleanup error in catch block
      }
    }

    if (error.code === "ENOENT") {
      return NextResponse.json(
        {
          error: "Microsoft MarkItDown file conversion is only supported in a local environment with Python. " +
                 "To convert multi-format study guides (PDFs, Word docs, Excel sheets, PowerPoint slides), " +
                 "please run MOLD V2 locally ('pnpm dev') with a Python virtual environment (.venv) configured!"
        },
        { status: 503 }
      )
    }
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

