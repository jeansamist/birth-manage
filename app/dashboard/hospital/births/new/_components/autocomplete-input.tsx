"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface AutocompleteInputProps extends React.ComponentPropsWithoutRef<"input"> {
  value: string
  onChangeValue: (val: string) => void
  suggestions: string[]
}

export function AutocompleteInput({
  value,
  onChangeValue,
  suggestions,
  className,
  placeholder,
  ...props
}: AutocompleteInputProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const filtered = React.useMemo(() => {
    if (!value) return suggestions.slice(0, 5)
    return suggestions
      .filter((s) => s.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 5)
  }, [value, suggestions])

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative w-full">
      <Input
        value={value}
        onChange={(e) => {
          onChangeValue(e.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        className={cn("h-10", className)}
        placeholder={placeholder}
        {...props}
      />
      {isOpen && filtered.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-md max-h-48 overflow-y-auto p-1 animate-in fade-in slide-in-from-top-1 duration-100">
          {filtered.map((item) => (
            <li key={item}>
              <button
                type="button"
                onClick={() => {
                  onChangeValue(item)
                  setIsOpen(false)
                }}
                className="w-full text-left px-3 py-1.5 text-xs rounded hover:bg-muted hover:text-accent-foreground cursor-pointer font-medium"
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
