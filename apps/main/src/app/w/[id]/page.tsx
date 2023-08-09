import { cache } from 'react';
import { z } from 'zod';

import { getWidgetInfo } from './get-widget-info';
import { TemplateWrapper } from './TemplateWrapper';

interface Props {
  params: {
    id: string;
  };
}

const inputSchema = z.object({
  id: z.string().cuid(),
});

const resolveWidgetInfo = cache(async (id: string) => {
  return await getWidgetInfo(id);
});

const WidgetPage = async (props: Props) => {
  const { id } = props.params;

  if (!inputSchema.safeParse(props.params).success) {
    return (
      <div className="flex flex-col justify-center items-center">
        <h1 className="text text-3xl font-semibold mb-4">We found no information</h1>
        <span className="text text-center">
          We {`couldn't`} find any information about the widget {`you're`} looking for. Please check the
          URL and try again.
        </span>
      </div>
    );
  }

  const widgetInfo = await resolveWidgetInfo(id);

  return <TemplateWrapper id={id} widget={widgetInfo} />;
};

export default WidgetPage;
