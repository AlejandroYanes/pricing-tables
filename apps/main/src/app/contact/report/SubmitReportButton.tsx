'use client'
import { useState } from 'react';
import { Button, Loader, RenderIf } from '@dealo/ui';

import type { Report } from './report-actions';

interface Props {
  onSubmit: (formData: Report) => Promise<void>;
}
const SubmitQueryButton = (props: Props) => {
  const { onSubmit } = props;
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      setLoading(true);
      const data: Report = {
        name: (e.currentTarget?.form?.elements as any).name.value,
        email: (e.currentTarget?.form?.elements as any).email.value,
        message: (e.currentTarget?.form?.elements as any).message.value,
        consent: (e.currentTarget?.form?.elements as any).consent.checked,
      };
      await onSubmit(data);
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
