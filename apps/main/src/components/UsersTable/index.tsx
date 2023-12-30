'use client'

import { useState } from 'react';
import { CSVLink } from 'react-csv';
import { IconAdjustments } from '@tabler/icons-react';
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
  const [isSetup, setIsSetup] = useState<string>('all');
  const [query, setQuery] = useState('');

  const { debounceCall } = useDebounce(250);
  const [isSetup, setIsSetup] = useState<string | undefined>();
  const [hasLegacy, setHasLegacy] = useState<string | undefined>();

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

    return undefined;
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search users"
          className="w-[280px]"
          onChange={(e) => handleSearch(e.target.value)}
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
      <Group spacing="xs">
        <Popover width={200} position="bottom-end">
          <Popover.Target>
            <Indicator
              withBorder
              position="bottom-center"
              size={12}
              disabled={resolveStatusFilter() === undefined}
            >
              <ActionIcon variant="filled" size="lg">
                <IconAdjustmentsAlt stroke={1} />
              </ActionIcon>
            </Indicator>
          </Popover.Target>
          <Popover.Dropdown>
            <Stack>
              <Radio.Group
                name="has-setup"
                value={resolveStatusFilter()}
                onChange={(value: string) => handleFilterChange(value)}
              >
                <Stack spacing="xs">
                  <Text size="sm" weight={500}>Is Setup</Text>
                  <Radio value="setup-yes" label="Yes" />
                  <Radio value="setup-no" label="No" />
                  <Text size="sm" weight={500}>Has legacy setup</Text>
                  <Radio value="legacy-yes" label="Yes" />
                  <Radio value="legacy-no" label="No" />
                </Stack>
              </Radio.Group>
            </Stack>
            <Group position="right" mt="sm">
              <Button variant="default" size="xs" onClick={clearFilters}>Clear</Button>
            </Group>
          </Popover.Dropdown>
        </Popover>
        <CSVLink data={csvData} filename="dealo_users.csv" target="_blank">
          <ActionIcon variant="filled" size="lg">
            <IconDatabaseExport stroke={1} />
          </ActionIcon>
        </CSVLink>
      </Group>
    </Group>
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
