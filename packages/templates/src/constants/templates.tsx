import type { Templates } from 'models';

import { BasicTemplate, BasicSkeleton } from '../Basic';
import { SecondTemplate } from '../Second';
import { ThirdTemplate } from '../Third';

export enum TEMPLATE_IDS {
  BASIC = '1',
  SECOND = '2',
  THIRD = '3',
}

export type TemplateId = keyof typeof TEMPLATE_IDS;

export const templatesList: Templates[] = [
  { id: TEMPLATE_IDS.BASIC, name: 'First Template' },
  { id: TEMPLATE_IDS.SECOND, name: 'Second Template' },
  { id: TEMPLATE_IDS.THIRD, name: 'Third Template' },
];

export const templatesMap: Record<string, (props?: any) => JSX.Element> = {
  [TEMPLATE_IDS.BASIC]: BasicTemplate,
  [TEMPLATE_IDS.SECOND]: SecondTemplate,
  [TEMPLATE_IDS.THIRD]: ThirdTemplate,
};

export const skeletonMap: Record<string, (props?: any) => JSX.Element> = {
  [TEMPLATE_IDS.BASIC]: BasicSkeleton,
  [TEMPLATE_IDS.SECOND]: () => <>Skeleton 2</>,
  [TEMPLATE_IDS.THIRD]: () => <>Skeleton 3</>,
}
