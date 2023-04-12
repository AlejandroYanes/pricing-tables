import type { Templates } from 'models';

import { BasicTemplate, BasicSkeleton } from '../Basic';
import { SecondTemplate } from '../Second';

export enum TEMPLATE_IDS {
  BASIC = '1',
  SECOND = '2',
  FAKE_2 = '3',
}

export type TemplateId = keyof typeof TEMPLATE_IDS;

export const templatesList: Templates[] = [
  { id: TEMPLATE_IDS.BASIC, name: 'First Template' },
  { id: TEMPLATE_IDS.SECOND, name: 'Second Template' },
  { id: TEMPLATE_IDS.FAKE_2, name: 'Fake 2' },
];

export const templatesMap: Record<string, (props?: any) => JSX.Element> = {
  [TEMPLATE_IDS.BASIC]: BasicTemplate,
  [TEMPLATE_IDS.SECOND]: SecondTemplate,
  [TEMPLATE_IDS.FAKE_2]: () => <>Fake 2</>,
};

export const skeletonMap: Record<string, (props?: any) => JSX.Element> = {
  [TEMPLATE_IDS.BASIC]: BasicSkeleton,
  [TEMPLATE_IDS.SECOND]: () => <>Skeleton 2</>,
  [TEMPLATE_IDS.FAKE_2]: () => <>Skeleton 3</>,
}
