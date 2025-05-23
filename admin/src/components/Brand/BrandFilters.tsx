"use client"
import { Filter, ListFilter } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useQueryParams } from "../../hooks/useQueryState"
import { FilterSearchInput } from "../FilterComponents/FilterSearchInput"
import { SelectFilter } from "../FilterComponents/SelectFilter"
import { SortFilterPopover } from "../FilterComponents/SelectFilterPoopover"
import Pagination from "../ReusableComponents/Pagination"
import { Button } from "../ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

export interface SortOption {
  label: string
  value: SortField
}
export type SortField = string

export type SortDirection = 'asc' | 'desc' | ''

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
        <p>No Of Items</p>
      </TooltipContent>
    </Tooltip>
  )
}

const sortOptions: SortOption[] = [
  { label: "Sort By", value: "" },
  { label: 'Created At', value: 'createdAt' },
  { label: 'Title', value: 'title' },
];

const BrandFilters = ({ totalItems }: { totalItems: number }) => {

  const searchParams = useSearchParams()
  const { getParam, setBulk, resetParams } = useQueryParams({ page: "1", limit: "10" })

  const parseNumber = (value: string | null): number | null => {
    if (!value) return null
    const num = parseInt(value)
    return isNaN(num) ? null : num
  }

  const [search, setSearch] = useState<string>("")
  const [status, setStatus] = useState<string | null>("")
  const [limit, setLimit] = useState<number | null>(10)
  const [sort, setSort] = useState<SortState>({
    label: '',
    field: '',
    direction: '',
  })
  const [page, setPage] = useState<number>(1)

  useEffect(() => {
    const field = getParam('sortBy') || '';
    const direction = (getParam('orderBy') as SortDirection) || '';

    const matchedLabel = sortOptions.find(opt => opt.value === field)?.label || '';

    setSearch(getParam('search'));
    setStatus(getParam('status'));
    setLimit(parseNumber(getParam('limit')) || null);
    setSort({
      label: matchedLabel,
      field,
      direction,
    });
    setPage(parseNumber(getParam('page')) || 1);
  }, [getParam, searchParams]);

  const handleSearch = (val: string) => {
    if (val) {
      setBulk({ "search": val, "page": 1 })
    } else {
      setBulk({ search: null })
    }
  }

  const handleStatus = (val: never) => {
    setBulk({ 'status': val, "page": 1 })
  }

  const handleSort = (val: SortState) => {
    setBulk({ "sortBy": val.field, "orderBy": val.direction, "page": 1 })
  }

  const handleLimit = (val: number) => {
    setBulk({ "limit": val, "page": "1" })
  }

  const handlePage = (val: number) => {
    setBulk({ "page": val })
  }

  const handleResetFilter = () => {
    resetParams()
  }

  return (
    <div className="flex flex-wrap items-end gap-4 mt-3">
      <FilterSearchInput value={search} onChange={handleSearch} placeholder="Search brands..." className="w-full max-w-[350px]" />

      <div className="ml-auto flex flex-wrap items-end gap-4">

        <SelectFilter
          value={status!}
          onChange={handleStatus}
          placeholder="Status"
          iconComponent={<ToolTipForStatus />}
          options={[
            { label: 'All', value: null },
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
          ]}
        />

        <SortFilterPopover
          value={sort}
          onChange={handleSort}
          options={sortOptions}
        />

        <SelectFilter
          value={limit!}
          onChange={handleLimit}
          placeholder="Limit"
          iconComponent={<ToolTipForPages />}
          options={[
            { label: '10', value: 10 },
            { label: '20', value: 20 },
            { label: '50', value: 50 },
            { label: '100', value: 100 },
            { label: 'All', value: null },
          ]}
        />

        <Button onClick={handleResetFilter} variant="outline">Reset</Button>

        <div className="fixed left-1/2 bottom-10 -translate-x-1/2 bg-white shadow-sm px-5 py-1 shadow-gray-300 rounded-2xl">
          <Pagination totalItems={totalItems} limit={limit} currentPage={page} setPage={handlePage} />
        </div>

      </div>
    </div>
  )
}

export default BrandFilters