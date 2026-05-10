"use client"

import { useState, useEffect } from "react"
import { getStoredUser, setStoredUser, clearStoredUser, type User } from "@/lib/auth-store"

export function GoogleSignUpButton() {
  const [user, setUser] = useState<User | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    setUser(getStoredUser())
  }, [])

  const handleMockSignIn = () => {
    const mockUser: User = {
      id: crypto.randomUUID(),
      name: "Jules Engineer",
      email: "jules@example.com",
      // Generic SVG avatar for mock purposes
      picture: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%234A90E2" /><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="40" fill="white" font-family="sans-serif">J</text></svg>`,
    }
    setStoredUser(mockUser)
    setUser(mockUser)
  }

  const handleSignOut = () => {
    clearStoredUser()
    setUser(null)
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end">
          <span className="text-xs font-mono text-muted-foreground uppercase">{user.name}</span>
          <button
            onClick={handleSignOut}
            className="text-[10px] text-red-400 hover:text-red-300 transition-colors uppercase font-mono"
          >
            Sign Out
          </button>
        </div>
        {user.picture && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.picture}
            alt="Profile"
            className="w-8 h-8 rounded-full border border-border"
          />
        )}
      </div>
    )
  }

  return (
    <button
      onClick={handleMockSignIn}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex items-center justify-center gap-2 px-3 py-1.5 rounded border border-border bg-background hover:bg-secondary/50 hover:border-primary/40 transition-all text-sm font-mono text-foreground"
    >
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill={isHovered ? "#4285F4" : "currentColor"}
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill={isHovered ? "#34A853" : "currentColor"}
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill={isHovered ? "#FBBC05" : "currentColor"}
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill={isHovered ? "#EA4335" : "currentColor"}
        />
        <path d="M1 1h22v22H1z" fill="none" />
      </svg>
      <span>Sign up with Google</span>
    </button>
  )
}
