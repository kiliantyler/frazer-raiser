import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface TablePaginationProps {
  currentPage: number
  pageCount: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function TablePagination({ currentPage, pageCount, totalItems, pageSize, onPageChange }: TablePaginationProps) {
  const start = (currentPage - 1) * pageSize
  const end = Math.min(start + pageSize, totalItems)

  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <div>
        Showing {totalItems === 0 ? 0 : start + 1} to {end} of {totalItems} results
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious className="cursor-pointer" onClick={() => onPageChange(Math.max(1, currentPage - 1))} />
          </PaginationItem>
          {Array.from({ length: pageCount })
            .slice(0, 5)
            .map((_, i) => {
              const index = i + 1
              return (
                <PaginationItem key={index}>
                  <PaginationLink
                    className="cursor-pointer"
                    isActive={index === currentPage}
                    onClick={() => onPageChange(index)}>
                    {index}
                  </PaginationLink>
                </PaginationItem>
              )
            })}
          {pageCount > 5 ? (
            <PaginationItem>
              <span className="px-2">…</span>
            </PaginationItem>
          ) : null}
          <PaginationItem>
            <PaginationNext
              className="cursor-pointer"
              onClick={() => onPageChange(Math.min(pageCount, currentPage + 1))}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
