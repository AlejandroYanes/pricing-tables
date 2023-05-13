import { Group, Pagination, Table, Text } from '@mantine/core';
import dayjs from 'dayjs';
import { calculateTotal } from 'helpers';

import UserAvatar from 'components/UserAvatar';

interface Props {
  page: number;
  count: number;
  data: { id: string; name: string; createdAt: Date; userId: string | null }[];
  onPageChange: (nextPage: number) => void;
}

const GuestsTable = (props: Props) => {
  const { page, count, data, onPageChange } = props;

  const rows = data.map((widget) => (
    <tr key={widget.id}>
      <td>
        <Group spacing="sm">
          <UserAvatar user={null} />
          <div>
            <Text size="sm" weight={500}>
              {widget.name}
            </Text>
            <Text size="xs" color="dimmed">
              {widget.userId}
            </Text>
          </div>
        </Group>
      </td>

      <td>{dayjs(widget.createdAt).format('DD MMMM, YY')}</td>
    </tr>
  ));

  return (
    <>
      <Table verticalSpacing="sm" horizontalSpacing="lg">
        <thead>
          <tr>
            <th>Widget</th>
            <th style={{ width: '130px' }}>Created At</th>
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

export default GuestsTable;
