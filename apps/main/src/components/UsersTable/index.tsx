'use client'

import { useState } from 'react';
import { IconAdjustments } from '@tabler/icons-react';
import { useDebouncedState } from '@mantine/hooks';
import { RenderIf } from '@dealo/ui';

import { trpc } from 'utils/trpc';
import UserAvatar from 'components/UserAvatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'components/ui/popover';
import { Button } from 'components/ui/button';
import { Label } from 'components/ui/label';
import { RadioGroup, RadioGroupItem } from 'components/ui/radio-group';
import Pagination from 'components/ui/pagination';
import { Input } from 'components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'components/ui/table';
import { Badge } from 'components/ui/badge';

const UsersTable = () => {
  const [query, setQuery] = useDebouncedState('', 200);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [isSetup, setIsSetup] = useState<string>('all');

  const {
    data: { results, count } = { results: [], count: 0 },
  } = trpc.user.listUsers.useQuery({ query, page, pageSize, isSetup: isSetup as any }, { keepPreviousData: true });

  const handleFilterChange = (value: string) => {
    setIsSetup(value);
    setPage(1);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search users"
          className="w-[280px]"
          onChange={(e) => setQuery(e.target.value)}
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost">
              <IconAdjustments />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-[200px]">
            <div className="flex flex-col gap-4">
              <span className="text text-sm font-semibold">Is Setup</span>
              <RadioGroup
                name="status"
                value={isSetup}
                onValueChange={(value: string) => handleFilterChange(value)}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="r1" />
                    <Label htmlFor="r1">All</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="r2" />
                    <Label htmlFor="r2">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="r3" />
                    <Label htmlFor="r3">No</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead style={{ width: '100px' }}>Is Setup</TableHead>
            <TableHead style={{ width: '130px' }}>Widgets</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <UserAvatar user={user} />
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold">
                      {user.name ?? 'Anonymous'}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {user.email ?? 'no email'}
                    </span>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <RenderIf
                  condition={user.isSetup}
                  fallback={
                    <Badge variant="secondary">No</Badge>
                  }
                >
                  <Badge variant="success">Yes</Badge>
                </RenderIf>
              </TableCell>

              <TableCell>{user.isSetup ? user._count.widgets : 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between py-6 sticky bottom-0 bg-white">
        <span className="text-sm font-medium">{`Total: ${count}`}</span>
        <Pagination
          page={page}
          onPageChange={setPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          total={count}
        />
      </div>
    </>
  );
}

export default UsersTable;
