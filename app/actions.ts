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

async function processExampleFile(filePath: string, fileStem: string, file: string, manifestResults: ExampleManifestEntry[]) {
  try {
    const { text } = await import("node:stream/consumers")
    const stream = fs.createReadStream(filePath)
    const content = await text(stream)
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

    manifestResults.push({
      id: data.id || fileStem,
      filename: fileStem,   // always the actual file name, not the subject id
      name: data.name || fileStem,
      description: data.config?.description || "",
      questionCount: data.questions?.length || 0,
      categoryCount: categories.size,
      tags: data.tags || tags
    })
  } catch (err) {
    logger.error(`Failed to parse Example Example: ${file}`, err)
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

    const manifestResults: ExampleManifestEntry[] = []

    for (const file of jsonFiles) {
      const filePath = path.join(examplesDir, file)
      const fileStem = file.replace(/\.json$/i, "")
      await processExampleFile(filePath, fileStem, file, manifestResults)
    }

    manifestCache = manifestResults
    return manifestResults
  } catch (err) {
    logger.error("Failed to read examples directory", err)
    return []
  }
}
