'use client'

import { useState } from 'react';
import {
  Badge,
  // Group,
  // Pagination,
  // Select,
  Table,
  // Text,
  TextInput,
  // createStyles,
  // Popover,
  // ActionIcon,
  // Stack,
  // Divider,
  // Radio,
} from '@mantine/core';
import { IconAdjustments } from '@tabler/icons-react';
import { calculateTotal } from '@dealo/helpers';
import { RenderIf } from '@dealo/ui';
import { useDebouncedState } from '@mantine/hooks';

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
import Pagination from '../ui/pagination';
import { Separator } from '../ui/separator';

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

  const rows = results.map((user) => (
    <tr key={user.id}>
      <td>
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
      </td>

      <td>
        <RenderIf
          condition={user.isSetup}
          fallback={
            <Badge color="orange">No</Badge>
          }
        >
          <Badge color="green">Yes</Badge>
        </RenderIf>
      </td>

      <td>{user.isSetup ? user._count.widgets : 'N/A'}</td>
    </tr>
  ));

  return (
    <>
      <div className="flex justify-between items-center">
        <TextInput
          my="lg"
          mr="auto"
          defaultValue=""
          placeholder="Search users"
          sx={{ width: '280px' }}
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
      <Table verticalSpacing="sm" horizontalSpacing="lg">
        <thead>
          <tr>
            <th>User</th>
            <th style={{ width: '100px' }}>Is Setup</th>
            <th style={{ width: '130px' }}>Widgets</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
      <div className="flex items-center justify-between py-6 sticky bottom-0">
        <div className="flex items-center gap-4">

          <span className="text-sm font-medium">{`Total: ${count}`}</span>
        </div>
        <Pagination
          page={page}
          onPageChange={setPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          total={calculateTotal(count, pageSize)}
        />
      </div>
    </>
  );
}

export default UsersTable;
