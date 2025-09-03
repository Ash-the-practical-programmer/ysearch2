import type { Metadata } from "next"
import SearchOrchestrator from "@/components/search-orchestrator"
import { SearchInterface } from "@/components/search-interface"
import { GEPADashboard } from "@/components/gepa-dashboard"

export const metadata: Metadata = {
  title: "Symphonic Search — Augmented Intelligence",
  description: "A sleek, glassy portal where discovery feels natural and beautifully simple.",
}

export default function Page() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-[var(--bg)] text-[var(--fg)]">
      {/* Background: choose aura or landscape by swapping className */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-aura" />
      {/* Optional: dreamy backdrop */}
      {/* <div aria-hidden className="absolute inset-0 -z-20 bg-landscape opacity-[0.25]" /> */}

      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        {/* Minimal brand mark, can be replaced with your logo */}
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-full border border-[var(--line)]/70 bg-transparent" />
          <span className="text-sm text-[var(--muted)]">Symphonic</span>
        </div>
        <div className="flex items-center gap-2">
          <a href="#" className="btn-ghost rounded-full px-3 py-1 text-xs" aria-label="View examples">
            Examples
          </a>
          <a href="#" className="btn-brand rounded-full px-3 py-1 text-xs" aria-label="Get started">
            Get started
          </a>
        </div>
      </header>

      <section aria-label="Search" className="relative">
        <div className="mx-auto max-w-3xl px-4">
          {/* Glass panel with big serif headline and pill input inside orchestrator */}
          <div className="glass rounded-2xl p-5 md:p-6">
            <h1 className="font-heading text-pretty text-2xl md:text-3xl">Imagine your own worlds</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Type. Explore. Share. It feels like the web—only sharper.
            </p>
            <div className="mt-4">
              <SearchOrchestrator />
            </div>
            
            {/* Add GEPA-Enhanced Search */}
            <div className="mt-8 border-t border-[var(--line)]/30 pt-6">
              <h2 className="text-lg font-semibold mb-4">Enhanced Search with AI Optimization</h2>
              <div className="rounded-lg border border-[var(--line)]/50 p-4">
                <SearchInterface />
              </div>
            </div>
            
            {/* GEPA Dashboard */}
            <div className="mt-8 border-t border-[var(--line)]/30 pt-6">
              <GEPADashboard />
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto mt-12 max-w-5xl px-6 pb-10 text-center text-xs text-[var(--muted)]">
        Press "/" to focus • Cmd/Ctrl+K for command palette
      </footer>
    </main>
  )
}