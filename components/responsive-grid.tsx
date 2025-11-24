import type React from "react"
interface ResponsiveGridProps {
  children: React.ReactNode
  cols?: {
    default: number
    sm?: number
    md?: number
    lg?: number
  }
  gap?: string
  className?: string
}

export function ResponsiveGrid({
  children,
  cols = { default: 1, md: 2, lg: 3 },
  gap = "gap-6",
  className = "",
}: ResponsiveGridProps) {
  const gridClass = `grid ${gap} ${
    cols.sm ? `sm:grid-cols-${cols.sm}` : ""
  } ${cols.md ? `md:grid-cols-${cols.md}` : ""} ${
    cols.lg ? `lg:grid-cols-${cols.lg}` : ""
  } grid-cols-${cols.default} ${className}`

  return <div className={gridClass}>{children}</div>
}
