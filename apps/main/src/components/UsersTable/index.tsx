'use client'

import { useState } from 'react';
import { CSVLink } from 'react-csv';
import { IconAdjustments, IconDatabaseExport } from '@tabler/icons-react';
import {
  RenderIf,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  Label,
  RadioGroup,
  RadioGroupItem,
  Pagination,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
} from '@dealo/ui';

import { trpc } from 'utils/trpc';
import { useDebounce } from 'utils/hooks/useDebounce';
import UserAvatar from 'components/UserAvatar';

const UsersTable = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [isSetup, setIsSetup] = useState<string | undefined>();
  const [hasLegacy, setHasLegacy] = useState<string | undefined>();
  const [query, setQuery] = useState('');

  const { debounceCall } = useDebounce(250);

  const {
    data: { results, count } = { results: [], count: 0 },
  } = trpc.user.listUsers.useQuery(
    { query, page, pageSize, isSetup: isSetup as any, hasLegacy: hasLegacy as any },
    { keepPreviousData: true },
  );

  const csvData: string[][] = [['name', 'email']].concat(results.map((user) => ([user.name || '-', user.email || '-'])));

  const handleSearch = (value: string) => {
    debounceCall(() => setQuery(value));
  }

  const handleFilterChange = (value: string) => {
    const [filter, filterValue] = value.split('-');

    if (filter === 'setup') {
      setIsSetup(filterValue);
      setHasLegacy(undefined);
    } else {
      setHasLegacy(filterValue);
      setIsSetup(undefined);
    }

    setPage(1);
  };

  const clearFilters = () => {
    setIsSetup(undefined);
    setHasLegacy(undefined);
    setPage(1);
  };

  const resolveStatusFilter = () => {
    if (isSetup) {
      return isSetup === 'yes' ? 'setup-yes' : 'setup-no';
    }

    if (hasLegacy) {
      return hasLegacy === 'yes' ? 'legacy-yes' : 'legacy-no';
    }

    return 'none';
  };

  console.log(resolveStatusFilter());

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search users"
          className="w-[280px]"
          onChange={(e) => handleSearch(e.target.value)}
        />
        <div className="flex flex-row ml-auto">
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
                  name="has-setup"
                  value={resolveStatusFilter()}
                  onValueChange={(value: string) => handleFilterChange(value)}
                >
                  <div className="flex flex-col gap-2">
                    <span>Is Setup</span>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="setup-yes" id="r2"/>
                      <Label htmlFor="r2">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="setup-no" id="r3"/>
                      <Label htmlFor="r3">No</Label>
                    </div>
                    <span>Has legacy setup</span>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="legacy-yes" id="r4"/>
                      <Label htmlFor="r4">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="legacy-no" id="r5"/>
                      <Label htmlFor="r5">No</Label>
                    </div>
                  </div>
                </RadioGroup>
                <Button variant="outline" size="sm" onClick={clearFilters}>Clear</Button>
              </div>
            </PopoverContent>
          </Popover>
          <CSVLink data={csvData} filename="dealo_users.csv" target="_blank">
            <Button variant="ghost">
              <IconDatabaseExport stroke={1} />
            </Button>
          </CSVLink>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead style={{ width: '100px' }}>Is Setup</TableHead>
            <TableHead style={{ width: '100px' }}>LEgacy</TableHead>
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

              <TableCell>
                <RenderIf
                  condition={user.hasLegacy}
                  fallback={
                    <Badge color="secondary">No</Badge>
                  }
                >
                  <Badge color="success">Yes</Badge>
                </RenderIf>
              </TableCell>

              <TableCell>{user.isSetup ? user._count.widgets : 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between py-6 sticky bottom-0">
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
