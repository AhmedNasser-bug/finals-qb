"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { useCheatSheet } from "@/lib/game/cheat-sheet-context"
import { formatLabel, gradeColor, hasVisual } from "@/lib/mold-types"
import DOMPurify from "isomorphic-dompurify"
import { renderMath } from "@/lib/utils/math-renderer"
import { cn } from "@/lib/utils"

interface LogLine {
  id: string
  type: "input" | "system" | "success" | "error" | "rich"
  text?: string
  element?: React.ReactNode
}

export function CheatSheetTerminal({ subjectId }: { subjectId: string }) {
  const { isOpen, setIsOpen, toggleCheatSheet, entries, clearEntries } = useCheatSheet()
  const [terminalInput, setTerminalInput] = useState("")
  const [logs, setLogs] = useState<LogLine[]>([])
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  
  const logContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 1. Initial boot screen logs
  useEffect(() => {
    setLogs([
      { id: "boot-1", type: "system", text: "MOLD SYSTEM CONTROL TERMINAL v2.0.0" },
      { id: "boot-2", type: "system", text: "=========================================" },
      { id: "boot-3", type: "system", text: "[STATUS: ONLINE. CHEAT_SHEET_LOG LOADED.]" },
      { id: "boot-4", type: "system", text: "Type 'help' for available commands or 'list' to see flagged questions." },
      { id: "boot-5", type: "system", text: "-----------------------------------------" },
    ])
  }, [])

  // 2. Scroll to bottom when logs change
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [logs])

  // 3. Keep focus in input when terminal is clicked
  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // 4. Focus input when terminal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus()
      }, 100)
    }
  }, [isOpen])

  // 5. Ctrl + ` (Backtick) global keyboard toggle (only when terminal is active in GameRunner)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === "`" || e.key === "~")) {
        e.preventDefault()
        toggleCheatSheet()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleCheatSheet])

  // Helper to append a line to the terminal
  const appendLog = useCallback((log: Omit<LogLine, "id">) => {
    setLogs((prev) => [...prev, { ...log, id: `log-${Date.now()}-${Math.random()}` }])
  }, [])

  // Command executor
  const executeCommand = useCallback((cmdText: string) => {
    const trimmed = cmdText.trim()
    if (!trimmed) return

    // Add to input history
    appendLog({ type: "input", text: `MOLD_SYS@USER:~$ ${trimmed}` })
    setHistory((prev) => [...prev, trimmed])
    setHistoryIndex(-1)

    const parts = trimmed.split(" ")
    const command = parts[0].toLowerCase()
    const arg = parts.slice(1).join(" ")

    switch (command) {
      case "help":
        appendLog({
          type: "system",
          text: `Available Console Commands:
  help          - Display this help message.
  list          - List all flagged question entries (wrong or hinted).
  view <index>  - Display detailed explanation of a flagged entry.
  clear         - Wipe the cheat sheet database for this subject.
  close         - Close the terminal side panel.`
        })
        break

      case "list":
        if (entries.length === 0) {
          appendLog({
            type: "system",
            text: "LOG STATUS: Empty. Answer questions incorrectly or request hints to populate the terminal cheat sheet."
          })
        } else {
          appendLog({ type: "system", text: `FLAGGED DATABASE ENTRIES (${entries.length} RECORDS FOUND):` })
          entries.forEach((entry, idx) => {
            const num = idx + 1
            const statusStr = [
              entry.gotWrong ? "WRONG" : null,
              entry.hintUsed ? "HINTED" : null
            ].filter(Boolean).join(" & ")

            appendLog({
              type: "rich",
              element: (
                <div key={entry.id} className="py-0.5 flex flex-wrap gap-2 items-center">
                  <span className="text-[#a1a1aa] font-mono">[{num}]</span>
                  <button
                    onClick={() => executeCommand(`view ${num}`)}
                    className="text-left font-mono text-[#fecc17] hover:underline focus:outline-none hover:text-white"
                  >
                    {formatLabel(entry.category)} / {entry.id.substring(0, 12)}
                  </button>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 bg-zinc-800 rounded text-zinc-400">
                    {entry.difficulty}
                  </span>
                  <span className={cn(
                    "text-[9px] font-mono font-bold tracking-wider",
                    entry.gotWrong ? "text-red-400" : "text-yellow-500"
                  )}>
                    ({statusStr})
                  </span>
                </div>
              )
            })
          })
        }
        break

      case "view": {
        const idxVal = parseInt(arg, 10)
        if (isNaN(idxVal) || idxVal < 1 || idxVal > entries.length) {
          appendLog({ type: "error", text: `Syntax Error: 'view' expects a valid index between 1 and ${entries.length}. Usage: view <index>` })
        } else {
          const entry = entries[idxVal - 1]
          appendLog({
            type: "rich",
            element: (
              <div className="bg-[#121212] border border-zinc-800/80 p-4 rounded my-2 text-[#e5e2e1] space-y-3 font-sans">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                    RECORD_ID: {entry.id}
                  </span>
                  <span className="font-mono text-[9px] px-2 py-0.5 bg-zinc-900 rounded text-zinc-400 uppercase">
                    {entry.difficulty}
                  </span>
                </div>

                {/* Question Text */}
                <div className="space-y-1">
                  <span className="block font-mono text-[9px] text-[#fecc17] uppercase tracking-wider">
                    [QUESTION]
                  </span>
                  <p 
                    className="text-sm font-semibold leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(renderMath(entry.question))
                    }}
                  />
                </div>

                {/* Options */}
                {entry.options && entry.options.length > 0 && (
                  <div className="space-y-1">
                    <span className="block font-mono text-[9px] text-zinc-500 uppercase tracking-wider">
                      [OPTIONS]
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {entry.options.map((opt) => {
                        const isCorrect = opt.label === entry.answer
                        return (
                          <div 
                            key={opt.label} 
                            className={cn(
                              "p-2 border rounded font-mono",
                              isCorrect 
                                ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-400" 
                                : "bg-zinc-900/40 border-zinc-800 text-zinc-400"
                            )}
                          >
                            <span className="font-black mr-1.5">{opt.label}:</span>
                            <span dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(renderMath(opt.text))
                            }} />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Explanation */}
                <div className="space-y-1 border-t border-zinc-800/80 pt-3">
                  <span className="block font-mono text-[9px] text-[#4ae176] uppercase tracking-wider">
                    [SYSTEM_EXPLANATION]
                  </span>
                  <p 
                    className="text-xs leading-relaxed text-zinc-300 italic"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(renderMath(entry.explanation))
                    }}
                  />
                </div>
              </div>
            )
          })
        }
        break
      }

      case "clear":
        clearEntries()
        appendLog({ type: "success", text: "LOG ACTION: Cheat sheet database cleared. 0 records remaining." })
        break

      case "close":
        appendLog({ type: "system", text: "Terminating session..." })
        setIsOpen(false)
        break

      default:
        appendLog({ type: "error", text: `Command not found: '${command}'. Type 'help' for instructions.` })
    }
  }, [entries, appendLog, clearEntries, setIsOpen])

  // Key down event handler for input field (handles Enter and History UP/DOWN keys)
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Proactively block propagation so typing inside terminal doesn't trigger game keystrokes
    e.stopPropagation()

    if (e.key === "Enter") {
      const val = terminalInput
      setTerminalInput("")
      executeCommand(val)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (history.length === 0) return
      
      const newIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(newIdx)
      setTerminalInput(history[newIdx])
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (history.length === 0) return
      
      if (historyIndex === -1) return
      if (historyIndex >= history.length - 1) {
        setHistoryIndex(-1)
        setTerminalInput("")
      } else {
        const newIdx = historyIndex + 1
        setHistoryIndex(newIdx)
        setTerminalInput(history[newIdx])
      }
    }
  }

  return (
    <>
      {/* Drawer Overlay (to click outside and close) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
        />
      )}

      {/* Terminal Drawer */}
      <div
        onClick={handleContainerClick}
        onKeyDown={(e) => e.stopPropagation()} // block game keys globally inside terminal drawer
        className={cn(
          "fixed top-0 right-0 z-50 h-screen w-full max-w-md md:max-w-2xl bg-[#090909] border-l border-zinc-800/80 shadow-2xl flex flex-col transition-all duration-300 transform select-text",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="scanlines absolute inset-0 opacity-[0.05] pointer-events-none z-0" />
        
        {/* Terminal Header */}
        <div className="relative z-10 bg-[#121212] border-b border-zinc-800/80 px-4 py-3 shrink-0 flex justify-between items-center font-mono">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">
              MOLD_CONTROL_UNIT://SYSTEM_TERMINAL
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest hidden sm:inline">
              Ctrl + ` to Toggle
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-500 hover:text-red-400 transition-colors uppercase text-[10px] font-black border border-zinc-800 hover:border-red-500/30 bg-zinc-950 px-2 py-0.5 rounded cursor-pointer"
            >
              [X]
            </button>
          </div>
        </div>

        {/* Terminal Body (Scrollable Output) */}
        <div
          ref={logContainerRef}
          className="relative z-10 flex-1 overflow-y-auto p-4 font-mono text-xs text-[#fecc17] space-y-2 custom-scrollbar selection:bg-[#fecc17]/20 selection:text-white"
        >
          {logs.map((log) => {
            if (log.type === "input") {
              return (
                <div key={log.id} className="text-zinc-400 font-semibold break-all">
                  {log.text}
                </div>
              )
            }
            if (log.type === "error") {
              return (
                <div key={log.id} className="text-red-400 break-all">
                  {log.text}
                </div>
              )
            }
            if (log.type === "success") {
              return (
                <div key={log.id} className="text-[#4ae176] break-all">
                  {log.text}
                </div>
              )
            }
            if (log.type === "rich") {
              return <div key={log.id} className="w-full">{log.element}</div>
            }
            return (
              <div key={log.id} className="white-space-pre-wrap leading-relaxed break-all">
                {log.text}
              </div>
            )
          })}
        </div>

        {/* Terminal Input Bar */}
        <div className="relative z-10 bg-[#0c0c0c] border-t border-zinc-800/80 px-4 py-3 shrink-0 flex items-center gap-2 font-mono">
          <span className="text-zinc-400 font-bold shrink-0">MOLD_SYS@USER:~$</span>
          <div className="flex-1 relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              className="w-full bg-transparent text-[#fecc17] focus:outline-none border-none p-0 focus:ring-0 text-xs shrink-0 select-text"
              placeholder="Type command (e.g. help, list, clear)..."
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
            />
            {/* Blinking cursor emulation (optional, but looks amazing!) */}
            {terminalInput === "" && (
              <span className="absolute left-0 w-1.5 h-3.5 bg-[#fecc17] animate-pulse pointer-events-none" style={{ animationDuration: "1s" }} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
