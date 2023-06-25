'use client'

import { useState } from 'react';
import {
  Badge,
  Group,
  Pagination,
  Select,
  Table,
  Text,
  TextInput,
  createStyles,
  Popover,
  ActionIcon,
  Stack,
  Divider,
  Radio,
} from '@mantine/core';
import { IconFilter } from '@tabler/icons-react';
import { calculateTotal } from '@dealo/helpers';
import { RenderIf } from '@dealo/ui';
import { useDebouncedState } from '@mantine/hooks';

import { trpc } from 'utils/trpc';
import UserAvatar from 'components/UserAvatar';

const useStyles = createStyles((theme) => ({
  footer: {
    position: 'sticky',
    bottom: 0,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },
}));

const UsersTable = () => {
  const [query, setQuery] = useDebouncedState('', 200);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [isSetup, setIsSetup] = useState<string>('all');

  const {
    data: { results, count } = { results: [], count: 0 },
  } = trpc.user.listUsers.useQuery({ query, page, pageSize, isSetup: isSetup as any }, { keepPreviousData: true });
  const { classes } = useStyles();

  const handleFilterChange = (value: string) => {
    setIsSetup(value);
    setPage(1);
  };

  const rows = results.map((user) => (
    <tr key={user.id}>
      <td>
        <Group spacing="sm">
          <UserAvatar user={user} />
          <div>
            <Text size="sm" weight={500}>
              {user.name ?? 'Anonymous'}
            </Text>
            <Text size="xs" color="dimmed">
              {user.email ?? 'no email'}
            </Text>
          </div>
        </Group>
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
      <Group position="apart">
        <TextInput
          my="lg"
          mr="auto"
          defaultValue=""
          placeholder="Search users"
          sx={{ width: '280px' }}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Popover width={200} position="bottom-end">
          <Popover.Target>
            <ActionIcon variant="filled" size="lg"><IconFilter /></ActionIcon>
          </Popover.Target>

          <Popover.Dropdown>
            <Stack>
              <Text size="sm" weight={500}>Filters</Text>
              <Divider />
              <Stack>
                <Text size="sm" weight={500}>Is Setup</Text>
                <Radio.Group
                  name="status"
                  value={isSetup}
                  onChange={(value: string) => handleFilterChange(value)}
                >
                  <Stack spacing="xs">
                    <Radio value="all" label="All" />
                    <Radio value="yes" label="Yes" />
                    <Radio value="no" label="No" />
                  </Stack>
                </Radio.Group>
              </Stack>
            </Stack>
          </Popover.Dropdown>
        </Popover>
      </Group>
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
      <Group position="apart" py="lg" className={classes.footer}>
        <Group align="center">
          <Select
            defaultValue="25"
            data={['5', '10', '25', '50', '100']}
            onChange={(value) => setPageSize(Number(value))}
            style={{ width: 80 }}
          />
          <Text>{`Total: ${count}`}</Text>
        </Group>
        <Pagination
          withEdges
          value={page}
          onChange={setPage}
          total={calculateTotal(count, pageSize)}
        />
      </Group>
    </>
  );
}

export default UsersTable;
