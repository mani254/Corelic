import clsx from 'clsx'
import { Search } from 'lucide-react'
import { useEffect, useRef } from 'react'

type FilterSearchInputProps = {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  className?: string
  iconSize?: number
}

export const FilterSearchInput = ({
  value,
  onChange,
  placeholder = 'Search...',
  className,
  iconSize = 18,
}: FilterSearchInputProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Optional: blur input on Escape
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        const input = wrapperRef.current?.querySelector('input')
        input?.blur()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div
      ref={wrapperRef}
      className={clsx(
        "relative flex items-center border border-input rounded-md px-3 py-2 bg-white shadow-sm transition-colors focus-within:ring-1 focus-within:border-orange-100 focus-within:ring-orange-100",
        className
      )}
    >
      <Search
        size={iconSize}
        className="text-muted-foreground min-w-[18px] mr-2"
        aria-hidden="true"
      />
      <input
        type="text"
        className="w-full text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
        role="searchbox"
        aria-label="Search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
