"use client"

import type React from "react"

import { useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Search, Loader2 } from "lucide-react"

type Suggestion = { label: string; hint?: string }
const TRENDING: Suggestion[] = [
  { label: "Latest AI breakthroughs", hint: "news" },
  { label: "How to structure a knowledge base", hint: "guide" },
  { label: "Design tokens best practices", hint: "design" },
  { label: "Futuristic UI inspiration", hint: "design" },
  { label: "Web performance tuning 2025", hint: "dev" },
]

export function SearchInput({
  id,
  value,
  onChange,
  onSubmit,
  isLoading,
  mode,
  onModeChange,
}: {
  id?: string
  value: string
  onChange: (v: string) => void
  onSubmit: (v: string) => void
  isLoading?: boolean
  mode?: "auto" | "personalized" | "neutral"
  onModeChange?: (mode: "auto" | "personalized" | "neutral") => void
}) {
  const [focus, setFocus] = useState(false)
  const [i, setI] = useState(-1) // active suggestion index
  const [local, setLocal] = useState<Suggestion[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const [internal, setInternal] = useState(value)

  // keep internal in sync with external
  useEffect(() => setInternal(value), [value])

  // debounced update to parent
  useEffect(() => {
    const t = setTimeout(() => onChange(internal), 180)
    return () => clearTimeout(t)
  }, [internal, onChange])

  // localStorage recent suggestions
  useEffect(() => {
    try {
      const raw = localStorage.getItem("recent-searches")
      if (raw) {
        const arr = JSON.parse(raw) as string[]
        setLocal(arr.slice(0, 5).map((label) => ({ label })))
      }
    } catch {}
  }, [])

  const suggestions = useMemo(() => {
    const base = [...local, ...TRENDING]
    if (!internal.trim()) return base
    const dedup = new Map<string, Suggestion>()
    for (const s of base) {
      if (s.label.toLowerCase().includes(internal.toLowerCase())) {
        dedup.set(s.label, s)
      }
    }
    return Array.from(dedup.values()).slice(0, 8)
  }, [internal, local])

  const runSubmit = (q?: string) => {
    const next = (q ?? internal).trim()
    if (!next) return
    try {
      const raw = localStorage.getItem("recent-searches")
      const arr = raw ? (JSON.parse(raw) as string[]) : []
      const merged = [next, ...arr.filter((x) => x !== next)].slice(0, 10)
      localStorage.setItem("recent-searches", JSON.stringify(merged))
    } catch {}
    onSubmit(next)
    inputRef.current?.blur()
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setI((x) => Math.min(x + 1, suggestions.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setI((x) => Math.max(x - 1, -1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      runSubmit(i >= 0 ? suggestions[i]?.label : undefined)
    } else if (e.key === "Escape") {
      setI(-1)
      ;(e.target as HTMLInputElement).blur()
    }
  }

  useEffect(() => {
    if (i >= 0 && i < suggestions.length) {
      const v = suggestions[i].label
      setInternal(v)
    } else if (i === -1) {
      setInternal(value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i])

  return (
    <div className="relative">
      {/* Main search bar with integrated personalization controls */}
      <div className="relative mx-auto w-full max-w-3xl rounded-2xl bg-white/10 px-4 py-3 pr-36 ring-1 ring-white/20 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
        <div className="flex items-center">
          <Search className="ml-3 h-5 w-5 text-muted-foreground" aria-hidden />
          <input
            id={id}
            ref={inputRef}
            value={internal}
            onChange={(e) => setInternal(e.target.value)}
            onKeyDown={onKeyDown}
            onFocus={() => setFocus(true)}
            onBlur={() => setTimeout(() => setFocus(false), 120)}
            placeholder="Search the web of ideas..."
            className={cn(
              "flex-1 bg-transparent px-3 py-3 outline-none placeholder:text-muted-foreground",
              "text-base md:text-lg",
            )}
            aria-label="Search"
            autoComplete="off"
            spellCheck={false}
          />
          <div className="mr-2 flex items-center gap-2">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-[color:var(--brand)]" aria-label="Loading" />
            ) : null}
            <kbd className="hidden select-none rounded bg-[color:var(--line-soft)] px-1.5 py-0.5 text-xs text-muted-foreground md:inline">
              /
            </kbd>
          </div>
          {/* Baton line (meaningful loading indicator) */}
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-x-0 -bottom-px h-0.5 origin-left scale-x-0 bg-[color:var(--brand)] transition-transform",
              isLoading ? "scale-x-100" : "group-focus-within:scale-x-100",
            )}
          />
        </div>

        {/* Personalization segmented control in the right corner of the search bar */}
        {onModeChange && (
          <div
            role="radiogroup"
            aria-label="Personalization mode"
            className="pointer-events-auto absolute inset-y-0 right-10 my-auto inline-flex h-9 items-center gap-1 rounded-full bg-white/10 px-1.5 ring-1 ring-white/25 backdrop-blur-md"
          >
            <button
              type="button"
              role="radio"
              aria-checked={mode === "auto"}
              onClick={() => onModeChange("auto")}
              className={cn(
                "rounded-full px-3 py-1.5 text-[11px] transition",
                mode === "auto"
                  ? "bg-white/20 text-[var(--fg)] ring-1 ring-white/40"
                  : "text-[var(--muted)] hover:text-[var(--fg)]",
              )}
            >
              Auto
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={mode === "personalized"}
              onClick={() => onModeChange("personalized")}
              className={cn(
                "rounded-full px-3 py-1.5 text-[11px] transition",
                mode === "personalized"
                  ? "bg-white/20 text-[var(--fg)] ring-1 ring-white/40"
                  : "text-[var(--muted)] hover:text-[var(--fg)]",
              )}
            >
              Personalized
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={mode === "neutral"}
              onClick={() => onModeChange("neutral")}
              className={cn(
                "rounded-full px-3 py-1.5 text-[11px] transition",
                mode === "neutral"
                  ? "bg-white/20 text-[var(--fg)] ring-1 ring-white/40"
                  : "text-[var(--muted)] hover:text-[var(--fg)]",
              )}
            >
              Neutral
            </button>
          </div>
        )}

        {/* Subtle search icon at far right, decorative */}
        <div
          aria-hidden
          className="absolute right-3 top-1/2 grid -translate-y-1/2 place-items-center rounded-full bg-white/10 p-2 ring-1 ring-white/25"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" className="text-[var(--fg)]/80">
            <path
              d="M21 21l-4.35-4.35m1.35-4.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {focus && suggestions.length > 0 && (
        <ul
          role="listbox"
          aria-label="Suggestions"
          className="absolute z-20 mt-2 w-full max-w-3xl overflow-hidden rounded-xl border border-[color:var(--line)] bg-[color:var(--panel)] shadow"
        >
          {suggestions.map((s, idx) => (
            <li
              key={s.label}
              role="option"
              aria-selected={idx === i}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => runSubmit(s.label)}
              className={cn(
                "flex cursor-pointer items-center justify-between px-3 py-2 text-sm transition-colors",
                idx === i ? "bg-[color:var(--line-soft)]" : "hover:bg-[color:var(--line-soft)]",
              )}
            >
              <span className="truncate">{s.label}</span>
              {s.hint ? <span className="ml-3 shrink-0 text-xs text-muted-foreground">{s.hint}</span> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}