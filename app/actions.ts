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

    const manifest: ExampleManifestEntry[] = []

    for (const file of jsonFiles) {
      const filePath = path.join(examplesDir, file)
      const content = await fs.readFile(filePath, "utf-8")
      try {
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

        manifest.push({
          id: data.id || file.replace(".json", ""),
          name: data.name || file.replace(".json", ""),
          description: data.config?.description || "",
          questionCount: data.questions?.length || 0,
          categoryCount: categories.size,
          tags: data.tags || tags
        })
      } catch (err) {
        console.error(`Failed to parse Example Example: ${file}`, err)
      }
    }

    return manifest
  } catch (err) {
    console.error("Failed to read examples directory", err)
    return []
  }
}
