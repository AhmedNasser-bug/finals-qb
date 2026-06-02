import { test, describe, after } from "node:test"
import assert from "node:assert"
import { spawnSync } from "child_process"
import { writeFileSync, unlinkSync, existsSync } from "fs"
import { join } from "path"

// Detect Python executable (local .venv or system python)
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

describe("MarkItDown Microservice Script Tests", () => {
  const scriptPath = join(process.cwd(), "scripts", "convert_material.py")
  const tempTestFile = join(process.cwd(), "temp_test_markitdown.txt")

  // Cleanup block in case of failures
  after(() => {
    if (existsSync(tempTestFile)) {
      try {
        unlinkSync(tempTestFile)
      } catch (e) {
        // ignore
      }
    }
  })

  test("convert_material.py successfully parses a text file", () => {
    const testContent = "Hello MarkItDown! This is study notes."
    writeFileSync(tempTestFile, testContent, "utf-8")

    const result = spawnSync(pythonExecutable, [scriptPath, tempTestFile])

    assert.strictEqual(result.status, 0, "Python process should exit with 0")
    const stdoutStr = result.stdout.toString("utf-8").trim()
    assert.strictEqual(stdoutStr, testContent, "Stdout should match file content parsed by markitdown")

    // Clean up
    if (existsSync(tempTestFile)) {
      unlinkSync(tempTestFile)
    }
  })

  test("convert_material.py handles missing file argument with error exit", () => {
    const result = spawnSync(pythonExecutable, [scriptPath])

    assert.strictEqual(result.status, 1, "Python process should exit with 1 on missing argument")
    const stderrStr = result.stderr.toString("utf-8").trim()
    assert.match(stderrStr, /Error: Missing input file path/, "Stderr should show missing argument message")
  })

  test("convert_material.py handles non-existent file path with error exit", () => {
    const nonExistentPath = join(process.cwd(), "non_existent_file_path_12345.docx")
    const result = spawnSync(pythonExecutable, [scriptPath, nonExistentPath])

    assert.strictEqual(result.status, 1, "Python process should exit with 1 on non-existent path")
    const stderrStr = result.stderr.toString("utf-8").trim()
    assert.match(stderrStr, /Error: File '.*' does not exist/, "Stderr should show file does not exist message")
  })
})

