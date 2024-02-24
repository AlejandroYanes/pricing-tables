'use client'

import { useState } from 'react';
import { CSVLink } from 'react-csv';
import { IconDatabaseExport } from '@tabler/icons-react';
import {
  Button,
  Pagination,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Select,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectTrigger,
  TooltipTrigger,
  TooltipContent,
  Tooltip,
  TooltipProvider,
} from '@dealo/ui';
import { formatDate } from '@dealo/helpers';

import { trpc } from 'utils/trpc';
import { useDebounce } from 'utils/hooks/use-debounce';
import UserAvatar from 'components/user-avatar';

type Status = 'setup' | 'legacy' | 'none' | 'all';

const UsersTable = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [status, setStatus] = useState<Status>('all');
  const [query, setQuery] = useState('');

  const { debounceCall } = useDebounce(250);

  const {
    data: { results, count } = { results: [], count: 0 },
  } = trpc.user.listUsers.useQuery(
    { query, page, pageSize, status },
    { keepPreviousData: true },
  );

  const csvData: string[][] = [['name', 'email', 'started_on']].concat(
    results.map((user) => ([
      user.name || '-',
      user.email || '-',
      user.createdAt ? formatDate(user.createdAt) : '-',
    ]))
  );

  const handleSearch = (value: string) => {
    debounceCall(() => setQuery(value));
  }

  const handleFilterChange = (value: string) => {
    setStatus(value as Status);
    setPage(1);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search users"
          className="w-[280px]"
          onChange={(e) => handleSearch(e.target.value)}
        />
        <div data-el="top-right" className="flex flex-row ml-auto gap-4">
          <Select onValueChange={handleFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue className="capitalize">Status: {status}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="setup">Is Setup</SelectItem>
              <SelectItem value="legacy">Has legacy setup</SelectItem>
              <SelectItem value="none">Has no setup</SelectItem>
            </SelectContent>
          </Select>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <CSVLink data={csvData} filename="dealo_users.csv" target="_blank">
                  <Button variant="outline-ghost" className="px-2">
                    <IconDatabaseExport stroke={1} />
                  </Button>
                </CSVLink>
              </TooltipTrigger>
              <TooltipContent>
                Export currently listed users to CSV
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead className="text-center" style={{ width: '170px' }}>Status</TableHead>
            <TableHead className="text-center" style={{ width: '100px' }}>Widgets</TableHead>
            <TableHead className="text-center" style={{ width: '130px' }}>Started On</TableHead>
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

              <TableCell className="text-center">
                {user.isSetup ? <Badge variant="default">Is Setup</Badge> : null}
                {user.hasLegacy ? <Badge variant="secondary">Has legacy setup</Badge> : null}
                {!user.isSetup && !user.hasLegacy ? <Badge variant="outline">Has no setup</Badge> : null}
              </TableCell>

              <TableCell className="text-center">{user.isSetup ? user._count.widgets : 'N/A'}</TableCell>

              <TableCell className="text-center">{formatDate(user.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between py-6 sticky bottom-0 bg-background">
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
