import { Badge, Group, Pagination, Select, Table, Text, TextInput } from '@mantine/core';
import { calculateTotal } from 'helpers';
import type { Role} from 'models';
import { ROLES_LIST } from 'models';
import { RenderIf } from 'ui';

import UserAvatar from 'components/UserAvatar';

interface Props {
  page: number;
  count: number;
  data: {
    id: string;
    image: string | null;
    name: string | null;
    email: string | null;
    role: string | null;
    stripeKey: string | null;
    _count: {
      widgets: number;
    };
  }[];
  currentUser: string | undefined;
  updateRole: (userId: string, newRole: Role) => void;
  onQueryChange: (nextQuery: string) => void;
  onPageChange: (nextPage: number) => void;
}

const UsersTable = (props: Props) => {
  const { page, count, data, currentUser, updateRole, onPageChange, onQueryChange } = props;

  const rows = data.map((user) => (
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
          condition={!!user.stripeKey}
          fallback={
            <Badge color="orange">No</Badge>
          }
        >
          <Badge color="green">Yes</Badge>
        </RenderIf>
      </td>

      <td>{!!user.stripeKey ? user._count.widgets : 'N/A'}</td>

      <td>
        <Select
          disabled={user.id === currentUser}
          data={ROLES_LIST as string[]}
          value={user.role}
          onChange={(value) => updateRole(user.id, value! as Role)}
          variant="unstyled"
        />
      </td>
    </tr>
  ));

  return (
    <>
      <TextInput
        my="lg"
        mr="auto"
        defaultValue=""
        placeholder="Search users"
        sx={{ width: '280px' }}
        onChange={(e) => onQueryChange(e.target.value)}
      />
      <Table verticalSpacing="sm" horizontalSpacing="lg">
        <thead>
          <tr>
            <th>User</th>
            <th style={{ width: '100px' }}>Is Setup</th>
            <th style={{ width: '130px' }}>Widgets</th>
            <th style={{ width: '200px' }}>Role</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
      <Group position="right" py="lg">
        <Pagination
          withEdges
          value={page}
          onChange={onPageChange}
          total={calculateTotal(count)}
        />
      </Group>
    </>
  );
}

export default UsersTable;
