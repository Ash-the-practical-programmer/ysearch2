"use client"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

const QUICK = [
  "Open settings",
  "Clear recent searches",
  "Show trending topics",
  "Search: latest AI breakthroughs",
  "Search: performance tuning 2025",
]

export function CommandMenu({
  open,
  onOpenChange,
  onRun,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onRun: (q: string) => void
}) {
  const run = (label: string) => {
    if (label.startsWith("Search: ")) {
      onRun(label.replace("Search: ", ""))
      onOpenChange(false)
      return
    }
    if (label === "Clear recent searches") {
      try {
        localStorage.removeItem("recent-searches")
      } catch {}
      onOpenChange(false)
      return
    }
    if (label === "Show trending topics") {
      onRun("Trending topics")
      onOpenChange(false)
      return
    }
    if (label === "Open settings") {
      // Placeholder: could open a settings dialog in future
      onOpenChange(false)
    }
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command>
        <CommandInput placeholder="Type a command or search…" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="Quick actions">
            {QUICK.map((q) => (
              <CommandItem key={q} onSelect={() => run(q)}>
                {q}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Suggestions">
            {[
              "Futuristic UI inspiration",
              "Design tokens best practices",
              "Knowledge graphs",
              "Edge search architectures",
            ].map((s) => (
              <CommandItem key={s} onSelect={() => run(`Search: ${s}`)}>
                {s}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}