"use server"

import fs from "fs/promises"
import path from "path"

export interface ExampleManifestEntry {
  id: string
  name: string
  description: string
  questionCount: number
  categoryCount: number
  tags: string[]
}

export async function getExamplesManifest(): Promise<ExampleManifestEntry[]> {
  const examplesDir = path.join(process.cwd(), "public", "examples")
  
  try {
    const files = await fs.readdir(examplesDir)
    const jsonFiles = files.filter(f => f.endsWith(".json") && f !== "index.json")

    const manifestPromises = jsonFiles.map(async (file) => {
      const filePath = path.join(examplesDir, file)
      try {
        const content = await fs.readFile(filePath, "utf-8")
        const data = JSON.parse(content)

        // Calculate categories
        const categories = new Set<string>()
        if (data.questions && Array.isArray(data.questions)) {
          for (const q of data.questions) {
            if (q.category) categories.add(q.category)
          }
        }

        const tags: string[] = []
        if (data.config?.difficulty) {
          tags.push(data.config.difficulty)
        }

        return {
          id: data.id || file.replace(".json", ""),
          name: data.name || file.replace(".json", ""),
          description: data.config?.description || "",
          questionCount: data.questions?.length || 0,
          categoryCount: categories.size,
          tags: data.tags || tags
        }
      } catch (err) {
        console.error(`Failed to parse Example Example: ${file}`, err)
        return null
      }
    })

    const manifestResults = await Promise.all(manifestPromises)
    return manifestResults.filter((entry): entry is ExampleManifestEntry => entry !== null)
  } catch (err) {
    console.error("Failed to read examples directory", err)
    return []
  }
}
