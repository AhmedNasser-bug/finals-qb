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

let manifestCache: { entries: ExampleManifestEntry[], lastModTime: number } | null = null

export async function getExamplesManifest(): Promise<ExampleManifestEntry[]> {
  const examplesDir = path.join(process.cwd(), "public", "examples")

  try {
    const dirStat = await fsPromises.stat(examplesDir)
    const currentModTime = dirStat.mtimeMs

    if (manifestCache && manifestCache.lastModTime === currentModTime) {
      return manifestCache.entries
    }

    const files = await fsPromises.readdir(examplesDir)
    const jsonFiles = files.filter(f => f.endsWith(".json") && f !== "index.json")

    const manifestPromises = jsonFiles.map(async (file) => {
      const filePath = path.join(examplesDir, file)
      const fileStem = file.replace(/\.json$/i, "")
      try {
        const content = await fsPromises.readFile(filePath, "utf-8")
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
        } as ExampleManifestEntry
      } catch (err) {
        logger.error(`Failed to parse Example Example: ${file}`, err)
        return null
      }
    })

    const results = await Promise.all(manifestPromises)
    const manifestResults = results.filter((entry): entry is ExampleManifestEntry => entry !== null)

    manifestCache = { entries: manifestResults, lastModTime: currentModTime }
    return manifestResults
  } catch (err) {
    logger.error("Failed to read examples directory", err)
    return []
  }
}
