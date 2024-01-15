'use client'
import { useState } from 'react';
import { IconX } from '@tabler/icons-react';
import { Badge, Button, InputWithLabel } from '@dealo/ui';

const ExternalEmailForm = () => {
  const [addresses, setAddresses] = useState<string[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = e.currentTarget.value;
      if (!value) return;
      const split = value.split(' ');
      const emailRegex = /\S+@\S+\.\S+/;
      const validAddresses = split.filter((address) => emailRegex.test(address.trim()));

      setAddresses([...addresses, ...validAddresses]);
      e.currentTarget.value = '';
    }
  };

  return (
    <>
      <InputWithLabel label="Subject"/>
      <InputWithLabel label="To" onKeyDown={handleKeyDown} />
      <div className="flex items-center flex-wrap gap-4">
        {addresses.map((address, i) => (
          <div key={i} className="flex items-center gap-2">
            <Badge variant="outline" className="pr-1 text-[14px]">
              <span>{address}</span>
              <button
                className="ml-4 w-4 h-4 flex flex-col items-center justify-center rounded-xl cursor-pointer hover:bg-slate-300/20"
                onClick={() => setAddresses(addresses.filter((_, j) => i !== j))}
              >
                <IconX size={12} />
              </button>
            </Badge>
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-6">
        <Button variant="default">Send</Button>
      </div>
    </>
  );
};

export default ExternalEmailForm;
