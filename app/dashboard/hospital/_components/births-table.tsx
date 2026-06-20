"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  Baby,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  PlusIcon,
  FileDown,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface BirthRecord {
  id: string
  babyFirstName: string | null
  babyLastName: string | null
  babyGender: "MALE" | "FEMALE" | null
  birthDate: Date
  status: "DRAFT" | "SUBMITTED" | "PROCESSING" | "PENDING_APPROVAL" | "APPROVED" | "DECLINED"
  updatedAt: Date
  certificateNumber: string | null
  motherFirstName: string | null
  motherLastName: string | null
  cityHall: {
    name: string
  } | null
}

interface BirthsTableProps {
  births: BirthRecord[]
  initialStatusFilter?: string
}

const PAGE_SIZE_OPTIONS = [8, 15, 25, 50]

const statusColors: Record<
  BirthRecord["status"],
  { bg: string; text: string; border: string; label: string }
> = {
  DRAFT: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
    label: "Brouillon",
  },
  SUBMITTED: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    label: "Soumis",
  },
  PROCESSING: {
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-200 dark:border-indigo-800",
    label: "En cours",
  },
  PENDING_APPROVAL: {
    bg: "bg-purple-50 dark:bg-purple-950/30",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800",
    label: "En attente signature",
  },
  APPROVED: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800",
    label: "Approuvé",
  },
  DECLINED: {
    bg: "bg-red-50 dark:bg-red-950/30",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-200 dark:border-red-800",
    label: "Refusé",
  },
}

export function BirthsTable({ births, initialStatusFilter }: BirthsTableProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [cityHallFilter, setCityHallFilter] = React.useState<string>("all")

  React.useEffect(() => {
    if (initialStatusFilter) {
      setStatusFilter(
        initialStatusFilter === "draft" ? "DRAFT" :
        initialStatusFilter === "submitted" ? "in_progress" :
        initialStatusFilter === "approved" ? "APPROVED" :
        initialStatusFilter === "declined" ? "DECLINED" : "all"
      )
    } else {
      setStatusFilter("all")
    }
  }, [initialStatusFilter])

  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(8)
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set())

  // Dynamic city hall list from data
  const uniqueCityHalls = React.useMemo(() => {
    const list = new Set<string>()
    births.forEach((b) => {
      if (b.cityHall?.name) {
        list.add(b.cityHall.name)
      }
    })
    return Array.from(list).sort()
  }, [births])

  const hasActiveFilters = statusFilter !== "all" || cityHallFilter !== "all" || searchQuery !== ""

  const clearFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setCityHallFilter("all")
  }

  const filteredBirths = React.useMemo(() => {
    return births.filter((b) => {
      const babyName = `${b.babyFirstName ?? ""} ${b.babyLastName ?? ""}`.toLowerCase()
      const motherName = `${b.motherFirstName ?? ""} ${b.motherLastName ?? ""}`.toLowerCase()
      const matchesSearch =
        babyName.includes(searchQuery.toLowerCase()) ||
        motherName.includes(searchQuery.toLowerCase()) ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase())

      let matchesStatus = true
      if (statusFilter !== "all") {
        if (statusFilter === "in_progress") {
          matchesStatus = ["SUBMITTED", "PROCESSING", "PENDING_APPROVAL"].includes(b.status)
        } else {
          matchesStatus = b.status === statusFilter
        }
      }

      const matchesCityHall =
        cityHallFilter === "all" || b.cityHall?.name === cityHallFilter

      return matchesSearch && matchesStatus && matchesCityHall
    })
  }, [births, searchQuery, statusFilter, cityHallFilter])

  const totalPages = Math.ceil(filteredBirths.length / pageSize)

  const paginatedBirths = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredBirths.slice(startIndex, startIndex + pageSize)
  }, [filteredBirths, currentPage, pageSize])

  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, cityHallFilter, pageSize])

  const toggleSelectAll = () => {
    if (selectedRows.size === paginatedBirths.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(paginatedBirths.map((b) => b.id)))
    }
  }

  const toggleSelectRow = (id: string) => {
    const newSet = new Set(selectedRows)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setSelectedRows(newSet)
  }

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(date))
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      {/* Header controls exactly like dashboard-3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b">
        <div className="flex items-center gap-2">
          <Baby className="size-5 text-muted-foreground" />
          <span className="font-medium text-muted-foreground">
            Liste des déclarations
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-[220px] h-9"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "inline-flex items-center justify-center gap-2 h-9 px-3 rounded-md border text-sm font-medium cursor-pointer",
                "border-border hover:bg-background bg-muted shadow-xs",
              )}
            >
              <Filter className="size-4" />
              Filtrer
              {hasActiveFilters && (
                <span className="size-1.5 rounded-full bg-primary" />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[220px]">
              <DropdownMenuLabel className="text-muted-foreground text-xs font-medium">
                Statut
              </DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "all"}
                onCheckedChange={() => setStatusFilter("all")}
              >
                Tous les statuts
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "DRAFT"}
                onCheckedChange={() => setStatusFilter("DRAFT")}
              >
                Brouillons
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "in_progress"}
                onCheckedChange={() => setStatusFilter("in_progress")}
              >
                En cours de traitement
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "APPROVED"}
                onCheckedChange={() => setStatusFilter("APPROVED")}
              >
                Actes approuvés
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "DECLINED"}
                onCheckedChange={() => setStatusFilter("DECLINED")}
              >
                Refusés
              </DropdownMenuCheckboxItem>

              {uniqueCityHalls.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-muted-foreground text-xs font-medium">
                    Mairie
                  </DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={cityHallFilter === "all"}
                    onCheckedChange={() => setCityHallFilter("all")}
                  >
                    Toutes les mairies
                  </DropdownMenuCheckboxItem>
                  {uniqueCityHalls.map((cityHall) => (
                    <DropdownMenuCheckboxItem
                      key={cityHall}
                      checked={cityHallFilter === cityHall}
                      onCheckedChange={() => setCityHallFilter(cityHall)}
                    >
                      {cityHall}
                    </DropdownMenuCheckboxItem>
                  ))}
                </>
              )}

              {hasActiveFilters && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={clearFilters}
                    className="text-destructive font-medium cursor-pointer"
                  >
                    Effacer les filtres
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="hidden sm:block w-px h-6 bg-border" />

          <Button asChild size="sm" className="gap-2">
            <Link href="/dashboard/hospital/births/new">
              <PlusIcon className="size-4" />
              Nouveau
            </Link>
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    selectedRows.size === paginatedBirths.length &&
                    paginatedBirths.length > 0
                  }
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className="min-w-[100px] text-muted-foreground font-medium">
                ID Dossier
              </TableHead>
              <TableHead className="min-w-[180px] text-muted-foreground font-medium">
                Enfant
              </TableHead>
              <TableHead className="min-w-[180px] text-muted-foreground font-medium">
                Mère
              </TableHead>
              <TableHead className="min-w-[150px] text-muted-foreground font-medium">
                Mairie de destination
              </TableHead>
              <TableHead className="min-w-[120px] text-muted-foreground font-medium">
                Date de naissance
              </TableHead>
              <TableHead className="min-w-[120px] text-muted-foreground font-medium">
                Dernière modification
              </TableHead>
              <TableHead className="min-w-[120px] text-muted-foreground font-medium">
                Statut
              </TableHead>
              <TableHead className="w-[80px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedBirths.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="h-32 text-center text-muted-foreground"
                >
                  {hasActiveFilters
                    ? "Aucune déclaration ne correspond à vos filtres."
                    : "Aucune déclaration pour le moment."}
                </TableCell>
              </TableRow>
            ) : (
              paginatedBirths.map((birth) => {
                const babyFullName = `${birth.babyFirstName ?? ""} ${birth.babyLastName ?? ""}`.trim()
                const motherFullName = `${birth.motherFirstName ?? ""} ${birth.motherLastName ?? ""}`.trim()
                const initials = babyFullName
                  ? babyFullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
                  : "N"

                return (
                  <TableRow key={birth.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(birth.id)}
                        onCheckedChange={() => toggleSelectRow(birth.id)}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground font-medium">
                      #{birth.id.slice(-8)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar className="size-6 shrink-0">
                          <AvatarFallback className="text-[10px] font-semibold bg-muted">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground">
                          {babyFullName || (
                            <span className="text-muted-foreground italic text-xs">
                              Sans nom
                            </span>
                          )}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {motherFullName || "—"}
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-0.5 rounded-md bg-muted text-xs font-medium text-muted-foreground">
                        {birth.cityHall?.name ?? "Non assignée"}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {formatDate(birth.birthDate)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {formatDate(birth.updatedAt)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-medium",
                          statusColors[birth.status].bg,
                          statusColors[birth.status].text,
                          statusColors[birth.status].border
                        )}
                      >
                        {statusColors[birth.status].label}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {birth.status === "DRAFT" && (
                        <Link
                          href={`/dashboard/hospital/births/${birth.id}/edit`}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          Modifier
                        </Link>
                      )}
                      {birth.status === "APPROVED" && birth.certificateNumber && (
                        <a
                          href={`/api/certificate/${birth.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                        >
                          <FileDown className="size-3.5" />
                          Acte
                        </a>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination footer exactly like dashboard-3 */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t">
        <div className="flex items-center gap-6">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="size-4" />
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }

              if (i === 3 && totalPages > 5 && currentPage < totalPages - 2) {
                return (
                  <span key="ellipsis" className="px-3 py-1 text-sm select-none">
                    ...
                  </span>
                )
              }

              if (i === 4 && totalPages > 5) {
                pageNum = totalPages
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "secondary" : "ghost"}
                  size="icon-sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className={cn(currentPage === pageNum && "bg-muted")}
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground">
            Affichage de {filteredBirths.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} à{" "}
            {Math.min(currentPage * pageSize, filteredBirths.length)} sur{" "}
            {filteredBirths.length} entrées
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 h-8 px-2.5 rounded-md border border-border bg-background hover:bg-muted shadow-xs text-sm font-medium cursor-pointer">
              Afficher {pageSize}
              <ChevronDown className="size-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {PAGE_SIZE_OPTIONS.map((size) => (
                <DropdownMenuItem
                  key={size}
                  onClick={() => setPageSize(size)}
                  className={cn(pageSize === size && "bg-muted cursor-pointer")}
                >
                  Afficher {size}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
