import clsx from 'clsx'
import { Search } from 'lucide-react'
import { useRef, useState } from 'react'

type FilterSearchInputProps = {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  className?: string
  iconSize?: number
  debounceDelay?: number
}

export const FilterSearchInput = ({
  value,
  onChange,
  placeholder = 'Search...',
  className,
  iconSize = 18,
  debounceDelay = 300,
}: FilterSearchInputProps) => {
  const [searchValue, setSearchValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  // store timeout id between renders
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const handleChange = (val: string) => {
    setSearchValue(val)

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      onChange(val)
    }, debounceDelay)
  }

  return (
    <div
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
        ref={inputRef}
        type="text"
        className="w-full text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
        role="searchbox"
        aria-label="Search"
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            inputRef.current?.blur()
          }
        }}
      />
    </div>
  )
}
