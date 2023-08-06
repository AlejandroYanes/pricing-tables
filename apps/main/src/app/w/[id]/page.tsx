import { cache } from 'react';

import { getWidgetInfo } from './get-widget-info';
import { TemplateWrapper } from './TemplateWrapper';

interface Props {
  params: {
    id: string;
  };
}

const resolveWidgetInfo = cache(async (id: string) => {
  return await getWidgetInfo(id);
});

const WidgetPage = async (props: Props) => {
  const { id } = props.params;

  const widgetInfo = await resolveWidgetInfo(id);

  return <TemplateWrapper id={id} widget={widgetInfo} />;
};

export default WidgetPage;
