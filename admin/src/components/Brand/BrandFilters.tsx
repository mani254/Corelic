"use client"
import { Filter, ListFilter } from "lucide-react"
import { useState } from "react"
import { FilterSearchInput } from "../FilterComponents/FilterSearchInput"
import { SelectFilter } from "../FilterComponents/SelectFilter"
import { SortFilterPopover } from "../FilterComponents/SelectFilterPoopover"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

export interface SortOption {
  label: string
  value: SortField
}
export type SortField = string

export type SortDirection = 'asc' | 'desc'

export interface SortState {
  label: string,
  field: SortField
  direction: SortDirection
}


const ToolTipForStatus = () => {
  return (<Tooltip>
    <TooltipTrigger asChild>
      <span className="text-muted-foreground"><ListFilter size={16} /></span>
    </TooltipTrigger>
    <TooltipContent side="bottom">
      <p>Status</p>
    </TooltipContent>
  </Tooltip>)
}

const ToolTipForPages = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="text-muted-foreground"><Filter size={16} /></span>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>No Of pages</p>
      </TooltipContent>
    </Tooltip>
  )

}
const BrandFilters = () => {
  const [search, setSearch] = useState<string>('')
  const [status, setStatus] = useState<string | null>(null)
  const [limit, setLimit] = useState('10')
  const [sort, setSort] = useState<SortState>({ label: "", field: '', direction: 'asc' })

  return (
    <div className="flex flex-wrap items-end gap-4 mt-3">
      <FilterSearchInput value={search} onChange={setSearch} placeholder="Search brands..." className="w-full max-w-[350px]" />

      <div className="ml-auto flex flex-wrap items-end gap-4">
        <SelectFilter
          value={status!}
          onChange={setStatus}
          placeholder="Status"
          iconComponent={<ToolTipForStatus />}
          options={[
            { label: 'All', value: null! },
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
          ]}
        />

        <SortFilterPopover
          value={sort}
          onChange={setSort}
          options={[
            { label: 'Created At', value: 'createdAt' },
            { label: 'Title', value: 'title' },
          ]}
        />

        <SelectFilter
          value={limit}
          onChange={setLimit}
          placeholder="Limit"
          iconComponent={<ToolTipForPages />}
          options={[
            { label: '10', value: '10' },
            { label: '20', value: '20' },
            { label: '50', value: '50' },
            { label: '100', value: '100' },
            { label: 'All', value: 'empty' },
          ]}
        />
      </div>
    </div>
  )
}

export default BrandFilters