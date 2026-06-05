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

const manifestCache = new Map<string, { mtimeMs: number, entry: ExampleManifestEntry }>()

export async function getExamplesManifest(): Promise<ExampleManifestEntry[]> {
  const examplesDir = path.join(process.cwd(), "public", "examples")

  try {
    const files = await fsPromises.readdir(examplesDir)
    const jsonFiles = files.filter(f => f.endsWith(".json") && f !== "index.json")

    const manifestResults = await Promise.all(
      jsonFiles.map(async (file) => {
        const filePath = path.join(examplesDir, file)
        const fileStem = file.replace(/\.json$/i, "")
        try {
          const stat = await fsPromises.stat(filePath)
          const cached = manifestCache.get(file)

          if (cached && cached.mtimeMs === stat.mtimeMs) {
            return cached.entry
          }

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

          const entry = {
            id: data.id || fileStem,
            filename: fileStem,   // always the actual file name, not the subject id
            name: data.name || fileStem,
            description: data.config?.description || "",
            questionCount: data.questions?.length || 0,
            categoryCount: categories.size,
            tags: data.tags || tags
          }

          manifestCache.set(file, { mtimeMs: stat.mtimeMs, entry })
          return entry
        } catch (err) {
          logger.error(`Failed to parse Example Example: ${file}`, err)
          return null
        }
      })
    )

    return manifestResults.filter((entry): entry is ExampleManifestEntry => entry !== null)
  } catch (err) {
    logger.error("Failed to read examples directory", err)
    return []
  }
}
