'use client';

import { IconNewSection } from '@tabler/icons-react';

import { Button } from 'components/ui/button';

export default function AddBlock(props: { label: string; onClick: () => void }) {
  const { label, onClick } = props;

  return (
    <>
      <Button
        variant="ghost"
        className="flex flex-col items-center h-[260px] w-[320px] p-4 rounded-sm border-2 border-dashed border-neutral-300"
        onClick={onClick}
      >
        <IconNewSection size={60} />
        <span className="text-xl">{label}</span>
      </Button>
    </>
  );
}
