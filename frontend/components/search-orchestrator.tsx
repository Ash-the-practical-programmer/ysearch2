"use client"

import type React from "react"

import { useCallback, useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import { cn } from "@/lib/utils"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { SearchInput } from "@/components/symphony/search-input"
import { CommandMenu } from "@/components/symphony/command-menu"
import type { FiltersState } from "@/components/symphony/filters"

type SearchResult = {
  id: string
  title: string
  snippet: string
  url: string
  signals: string[]
  score: number
}

type Mode = "auto" | "personalized" | "neutral"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch")
  return (await res.json()) as { results: SearchResult[]; tookMs: number }
}

export default function SearchOrchestrator() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  const [query, setQuery] = useState("")
  const [focusedIdx, setFocusedIdx] = useState<number>(-1)
  const [openPalette, setOpenPalette] = useState(false)
  const inputDomId = "main-search"

  const [filters, setFilters] = useState<FiltersState>({
    type: "all",
    time: "any",
    safe: true,
  })

  const [mode, setMode] = useState<Mode>("auto")

  useEffect(() => {
    const q = params.get("q") || ""
    if (q && q !== query) setQuery(q)
  }, [params, query])

  useEffect(() => {
    const m = (params.get("mode") as Mode) || "auto"
    if (m !== mode) setMode(m)
  }, [params, mode])

  const key =
    query.trim().length > 0
      ? `/api/search?q=${encodeURIComponent(query.trim())}&type=${filters.type}&time=${filters.time}&safe=${
          filters.safe ? 1 : 0
        }&mode=${mode}`
      : null

  const { data, isLoading, error } = useSWR(key, fetcher, { revalidateOnFocus: false })
  const results = data?.results ?? []

  useEffect(() => {
    const isEditable = (el: Element | null) =>
      !!el &&
      (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || (el as HTMLElement).isContentEditable)

    const onGlobal = (e: KeyboardEvent) => {
      const target = e.target as Element | null
      // Cmd/Ctrl+K toggles palette
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpenPalette((v) => !v)
        return
      }
      // "/" focuses search when not typing in a field
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey && !isEditable(target)) {
        e.preventDefault()
        const el = document.getElementById(inputDomId) as HTMLInputElement | null
        el?.focus()
      }
      // Escape clears focusIndex
      if (e.key === "Escape") {
        setFocusedIdx(-1)
      }
      // Result navigation when not focused in input
      if (!isEditable(target) && results.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault()
          setFocusedIdx((prev) => Math.min(prev + 1, results.length - 1))
        } else if (e.key === "ArrowUp") {
          e.preventDefault()
          setFocusedIdx((prev) => Math.max(prev - 1, 0))
        } else if (e.key === "Enter" && focusedIdx >= 0) {
          window.open(results[focusedIdx].url, "_blank", "noopener,noreferrer")
        }
      }
    }
    window.addEventListener("keydown", onGlobal)
    return () => window.removeEventListener("keydown", onGlobal)
  }, [results, focusedIdx])

  const liveMessage = useMemo(() => {
    if (!query) return "Idle"
    if (isLoading) return "Searching..."
    return `Showing ${results.length} results in ${data?.tookMs ?? 0} ms for ${query}`
  }, [query, isLoading, results.length, data?.tookMs])

  const statusText = useMemo(() => {
    if (error) return "Something went off-tempo."
    if (isLoading && query) return "Scoring the orchestra…"
    if (!isLoading && query && results.length === 0) return "No results — try refining terms."
    return ""
  }, [error, isLoading, results.length, query])

  const submitQuery = useCallback(
    (q: string) => {
      setQuery(q)
      const url = `${pathname}?q=${encodeURIComponent(q)}`
      router.replace(url, { scroll: false })
    },
    [pathname, router],
  )

  const changeMode = useCallback(
    (m: Mode) => {
      setMode(m)
      const sp = new URLSearchParams(Array.from(params.entries()))
      sp.set("mode", m)
      router.replace(`${pathname}?${sp.toString()}`, { scroll: false })
      window.dispatchEvent(new CustomEvent("search:mode", { detail: { mode: m } }))
    },
    [params, pathname, router],
  )

  return (
    <div className="relative">
      <SearchInput 
        id={inputDomId} 
        value={query} 
        onChange={setQuery} 
        onSubmit={submitQuery} 
        isLoading={!!isLoading}
        mode={mode}
        onModeChange={changeMode}
      />

      <p className="sr-only" aria-live="polite">
        {liveMessage}
      </p>

      {/* Helper line */}
      {statusText ? (
        <div role="status" className="mt-2 text-xs text-[var(--muted)]">
          {statusText}
        </div>
      ) : null}

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <ul id="results" role="listbox" aria-label="Results" className="space-y-3">
            {results.map((r, i) => (
              <li key={r.id} role="option" aria-selected={focusedIdx === i}>
                <ResultCard
                  result={r}
                  active={focusedIdx === i}
                  onHover={() => setFocusedIdx(i)}
                  onOpen={() => window.open(r.url, "_blank", "noopener,noreferrer")}
                />
              </li>
            ))}

            {!isLoading && query && results.length === 0 ? (
              <li className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4 text-sm text-[var(--muted)]">
                No results yet — try a broader phrase or add a clarifier.
              </li>
            ) : null}
          </ul>
        </div>

        <aside aria-label="Signals & refine" className="space-y-3">
          <details className="group">
            <summary
              className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-[var(--line)] bg-[var(--panel)] text-[var(--fg)] outline-none transition hover:border-[var(--brand)] [&::-webkit-details-marker]:hidden"
              aria-label="Why these results"
              title="Why these results"
            >
              <span aria-hidden className="text-base font-semibold">
                ?
              </span>
              <span className="sr-only">Why these results</span>
            </summary>

            <div className="mt-3 glass rounded-xl p-4 ring-1 ring-[var(--line)]/70">
              <h2 className="text-sm font-semibold text-[var(--fg)]">Why these results</h2>
              <p className="mt-2 text-xs text-[var(--muted)]">
                We highlight the main reasons results appear—so you can trust the ranking at a glance.
              </p>

              <div className="mt-3 flex flex-wrap gap-2" role="list" aria-label="Ranking highlights">
                <SignalChip label="Trusted sources" />
                <SignalChip label="Fresh + recent" />
                <SignalChip label="Intent match" />
                <SignalChip label="Diverse viewpoints" />
              </div>

              <a
                href="/about/ranking"
                className="mt-3 inline-flex items-center text-[10px] text-[var(--brand)] underline decoration-dotted underline-offset-4"
              >
                Learn how ranking works
              </a>
            </div>
          </details>

          {/* Refine card unchanged */}
          <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4">
            <h2 className="text-sm font-medium">Refine</h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <RefineButton onClick={() => submitQuery(query + " concise summary")}>Concise</RefineButton>
              <RefineButton onClick={() => submitQuery(query + " in-depth analysis")}>In-depth</RefineButton>
              <RefineButton onClick={() => submitQuery(query + " with sources")}>With sources</RefineButton>
              <RefineButton onClick={() => submitQuery(query + " step-by-step")}>Step-by-step</RefineButton>
            </div>
          </div>
        </aside>
      </div>

      <CommandMenu open={openPalette} onOpenChange={setOpenPalette} onRun={(q) => submitQuery(q)} />
    </div>
  )
}

function ResultCard({
  result,
  active,
  onHover,
  onOpen,
}: {
  result: {
    id: string
    title: string
    snippet: string
    url: string
    signals: string[]
    score: number
  }
  active?: boolean
  onHover?: () => void
  onOpen?: () => void
}) {
  return (
    <button
      type="button"
      onMouseEnter={onHover}
      onFocus={onHover}
      onClick={onOpen}
      className={cn(
        "group block w-full rounded-xl glass p-4 text-left transition-colors",
        active
          ? "shadow-[0_0_0_3px_color-mix(in_oklab,var(--brand)_30%,transparent)] border border-[var(--brand)]"
          : "border border-[var(--line)]/70 hover:border-[var(--brand)]/80",
      )}
      aria-describedby={`${result.id}-desc`}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-medium text-[var(--fg)]">
          <span className="inline-block align-middle">{result.title}</span>
          <span className="ml-2 align-middle text-[10px] text-[var(--muted)]">({Math.round(result.score)}%)</span>
        </h3>
        <span className="text-xs text-[var(--brand)] underline decoration-dotted underline-offset-4">Open ↗</span>
      </div>
      <p id={`${result.id}-desc`} className="mt-2 text-sm text-[var(--muted)]">
        {result.snippet}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {result.signals.map((s, i) => (
          <span
            key={s + i}
            className="animate-rise inline-flex items-center rounded-md border border-[var(--line)] bg-[var(--bg)] px-2 py-1 text-[10px] font-mono text-[var(--muted)]"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            {s}
          </span>
        ))}
      </div>
    </button>
  )
}

function SignalChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-md border border-[var(--line)] bg-[var(--bg)] px-2 py-1 text-[10px] font-mono text-[var(--muted)]">
      <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
      {label}
    </span>
  )
}

function RefineButton({
  onClick,
  children,
}: {
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-xs text-[var(--fg)] transition-colors hover:border-[var(--brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
    >
      {children}
    </button>
  )
}