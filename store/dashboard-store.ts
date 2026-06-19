"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type LayoutDensity = "compact" | "default" | "comfortable"

interface DashboardState {
  layoutDensity: LayoutDensity
  showAlertBanner: boolean
  showStatsCards: boolean
  showTable: boolean
  setLayoutDensity: (density: LayoutDensity) => void
  setShowAlertBanner: (show: boolean) => void
  setShowStatsCards: (show: boolean) => void
  setShowTable: (show: boolean) => void
  resetLayout: () => void
}

const defaults = {
  layoutDensity: "default" as LayoutDensity,
  showAlertBanner: true,
  showStatsCards: true,
  showTable: true,
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      ...defaults,
      setLayoutDensity: (layoutDensity) => set({ layoutDensity }),
      setShowAlertBanner: (showAlertBanner) => set({ showAlertBanner }),
      setShowStatsCards: (showStatsCards) => set({ showStatsCards }),
      setShowTable: (showTable) => set({ showTable }),
      resetLayout: () => set(defaults),
    }),
    { name: "birth-manage-dashboard" }
  )
)
