import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight } from '@tabler/icons-react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Button } from './button';
import { cn } from './helpers';

interface Props {
  total: number;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
  page: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination = (props: Props) => {
  const { total, pageSize, onPageSizeChange, page, onPageChange, className } = props;
  const totalPages = Math.ceil(total / pageSize) || 1;
  return (
    <div className={cn('flex items-center justify-between px-2 space-x-6 lg:space-x-8', className)}>
      <div className="flex items-center justify-center text-sm font-medium">
        {`Page ${page} of ${totalPages}`}
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className="h-8 w-8 p-0 lg:flex"
          onClick={() => onPageChange(1)}
          disabled={page === 1}
        >
          <span className="sr-only">Go to first page</span>
          <IconChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          <span className="sr-only">Go to previous page</span>
          <IconChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
        >
          <span className="sr-only">Go to next page</span>
          <IconChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0 lg:flex"
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
        >
          <span className="sr-only">Go to last page</span>
          <IconChevronsRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Select defaultValue="25" onValueChange={(value) => onPageSizeChange(Number(value))}>
          <SelectTrigger className="w-[80px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 25, 50, 100].map((value) => (
              <SelectItem key={value} value={`${value}`}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export { Pagination };
