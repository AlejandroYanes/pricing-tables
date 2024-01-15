'use client'
import { useState } from 'react';
import { IconAdjustments } from '@tabler/icons-react';
import {
  Button,
  Checkbox,
  InputWithLabel,
  Label,
  Loader,
  Pagination,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RadioGroup,
  RadioGroupItem,
  RenderIf
} from '@dealo/ui';
import { callAPI } from '@dealo/helpers';

import { useDebounce } from 'utils/hooks/useDebounce';
import { trpc } from 'utils/trpc';

const InternalEmailForm = () => {
  const [subject, setSubject] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | undefined>();

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

  const handleToggleAll = () => {
    if (selectedUsers.length === results.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(results.map((user) => user.id));
    }
  }

  const handleToggleUser = (userId: string) => {
    setSelectedUsers((prev) => prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]);
  }

  const sendEmail = async () => {
    if (sending || !subject || !selectedUsers.length) {
      return;
    }

    try {
      setSending(true);
      await callAPI({
        url: '/api/email/send/internal',
        method: 'POST',
        body: {
          subject,
          to: selectedUsers,
        },
      });
      setSending(false);
    } catch (e) {
      console.error(e);
      setError('Something went wrong. Please check the logs.');
      setSending(false);
    }
  }

  // const items = new Array(100).fill(0).map((_, i) => ({ id: `${i}`, name: `User ${i}` }));

  return (
    <div className="flex-1 flex flex-col gap-6 overflow-hidden">
      <InputWithLabel
        label="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <div className="flex items-end gap-2">
        <InputWithLabel className="flex-1" label="To" onChange={(e) => handleSearch(e.target.value)} />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <IconAdjustments />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-[200px]">
            <div className="flex flex-col gap-4">
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
        <Button variant="outline" onClick={handleToggleAll}>
          Toggle All
        </Button>
      </div>
      <RenderIf condition={!!error}>
        <span className="text-red-500">{error}</span>
      </RenderIf>
      <div className="flex-1 flex flex-col gap-4 overflow-auto">
        {results.map((user) => (
          <div key={user.id} className="flex items-center gap-2 pl-6">
            <Checkbox
              id={`user-${user.id}`}
              checked={selectedUsers.includes(user.id)}
              onClick={() => handleToggleUser(user.id)}
            />
            <Label htmlFor={`user-${user.id}`}>{user.name}</Label>
          </div>
        ))}
        <div className="mt-auto flex items-center justify-end sticky bottom-0 gap-8 bg-background">
          <span className="text-sm font-medium">{`Total: ${count}`}</span>
          <Pagination
            className="px-0 ml-auto"
            page={page}
            onPageChange={setPage}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            total={count}
          />
          <Button variant="default" onClick={sendEmail}>
            <RenderIf condition={sending} fallback="Send">
              <Loader size="xs" className="mr-2" color="white" />
              Sending...
            </RenderIf>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InternalEmailForm;
