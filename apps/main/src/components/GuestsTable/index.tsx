import { createStyles, Group, Pagination, Select, Table, Text } from '@mantine/core';
import dayjs from 'dayjs';
import { calculateTotal } from '@dealo/helpers';

import UserAvatar from 'components/UserAvatar';

interface Props {
  page: number;
  pageSize: number;
  count: number;
  data: { id: string; name: string; createdAt: Date; userId: string | null }[];
  onPageChange: (nextPage: number) => void;
  onPageSizeChange: (nextPageSize: number) => void;
}

const useStyles = createStyles((theme) => ({
  footer: {
    position: 'sticky',
    bottom: 0,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },
}));

const GuestsTable = (props: Props) => {
  const { page, pageSize, count, data, onPageChange, onPageSizeChange } = props;
  const { classes } = useStyles();

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
      <Group position="apart" py="lg" className={classes.footer}>
        <Select
          defaultValue="25"
          data={['5', '10', '25', '50', '100']}
          onChange={(value) => onPageSizeChange(Number(value))}
          style={{ width: 80 }}
        />
        <Pagination
          withEdges
          value={page}
          onChange={onPageChange}
          total={calculateTotal(count, pageSize)}
        />
      </Group>
    </>
  );
}

export default GuestsTable;
