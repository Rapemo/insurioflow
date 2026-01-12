import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent } from './card';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  onRowClick,
  emptyMessage = 'No data available',
  className,
}: DataTableProps<T>) {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  // Mobile Card View
  const MobileCardView = () => (
    <div className="space-y-4 sm:hidden">
      {data.map((item) => (
        <Card 
          key={item.id} 
          className="touch-manipulation hover:shadow-md transition-shadow"
          onClick={() => onRowClick?.(item)}
        >
          <CardContent className="p-4">
            <div className="space-y-3">
              {columns.map((column) => (
                <div key={column.key} className="flex justify-between items-start">
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground min-w-0 flex-shrink-0">
                    {column.header}
                  </span>
                  <div className="text-xs sm:text-sm text-right flex-1 min-w-0 ml-2">
                    {column.render
                      ? column.render(item)
                      : (item as Record<string, unknown>)[column.key] as ReactNode}
                  </div>
                </div>
              ))}
              {onRowClick && (
                <div className="pt-2 border-t border-border">
                  <Button variant="ghost" size="sm" className="w-full touch-manipulation">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Desktop Table View
  const TableView = () => (
    <div className={cn('overflow-x-auto', className)}>
      <table className="data-table min-w-full">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={cn(column.className, 'whitespace-nowrap')}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              onClick={() => onRowClick?.(item)}
              className={cn(
                'hover:bg-muted/50 transition-colors',
                onRowClick && 'cursor-pointer'
              )}
            >
              {columns.map((column) => (
                <td key={column.key} className={cn(column.className, 'whitespace-nowrap')}>
                  {column.render
                    ? column.render(item)
                    : (item as Record<string, unknown>)[column.key] as ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* View Toggle for Mobile */}
      <div className="flex justify-end sm:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
          className="touch-manipulation"
        >
          {viewMode === 'table' ? 'Card View' : 'Table View'}
        </Button>
      </div>

      {/* Render based on view mode and screen size */}
      <div className="block sm:hidden">
        {viewMode === 'cards' ? <MobileCardView /> : <TableView />}
      </div>
      <div className="hidden sm:block">
        <TableView />
      </div>
    </div>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-border">
      <p className="text-sm text-muted-foreground order-2 sm:order-1">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center gap-2 order-1 sm:order-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="touch-manipulation min-h-9 min-w-9"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium px-2 py-1 min-w-8 text-center">
          {currentPage}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="touch-manipulation min-h-9 min-w-9"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
