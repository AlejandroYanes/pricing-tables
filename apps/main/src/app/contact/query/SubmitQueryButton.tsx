'use client'
import React, { useState } from 'react';
import { Button, Loader, RenderIf } from '@dealo/ui';

import { type Query } from './query-actions';

interface Props {
  onSubmit: (formData: Query) => Promise<{ success: boolean }>;
}
const SubmitQueryButton = (props: Props) => {
  const { onSubmit } = props;
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const form = e.currentTarget?.form;

    if (!form) {
      return;
    }

    try {
      setLoading(true);
      const data: Query = {
        name: (form.elements as any).name.value,
        email: (form.elements as any).email.value,
        company: (form.elements as any).company.value,
        source: (form.elements as any).source.value,
        message: (form.elements as any).message.value,
        consent: (form.elements as any).consent.checked,
      };
      await onSubmit(data);
      form.reset();
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }

  return (
    <Button className="w-full" disabled={loading} onClick={handleClick}>
      <RenderIf condition={loading}>
        <Loader color="white" size="xs" className="mr-2" />
      </RenderIf>
      Submit
    </Button>
  );
};

export default SubmitQueryButton;
