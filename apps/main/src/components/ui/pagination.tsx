import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight } from '@tabler/icons-react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Button } from './button';

interface Props {
  total: number;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
  page: number;
  onPageChange: (page: number) => void;
}

const Pagination = (props: Props) => {
  const { total, pageSize, onPageSizeChange, page, onPageChange } = props;
  const totalPages = Math.ceil(total / pageSize);
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
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
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
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
      </div>
    </div>
  );
};

export default Pagination;
