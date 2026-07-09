"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SearchIcon, Loader2Icon, InboxIcon, SlidersHorizontalIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { StatusBadge } from "./status-badge"
import type { BirthStatus } from "@/types/birth"

interface QuickSearchResult {
  id: string
  childName: string | null
  motherName: string | null
  certificateNumber: string | null
  status: BirthStatus
  hospitalName: string
}

export function QuickSearch() {
  const router = useRouter()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<QuickSearchResult[]>([])
  const [loading, setLoading] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const term = query.trim()
    if (term.length < 2) {
      setResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    const timeout = setTimeout(() => {
      fetch(`/api/city-hall/search?q=${encodeURIComponent(term)}`)
        .then((res) => (res.ok ? res.json() : { results: [] }))
        .then((data) => setResults(data.results ?? []))
        .catch(() => setResults([]))
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(timeout)
  }, [query])

  React.useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

  function goToAdvancedSearch() {
    setOpen(false)
    router.push("/dashboard/city-hall/search")
  }

  const term = query.trim()
  const showDropdown = open && term.length >= 2

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false)
          }}
          placeholder="Rechercher un acte…"
          className="pl-8 pr-8 h-9 bg-background text-sm"
        />
        {loading && (
          <Loader2Icon className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 animate-spin text-muted-foreground" />
        )}
      </div>

      {showDropdown && (
        <div className="absolute inset-x-0 z-50 mt-1.5 rounded-lg border bg-popover shadow-lg overflow-hidden">
          {results.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-6 text-center px-4">
              <InboxIcon className="mb-1.5 size-5 text-muted-foreground/40" />
              <p className="text-xs text-muted-foreground">
                Aucun résultat pour « {term} ».
              </p>
            </div>
          )}

          {results.length > 0 && (
            <ul className="max-h-80 overflow-y-auto py-1">
              {results.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/dashboard/city-hall/births/${r.id}/details`}
                    onClick={() => setOpen(false)}
                    className="flex flex-col gap-1 px-3 py-2 text-xs hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium truncate min-w-0">
                        {r.childName ?? <span className="italic text-muted-foreground">Sans nom</span>}
                      </p>
                      <div className="shrink-0">
                        <StatusBadge status={r.status} />
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {r.motherName ? `Mère : ${r.motherName} · ` : ""}
                      {r.hospitalName}
                    </p>
                    {r.certificateNumber && (
                      <p className="text-[10px] font-mono text-muted-foreground/80 truncate">
                        {r.certificateNumber}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            onClick={goToAdvancedSearch}
            className="flex w-full items-center gap-2 border-t px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <SlidersHorizontalIcon className="size-3.5" />
            Recherche avancée
          </button>
        </div>
      )}
    </div>
  )
}
