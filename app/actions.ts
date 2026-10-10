"use server"

import fsPromises from "fs/promises"
import fs from "fs"
import path from "path"
import { logger } from "@/lib/logger"

export interface ExampleManifestEntry {
  id: string
  /** The file stem (without .json) used to fetch the full JSON from /examples/ */
  filename: string
  name: string
  description: string
  questionCount: number
  categoryCount: number
  tags: string[]
}

let manifestCache: ExampleManifestEntry[] | null = null

async function processExampleFile(filePath: string, fileStem: string, file: string): Promise<ExampleManifestEntry | null> {
  try {
    const content = await new Promise<string>((resolve, reject) => {
      let data = ""
      const stream = fs.createReadStream(filePath, "utf-8")
      stream.on("data", (chunk) => {
        data += chunk
      })
      stream.on("end", () => resolve(data))
      stream.on("error", reject)
    })

    const data = JSON.parse(content)

    // Calculate categories
    const categories = new Set<string>()
    const questions = Array.isArray(data.questions) ? data.questions : []
    for (const q of questions) {
      if (q.category) categories.add(q.category)
    }

    const tags: string[] = []
    if (data.config?.difficulty) {
      tags.push(data.config.difficulty)
    }

    return {
      id: data.id || fileStem,
      filename: fileStem,   // always the actual file name, not the subject id
      name: data.name || fileStem,
      description: data.config?.description || "",
      questionCount: data.questions?.length || 0,
      categoryCount: categories.size,
      tags: data.tags || tags
    }
  } catch (err) {
    logger.error(`Failed to parse Example Example: ${file}`, err)
    return null
  }
}

export async function getExamplesManifest(): Promise<ExampleManifestEntry[]> {
  if (manifestCache) {
    return manifestCache
  }

  const examplesDir = path.join(process.cwd(), "public", "examples")

  try {
    const files = await fsPromises.readdir(examplesDir)
    const jsonFiles = files.filter(f => f.endsWith(".json") && f !== "index.json")

    const results = await Promise.all(
      jsonFiles.map((file) => {
        const filePath = path.join(examplesDir, file)
        const fileStem = file.replace(/\.json$/i, "")
        return processExampleFile(filePath, fileStem, file)
      })
    )

    const manifestResults = results.filter((entry): entry is ExampleManifestEntry => entry !== null)

    manifestCache = manifestResults
    return manifestResults
  } catch (err) {
    logger.error("Failed to read examples directory", err)
    return []
  }
}
