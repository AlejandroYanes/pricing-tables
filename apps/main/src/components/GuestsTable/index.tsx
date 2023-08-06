'use client'

import { useState } from 'react';
import dayjs from 'dayjs';
import {
  Button,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@dealo/ui';

import { trpc } from 'utils/trpc';
import UserAvatar from 'components/UserAvatar';

const GuestsTable = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const {
    data: { results, count } = { results: [], count: 0 },
    refetch,
  } = trpc.widgets.listGuestWidgets.useQuery({ page, pageSize }, { keepPreviousData: true });

  const { mutate, isLoading } = trpc.widgets.deleteGuestWidgets.useMutation({
    onSuccess: () => refetch(),
  });

  return (
    <>
      <div className="flex justify-end items-center mb-4">
        <Button
          variant="destructive"
          onClick={() => mutate()}
          disabled={isLoading}
        >
          Delete All
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Widget</TableHead>
            <TableHead style={{ width: '130px' }}>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((widget) => (
            <TableRow key={widget.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <UserAvatar user={null} />
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold">
                      {widget.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {widget.userId}
                    </span>
                  </div>
                </div>
              </TableCell>

              <TableCell>{dayjs(widget.createdAt).format('DD MMMM, YY')}</TableCell>
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

export default GuestsTable;
