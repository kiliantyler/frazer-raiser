import * as React from 'react'

interface UseTableFilteringOptions<T> {
  data: T[]
  searchFields: (item: T) => string[]
  pageSize?: number
}

interface UseTableFilteringResult<T> {
  // Search
  query: string
  setQuery: (query: string) => void

  // Pagination
  page: number
  setPage: (page: number) => void
  pageSize: number
  pageCount: number

  // Results
  filteredData: T[]
  paginatedData: T[]
}

export function useTableFiltering<T>({
  data,
  searchFields,
  pageSize = 10,
}: UseTableFilteringOptions<T>): UseTableFilteringResult<T> {
  const [query, setQuery] = React.useState('')
  const [page, setPage] = React.useState(1)

  const filteredData = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return data

    return data.filter(item => {
      const fields = searchFields(item)
      return fields.some(field => field.toLowerCase().includes(q))
    })
  }, [data, query, searchFields])

  const pageCount = Math.max(1, Math.ceil(filteredData.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * pageSize
  const paginatedData = filteredData.slice(start, start + pageSize)

  // Reset to page 1 when query changes
  React.useEffect(() => {
    setPage(1)
  }, [query])

  return {
    query,
    setQuery,
    page: currentPage,
    setPage,
    pageSize,
    pageCount,
    filteredData,
    paginatedData,
  }
}
