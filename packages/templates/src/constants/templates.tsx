import type { Templates } from 'models';

import { BasicTemplate, BasicSkeleton } from '../Basic';
import { SecondTemplate, SecondSkeleton } from '../Second';
import { ThirdSkeleton, ThirdTemplate } from '../Third';

export enum TEMPLATE_IDS {
  BASIC = '1',
  SECOND = '2',
  THIRD = '3',
}

export const templatesList: Templates[] = [
  { id: TEMPLATE_IDS.BASIC, name: 'First Template' },
  { id: TEMPLATE_IDS.SECOND, name: 'Second Template' },
  { id: TEMPLATE_IDS.THIRD, name: 'Third Template' },
];

export const templatesMap: Record<string, (props?: any) => JSX.Element | null> = {
  [TEMPLATE_IDS.BASIC]: BasicTemplate,
  [TEMPLATE_IDS.SECOND]: SecondTemplate,
  [TEMPLATE_IDS.THIRD]: ThirdTemplate,
};

export const skeletonMap: Record<string, (props?: any) => JSX.Element> = {
  [TEMPLATE_IDS.BASIC]: BasicSkeleton,
  [TEMPLATE_IDS.SECOND]: SecondSkeleton,
  [TEMPLATE_IDS.THIRD]: ThirdSkeleton,
}
