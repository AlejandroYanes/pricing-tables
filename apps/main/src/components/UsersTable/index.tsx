import { useState } from 'react';
import { CSVLink } from 'react-csv';
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
  Radio,
  Button,
  Indicator,
} from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { IconAdjustmentsAlt, IconDatabaseExport } from '@tabler/icons';
import { calculateTotal } from 'helpers';
import { RenderIf } from 'ui';

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
  const [isSetup, setIsSetup] = useState<string | undefined>();
  const [hasLegacy, setHasLegacy] = useState<string | undefined>();

  const { classes } = useStyles();

  const {
    data: { results, count } = { results: [], count: 0 },
  } = trpc.user.listUsers.useQuery(
    { query, page, pageSize, isSetup: isSetup as any, hasLegacy: hasLegacy as any },
    { keepPreviousData: true },
  );

  const csvData: string[][] = [['name', 'email']].concat(results.map((user) => ([user.name || '-', user.email || '-'])));

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
      <Group position="apart">
        <TextInput
          my="lg"
          mr="auto"
          defaultValue=""
          placeholder="Search users"
          sx={{ width: '280px' }}
          onChange={(e) => setQuery(e.target.value)}
        />
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
      <Table verticalSpacing="sm" horizontalSpacing="lg">
        <thead>
          <tr>
            <th>User</th>
            <th style={{ width: '100px' }}>Is Setup</th>
            <th style={{ width: '100px' }}>Legacy</th>
            <th style={{ width: '130px' }}>Widgets</th>
          </tr>
        </thead>
        <tbody>{results.map((user) => (
          <tr key={user.id}>
            <td>
              <Group spacing="sm">
                <UserAvatar user={user}/>
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

            <td>
              <RenderIf
                condition={user.hasLegacy}
                fallback={
                  <Badge color="orange">No</Badge>
                }
              >
                <Badge color="green">Yes</Badge>
              </RenderIf>
            </td>

            <td>{user.isSetup ? user._count.widgets : 'N/A'}</td>
          </tr>
        ))}
        </tbody>
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
