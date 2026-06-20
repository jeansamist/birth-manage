"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import {
  FileText,
  MoreHorizontal,
  BarChart3,
  LineChart as LineChartIcon,
  AreaChart as AreaChartIcon,
  Calendar,
  Grid3X3,
  RefreshCw,
  Check,
} from "lucide-react"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"

interface ChartDataItem {
  month: string
  series1: number
  series2: number
}

interface DashboardChartProps {
  title: string
  series1Label: string
  series2Label: string
  data: ChartDataItem[]
}

type ChartType = "bar" | "line" | "area"
type TimePeriod = "3months" | "6months" | "year"

const periodLabels: Record<TimePeriod, string> = {
  "3months": "Derniers 3 mois",
  "6months": "Derniers 6 mois",
  year: "Année complète",
}

export function DashboardChart({
  title,
  series1Label,
  series2Label,
  data,
}: DashboardChartProps) {
  const { theme } = useTheme()
  const [chartType, setChartType] = useState<ChartType>("line")
  const [period, setPeriod] = useState<TimePeriod>("year")
  const [showGrid, setShowGrid] = useState(true)
  const [showSeries1, setShowSeries1] = useState(true)
  const [showSeries2, setShowSeries2] = useState(true)
  const [smoothCurve, setSmoothCurve] = useState(true)

  const isDark = theme === "dark"
  const axisColor = isDark ? "#71717a" : "#a1a1aa"
  const gridColor = isDark ? "#27272a" : "#e5e7eb"
  
  // Custom colors matching dashboard-3
  const series1Color = "#2d9f75" // Emerald-500
  const series2Color = isDark ? "#6366f1" : "#162664" // Indigo / Navy

  const chartData = (() => {
    switch (period) {
      case "3months":
        return data.slice(-3)
      case "6months":
        return data.slice(-6)
      default:
        return data
    }
  })()

  const resetToDefault = () => {
    setChartType("line")
    setPeriod("year")
    setShowGrid(true)
    setShowSeries1(true)
    setShowSeries2(true)
    setSmoothCurve(true)
  }

  function CustomTooltip({
    active,
    payload,
    label,
  }: any) {
    if (!active || !payload?.length) return null

    const dataS1 = payload.find((p: any) => p.dataKey === "series1")
    const dataS2 = payload.find((p: any) => p.dataKey === "series2")
    const s1Value = dataS1?.value || 0
    const s2Value = dataS2?.value || 0

    return (
      <div className="bg-popover border border-border rounded-lg p-3 shadow-lg min-w-[160px]">
        <p className="text-sm font-semibold text-foreground mb-3">{label}</p>
        <div className="space-y-2">
          {showSeries1 && (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full" style={{ backgroundColor: series1Color }} />
                <span className="text-xs text-muted-foreground">{series1Label}</span>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {s1Value}
              </span>
            </div>
          )}
          {showSeries2 && (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full" style={{ backgroundColor: series2Color }} />
                <span className="text-xs text-muted-foreground">{series2Label}</span>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {s2Value}
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 border-b">
        <div className="flex items-center gap-2">
          <FileText className="size-5 text-muted-foreground" />
          <span className="font-medium text-muted-foreground">
            {title}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="hidden sm:flex items-center gap-4">
            {showSeries1 && (
              <div className="flex items-center gap-1.5">
                <div className="size-3 rounded-full" style={{ backgroundColor: series1Color }} />
                <span className="text-xs font-medium text-muted-foreground">
                  {series1Label}
                </span>
              </div>
            )}
            {showSeries2 && (
              <div className="flex items-center gap-1.5">
                <div className="size-3 rounded-full" style={{ backgroundColor: series2Color }} />
                <span className="text-xs font-medium text-muted-foreground">
                  {series2Label}
                </span>
              </div>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center size-8 rounded-md hover:bg-muted cursor-pointer">
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-muted-foreground text-xs font-medium">
                Type de graphique
              </DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setChartType("bar")} className="cursor-pointer">
                <BarChart3 className="size-4 mr-2" />
                Histogramme
                {chartType === "bar" && (
                  <Check className="size-4 ml-auto" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setChartType("line")} className="cursor-pointer">
                <LineChartIcon className="size-4 mr-2" />
                Courbes
                {chartType === "line" && (
                  <Check className="size-4 ml-auto" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setChartType("area")} className="cursor-pointer">
                <AreaChartIcon className="size-4 mr-2" />
                Aires
                {chartType === "area" && (
                  <Check className="size-4 ml-auto" />
                )}
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer">
                  <Calendar className="size-4 mr-2" />
                  Période
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {(Object.keys(periodLabels) as TimePeriod[]).map((key) => (
                    <DropdownMenuItem key={key} onClick={() => setPeriod(key)} className="cursor-pointer">
                      {periodLabels[key]}
                      {period === key && (
                        <Check className="size-4 ml-auto" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator />

              <DropdownMenuLabel className="text-muted-foreground text-xs font-medium">
                Affichage
              </DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={showGrid}
                onCheckedChange={setShowGrid}
                className="cursor-pointer"
              >
                <Grid3X3 className="size-4 mr-2" />
                Afficher le quadrillage
              </DropdownMenuCheckboxItem>

              {(chartType === "line" || chartType === "area") && (
                <DropdownMenuCheckboxItem
                  checked={smoothCurve}
                  onCheckedChange={setSmoothCurve}
                  className="cursor-pointer"
                >
                  <AreaChartIcon className="size-4 mr-2" />
                  Lissage des courbes
                </DropdownMenuCheckboxItem>
              )}

              <DropdownMenuSeparator />

              <DropdownMenuLabel className="text-muted-foreground text-xs font-medium">
                Séries de données
              </DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={showSeries1}
                onCheckedChange={setShowSeries1}
                className="cursor-pointer"
              >
                <div className="size-3 rounded-full mr-2" style={{ backgroundColor: series1Color }} />
                {series1Label}
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                checked={showSeries2}
                onCheckedChange={setShowSeries2}
                className="cursor-pointer"
              >
                <div className="size-3 rounded-full mr-2" style={{ backgroundColor: series2Color }} />
                {series2Label}
              </DropdownMenuCheckboxItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={resetToDefault} className="cursor-pointer">
                <RefreshCw className="size-4 mr-2" />
                Réinitialiser
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="h-[250px] sm:h-[280px] px-4 py-6">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "bar" ? (
            <BarChart data={chartData} barGap={4}>
              <defs>
                <linearGradient
                  id="series1Gradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={series1Color} stopOpacity={1} />
                  <stop offset="100%" stopColor={series1Color} stopOpacity={0.6} />
                </linearGradient>
                <linearGradient
                  id="series2Gradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={series2Color} stopOpacity={1} />
                  <stop offset="100%" stopColor={series2Color} stopOpacity={0.6} />
                </linearGradient>
              </defs>
              {showGrid && (
                <CartesianGrid
                  strokeDasharray="0"
                  stroke={gridColor}
                  vertical={false}
                />
              )}
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: axisColor, fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: axisColor, fontSize: 10 }}
                width={30}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: isDark ? "#27272a" : "#f4f4f5", radius: 4 }}
              />
              {showSeries1 && (
                <Bar
                  dataKey="series1"
                  fill="url(#series1Gradient)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={22}
                />
              )}
              {showSeries2 && (
                <Bar
                  dataKey="series2"
                  fill="url(#series2Gradient)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={22}
                />
              )}
            </BarChart>
          ) : chartType === "line" ? (
            <LineChart data={chartData}>
              {showGrid && (
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={gridColor}
                  vertical={true}
                />
              )}
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: axisColor, fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: axisColor, fontSize: 10 }}
                width={30}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: isDark ? "#3f3f46" : "#d4d4d8" }}
              />
              {showSeries1 && (
                <Line
                  type={smoothCurve ? "monotone" : "linear"}
                  dataKey="series1"
                  stroke={series1Color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 6,
                    fill: series1Color,
                    stroke: "white",
                    strokeWidth: 2,
                  }}
                />
              )}
              {showSeries2 && (
                <Line
                  type={smoothCurve ? "monotone" : "linear"}
                  dataKey="series2"
                  stroke={series2Color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 6,
                    fill: series2Color,
                    stroke: "white",
                    strokeWidth: 2,
                  }}
                />
              )}
            </LineChart>
          ) : (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient
                  id="series1AreaGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={series1Color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={series1Color} stopOpacity={0.05} />
                </linearGradient>
                <linearGradient
                  id="series2AreaGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={series2Color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={series2Color} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              {showGrid && (
                <CartesianGrid
                  strokeDasharray="0"
                  stroke={gridColor}
                  vertical={false}
                />
              )}
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: axisColor, fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: axisColor, fontSize: 10 }}
                width={30}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: isDark ? "#3f3f46" : "#d4d4d8" }}
              />
              {showSeries1 && (
                <Area
                  type={smoothCurve ? "monotone" : "linear"}
                  dataKey="series1"
                  stroke={series1Color}
                  strokeWidth={2}
                  fill="url(#series1AreaGradient)"
                />
              )}
              {showSeries2 && (
                <Area
                  type={smoothCurve ? "monotone" : "linear"}
                  dataKey="series2"
                  stroke={series2Color}
                  strokeWidth={2}
                  fill="url(#series2AreaGradient)"
                />
              )}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
